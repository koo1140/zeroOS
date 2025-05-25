// Window.jsx
import React from 'react';
import { Rnd } from 'react-rnd';

export default function Window(props) {
  const {
    id, title, x, y, width, height, zIndex, isMaximized,
    onFocus, onClose, onMinimize, onMaximize,
    children
  } = props;

  // When the window is clicked or dragged, bring it to front
  const handleMouseDown = () => { onFocus(); };

  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      onDragStop={(e, d) => {
        // update position state if needed (not shown here for brevity)
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        // update size and position if needed
      }}
      style={{ zIndex }}
      bounds="parent"
      className="window"
      dragHandleClassName="window-header"
      disableDragging={isMaximized} 
      enableResizing={!isMaximized}
      onDragStart={handleMouseDown}
      onResizeStart={handleMouseDown}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <span className="title">{title}</span>
        <div className="controls">
          <button onClick={onMinimize}>–</button>
          <button onClick={onMaximize}>□</button>
          <button onClick={onClose}>✕</button>
        </div>
      </div>
      <div className="window-body">
        {children}
      </div>
    </Rnd>
  );
}
