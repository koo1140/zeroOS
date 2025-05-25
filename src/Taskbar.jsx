import React, { useState, useEffect } from 'react';
import './Taskbar.css';
import AppLoader from './AppLoader';

const Taskbar = ({ onAppClick }) => {
  const [entered, setEntered] = useState(false);
  const [time, setTime] = useState("");
  const [emoji, setEmoji] = useState("");

  const updateTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const isAM = hours < 12;

    const emoji = isAM ? "🌞" : "🌜";
    hours = hours % 12 || 12;
    const formatNumber = (num) => num.toString().padStart(2, '0');
    const timeString = `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;

    setTime(timeString);
    setEmoji(emoji);
  };

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`taskbar ${entered ? 'entered' : ''}`}>
      <div className="taskbar-apps">
        <AppLoader
          onAppClick={(app) => onAppClick(app.name, app.Component)}
        />
      </div>
      <div className="taskbar-element clock">{time}</div>
      <div className="taskbar-element emoji-circle">{emoji}</div>
    </div>
  );
};

export default Taskbar;
