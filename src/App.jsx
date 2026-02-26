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

// --- STUDENT PROFILE COMPONENT ---
function StudentProfile({ tasks }) {
  const { name } = useParams();
  const studentSessions = tasks.filter(t => t.title.includes(name));

  return (
    <div className="profile-container">
      <Link to="/" className="back-btn"><ArrowLeft size={18} /> Back to Dashboard</Link>
      <header className="profile-header">
        <h1>{name}'s Trading History</h1>
      </header>
      <div className="profile-grid">
        <div className="glass-card">
          <h3><Brain size={20} /> Mentor Notes</h3>
          <div className="note-box"><p>Focus on discipline and risk management for {name}.</p></div>
        </div>
        <div className="glass-card">
          <h3><Target size={20} /> Past Sessions</h3>
          {studentSessions.map(s => <div key={s.id} className="history-item">{new Date(s.start).toLocaleDateString()} - {s.title}</div>)}
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