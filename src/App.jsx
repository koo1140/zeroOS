// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import WelcomePopup from './WelcomePopup';

function App() {
  const [showPopup, setShowPopup] = useState(true);
  const [dimmed, setDimmed] = useState(true);

  useEffect(() => {
    if (!showPopup) {
      const timer = setTimeout(() => setDimmed(false), 600);
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
    </div>
  );
}

export default App;
