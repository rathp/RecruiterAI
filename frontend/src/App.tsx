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
  const [progress, setProgress] = useState(0); // 0 to 100
  const [progressText, setProgressText] = useState("");



  const backendURL = "http://localhost:8000"; // Change if deployed

  const handleUpload = async () => {
    if (!resumes || !jobDescription) return;

    setLoading(true);
    setProgress(10);
    setProgressText("Uploading and processing resumes...");

    const formData = new FormData();
    Array.from(resumes).forEach((file) => formData.append("resumes", file));
    formData.append("job_description", jobDescription);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + 10;
        clearInterval(interval);
        return prev;
      });
    }, 300); // every 300ms

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
  
  const [loading, setLoading] = useState(false);
  const [generatingQuestionsFor, setGeneratingQuestionsFor] = useState<string | null>(null);


  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>RecruitAI (WIP)</h1>

      <textarea
        placeholder="Paste job description"
        rows={5}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        type="file"
        multiple
        onChange={(e) => setResumes(e.target.files)}
      />
      <button onClick={handleUpload}>Match Resumes</button>

    {/* Validation Error */}
    {(!resumes || resumes.length === 0) && !jobDescription && (
    <p style={{ color: "red", fontWeight: "bold" }}>
        Please upload resumes and enter a job description.
    </p>
    )}

    {/* Loading Progress UI */}
    {loading && (
    <div style={{ marginTop: 20 }}>
        <p style={{ color: "green", fontWeight: "bold", marginBottom: 8 }}>
        Matching resumes...
        </p>
        
        <div style={{ width: "100%", backgroundColor: "#f0f0f0", height: 12, borderRadius: 6 }}>
        <div
            style={{
            width: `${progress}%`,
            backgroundColor: "#3498db",
            height: "100%",
            borderRadius: 6,
            transition: "width 0.5s ease-in-out"
            }}
        />
        </div>

        <p style={{ fontStyle: "italic", marginTop: 8, color: "#333" }}>
        {progressText || "Processing..."}
        </p>
    </div>
    )}


      {/* Show results if they exist */}
      {topCandidates.length > 0 && (
      <ul>
          {topCandidates.map(c => (
          <li key={c.filename}>
              <strong>{c.filename}</strong> - Score: {c.score}
              {c.summary && (
              <p style={{ fontStyle: "italic", fontSize: "0.9em" }}>{c.summary}</p>
              )}
              <button onClick={() => handleGenerateQuestions(c.filename)}>
              Generate Questions
              </button>
              {generatingQuestionsFor === c.filename && (<p style={{ color: "green" }}>Generating questions...</p>
            )}
          </li>
          ))}
      </ul>
      )}
      {questions.length > 0 && (
        <>
        <h3>Generated Questions</h3>
        <ul>
            {questions.map((q, i) => (
                <li key={i}>{q}</li>
                ))}
                </ul>
                </>
        )}

      <h3>Schedule Interview</h3>
      <input
        placeholder="Candidate Email"
        value={candidateEmail}
        onChange={(e) => setCandidateEmail(e.target.value)}
      />
      <input
        placeholder="Recruiter Email"
        value={recruiterEmail}
        onChange={(e) => setRecruiterEmail(e.target.value)}
      />
      <input
        placeholder="Interview Time (e.g., 2025-06-18T15:00:00)"
        value={interviewTime}
        onChange={(e) => setInterviewTime(e.target.value)}
      />
      <button onClick={handleSchedule}>Schedule</button>
      <button onClick={handleSendWelcomeEmail}>Send Welcome Email</button>
    </div>
  );
}

export default App;
