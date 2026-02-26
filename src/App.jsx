import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { TrendingUp, Users, Clock, AlertTriangle, ArrowLeft, Target, Brain } from 'lucide-react';
import './App.css';

// --- MAIN DASHBOARD COMPONENT ---
function Dashboard({ tasks, setTasks }) {
  const [form, setForm] = useState({ title: '', date: '', category: 'mentoring', pair: '' });

  const addTask = () => {
    if (!form.title || !form.date) return alert("Fill in the student name and date!");
    
    const newTask = {
      id: String(Date.now()),
      title: `${form.title} (${form.pair || 'General'})`,
      start: form.date,
      backgroundColor: form.category === 'mentoring' ? '#8b5cf6' : '#10b981',
      extendedProps: { ...form }
    };

    setTasks([...tasks, newTask]);
    setForm({ title: '', date: '', category: 'mentoring', pair: '' });
  };

  const studentCount = new Set(tasks.filter(t => t.extendedProps?.category === 'mentoring').map(t => t.title)).size;

  return (
    <div className="dashboard-container">
      <section className="stats-grid">
        <StatCard icon={<Users />} label="Active Students" value={studentCount} color="purple" />
        <StatCard icon={<Clock />} label="Total Sessions" value={tasks.length} color="blue" />
        <StatCard icon={<TrendingUp />} label="Main Pair" value="XAUUSD" color="green" />
        <StatCard icon={<AlertTriangle />} label="Conflicts" value="0" color="red" />
      </section>

      <div className="main-content">
        <aside className="glass-card sidebar">
          <h3>Schedule Session</h3>
          <input type="text" placeholder="Student Name" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
          <input type="text" placeholder="Pair (e.g. EURUSD)" value={form.pair} onChange={(e) => setForm({...form, pair: e.target.value})} />
          <input type="datetime-local" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
          <button className="add-btn" onClick={addTask}>Schedule & Save</button>
        </aside>

        <main className="glass-card calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            events={tasks}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'timeGridWeek,dayGridMonth' }}
            height="100%"
          />
        </main>
      </div>
    </div>
  );
}

// --- UPDATED STUDENT PROFILE COMPONENT ---
function StudentProfile({ tasks }) {
  const { name } = useParams();
  const [rawNotes, setRawNotes] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const studentSessions = tasks.filter(t => t.title.includes(name));

  const handleSummarize = () => {
    if (!rawNotes) return alert("Please paste some session notes first!");
    
    setIsProcessing(true);
    
    // Simulating AI Processing delay
    setTimeout(() => {
      const formatted = `
📊 SESSION SUMMARY FOR ${name.toUpperCase()}
------------------------------------------
🧠 PSYCHOLOGY: ${rawNotes.includes('fear') ? 'Working on market anxiety.' : 'Mindset is stabilizing.'}
📈 STRATEGY: Focus on ${studentSessions[0]?.extendedProps?.pair || 'Current Pairs'}.
📝 HOMEWORK: Review the London Open price action for the last 5 days.
      `;
      setAiSummary(formatted);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="profile-container">
      <Link to="/" className="back-btn"><ArrowLeft size={18} /> Back to Dashboard</Link>
      
      <header className="profile-header">
        <h1>{name}'s Performance Hub</h1>
      </header>

      <div className="profile-grid">
        {/* Left: Input for Raw Notes */}
        <div className="glass-card">
          <h3><Brain size={20} /> AI Session Summarizer</h3>
          <p className="sub-text">Paste your raw session notes below:</p>
          <textarea 
            className="note-textarea"
            placeholder="e.g. Student took a bad trade on Gold, ignored the trend, but managed risk well..."
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
          ></textarea>
          <button className="ai-btn" onClick={handleSummarize} disabled={isProcessing}>
            {isProcessing ? "AI is thinking..." : "✨ Generate AI Summary"}
          </button>
        </div>

        {/* Right: AI Output */}
        <div className="glass-card ai-output">
          <h3><Target size={20} /> Structured Growth Plan</h3>
          {aiSummary ? (
            <pre className="summary-display">{aiSummary}</pre>
          ) : (
            <p className="placeholder-text">Click generate to see the structured plan.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- BASE APP WRAPPER ---
function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('fxMentorTasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fxMentorTasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <Router>
      <nav className="glass-nav">
        <Link className="nav-logo" to="/">📊 FX-MENTOR PRO</Link>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard tasks={tasks} setTasks={setTasks} />} />
        <Route path="/student/:name" element={<StudentProfile tasks={tasks} />} />
      </Routes>
    </Router>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info"><p>{label}</p><h3>{value}</h3></div>
    </div>
  );
}

export default App;