// src/AppLoader.jsx
import React from 'react';

// Remove hardcoded appRegistry

export default function AppLoader({ onAppClick, apps }) {
  return (
    <>
      {apps.map((app) => (
        <div
          key={app.name}
          className="app-icon"
          title={app.name}
          onClick={() => onAppClick(app)}
        >
          <img src={app.icon} alt={app.name} />
        </div>
      ))}
    </>
  );
}
