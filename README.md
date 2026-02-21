# Resume Screening using RAG (FastAPI + FAISS + Gemini)

This project implements a Resume Screening system using Retrieval-Augmented Generation (RAG).
It allows users to upload resumes and job descriptions, compute a match score, and ask questions grounded in the resume content using an LLM.

## Problem Statement
Manual resume screening is time-consuming and subjective. Traditional AI chatbots cannot access private documents like resumes and may hallucinate answers.
This project solves the problem by using RAG, where relevant resume content is retrieved from a vector database and injected into the LLM prompt to produce accurate and grounded responses.

## Features
* Upload resume (PDF/TXT)
* Upload job description (PDF/TXT)
* Chunking and embeddings using Sentence-Transformers
* Vector similarity search using FAISS
* RAG-based Q&A using Gemini
* Resume–JD match score with strengths & gaps
* React frontend for user interaction



## Architecture Overview

```bash
Frontend (React)
       |
       v
FastAPI Backend
       |
       v
Resume/JD Upload → Text Extraction → Chunking → Embeddings
       |
       v
FAISS Vector Database (stores resume chunks)
       |
       v
User Query → Vector Search (Top-K chunks)
       |
       v
Prompt + Retrieved Context → Gemini LLM → Answer / Match Analysis
```

## RAG Flow (Step-by-step)

1. Resume is uploaded and text is extracted.

2. Text is chunked and converted into embeddings.

3. Embeddings are stored in FAISS (vector database).

4. User asks a question.

5. The question is embedded and searched in FAISS.

6. Top relevant chunks are retrieved.

7. Retrieved chunks are passed to Gemini as context.

8. Gemini generates a grounded answer.

## Tech Stack

* Frontend: React (Vite), Axios

* Backend: FastAPI

* Vector DB: FAISS

* Embeddings: Sentence-Transformers (MiniLM)

* LLM: Gemini

* Deployment (Demo): Google Colab + ngrok

## Setup Instructions
### Backend Setup (Colab / Local)
#### Install dependencies:
```python
pip install fastapi uvicorn pdfplumber sentence-transformers faiss-cpu python-multipart google-generativeai python-dotenv pyngrok
```
#### Set Gemini API
```python
export GEMINI_API_KEY=YOUR_API_KEY
```
#### Run FastAPI server:
```python
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
#### Expose using ngrok:
```python
from pyngrok import ngrok
public_url = ngrok.connect(8000)
print(public_url)



```

### Backend Setup (Colab / Local)

```python 
cd resume-rag-frontend
npm install
npm run dev
```

### Update backend URL in src/api.js:
``` bash
export const BASE_URL = "https://<your-ngrok-url>.ngrok-free.dev";

```
## API Documentation

#### 1. POST /upload_resume:
Uploads and indexes a resume.
###### Request:
* multipart/form-data
* key: file
###### Response:
```JSON
{
  "message": "Resume uploaded & indexed",
  "num_chunks": 10
}
```
#### 2. POST /upload_jd:
Uploads job description.
###### Request:
* multipart/form-data
* key: file
###### Response:
```JSON

 {
  "message": "Job description uploaded"
}

```
#### 3. POST /match:
Returns match score, strengths, gaps and summary.

###### Response:
```JSON

{
  "match_score": 75,
  "strengths": ["Strong Python and API development experience"],
  "gaps": ["No React experience mentioned"],
  "summary": "Candidate matches backend requirements but lacks frontend exposure."
}

```
#### 4. POST /chat:
Ask questions grounded in resume context.
###### Request:
``` JSON
{
  "question": "Does the candidate have React experience?"
}
```
###### Response:
```JSON

{
  "answer": "The resume does not explicitly mention React experience.",
  "retrieved_context": ["..."]
}

```


### Author:  Shreyansh Kumar Singh 

