import React, { useState } from "react";
import axios from "axios";

function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumes, setResumes] = useState<FileList | null>(null);
  const [topCandidates, setTopCandidates] = useState<any[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [candidateEmail, setCandidateEmail] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingQuestionsFor, setGeneratingQuestionsFor] = useState<string | null>(null);

  const backendURL = "http://localhost:8000";

  const handleUpload = async () => {
    if (!resumes || !jobDescription) return;
    setLoading(true);
    setProgress(10);
    setProgressText("Uploading and processing resumes...");

    const formData = new FormData();
    Array.from(resumes).forEach((file) => formData.append("resumes", file));
    formData.append("job_description", jobDescription);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + 10;
        clearInterval(interval);
        return prev;
      });
    }, 300);

    try {
      const res = await axios.post(`${backendURL}/match_resumes`, formData);
      setTopCandidates(res.data);
      setProgress(100);
      setProgressText("Matching complete.");
    } catch (err) {
      console.error("Resume matching failed:", err);
      setProgressText("Something went wrong.");
      setProgress(100);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setProgress(0);
        setProgressText("");
      }, 2000);
    }
  };

  const handleGenerateQuestions = async (filename: string) => {
    setGeneratingQuestionsFor(filename);
    try {
      const resumeText = `${filename}`;
      const res = await axios.post(`${backendURL}/generate_questions`, {
        job_description: jobDescription,
        resume_text: resumeText,
      });
      setQuestions(res.data.questions);
    } catch (err) {
      console.error("Question generation failed:", err);
    } finally {
      setGeneratingQuestionsFor(null);
    }
  };

  const handleSchedule = async () => {
    await axios.post(`${backendURL}/schedule_interview`, {
      candidate_email: candidateEmail,
      recruiter_email: recruiterEmail,
      time_slot: interviewTime,
    });
  };

  const handleSendWelcomeEmail = async () => {
    await axios.post(`${backendURL}/send_welcome_email`, {
      candidate_email: candidateEmail,
    });
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial, sans-serif", maxWidth: 800, margin: "auto" }}>
      <img src="/AberdeenLogo.png" alt="Company Logo" style={{
      maxHeight: "60px",
      height: "auto",
      width: "auto",
      objectFit: "contain",
    }}
  /><h1 style={{ fontSize: 28, margin: 20 }}>RecruitAI – Aberdeen's GenAI Recruitment Tool</h1>

      <textarea
        placeholder="Paste job description"
        rows={5}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
      />

      <input type="file" multiple onChange={(e) => setResumes(e.target.files)} style={{ marginBottom: 10 }} />
      <button onClick={handleUpload} style={{ marginBottom: 20 }}>Match Resumes</button>

      {(!resumes || resumes.length === 0) && !jobDescription && (
        <p style={{ color: "red", fontWeight: "bold" }}>Please upload resumes and enter a job description.</p>
      )}

      {loading && (
        <div style={{ marginTop: 20 }}>
          <p style={{ color: "green", fontWeight: "bold", marginBottom: 8 }}>Matching resumes...</p>
          <div style={{ width: "100%", backgroundColor: "#f0f0f0", height: 12, borderRadius: 6 }}>
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: "#3498db",
                height: "100%",
                borderRadius: 6,
                transition: "width 0.5s ease-in-out",
              }}
            />
          </div>
          <p style={{ fontStyle: "italic", marginTop: 8, color: "#333" }}>{progressText || "Processing..."}</p>
        </div>
      )}

      {topCandidates.length > 0 && (
        <div style={{ marginTop: 30 }}>
          {topCandidates.map((c) => (
            <div
              key={c.filename}
              style={{
                border: "1px solid #ccc",
                borderRadius: 10,
                padding: 15,
                marginBottom: 15,
                backgroundColor: "#fafafa",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              <strong>{c.filename}</strong> – Score: <span style={{ color: "#3498db" }}>{c.score}</span>
              <p style={{ fontStyle: "italic", marginTop: 8 }}>{c.summary}</p>
              <button onClick={() => handleGenerateQuestions(c.filename)}>Generate Questions</button>
              {generatingQuestionsFor === c.filename && <p style={{ color: "green" }}>Generating questions...</p>}
            </div>
          ))}
        </div>
      )}

    {questions.length > 0 && (
    <div style={{
        marginTop: "30px",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        borderRadius: "8px"
    }}>
        <h3 style={{ color: "#2c3e50" }}>🎯 Recommended Interview Questions</h3>
        {questions
        .filter((q) => q.trim() !== "")
        .map((q, i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
            <strong>Q{i + 1}.</strong>
            <p style={{ margin: "4px 0 0 0" }}>{q.replace(/^\d+\.\s*/, "")}</p>
            </div>
        ))}
    </div>
    )}

      <div
        style={{
          marginTop: 30,
          padding: 20,
          backgroundColor: "#f9f9f9",
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <h3 style={{ marginBottom: 10 }}>📅 Schedule Interview</h3>
        <input
          placeholder="Candidate Email"
          value={candidateEmail}
          onChange={(e) => setCandidateEmail(e.target.value)}
          style={{ marginBottom: 10, width: "100%", padding: 8 }}
        />
        <input
          placeholder="Recruiter Email"
          value={recruiterEmail}
          onChange={(e) => setRecruiterEmail(e.target.value)}
          style={{ marginBottom: 10, width: "100%", padding: 8 }}
        />
        <input
          placeholder="Interview Time (e.g., 2025-06-18T15:00:00)"
          value={interviewTime}
          onChange={(e) => setInterviewTime(e.target.value)}
          style={{ marginBottom: 10, width: "100%", padding: 8 }}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleSchedule}>Schedule</button>
          <button onClick={handleSendWelcomeEmail}>Send Welcome Email</button>
        </div>
      </div>
    </div>
  );
}

export default App;