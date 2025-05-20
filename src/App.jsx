import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import WelcomePopup from './WelcomePopup';
import Taskbar from './Taskbar';
import { AuthProvider, useAuth } from './auth/authProvider';
import LoginPage from './auth/LoginPage';

function App() {
  const [showPopup, setShowPopup] = useState(true);
  const [dimmed, setDimmed] = useState(true);
  const [showTaskbar, setShowTaskbar] = useState(false);

  useEffect(() => {
    if (!showPopup) {
      const timer = setTimeout(() => {
        setDimmed(false);
        setShowTaskbar(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setDimmed(true);
    }
  }, [showPopup]);

  const handleClose = () => {
    setShowPopup(false);
  };

  const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
  };

  const Home = () => {
    return (
      <>
        {showPopup && <WelcomePopup onClose={handleClose} />}
        {showTaskbar && <Taskbar />}
      </>
    );
  };

  return (
    <div className={`app ${dimmed ? 'dimmed' : ''}`}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>
                    <h1>Protected Page</h1>
                    <p>You are logged in!</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Home />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;