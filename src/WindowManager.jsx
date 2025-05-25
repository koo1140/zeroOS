// src/WindowManager.jsx
import React from 'react';
import Window from './Window';

export default function WindowManager({
  windows,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDragStop,
  onResizeStop,
}) {
  return (
    <>
      {windows
        .filter(w => !w.isMinimized)
        .map(win => (
          <Window
            key={win.id}
            {...win}
            onFocus={() => onFocus(win.id)}
            onClose={() => onClose(win.id)}
            onMinimize={() => onMinimize(win.id)}
            onMaximize={() => onMaximize(win.id)}
            onDragStop={(x, y) => onDragStop(win.id, x, y)}
            onResizeStop={(w, h, x, y) =>
              onResizeStop(win.id, w, h, x, y)
            }
          >
            <win.Component />
          </Window>
        ))}
    </>
  );
}
