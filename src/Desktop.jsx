import React, { useState } from 'react';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';

const Desktop = () => {
  const [windows, setWindows] = useState([]);
  const [zIndexCounter, setZIndexCounter] = useState(1);

  const openApp = (appName, Component) => {
    const id = `${appName}_${Date.now()}`;
    setWindows(prev => [
      ...prev,
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
      },
    ]);
    setZIndexCounter(prev => prev + 1);
  };

  const closeWindow = id => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = id => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  };

  const maximizeWindow = id => {
    setWindows(prev => prev.map(w => {
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

  const focusWindow = id => {
    setWindows(prev => {
      const maxZ = prev.reduce((max, w) => (w.zIndex > max ? w.zIndex : max), 0);
      return prev.map(w =>
        w.id === id ? { ...w, zIndex: maxZ + 1 } : w
      );
    });
    setZIndexCounter(prev => prev + 1);
  };

  return (
    <div className="desktop">
      <WindowManager
        windows={windows}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={maximizeWindow}
        onFocus={focusWindow}
      />
      <Taskbar onAppClick={openApp} />
    </div>
  );
};

export default Desktop;
