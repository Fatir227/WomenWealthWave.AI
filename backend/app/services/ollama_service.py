import httpx
from typing import Dict, Any, List, Optional
from loguru import logger
from app.core.config import settings

class OllamaService:
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.model = settings.OLLAMA_MODEL
        self.client = httpx.AsyncClient(timeout=120.0)  # Increased timeout to 2 minutes
        
    async def generate(self, prompt: str, context: str = "") -> str:
        """Generate a response using the Ollama API with the given prompt and context.
        
        Args:
            prompt: The user's input prompt.
            context: Additional context to include in the system message.
            
        Returns:
            The generated response from the model.
        """
        system_prompt = (
            "You are WomenWealthWave, an AI financial advisor for women. "
            "Answer ONLY finance questions: budgeting, investing, banking, loans, schemes, business.\n"
            "Keep answers concise: 20-400 words maximum. Be clear and direct.\n"
            "VERY IMPORTANT: You must ALWAYS follow this exact output format.\n"
            "1) First, detect the user's language from their message.\n"
            "2) If the detected language is NOT English, reply in EXACTLY TWO SECTIONS:\n"
            "   English Response:\n"
            "   <clear English answer here>\n\n"
            "   Pronunciation (<Detected Language>):\n"
            "   <write the SAME English answer again, but transliterated in Latin letters so it sounds natural in that language (e.g. Hinglish for Hindi, Kanglish for Kannada).>\n"
            "3) If the user writes in English, reply with ONLY the first section:\n"
            "   English Response:\n"
            "   <clear English answer here>\n\n"
            "Do NOT add any extra sections, titles, or explanations.\n\n"
            f"Context:\n{context}\n\n"
            "Use the context above. Be brief and helpful."
        )
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
        
        try:
            response = await self.client.post(
                f"{self.base_url}/api/chat",
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "num_ctx": 1024,  # Smaller context for faster processing
                        "num_predict": 300,  # Max ~400 words (300 tokens ≈ 400 words)
                        "top_k": 40,  # Limit vocabulary for faster generation
                        "repeat_penalty": 1.1  # Avoid repetition
                    }
                }
            )
            
            response.raise_for_status()
            result = response.json()
            return result.get("message", {}).get("content", "I'm sorry, I couldn't generate a response. Please try again.")
            
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error from Ollama API: {str(e)}")
            logger.error(f"Response content: {e.response.text if hasattr(e, 'response') else 'No response'}")
            raise Exception(f"Ollama API error: {str(e)}")
            
        except httpx.TimeoutException as e:
            logger.error(f"Timeout error from Ollama API: {str(e)}")
            raise Exception("The AI is taking too long to respond. Please try again.")
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            logger.exception("Full traceback:")
            raise Exception(f"Error generating response: {str(e)}")
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()

# Global instance
ollama_service = OllamaService()
