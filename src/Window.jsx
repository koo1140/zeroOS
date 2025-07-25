// src/Window.jsx
import React from 'react';
import { Rnd } from 'react-rnd';

export default function Window({
  x, y, width, height, zIndex,
  title, isMaximized,
  minWidth, minHeight,
  onFocus, onClose, onMaximize,
  onDragStop, onResizeStop,
  htmlContent, // Added htmlContent prop
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
      style={{ zIndex, overflow: 'hidden', display: 'flex', flexDirection: 'column' }} // make Rnd a flex column
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      dragHandleClassName="window-header"
      className="window"
    >
      <div
        className="window-header"
        onMouseDown={startDrag}
        style={{ height: isMobile() ? '48px' : '32px', display: 'flex', alignItems: 'center' }} // Increased height for mobile
      >
        <span className="title" style={{ flexGrow: 1 }}>{title}</span>
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
      <div className="window-body" style={{
        padding: isMobile() ? 2 : 16,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        minWidth: 0,
        height: 'auto',
        width: '100%'
      }}>
        {htmlContent ? (
          <iframe
            srcDoc={htmlContent}
            style={{ width: '100%', height: '100%', minHeight: 0, minWidth: 0, display: 'block', flex: 1, border: 'none' }}
            title={title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          children
        )}
      </div>
      {!isMaximized && isMobile() && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '20px',
            height: '20px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            cursor: 'se-resize',
            zIndex: 1, // Ensure it's above the window body but below other controls if any
          }}
        />
      )}
    </Rnd>
  );
}

// Helper for mobile detection
function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth <= 600;
}
