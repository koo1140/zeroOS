// src/AppLoader.jsx
import React from 'react';
import NotesApp from './apps/Notes/App.jsx';
import notesIcon from './apps/Notes/icon.png';

// Registry of available apps, each with preferred sizing
export const appRegistry = [
  {
    name: 'Notes',
    Component: NotesApp,
    icon: notesIcon,
    defaultWidth: 600,
    defaultHeight: 450,
    minWidth: 300,
    minHeight: 200,
  },
  // …add more apps here
];

export default function AppLoader({ onAppClick }) {
  return (
    <>
      {appRegistry.map((app) => (
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
