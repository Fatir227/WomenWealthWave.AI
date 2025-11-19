# Financial Literacy AI Agent - Backend

A backend service for a financial literacy AI agent that provides personalized financial advice to women aged 15-35, with a focus on the Indian and international contexts.

## Features

- **RAG-based Knowledge Base**: Retrieval-Augmented Generation for accurate and up-to-date financial information
- **Age and Region-Specific Responses**: Tailored advice based on user's age group and location
- **Document Ingestion**: Easily add new financial documents to the knowledge base
- **Open-Source LLM Integration**: Built with open-source language models
- **RESTful API**: Easy integration with frontend applications

## Tech Stack

- **Python 3.9+**
- **FastAPI** - Modern, fast web framework for building APIs
- **ChromaDB** - Vector database for efficient document retrieval
- **Sentence Transformers** - For generating document and query embeddings
- **Hugging Face Transformers** - For running open-source language models
- **Pydantic** - Data validation and settings management

## Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Git
- CUDA-compatible GPU (recommended for better performance)

## Installation

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd financial-literacy-ai/backend
   ```

2. **Create and activate a virtual environment**
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the project root with the following content:
   ```env
   # Application
   APP_NAME="Financial Literacy AI"
   DEBUG=true
   
   # Server
   HOST="0.0.0.0"
   PORT=8000
   
   # Models
   EMBEDDING_MODEL="sentence-transformers/all-MiniLM-L6-v2"
   RERANKER_MODEL="cross-encoder/ms-marco-MiniLM-L-6-v2"
   LLM_MODEL="mistralai/Mistral-7B-Instruct-v0.1"
   
   # Paths (relative to project root)
   VECTOR_DB_PATH="./data/vector_db"
   KNOWLEDGE_BASE_DIR="./data/knowledge_base"
   ```

## Running the Application

1. **Start the development server**
   ```bash
   uvicorn main:app --reload
   ```

2. **Access the API documentation**
   Open your browser and go to:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Ask a Question
- **POST** `/api/v1/ask`
  - Get personalized financial advice based on user's query, age group, and region

### Ingest Documents
- **POST** `/api/v1/ingest`
  - Upload and process new financial documents to add to the knowledge base

### Health Check
- **GET** `/api/v1/health`
  - Check the health status of the API and its dependencies

### Document Management
- **DELETE** `/api/v1/documents/{document_id}`
  - Remove a document from the knowledge base
- **GET** `/api/v1/documents/stats`
  - Get statistics about documents in the knowledge base

## Adding Financial Documents

To add new financial documents to the knowledge base:

1. Place your documents in the `data/knowledge_base` directory
2. Use the `/api/v1/ingest` endpoint to process them

Supported document formats:
- PDF
- DOCX
- TXT
- CSV
- HTML
- JSON

## Configuration

You can customize the application behavior by modifying the following:

- `config.py`: Main configuration settings
- `.env`: Environment variables
- `requirements.txt`: Python dependencies

## Deployment

### Production Deployment

For production deployment, consider using:
- **Gunicorn** with Uvicorn workers
- **NGINX** as a reverse proxy
- **Docker** for containerization

Example Gunicorn command:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 main:app
```

### Docker

1. Build the Docker image:
   ```bash
   docker build -t financial-literacy-ai .
   ```

2. Run the container:
   ```bash
   docker run -p 8000:8000 --env-file .env financial-literacy-ai
   ```

## Development

### Code Style

This project uses:
- **Black** for code formatting
- **isort** for import sorting
- **Flake8** for linting

Run the following commands before committing:
```bash
black .
isort .
flake8
```

### Testing

To run tests:
```bash
pytest
```

## License

[Your License Here]

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## Contact

[Your Contact Information]
