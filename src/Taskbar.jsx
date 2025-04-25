// Taskbar.jsx
import React, { useState, useEffect } from 'react';
import './Taskbar.css';

const formatTimeWithEmoji = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const isAM = hours < 12;

  const emoji = isAM ? "🌞" : "🌜";
  hours = hours % 12 || 12; // transformă 0 în 12

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)} ${emoji}`;
};

const Taskbar = () => {
  const [entered, setEntered] = useState(false);
  const [time, setTime] = useState(formatTimeWithEmoji(new Date()));

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTimeWithEmoji(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`taskbar ${entered ? 'entered' : ''}`}>
      <div className="taskbar-element clock">{time}</div>
    </div>
  );
};


export default Taskbar;