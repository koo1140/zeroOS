// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import WelcomePopup from './WelcomePopup';
import Taskbar from './Taskbar'; // Import Taskbar component
import LoginPopup from './LoginPopup'; // Import LoginPopup component

function App() {
  const [showPopup, setShowPopup] = useState(true);
  const [dimmed, setDimmed] = useState(true);
  const [showTaskbar, setShowTaskbar] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // new state for login popup

  useEffect(() => {
    if (!showPopup) {
      const timer = setTimeout(() => {
        setDimmed(false);
        setShowLogin(true); // Show login popup after welcome popup closes
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setDimmed(true);
      setShowLogin(false); // Hide login popup if welcome popup is open
    }
  }, [showPopup]);

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowTaskbar(true); // Show taskbar after successful login
  };

  return (
    <div className={`app ${dimmed ? 'dimmed' : ''}`}>
      {showPopup && <WelcomePopup onClose={handleClose} />}
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />}
    + import Desktop from './Desktop';
  …
  {showTaskbar && <Desktop />}
    </div>
  );
}

export default App;
