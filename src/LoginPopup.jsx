import React, { useState, useRef, useEffect } from 'react';
import './LoginPopup.css';
import sha256 from 'crypto-js/sha256';
import correctHash from './login/auth/verify';

function LoginPopup({ onClose, onSuccess }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-popup-container">
            <div className="login-popup">
                <h2>Auth</h2>
                <input
                    ref={inputRef}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                {error && <div className="error-message">{error}</div>}
                <button onClick={handleLogin}>verify</button>
            </div>
        </div>
    );
}

export default LoginPopup;
