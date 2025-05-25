// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';

import WelcomePopup from './WelcomePopup';
import LoginPopup from './LoginPopup';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';

function App() {
  // ——— Your welcome/login/taskbar toggles ———
  const [showPopup, setShowPopup] = useState(true);
  const [dimmed, setDimmed] = useState(true);
  const [showTaskbar, setShowTaskbar] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!showPopup) {
      const timer = setTimeout(() => {
        setDimmed(false);
        setShowLogin(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setDimmed(true);
      setShowLogin(false);
    }
  }, [showPopup]);

  const handleCloseWelcome = () => setShowPopup(false);
  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowTaskbar(true);
  };

  // ——— Window state lives here in App.jsx ———
  const [windows, setWindows] = useState([]);
  const [zIndexCounter, setZIndexCounter] = useState(1);

  // Launch a new window
  const openApp = (appName, Component) => {
    const id = `${appName}_${Date.now()}`;
    setWindows(ws => [
      ...ws,
      {
        id,
        name: appName,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        zIndex: zIndexCounter,
        isMinimized: false,
        isMaximized: false,
        Component,
      }
    ]);
    setZIndexCounter(z => z + 1);
  };

  // Close
  const closeWindow = id => {
    setWindows(ws => ws.filter(w => w.id !== id));
  };

  // Minimize
  const minimizeWindow = id => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  // Maximize / restore
  const maximizeWindow = id => {
    setWindows(ws => ws.map(w => {
      if (w.id !== id) return w;
      if (!w.isMaximized) {
        return {
          ...w,
          isMaximized: true,
          prevX: w.x,
          prevY: w.y,
          prevWidth: w.width,
          prevHeight: w.height,
          x: 0,
          y: 0,
          width: '100%',
          height: '100%',
        };
      } else {
        return {
          ...w,
          isMaximized: false,
          x: w.prevX,
          y: w.prevY,
          width: w.prevWidth,
          height: w.prevHeight,
        };
      }
    }));
  };

  // Bring to front
  const focusWindow = id => {
    setWindows(ws => {
      const maxZ = ws.reduce((m, w) => w.zIndex > m ? w.zIndex : m, 0);
      return ws.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
    });
    setZIndexCounter(z => z + 1);
  };

  // Update position when dragged
  const updateWindowPosition = (id, x, y) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, x, y } : w));
  };

  // Update size & position when resized
  const updateWindowSize = (id, width, height, x, y) => {
    setWindows(ws =>
      ws.map(w => w.id === id ? { ...w, width, height, x, y } : w)
    );
  };

  return (
    <div className={`app ${dimmed ? 'dimmed' : ''}`}>
      {showPopup && <WelcomePopup onClose={handleCloseWelcome} />}
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {showTaskbar && (
        <>
          <WindowManager
            windows={windows}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={focusWindow}
            onDragStop={(id, x, y) => updateWindowPosition(id, x, y)}
            onResizeStop={(id, w, h, x, y) =>
              updateWindowSize(id, w, h, x, y)
            }
          />
          <Taskbar onAppClick={openApp} />
        </>
      )}
    </div>
  );
}

export default App;
