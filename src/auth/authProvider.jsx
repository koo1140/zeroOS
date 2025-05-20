import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username, password) => {
    // In a real app, you'd make an API call here
    if (username === 'Administrator' && password === 'zero00') {
      const user = { username: 'Administrator', role: 'admin' };
      setUser(user);
      Cookies.set('user', JSON.stringify(user));
      navigate('/protected'); // Redirect to a protected route
    } else {
      alert('Invalid credentials');
      return false;
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
    navigate('/');
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};