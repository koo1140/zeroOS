// src/AppLoader.jsx
import React from 'react';

// Remove hardcoded appRegistry

export default function AppLoader({ onAppClick, apps }) {
  const handleAppClick = async (app) => {
    // Dynamically import the app script from the protected endpoint
    const scriptUrl = app.script;
    try {
      const module = await import(/* @vite-ignore */ scriptUrl);
      onAppClick({ ...app, Component: module.default });
    } catch (e) {
      alert('Failed to load app: ' + app.name);
    }
  };

  return (
    <>
      {apps.map((app) => (
        <div
          key={app.name}
          className="app-icon"
          title={app.name}
          onClick={() => handleAppClick(app)}
        >
          <img src={app.icon} alt={app.name} />
        </div>
      ))}
    </>
  );
}
