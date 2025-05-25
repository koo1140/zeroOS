import React from 'react';
import Window from './Window';

export default function WindowManager({ windows, onClose, onMinimize, onMaximize, onFocus }) {
  return (
    <>
      {windows.filter(w => !w.isMinimized).map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.name}
          x={win.x}
          y={win.y}
          width={win.width}
          height={win.height}
          zIndex={win.zIndex}
          isMaximized={win.isMaximized}
          onFocus={() => onFocus(win.id)}
          onClose={() => onClose(win.id)}
          onMinimize={() => onMinimize(win.id)}
          onMaximize={() => onMaximize(win.id)}
        >
          <win.Component />
        </Window>
      ))}
    </>
  );
}

