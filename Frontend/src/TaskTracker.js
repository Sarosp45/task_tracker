import React, { useState, useEffect } from "react";

const TaskTracker = ({ onLogout }) => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Open');
    const [filter, setFilter] = useState('All');
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasks = (statusFilter = '') => {
        const url = statusFilter && statusFilter !== 'All'
            ? `http://localhost:8000/api/tasks/?status=${encodeURIComponent(statusFilter)}`
            : 'http://localhost:8000/api/tasks/';

        fetch(url, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) setTasks(data);
            })
            .catch(err => console.error('Error:', err));
    };

    useEffect(() => {
        fetchTasks(filter);
    }, [filter]);

    const addTask = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        fetch('http://localhost:8000/api/tasks/', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, status }),
        })
            .then(response => response.json())
            .then(task => {
                setTasks([...tasks, task]);
                setTitle('');
                setDescription('');
                setStatus('Open');
            });
    };

    const deleteTask = (id) => {
        fetch(`http://localhost:8000/api/tasks/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        }).then(() => setTasks(tasks.filter(t => t.id !== id)));
    };

    const updateTask = (id, updates) => {
        fetch(`http://localhost:8000/api/tasks/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        })
            .then(response => response.json())
            .then(updated => {
                setTasks(tasks.map(t => t.id === id ? updated : t));
                setEditingTask(null);
            });
    };

    const getStatusClass = (s) => {
        if (s === 'Open') return 'status-open';
        if (s === 'In Progress') return 'status-progress';
        return 'status-completed';
    };

    return (
        <div>
            <div className="header">
                <h1>Task Tracker</h1>
                <button className="btn-secondary" onClick={onLogout}>Logout</button>
            </div>

            {/* Add Task Form */}
            <form onSubmit={addTask}>
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Task Title"
                    required
                />
                <input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <button type="submit">+ Add Task</button>
            </form>

            {/* Status Filter */}
            <div style={{ marginBottom: '20px' }}>
                <strong style={{ marginRight: '10px' }}>Filter:</strong>
                {['All', 'Open', 'In Progress', 'Completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`filter-btn ${filter === f ? 'active' : ''}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Task List */}
            {tasks.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999' }}>No tasks found. Add one above!</p>
            ) : (
                <ul>
                    {tasks.map(task => (
                        <li key={task.id}>
                            {editingTask === task.id ? (
                                <div>
                                    <input
                                        defaultValue={task.title}
                                        id={`edit-title-${task.id}`}
                                        style={{ marginBottom: '5px' }}
                                    />
                                    <input
                                        defaultValue={task.description}
                                        id={`edit-desc-${task.id}`}
                                        style={{ marginBottom: '5px' }}
                                    />
                                    <select defaultValue={task.status} id={`edit-status-${task.id}`}>
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <button onClick={() => updateTask(task.id, {
                                        title: document.getElementById(`edit-title-${task.id}`).value,
                                        description: document.getElementById(`edit-desc-${task.id}`).value,
                                        status: document.getElementById(`edit-status-${task.id}`).value
                                    })}>Save</button>
                                    <button className="btn-secondary" onClick={() => setEditingTask(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <strong style={{ fontSize: '16px' }}>{task.title}</strong>
                                    <span className={`status-badge ${getStatusClass(task.status)}`} style={{ marginLeft: '10px' }}>
                                        {task.status}
                                    </span>
                                    <p>{task.description || 'No description'}</p>
                                    <button className="btn-secondary" onClick={() => setEditingTask(task.id)}>✏️ Edit</button>
                                    <button className="btn-danger" onClick={() => deleteTask(task.id)}>🗑️ Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskTracker;