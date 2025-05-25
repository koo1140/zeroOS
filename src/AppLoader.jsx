// AppLoader.jsx
import React, { useEffect, useState } from 'react';

const importAllApps = () => {
  const context = require.context('./apps', true, /App\.jsx$/);
  return context.keys().map((key) => {
    const appName = key.split('/')[1];
    const Component = context(key).default;
    const icon = require(`./apps/${appName}/icon.png`);
    return { name: appName, Component, icon };
  });
};

const AppLoader = ({ onAppClick }) => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const loadedApps = importAllApps();
    setApps(loadedApps);
  }, []);

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
};

export default AppLoader;
