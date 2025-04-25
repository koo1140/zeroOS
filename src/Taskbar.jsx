// Taskbar.jsx
import React, { useState, useEffect } from 'react';
import './Taskbar.css';

const Taskbar = () => {
  const [entered, setEntered] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000); // Update the time every second

    return () => clearInterval(timer); // Clean up the timer on component unmount
  }, []);

  return (
    <div className={`taskbar ${entered ? 'entered' : ''}`}>
      {/* Conținut taskbar */}
      <div className="taskbar-element clock">{time}</div>
    </div>
  );
};

export default Taskbar;
