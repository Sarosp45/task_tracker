import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import TaskTracker from "./TaskTracker";
import Login from './login';
import Signup from './Signup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    fetch('http://localhost:8000/api/auth/logout/', {
      method: 'POST',
      credentials: 'include'
    }).then(() => setIsAuthenticated(false));
  };


  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Signup onSignup={() => window.location.href = '/login'} />
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <TaskTracker onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;