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

      // Try to extract the default export using eval (for demo/dev only)
      let Component = null;
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('React', `
          let exports = {};
          let module = { exports };
          ${code}
          return exports.default || module.exports.default || NotesApp;
        `);
        Component = fn(React);
      } catch (e) {
        throw new Error('App code could not be evaluated: ' + e.message);
      }
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
