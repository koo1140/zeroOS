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
  const [apps, setApps] = useState(null);
  const [decryptionKeysMap, setDecryptionKeysMap] = useState({}); // State for decryption keys
  const [error, setError] = useState(''); // Error state for login/data fetching issues


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
  const handleLoginSuccess = async (loginData) => { // loginData from LoginPopup
    setShowLogin(false);
    console.log("Logged in as:", loginData.username);

    try {
      // 1. Fetch the list of apps (which includes encryptedHtml and keyId)
      const appsRes = await fetch('/api/apps', { credentials: 'include' });
      if (!appsRes.ok) {
        throw new Error(`Failed to fetch apps: ${appsRes.statusText}`);
      }
      const appsData = await appsRes.json();
      setApps(appsData);

      // 2. Extract keyIds from the fetched apps
      const keyIdsToFetch = appsData.map(app => app.keyId).filter(Boolean);

      if (keyIdsToFetch.length > 0) {
        // 3. Fetch the decryption keys for these keyIds
        const keysRes = await fetch('/api/decryption-keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyIds: keyIdsToFetch }),
          credentials: 'include', // Important for sending JWT cookie
        });

        if (!keysRes.ok) {
          throw new Error(`Failed to fetch decryption keys: ${keysRes.statusText}`);
        }
        const keysData = await keysRes.json();
        setDecryptionKeysMap(keysData.decryptionKeys || {});
      } else {
        setDecryptionKeysMap({}); // No keys to fetch
      }

      setShowDesktop(true); // Show desktop after apps and keys are processed

    } catch (e) {
      console.error("Error after login (fetching apps or keys):", e);
      // Handle error appropriately, e.g., show error message to user
      setError('Failed to load application data. Please try again.'); // Assuming setError state exists or is added
    }
  };

  // Desktop window state
  const [windows, setWindows] = useState([]);
  const [zCounter, setZCounter] = useState(1);

  // Open a new app window
  const openApp = (app) => {
    console.log('openApp got:', app);
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

      {showDesktop && apps && (
        <div className="desktop">
          <WindowManager
            windows={windows}
            onClose={closeWindow}
            onMaximize={maximizeWindow}
            onFocus={focusWindow}
            onDragStop={(id, x, y) => updateWindowPosition(id, x, y)}
            onResizeStop={(id, w, h, x, y) =>
              updateWindowSize(id, w, h, x, y)
            }
          />
          <Taskbar onAppClick={openApp} apps={apps} decryptionKeysMap={decryptionKeysMap} />
        </div>
      )}
      {error && <div className="app-error-popup">{error}</div> /* Display global errors */}
    </div>
  );
}

export default App;
