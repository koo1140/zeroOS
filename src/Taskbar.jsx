import React, { useState, useEffect } from 'react';
import './Taskbar.css';
import AppLoader from './AppLoader';

export default function Taskbar({ onAppClick, apps }) {
  const [entered, setEntered] = useState(false);
  const [time, setTime] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      let h = d.getHours();
      const m = d.getMinutes();
      const s = d.getSeconds();
      const isAM = h < 12;
      const emoji = isAM ? "🌞" : "🌜";
      h = h % 12 || 12;
      const fmt = n => n.toString().padStart(2,'0');
      setTime(`${fmt(h)}:${fmt(m)}:${fmt(s)}`);
      setEmoji(emoji);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`taskbar ${entered ? 'entered' : ''}`}>
      <div className="taskbar-apps">
        <AppLoader onAppClick={onAppClick} apps={apps} />
      </div>
      <div className="taskbar-element clock">{time}</div>
      <div className="taskbar-element emoji-circle">{emoji}</div>
    </div>
  );
}
