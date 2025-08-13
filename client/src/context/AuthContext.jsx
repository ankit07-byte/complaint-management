// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/check-auth', { withCredentials: true });
      setUser(res.data.user); // or processed user
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false); // THIS must run
    }
  };

  if (!user) {
    checkAuth();
  } else {
    setLoading(false);
  }
}, [user]);


  const login = async (email, password, role) => {
  try {
    console.log("login() called with:", { email, role });

    let endpoint;
    if (role === 'student') {
      endpoint = '/auth/student-login';
    } else if (role === 'authority') {
      endpoint = '/auth/authority-login';
    } else if (role === 'admin') {
      endpoint = '/auth/admin-login';
    }
    else throw new Error('Invalid role');

    console.log("Hitting endpoint:", endpoint);

    const res = await api.post(endpoint, { email, password }, { withCredentials: true });
    console.log("Response from backend:", res.data);

    localStorage.setItem('token', res.data.token);

    const userData = {
  ...res.data.user,
  role,
  designation: res.data.user?.designation || null,
  department:
    res.data.user?.designation === 'Network Department'
      ? 'Network'
      : res.data.user?.department || null,
  hostelNo:
    res.data.user?.designation === 'Network Department'
      ? null
      : res.data.user?.hostelNo || null
};



    console.log("Final userData:", userData);

    setUser(userData);
    toast.success('Logged in successfully');

    return userData;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || 'Login failed');
    throw error;
  }
};


  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true }); // ✅ fixed here
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };