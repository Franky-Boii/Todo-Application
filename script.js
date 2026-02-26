let calendar;
let tasks = JSON.parse(localStorage.getItem('fxMentorTasks')) || [];

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        slotMinTime: '06:00:00',
        headerToolbar: { left: 'prev,next today', center: 'title', right: 'timeGridWeek,dayGridMonth' },
        events: tasks,
        editable: true,
        eventClick: (info) => { if(confirm("Delete this session?")) deleteSession(info.event.id); }
    });
    calendar.render();
    updateStats();
    renderTaskList();
});

function toggleStudentFields() {
    const cat = document.getElementById('taskCategory').value;
    document.getElementById('student-fields').className = (cat === 'mentoring') ? '' : 'hidden';
}

function addTask() {
    const title = document.getElementById('taskInput').value;
    const dateStr = document.getElementById('taskDate').value;
    const category = document.getElementById('taskCategory').value;
    
    if (!title || !dateStr) return alert("Fill in the student name and time!");

    const newTask = {
        id: String(Date.now()),
        title: `[${category.toUpperCase()}] ${title}`,
        start: dateStr,
        category: category,
        pair: document.getElementById('focusPair').value || 'N/A',
        backgroundColor: getCategoryColor(category)
    };

    tasks.push(newTask);
    saveAndRefresh();
}

function deleteSession(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('fxMentorTasks', JSON.stringify(tasks));
    calendar.removeAllEvents();
    calendar.addEventSource(tasks);
    updateStats();
    renderTaskList();
}

function getCategoryColor(cat) {
    const colors = { mentoring: '#8b5cf6', trading: '#10b981', personal: '#475569' };
    return colors[cat] || '#3b82f6';
}

function updateStats() {
    const mentorTasks = tasks.filter(t => t.category === 'mentoring');
    document.getElementById('stat-students').innerText = [...new Set(mentorTasks.map(t => t.title))].length;
    document.getElementById('stat-sessions').innerText = mentorTasks.length;
}

function renderTaskList() {
    const list = document.getElementById('todoList');
    list.innerHTML = tasks.slice(-3).reverse().map(t => `
        <li class="todo-item">
            <strong>${t.title}</strong><br>
            <small>${new Date(t.start).toLocaleString()}</small>
        </li>
    `).join('');
}