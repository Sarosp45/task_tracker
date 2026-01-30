import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        fetch('http://localhost:8000/api/auth/login/', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Login Successful') {
                    onLogin();
                } else {
                    setError(data.error || 'Login failed');
                }
            })
            .catch(() => setError('Network error'));
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'block' }}>
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    style={{ display: 'block', margin: '10px auto', maxWidth: '300px' }}
                /><br />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    style={{ display: 'block', margin: '10px auto', maxWidth: '300px' }}
                /><br />
                <button type="submit">Login</button>
            </form>
            <p style={{ marginTop: '20px' }}>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    );
};

export default Login;