%%writefile rag.py
import os
import google.generativeai as genai

# Configure Gemini with your API key set in env
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Use a model that your runtime supports
_model = genai.GenerativeModel("models/gemini-flash-latest")
# Alternative (higher quality, slightly slower):
# _model = genai.GenerativeModel("models/gemini-pro-latest")

def rag_answer(question, retrieved_chunks):
    context = "\n\n".join(retrieved_chunks or [])
    prompt = f"""
You are an AI resume assistant. Answer strictly using the context below.

Context:
{context}

Question:
{question}

Answer:
"""
    resp = _model.generate_content(prompt)
    return resp.text