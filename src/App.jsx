import { useState, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "./api";
import { 
  Upload, 
  FileText, 
  Briefcase, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Target,
  MessageCircle,
  File,
  Sparkles,
  Brain
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState(null);
  const [match, setMatch] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [jdUploaded, setJdUploaded] = useState(false);
  const [isDraggingResume, setIsDraggingResume] = useState(false);
  const [isDraggingJd, setIsDraggingJd] = useState(false);
  const fileInputRef = useRef(null);
  const jdInputRef = useRef(null);

  const uploadResume = async () => {
    if (!resume) {
      toast.error("Please select a resume file");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", resume);
    
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/upload_resume`, formData);
      setResumeUploaded(true);
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload resume");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadJd = async () => {
    if (!jd) {
      toast.error("Please select a job description file");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", jd);
    
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/upload_jd`, formData);
      setJdUploaded(true);
      toast.success("Job description uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload job description");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMatch = async () => {
    if (!resumeUploaded || !jdUploaded) {
      toast.error("Please upload both resume and job description first");
      return;
    }
    
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/match`);
      setMatch(res.data);
      toast.success("Analysis complete!");
    } catch (err) {
      console.error(err);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const askChat = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    if (!resumeUploaded || !jdUploaded) {
      toast.error("Please upload both resume and job description first");
      return;
    }
    
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/chat`, { question });
      setAnswer(res.data.answer);
      toast.success("Answer received!");
    } catch (error) {
      toast.error("Failed to get answer");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    if (type === 'resume') {
      setIsDraggingResume(true);
    } else {
      setIsDraggingJd(true);
    }
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    if (type === 'resume') {
      setIsDraggingResume(false);
    } else {
      setIsDraggingJd(false);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (type === 'resume') {
        setResume(file);
        setResumeUploaded(false);
        setIsDraggingResume(false);
      } else {
        setJd(file);
        setJdUploaded(false);
        setIsDraggingJd(false);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="header">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: '24px',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              animation: 'shimmer 3s infinite'
            }}></div>
            <Brain size={36} color="white" />
          </div>
        </div>
        <h1 className="title">Resume Screening AI</h1>
        <p className="subtitle">
          <Sparkles size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Advanced RAG-powered analysis for intelligent resume matching and candidate evaluation
        </p>
      </header>

      <div className="grid">
        {/* Resume Upload */}
        <div className="card">
          <div className="flex-between mb-4">
            <div className="flex-center">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <FileText size={20} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Resume Upload</h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Upload candidate's resume</p>
              </div>
            </div>
            {resumeUploaded && (
              <div style={{ display: 'flex', alignItems: 'center', color: '#10b981' }}>
                <CheckCircle size={20} />
                <span style={{ marginLeft: '6px', fontSize: '0.875rem', fontWeight: '600' }}>Uploaded</span>
              </div>
            )}
          </div>
          
          <div
            className={`upload-area ${isDraggingResume ? 'dragover' : ''}`}
            onDragOver={(e) => handleDragOver(e, 'resume')}
            onDragLeave={(e) => handleDragLeave(e, 'resume')}
            onDrop={(e) => handleDrop(e, 'resume')}
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: 'pointer' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => {
                setResume(e.target.files[0]);
                setResumeUploaded(false);
              }}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx"
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {resume ? (
                <>
                  <File size={40} color="#3b82f6" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px', color: '#1f2937' }}>
                    {resume.name}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {formatFileSize(resume.size)}
                  </p>
                </>
              ) : (
                <>
                  <Upload size={40} color="#9ca3af" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                    Drop resume here or click to browse
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Supports PDF, DOC, DOCX
                  </p>
                </>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={uploadResume}
              disabled={loading || !resume || resumeUploaded}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {loading ? (
                <>
                  <div className="loading"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  {resumeUploaded ? 'Re-upload' : 'Upload Resume'}
                </>
              )}
            </button>
            {resume && (
              <button
                onClick={() => {
                  setResume(null);
                  setResumeUploaded(false);
                }}
                className="btn"
                style={{ 
                  backgroundColor: '#ef4444', 
                  color: 'white',
                  padding: '12px 16px'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Job Description Upload */}
        <div className="card">
          <div className="flex-between mb-4">
            <div className="flex-center">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <Briefcase size={20} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Job Description</h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Upload job description</p>
              </div>
            </div>
            {jdUploaded && (
              <div style={{ display: 'flex', alignItems: 'center', color: '#10b981' }}>
                <CheckCircle size={20} />
                <span style={{ marginLeft: '6px', fontSize: '0.875rem', fontWeight: '600' }}>Uploaded</span>
              </div>
            )}
          </div>
          
          <div
            className={`upload-area ${isDraggingJd ? 'dragover' : ''}`}
            onDragOver={(e) => handleDragOver(e, 'jd')}
            onDragLeave={(e) => handleDragLeave(e, 'jd')}
            onDrop={(e) => handleDrop(e, 'jd')}
            onClick={() => jdInputRef.current?.click()}
            style={{ cursor: 'pointer' }}
          >
            <input
              ref={jdInputRef}
              type="file"
              onChange={(e) => {
                setJd(e.target.files[0]);
                setJdUploaded(false);
              }}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt"
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {jd ? (
                <>
                  <File size={40} color="#8b5cf6" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px', color: '#1f2937' }}>
                    {jd.name}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {formatFileSize(jd.size)}
                  </p>
                </>
              ) : (
                <>
                  <Upload size={40} color="#9ca3af" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                    Drop job description here or click to browse
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Supports PDF, DOC, DOCX, TXT
                  </p>
                </>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={uploadJd}
              disabled={loading || !jd || jdUploaded}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {loading ? (
                <>
                  <div className="loading"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  {jdUploaded ? 'Re-upload' : 'Upload JD'}
                </>
              )}
            </button>
            {jd && (
              <button
                onClick={() => {
                  setJd(null);
                  setJdUploaded(false);
                }}
                className="btn"
                style={{ 
                  backgroundColor: '#ef4444', 
                  color: 'white',
                  padding: '12px 16px'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Match Analysis */}
      <div className="card">
        <div className="flex-center mb-4">
          <Target size={20} color="#10b981" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginLeft: '8px' }}>Match Analysis</h2>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={getMatch}
            disabled={loading || !resumeUploaded || !jdUploaded}
            className="btn btn-success"
            style={{ flex: 1, minWidth: '200px' }}
          >
            {loading ? (
              <>
                <div className="loading"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Target size={16} />
                Get Match Analysis
              </>
            )}
          </button>
          
          {match && (
            <button
              onClick={() => setMatch(null)}
              className="btn"
              style={{ 
                backgroundColor: '#6b7280', 
                color: 'white',
                padding: '12px 16px'
              }}
            >
              Clear Results
            </button>
          )}
        </div>
        
        {match && (
          <div>
            <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px' }}>
              <div className="flex-between mb-3">
                <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#166534' }}>Match Score</span>
                <span className="match-score">{match.match_score}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${match.match_score}%`,
                    backgroundColor: match.match_score >= 80 ? '#10b981' : match.match_score >= 60 ? '#f59e0b' : '#ef4444'
                  }}
                ></div>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '8px', margin: 0 }}>
                {match.match_score >= 80 ? 'Excellent match!' : match.match_score >= 60 ? 'Good match' : 'Consider reviewing requirements'}
              </p>
            </div>
            
            <div className="strengths">
              <h3 style={{ fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                <CheckCircle size={16} color="#3b82f6" style={{ marginRight: '8px' }} />
                Strengths ({match.strengths?.length || 0})
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {match.strengths?.map((strength, index) => (
                  <li key={index} style={{ 
                    fontSize: '0.875rem', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    padding: '8px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '4px'
                  }}>
                    <span style={{ marginRight: '8px', color: '#3b82f6' }}>✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="gaps">
              <h3 style={{ fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                <AlertCircle size={16} color="#f59e0b" style={{ marginRight: '8px' }} />
                Gaps ({match.gaps?.length || 0})
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {match.gaps?.map((gap, index) => (
                  <li key={index} style={{ 
                    fontSize: '0.875rem', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    padding: '8px',
                    backgroundColor: '#fffbeb',
                    borderRadius: '4px'
                  }}>
                    <span style={{ marginRight: '8px', color: '#f59e0b' }}>!</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="summary">
              <h3 style={{ fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                <Target size={16} color="#6b7280" style={{ marginRight: '8px' }} />
                AI Summary
              </h3>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#374151', 
                lineHeight: '1.6',
                margin: 0,
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '4px',
                borderLeft: '3px solid #3b82f6'
              }}>
                {match.summary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="card">
        <div className="flex-center mb-4">
          <MessageCircle size={20} color="#3b82f6" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginLeft: '8px' }}>AI Assistant</h2>
        </div>
        
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask about candidate's skills, experience, or fit..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && askChat()}
            className="input"
            disabled={loading}
          />
          <button
            onClick={askChat}
            disabled={loading || !question.trim() || !resumeUploaded || !jdUploaded}
            className="btn btn-primary"
          >
            {loading ? (
              <div className="loading"></div>
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        
        {answer && (
          <div className="chat-message">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageCircle size={16} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>AI Assistant</div>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#374151', 
                  lineHeight: '1.6', 
                  margin: 0,
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  {answer}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;