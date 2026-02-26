import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, Brain, Award } from 'lucide-react';

function StudentProfile() {
  const { name } = useParams(); // Gets the student name from the URL
  const allTasks = JSON.parse(localStorage.getItem('fxMentorTasks')) || [];
  
  // Filter sessions just for this student
  const studentSessions = allTasks.filter(t => t.title.includes(name));

  return (
    <div className="profile-container">
      <Link to="/" className="back-btn"><ArrowLeft size={18} /> Back to Dashboard</Link>
      
      <header className="profile-header">
        <h1>{name}'s Trading Journey</h1>
        <div className="badge-row">
          <span className="badge">Intermediate</span>
          <span className="badge">Focus: XAUUSD</span>
        </div>
      </header>

      <div className="profile-grid">
        {/* Psychology & Stats Card */}
        <div className="glass-card stat-detail">
          <h3><Brain size={20} /> Mentor Notes</h3>
          <div className="note-box">
            <p><strong>Common Issue:</strong> Revenge trading after London session losses.</p>
            <p><strong>Goal:</strong> Master 1:3 Risk/Reward ratios by next month.</p>
          </div>
        </div>

        {/* History Card */}
        <div className="glass-card session-history">
          <h3><Target size={20} /> Session History</h3>
          <ul>
            {studentSessions.map(s => (
              <li key={s.id} className="history-item">
                <span>{new Date(s.start).toLocaleDateString()}</span>
                <span>{s.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;