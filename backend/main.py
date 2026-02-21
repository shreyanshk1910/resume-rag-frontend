%%writefile main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import shutil, os
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import numpy as np
import google.generativeai as genai
import json, re
import json
import re
from file_parser import extract_text_from_file
from embeddings import VectorStore
from rag import rag_answer

from fastapi import HTTPException



store = VectorStore()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

embedder = SentenceTransformer("sentence-transformers/paraphrase-MiniLM-L3-v2", device="cpu")

resume_text = ""
jd_text = ""

class ChatRequest(BaseModel):
    question: str

class MatchResponse(BaseModel):
    match_score: float
    strengths: list[str]
    gaps: list[str]

@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    global resume_text
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    resume_text = extract_text_from_file(path)
    if not resume_text.strip():
        return {"error": "No readable text found in resume. Upload a text-based PDF/TXT."}

    chunks = store.chunk_text(resume_text)
    store.add_texts(chunks)
    return {"message": "Resume uploaded & indexed", "num_chunks": len(chunks)}

@app.post("/upload_jd")
async def upload_jd(file: UploadFile = File(...)):
    global jd_text
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    jd_text = extract_text_from_file(path)
    if not jd_text.strip():
        return {"error": "No readable text found in JD. Upload a text-based PDF/TXT."}

    return {"message": "Job description uploaded"}

@app.post("/match")
async def match_resume_jd():
    if not resume_text or not jd_text:
        raise HTTPException(status_code=400, detail="Upload resume and JD first")

    prompt = f"""
Compare the resume and job description below.
Return STRICT JSON:
{{
  "match_score": number (0-100),
  "strengths": [string],
  "gaps": [string],
  "summary": string
}}

Resume:
{resume_text[:2500]}

Job Description:
{jd_text[:2500]}
"""

    try:
        model = genai.GenerativeModel("models/gemini-flash-latest")
        res = model.generate_content(prompt)
        text = res.text.strip()

        m = re.search(r"\{.*\}", text, re.S)
        if m:
            return json.loads(m.group())

        return {
            "match_score": 60,
            "strengths": ["Relevant skills present"],
            "gaps": ["Some JD skills missing"],
            "summary": text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(req: ChatRequest):
    if not resume_text:
        raise HTTPException(status_code=400, detail="Upload a resume before chatting.")

    try:
        ctx = store.search(req.question, k=3)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        ans = rag_answer(req.question, ctx)
        return {"question": req.question, "answer": ans, "retrieved_context": ctx}
    except Exception as e:
        # Fallback so frontend doesn't break
        return {
            "question": req.question,
            "answer": "Sorry, I couldn't reach the LLM right now. Here is the relevant context I found:",
            "retrieved_context": ctx,
            "error": str(e),
        }

