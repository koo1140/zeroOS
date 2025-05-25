// src/Window.jsx
import React from 'react';
import { Rnd } from 'react-rnd';

export default function Window({
  x, y, width, height, zIndex,
  title, isMaximized,
  minWidth, minHeight,
  onFocus, onClose, onMaximize,
  onDragStop, onResizeStop,
  children
}) {
  const startDrag = () => onFocus();

  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      bounds="parent"
      minWidth={minWidth}
      minHeight={minHeight}
      onDragStart={startDrag}
      onResizeStart={startDrag}
      onDragStop={(e, d) => {
        startDrag();
        onDragStop(d.x, d.y);
      }}
      onResizeStop={(e, dir, ref, delta, pos) => {
        startDrag();
        onResizeStop(
          ref.offsetWidth,
          ref.offsetHeight,
          pos.x,
          pos.y
        );
      }}
      style={{ zIndex }}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      dragHandleClassName="window-header"
      className="window"
    >
      <div className="window-header" onMouseDown={startDrag}>
        <span className="title">{title}</span>
        <div className="controls">
          <button
            className="toggle-btn"
            onClick={onMaximize}
          >
            {isMaximized ? '–' : '□'}
          </button>
          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>
      <div className="window-body">{children}</div>
    </Rnd>
  );
}
