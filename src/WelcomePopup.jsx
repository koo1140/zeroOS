// WelcomePopup.jsx
import React from 'react';
import './WelcomePopup.css';

function WelcomePopup({ onClose }) {
  return (
    <div className="popup-container">
      <div className="popup">
        <h2>Welcome!</h2>
        <div className="message-box">
          <p>Hope :)</p>
          <p>(just click ok)</p>
          <p>nothing around here ✨</p>
          <p>you need to log in to access</p>
          <p>Hope :)</p>
          <p>Hope :)</p>
          <p>Hope :)</p>
        </div>
        <button onClick={onClose}>ok</button>
      </div>
    </div>
  );
}

export default WelcomePopup;