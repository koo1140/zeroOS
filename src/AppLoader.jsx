// src/AppLoader.jsx
import React, { useEffect, useState } from 'react';

const apps = import.meta.glob('./apps/*/App.jsx');
const icons = import.meta.globEager('./apps/*/icon.png');

const AppLoader = ({ onAppClick }) => {
  const [loadedApps, setLoadedApps] = useState([]);

  useEffect(() => {
    const loadApps = async () => {
      const entries = await Promise.all(
        Object.entries(apps).map(async ([path, resolver]) => {
          const nameMatch = path.match(/\.\/apps\/([^/]+)\/App\.jsx$/);
          if (!nameMatch) return null;
          const name = nameMatch[1];
          const module = await resolver();
          const icon = icons[`./apps/${name}/icon.png`]?.default;

          return {
            name,
            Component: module.default,
            icon,
          };
        })
      );

      setLoadedApps(entries.filter(Boolean));
    };

    loadApps();
  }, []);

  return (
    <>
      {loadedApps.map((app) => (
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
