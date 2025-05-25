// src/AppLoader.jsx
import React from 'react';

// Remove hardcoded appRegistry

export default function AppLoader({ onAppClick, apps }) {
  const handleAppClick = async (app) => {
    const scriptUrl = app.script;
    try {
      const res = await fetch(scriptUrl, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch app script');
      const code = await res.text();

      // Remove any import/export statements from the code
      const sanitized = code
        .replace(/import\s+.*from\s+.*;?/g, '')
        .replace(/export\s+default\s+/g, 'return ')
        .replace(/export\s+\{[^}]*\};?/g, '');

      // Wrap in a function to provide React in scope
      // eslint-disable-next-line no-new-func
      const Component = new Function('React', `${sanitized}`)(React);

      if (!Component) throw new Error('No default export found in app');
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
