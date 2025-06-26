// src/AppLoader.jsx

import React from 'react';

import { decryptAES } from './utils/cryptoUtils.js'; // Import the decryption utility

export default function AppLoader({ onAppClick, apps, decryptionKeysMap }) {

  const handleAppClick = async (app) => {

    if (!app.encryptedHtml || !app.keyId) {

      alert(`App data is incomplete for ${app.name}. Cannot open.`);

      return;

    }

    const secretKey = decryptionKeysMap && decryptionKeysMap[app.keyId];

    if (!secretKey) {

      alert(`Decryption key not found for ${app.name}. The app might have expired or there was an issue loading keys. Please try logging out and back in.`);

      return;

    }

    try {

      const decryptedHtml = decryptAES(app.encryptedHtml, secretKey);

      if (decryptedHtml === null) {

        throw new Error('Decryption failed. The content might be corrupted or the key is incorrect.');

      }

      // Successfully decrypted, pass htmlContent to onAppClick

      onAppClick({ ...app, htmlContent: decryptedHtml });

    } catch (e) {

      console.error('Failed to load or decrypt app:', app.name, e);

      alert(`Failed to load app: ${app.name}\n${e.message}`);

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
