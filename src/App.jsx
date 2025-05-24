// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import WelcomePopup from './WelcomePopup';
import Taskbar from './Taskbar'; // Import Taskbar component

function App() {
  const [showPopup, setShowPopup] = useState(true);
  const [dimmed, setDimmed] = useState(true);
  const [showTaskbar, setShowTaskbar] = useState(false);

  useEffect(() => {
    if (!showPopup) {
      const timer = setTimeout(() => {
        setDimmed(false);
        setShowTaskbar(true); // Show taskbar after popup closes
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setDimmed(true);
    }
  }, [showPopup]);

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <div className={`app ${dimmed ? 'dimmed' : ''}`}>
      {showPopup && <WelcomePopup onClose={handleClose} />}
      {showTaskbar && <Taskbar />}
    </div>
  );
}

export default App;
