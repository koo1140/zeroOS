// src/WindowManager.jsx
import React from 'react';
import Window from './Window';

export default function WindowManager({
  windows,
  onClose, onMinimize, onMaximize, onFocus,
  onDragStop, onResizeStop,
}) {
  return (
    <>
      {windows.filter(w=>!w.isMinimized).map(w => (
        <Window
          key={w.id}
          {...w}
          onFocus={() => onFocus(w.id)}
          onClose={() => onClose(w.id)}
          onMinimize={() => onMinimize(w.id)}
          onMaximize={() => onMaximize(w.id)}
          onDragStop={(x,y) => onDragStop(w.id,x,y)}
          onResizeStop={(width,height,x,y) => onResizeStop(w.id,width,height,x,y)}
          title={w.name} // Pass app name as title for the window and iframe
          // htmlContent is passed via {...w} which is handled by Window.jsx to render in iframe
        />
      ))}
    </>
  );
}
