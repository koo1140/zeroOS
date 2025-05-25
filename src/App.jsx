// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';

import WelcomePopup from './WelcomePopup';
import LoginPopup from './LoginPopup';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';

function App() {
  // Welcome & login popups
  const [showWelcome, setShowWelcome] = useState(true);
  const [dimmed, setDimmed] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);

  useEffect(() => {
    if (!showWelcome) {
      const timer = setTimeout(() => {
        setDimmed(false);
        setShowLogin(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setDimmed(true);
      setShowLogin(false);
    }
  }, [showWelcome]);

  const handleWelcomeClose = () => setShowWelcome(false);
  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowDesktop(true);
  };

  // Desktop window state
  const [windows, setWindows] = useState([]);
  const [zCounter, setZCounter] = useState(1);

  // Open a new app window
  const openApp = (app) => {
    console.log('openApp got:', app);
    if (!app || !app.Component) {
      console.error('❌ openApp was called with an invalid app:', app);
      return;
    }
    const id = `${app.name}_${Date.now()}`;
    setWindows(ws => [
      ...ws,
      {
        id,
        ...app,
        x: 100,
        y: 100,
        width: app.defaultWidth,
        height: app.defaultHeight,
        zIndex: zCounter,
        isMinimized: false,
        isMaximized: false,
      },
    ]);
    setZCounter(z => z + 1);
  };

  // Window controls
  const closeWindow = (id) => {
    setWindows(ws => ws.filter(w => w.id !== id));
  };

  const minimizeWindow = (id) => {
    setWindows(ws =>
      ws.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const maximizeWindow = (id) => {
    setWindows(ws =>
      ws.map(w => {
        if (w.id !== id) return w;
        if (!w.isMaximized) {
          return {
            ...w,
            isMaximized: true,
            prev: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 0,
            y: 0,
            width: '100%',
            height: '100%',
          };
        } else {
          return {
            ...w,
            isMaximized: false,
            x: w.prev.x,
            y: w.prev.y,
            width: w.prev.width,
            height: w.prev.height,
          };
        }
      })
    );
  };

  const focusWindow = (id) => {
    setWindows(ws => {
      const maxZ = ws.reduce((m, w) => (w.zIndex > m ? w.zIndex : m), 0);
      return ws.map(w =>
        w.id === id ? { ...w, zIndex: maxZ + 1 } : w
      );
    });
    setZCounter(z => z + 1);
  };

  const updateWindowPosition = (id, x, y) => {
    setWindows(ws =>
      ws.map(w => (w.id === id ? { ...w, x, y } : w))
    );
  };

  const updateWindowSize = (id, width, height, x, y) => {
    setWindows(ws =>
      ws.map(w =>
        w.id === id ? { ...w, width, height, x, y } : w
      )
    );
  };

  return (
    <div className={`app ${dimmed ? 'dimmed' : ''}`}>
      {showWelcome && <WelcomePopup onClose={handleWelcomeClose} />}
      {showLogin && (
        <LoginPopup onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
      )}

      {showDesktop && (
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