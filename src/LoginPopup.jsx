import React, { useState, useRef, useEffect } from 'react';
import './LoginPopup.css';

function LoginPopup({ onClose, onSuccess }) {
    const [username, setUsername] = useState(''); // Added username state
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const usernameInputRef = useRef(null); // Ref for username input

    useEffect(() => {
        usernameInputRef.current?.focus(); // Focus username input on mount
    }, []);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async () => {
        setError('');
        if (!username) {
            setError('Username is required.');
            return;
        }
        if (!password) {
            setError('Password is required.');
            return;
        }

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Sending username and password as separate fields
                body: JSON.stringify({ username, password }),
                credentials: 'include', // important for cookies
            });
            const data = await res.json();
            if (res.ok) {
                onSuccess(data); // Pass full data object on success
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (e) {
            setError('Network error. Please try again.');
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
                    ref={usernameInputRef} // Assign ref to username input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    onKeyDown={handleKeyDown} // Allow Enter key on username field
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                />
                {error && <div className="error-message">{error}</div>}
                <button onClick={handleLogin}>verify</button>
            </div>
        </div>
    );
}

export default LoginPopup;
