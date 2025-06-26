// src/AppLoader.jsx

import React from 'react';

// Remove hardcoded appRegistry

export default function AppLoader({ onAppClick, apps }) {

  const handleAppClick = async (app) => {

    const htmlUrl = app.html; // Assuming app.html contains the path to the HTML file

    try {

      // Fetch the HTML content
      const response = await fetch(htmlUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch HTML: ${response.statusText}`);
      }
      const htmlContent = await response.text();

      onAppClick({ ...app, htmlContent });

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