// src/AppLoader.jsx
import React from 'react';

// Remove hardcoded appRegistry

export default function AppLoader({ onAppClick, apps }) {
  const handleAppClick = async (app) => {
    const scriptUrl = app.script;
    try {
      // Dynamically import the module
      const module = await import(/* @vite-ignore */ scriptUrl);
      const Component = module.default; // Assuming the app exports its main component as default

      if (!Component) throw new Error('No default export found in app module');
      onAppClick({ ...app, Component });
    } catch (e) {
      alert('Failed to load app: ' + app.name + '\n' + e.message);
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
