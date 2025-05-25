import React, { useState, useRef, useEffect } from 'react';
import './LoginPopup.css';

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

    const handleLogin = async () => {
        setError('');
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
                credentials: 'include', // important for cookies
            });
            if (res.ok) {
                onSuccess();
            } else {
                setError('Incorrect password');
            }
        } catch (e) {
            setError('Network error');
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
