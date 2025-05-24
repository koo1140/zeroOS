import React, { useState } from 'react';
import './LoginPopup.css';
import sha256 from 'crypto-js/sha256';
import correctHash from './login/auth/verify';

function LoginPopup({ onClose, onSuccess }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = () => {
        const hashedPassword = sha256(password).toString();
        if (hashedPassword === correctHash) {
            onSuccess();
        } else {
            setError('Incorrect password');
        }
    };

    return (
        <div className="login-popup-container">
            <div className="login-popup">
                <h2>Login</h2>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleInputChange}
                />
                {error && <div className="error-message">{error}</div>}
                <button onClick={handleLogin}>Log In</button>
            </div>
        </div>
    );
}

export default LoginPopup;
