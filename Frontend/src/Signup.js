import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = ({ onSignup }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        fetch('http://localhost:8000/api/auth/signup/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    onSignup();
                } else {
                    setError(data.error || 'Signup failed');
                }
            })
            .catch(() => setError('Network error'));
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Sign Up</h2>
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
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
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
                <button type="submit">Sign Up</button>
            </form>
            <p style={{ marginTop: '20px' }}>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Signup;
