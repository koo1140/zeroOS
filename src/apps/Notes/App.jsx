// src/apps/Notes/App.jsx
import React, { useState } from 'react';
import './App.css';

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');

  const addNote = () => {
    if (text.trim()) {
      setNotes([...notes, text.trim()]);
      setText('');
    }
  };

  return (
    <div className="notes-app">
      <h2>📝 Notes</h2>
      <textarea
        placeholder="Write your note here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={addNote}>Add Note</button>
      <ul className="notes-list">
        {notes.map((note, idx) => (
          <li key={idx}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotesApp;
