// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';

import WelcomePopup from './WelcomePopup';
import LoginPopup from './LoginPopup';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';

function App() {
  // — welcome/login/taskbar toggles —
  const [showPopup, setShowPopup] = useState(true);
  const [dimmed, setDimmed] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);

  useEffect(() => {
    if (!showPopup) {
      const t = setTimeout(() => {
        setDimmed(false);
        setShowLogin(true);
      }, 600);
      return () => clearTimeout(t);
    } else {
      setDimmed(true);
      setShowLogin(false);
    }
  }, [showPopup]);

  const handleWelcomeClose = () => setShowPopup(false);
  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowDesktop(true);
  };

  // — desktop window state —
  const [windows, setWindows] = useState([]);
  const [zCounter, setZCounter] = useState(1);

  const openApp = app => {
    const id = app.name + '_' + Date.now();
    setWindows(ws => [
      ...ws,
      {
        id,
        ...app,
        x: 100, y: 100,
        width: app.defaultWidth,
        height: app.defaultHeight,
        zIndex: zCounter,
        isMinimized: false,
        isMaximized: false,
      }
    ]);
    setZCounter(z => z + 1);
  };

  const closeWindow     = id => setWindows(ws => ws.filter(w => w.id !== id));
  const minimizeWindow  = id => setWindows(ws => ws.map(w => w.id===id ? {...w, isMinimized:true} : w));
  const maximizeWindow  = id => setWindows(ws => ws.map(w => {
    if (w.id !== id) return w;
    if (!w.isMaximized) {
      return {
        ...w,
        isMaximized: true,
        prev: { x:w.x, y:w.y, w:w.width, h:w.height },
        x: 0, y: 0, width: '100%', height: '100%'
      };
    } else {
      return {
        ...w,
        isMaximized: false,
        x: w.prev.x,
        y: w.prev.y,
        width: w.prev.w,
        height: w.prev.h,
      };
    }
  }));
  const focusWindow     = id => {
    setWindows(ws => {
      const maxZ = ws.reduce((m,w)=>Math.max(m,w.zIndex),0);
      return ws.map(w => w.id===id ? {...w, zIndex: maxZ+1} : w);
    });
    setZCounter(z=>z+1);
  };
  const updatePosition  = (id, x, y) => setWindows(ws => ws.map(w=>w.id===id?{...w,x,y}:w));
  const updateSize      = (id, width, height, x, y) => setWindows(ws => ws.map(w=>w.id===id?{...w,width,height,x,y}:w));

  return (
    <div className={`app ${dimmed?'dimmed':''}`}>
      {showPopup && <WelcomePopup onClose={handleWelcomeClose} />}
      {showLogin && <LoginPopup onClose={()=>setShowLogin(false)} onSuccess={handleLoginSuccess} />}

      {showDesktop && (
        <>
          <WindowManager
            windows={windows}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={focusWindow}
            onDragStop={(id,x,y)=>updatePosition(id,x,y)}
            onResizeStop={(id,w,h,x,y)=>updateSize(id,w,h,x,y)}
          />
          <Taskbar onAppClick={openApp} />
        </>
      )}
    </div>
  );
}

export default App;
