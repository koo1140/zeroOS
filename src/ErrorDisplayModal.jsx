// src/ErrorDisplayModal.jsx
import React from 'react';
import './ErrorDisplayModal.css'; // We'll create this CSS file next

export default function ErrorDisplayModal({ isOpen, onClose, errorInfo }) {
  if (!isOpen) {
    return null;
  }

  const { title, appName, message, details, context } = errorInfo || {};

  return (
    <div className="error-modal-overlay">
      <div className="error-modal-content">
        <h2>{title || 'Error'}</h2>
        {appName && <p><strong>App:</strong> {appName}</p>}
        {message && <p><strong>Message:</strong> {message}</p>}
        {details && (
          <div>
            <strong>Details:</strong>
            <pre>{details}</pre>
          </div>
        )}
        {context && (
          <div>
            <strong>Context:</strong>
            <pre>{JSON.stringify(context, null, 2)}</pre>
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
