%%writefile embeddings.py
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Ultra-light model to avoid memory issues on Colab
_model = SentenceTransformer("sentence-transformers/paraphrase-MiniLM-L3-v2", device="cpu")

class VectorStore:
    def __init__(self):
        self.index = None
        self.text_chunks = []

    def chunk_text(self, text, chunk_size=120, overlap=30):
        words = text.split()
        chunks = []
        step = max(1, chunk_size - overlap)
        for i in range(0, len(words), step):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk)
        return chunks

    def add_texts(self, texts):
        if not texts:
            raise ValueError("No text chunks to index.")
        embeddings = _model.encode(texts, batch_size=8, show_progress_bar=False)
        dim = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(embeddings.astype("float32"))
        self.text_chunks = texts

    def search(self, query, k=3):
        if self.index is None:
            raise ValueError("Index is empty. Upload a resume first.")
        q = _model.encode([query], batch_size=1, show_progress_bar=False).astype("float32")
        _, idx = self.index.search(q, k)
        return [self.text_chunks[i] for i in idx[0]]