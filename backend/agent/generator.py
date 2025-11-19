import logging
import os
from typing import List, Dict, Any, Optional
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline, BitsAndBytesConfig
from dataclasses import dataclass
import json

from config import settings
from rag.pipeline import RAGPipeline, RetrievalResult

logger = logging.getLogger(__name__)

@dataclass
class GenerationConfig:
    """Configuration for text generation."""
    max_new_tokens: int = 1024
    temperature: float = 0.7
    top_p: float = 0.9
    top_k: int = 50
    repetition_penalty: float = 1.1
    do_sample: bool = True

class FinancialAgent:
    """
    AI agent for financial literacy, combining RAG with open-source LLM.
    Handles reasoning, response generation, and personalization.
    """
    
    def __init__(self, rag_pipeline: Optional[RAGPipeline] = None):
        self.rag_pipeline = rag_pipeline or RAGPipeline()
        self.generation_config = GenerationConfig()
        self.model = None
        self.tokenizer = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self._load_model()
    
    def _load_model(self):
        """Load the language model and tokenizer with optimized settings."""
        try:
            logger.info(f"Loading model: {settings.LLM_MODEL}")
            
            # Set up model loading kwargs based on settings
            model_kwargs = {
                "device_map": settings.DEVICE_MAP,
                "torch_dtype": torch.float16 if settings.DEVICE == "cuda" else torch.float32,
            }
            
            # Add quantization settings if enabled
            if settings.LOAD_IN_8BIT:
                model_kwargs["load_in_8bit"] = True
            elif settings.LOAD_IN_4BIT:
                model_kwargs["load_in_4bit"] = True
                
            # Add offloading settings if needed
            if hasattr(settings, 'OFFLOAD_FOLDER') and settings.OFFLOAD_FOLDER:
                model_kwargs["offload_folder"] = settings.OFFLOAD_FOLDER
                os.makedirs(settings.OFFLOAD_FOLDER, exist_ok=True)
            
            # Load the model with the specified settings
            self.pipeline = pipeline(
                "text-generation",
                model=settings.LLM_MODEL,
                tokenizer=settings.LLM_MODEL,
                **model_kwargs
            )
            
            logger.info(f"Model loaded successfully on {self.device}")
            
            logger.info("Model and tokenizer loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise
    
    def generate_response(
        self, 
        query: str,
        age_group: str,
        region: str,
        language: str = "en",
        max_retrieved_docs: int = 3,
        **generation_kwargs
    ) -> Dict[str, Any]:
        """
        Generate a response to a financial literacy query.
        
        Args:
            query: User's question
            age_group: User's age group (15-20, 21-28, 29-35)
            region: User's region (india, international)
            language: Preferred language for response
            max_retrieved_docs: Maximum number of documents to retrieve
            **generation_kwargs: Additional generation parameters
            
        Returns:
            Dictionary containing the generated response and metadata
        """
        # Update generation config with any provided overrides
        config = self.generation_config
        for key, value in generation_kwargs.items():
            if hasattr(config, key):
                setattr(config, key, value)
        
        # Retrieve relevant documents
        filter_metadata = self._get_metadata_filters(age_group, region)
        retrieved_docs = self.rag_pipeline.retrieve(
            query=query,
            top_k=max_retrieved_docs * 2,  # Retrieve more initially for better reranking
            rerank_top_k=max_retrieved_docs,
            filter_metadata=filter_metadata
        )
        
        # Format prompt with retrieved context
        prompt = self._build_prompt(
            query=query,
            age_group=age_group,
            region=region,
            retrieved_docs=retrieved_docs
        )
        
        # Generate response
        response_text = self._generate_text(prompt, config)
        
        # Parse response into structured format
        response = self._parse_response(response_text)
        
        # Add metadata
        response.update({
            "query": query,
            "age_group": age_group,
            "region": region,
            "language": language,
            "sources": [doc.to_dict() for doc in retrieved_docs]
        })
        
        return response
    
    def _build_prompt(
        self,
        query: str,
        age_group: str,
        region: str,
        retrieved_docs: List[RetrievalResult]
    ) -> str:
        """Build a prompt for the language model."""
        # System message with instructions
        system_prompt = (
            "You are a helpful, respectful and honest financial literacy assistant "
            f"specializing in helping women aged {age_group} in {region.capitalize()} "
            "with their financial questions. Provide accurate, clear, and actionable advice."
        )
        
        # Format retrieved documents
        context = "\n\n".join([doc.content for doc in retrieved_docs])
        
        # User query with context
        user_prompt = (
            f"Context:\n{context}\n\n"
            f"Question: {query}\n\n"
            "Please provide a helpful response that includes:\n"
            "1. A clear, concise answer to the question\n"
            "2. A detailed explanation in simple terms\n"
            "3. A practical example relevant to the user's age and region\n"
            "4. 3-5 actionable steps the user can take\n"
            "Format your response as a JSON object with these fields: "
            "answer, explanation, example, action_steps (as an array)."
        )
        
        # Combine into final prompt
        prompt = f"""<s>[INST] <<SYS>>
{system_prompt}
<</SYS>>

{user_prompt} [/INST]"""
        
        return prompt
    
    def _generate_text(self, prompt: str, config: GenerationConfig) -> str:
        """Generate text using the language model."""
        try:
            # Generate response
            outputs = self.pipeline(
                prompt,
                max_new_tokens=config.max_new_tokens,
                temperature=config.temperature,
                top_p=config.top_p,
                top_k=config.top_k,
                repetition_penalty=config.repetition_penalty,
                do_sample=config.do_sample,
                return_full_text=False,
                eos_token_id=self.pipeline.tokenizer.eos_token_id,
            )
            
            # Extract generated text
            generated_text = outputs[0]["generated_text"]
            
            # Clean up the response
            generated_text = generated_text.strip()
            
            return generated_text
            
        except Exception as e:
            logger.error(f"Error generating text: {str(e)}")
            return "I apologize, but I'm having trouble generating a response at the moment. Please try again later."
    
    def _parse_response(self, response_text: str) -> Dict[str, Any]:
        """Parse the model's response into a structured format."""
        try:
            # Try to parse as JSON
            if response_text.strip().startswith('{') and response_text.strip().endswith('}'):
                return json.loads(response_text)
                
            # Fallback to simple parsing if JSON parsing fails
            return {
                "answer": response_text,
                "explanation": "",
                "example": "",
                "action_steps": []
            }
            
        except json.JSONDecodeError:
            logger.warning("Failed to parse model response as JSON")
            return {
                "answer": response_text,
                "explanation": "",
                "example": "",
                "action_steps": []
            }
    
    def _get_metadata_filters(self, age_group: str, region: str) -> Dict[str, Any]:
        """Get metadata filters based on user's age group and region."""
        filters = {}
        
        # Add age group filter
        if age_group == "15-20":
            filters["age_group"] = {"$in": ["15-20", "all"]}
        elif age_group == "21-28":
            filters["age_group"] = {"$in": ["21-28", "all"]}
        elif age_group == "29-35":
            filters["age_group"] = {"$in": ["29-35", "all"]}
        
        # Add region filter
        if region in ["india", "international"]:
            filters["region"] = {"$in": [region, "all"]}
        
        return filters if filters else None

# Example usage
if __name__ == "__main__":
    # Initialize the agent
    agent = FinancialAgent()
    
    # Example query
    query = "How should I start investing with a small amount of money?"
    
    # Generate response
    response = agent.generate_response(
        query=query,
        age_group="21-28",
        region="india",
        max_retrieved_docs=3,
        temperature=0.7
    )
    
    # Print response
    print("\nResponse:")
    print(f"Answer: {response.get('answer', '')}")
    print(f"\nExplanation: {response.get('explanation', '')}")
    print(f"\nExample: {response.get('example', '')}")
    print("\nAction Steps:")
    for i, step in enumerate(response.get('action_steps', []), 1):
        print(f"{i}. {step}")
