// src/AppLoader.jsx
import React from 'react';
import NotesApp from './apps/Notes/App.jsx';
import notesIcon from './apps/Notes/icon.png';

const appRegistry = [
  {
    name: 'Notes',
    Component: NotesApp,
    icon: notesIcon,
  },
  // Add more apps here manually
];

const AppLoader = ({ onAppClick }) => {
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
};

export default AppLoader;
