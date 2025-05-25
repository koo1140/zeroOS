// src/AppLoader.jsx
import React from 'react';

// Remove hardcoded appRegistry

export default function AppLoader({ onAppClick, apps }) {
  const handleAppClick = async (app) => {
    const scriptUrl = app.script;
    try {
      // Fetch the script as text
      const res = await fetch(scriptUrl, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch app script');
      const code = await res.text();

      // Try to import as a blob module (works if code is valid JS)
      const blob = new Blob([code], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      try {
        const module = await import(/* @vite-ignore */ blobUrl);
        onAppClick({ ...app, Component: module.default });
      } catch (e) {
        // Fallback: try eval (for demo/dev only, not production safe)
        // eslint-disable-next-line no-eval
        let exports = {};
        eval(code + '\nexports = { default: NotesApp || exports.default };');
        if (exports.default) {
          onAppClick({ ...app, Component: exports.default });
        } else {
          throw e;
        }
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
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
