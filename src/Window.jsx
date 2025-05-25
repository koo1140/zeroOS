// src/Window.jsx
import React from 'react';
import { Rnd } from 'react-rnd';

export default function Window({
  x,
  y,
  width,
  height,
  zIndex,
  title,
  isMaximized,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onDragStop,
  onResizeStop,
  children,
}) {
  const handleMouseDown = () => onFocus();

  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      onDragStart={handleMouseDown}
      onResizeStart={handleMouseDown}
      onDragStop={(e, d) => {
        handleMouseDown();
        onDragStop(d.x, d.y);
      }}
      onResizeStop={(e, dir, ref, delta, pos) => {
        handleMouseDown();
        onResizeStop(
          ref.offsetWidth,
          ref.offsetHeight,
          pos.x,
          pos.y
        );
      }}
      style={{ zIndex }}
      bounds="parent"
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      dragHandleClassName="window-header"
      className="window"
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <span className="title">{title}</span>
        <div className="controls">
          <button onClick={onMinimize}>–</button>
          <button onClick={onMaximize}>□</button>
          <button onClick={onClose}>✕</button>
        </div>
      </div>
      <div className="window-body">{children}</div>
    </Rnd>
  );
}
