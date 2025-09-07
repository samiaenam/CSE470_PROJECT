// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // v3 default import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          _id: decoded.userId,
          role: decoded.role,
          isAdmin: decoded.isAdmin,
          name: decoded.name || '',
          phone: decoded.phone || ''
        });
      } catch (err) {
        console.error('Invalid token:', err);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
    }
  }, [token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

