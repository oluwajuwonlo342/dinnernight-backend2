import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('studentData');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const loadStudent = useCallback(async () => {
    const token = localStorage.getItem('studentToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setStudent(data.student);
      localStorage.setItem('studentData', JSON.stringify(data.student));
    } catch (err) {
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  const login = async (matricNumber, password) => {
    const { data } = await api.post('/auth/login', { matricNumber, password });
    localStorage.setItem('studentToken', data.token);
    localStorage.setItem('studentData', JSON.stringify(data.student));
    setStudent(data.student);
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('studentToken', data.token);
    localStorage.setItem('studentData', JSON.stringify(data.student));
    setStudent(data.student);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    setStudent(null);
  };

  const markVoted = () => {
    setStudent((prev) => {
      const updated = { ...prev, hasVoted: true };
      localStorage.setItem('studentData', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{ student, loading, login, register, logout, markVoted, isAuthenticated: !!student }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
