import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation, // Import useLocation
} from 'react-router-dom';
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
  const { user } = useAuth();
  const location = useLocation(); // Use useLocation hook

  useEffect(() => {
    if (!showPopup) {
      const timer = setTimeout(() => {
        setDimmed(false);
        setShowTaskbar(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setDimmed(true);
      setShowTaskbar(false); // Ensure taskbar is hidden when popup is visible
    }
  }, [showPopup]);

  const handleClose = () => {
    setShowPopup(false);
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
        <Route
          path="/"
          element={
            user ? (
              <Home />
            ) : (
              <Navigate to="/login" replace state={{ from: location }} />
            )
          }
        />
      </Routes>
    </div>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};

export default App;