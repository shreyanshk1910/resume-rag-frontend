import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "./api";

function App() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState(null);
  const [match, setMatch] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("file", resume);
    await axios.post(`${BASE_URL}/upload_resume`, formData);
    alert("Resume uploaded");
  };

  const uploadJd = async () => {
    const formData = new FormData();
    formData.append("file", jd);
    await axios.post(`${BASE_URL}/upload_jd`, formData);
    alert("JD uploaded");
  };

  const getMatch = async () => {
  try {
    setLoading(true);
    const res = await axios.post(`${BASE_URL}/match`);
    setMatch(res.data);
  } catch (err) {
    console.error(err);
    alert("Match API failed. Check backend logs.");
  } finally {
    setLoading(false);
  }
};

  const askChat = async () => {
    setLoading(true);
    const res = await axios.post(`${BASE_URL}/chat`, { question });
    setAnswer(res.data.answer);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2>Resume Screening using RAG</h2>

      <div>
        <h3>Upload Resume</h3>
        <input type="file" onChange={(e) => setResume(e.target.files[0])} />
        <button onClick={uploadResume}>Upload Resume</button>
      </div>

      <div>
        <h3>Upload Job Description</h3>
        <input type="file" onChange={(e) => setJd(e.target.files[0])} />
        <button onClick={uploadJd}>Upload JD</button>
      </div>

      <div>
        <h3>Match Analysis</h3>
        <button onClick={getMatch}>Get Match</button>
        {loading && <p>Loading...</p>}
        {match && (
          <div>
            <p><b>Match Score:</b> {match.match_score}%</p>
            <p><b>Strengths:</b> {match.strengths.join(", ")}</p>
            <p><b>Gaps:</b> {match.gaps.join(", ")}</p>
            <p><b>Summary:</b> {match.summary}</p>
          </div>
        )}
      </div>

      <div>
        <h3>Ask Questions (RAG Chat)</h3>
        <input
          type="text"
          placeholder="Ask about the candidate..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: "80%" }}
        />
        <button onClick={askChat}>Ask</button>

        {answer && (
          <div style={{ marginTop: 10 }}>
            <b>Answer:</b>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;