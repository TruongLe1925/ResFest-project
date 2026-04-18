import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const USER_KEY = 'user';
const USERS_KEY = 'users';

const readJsonFromStorage = (key, fallbackValue) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallbackValue;
  try {
    return JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem(key);
    return fallbackValue;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = readJsonFromStorage(USER_KEY, null);
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError('');
    if (!email || !password || !email.includes('@')) {
      setError('Invalid email or password');
      return false;
    }
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const users = readJsonFromStorage(USERS_KEY, []);
    const existingUser = users.find((item) => item.email === email);

    if (existingUser && existingUser.password !== password) {
      setError('Incorrect password');
      return false;
    }

    const nextUser = existingUser || {
      id: Date.now(),
      username: email.split('@')[0],
      email,
      password,
      createdAt: new Date().toISOString()
    };

    if (!existingUser) {
      localStorage.setItem(USERS_KEY, JSON.stringify([nextUser, ...users]));
    }

    const sessionUser = {
      id: nextUser.id,
      username: nextUser.username,
      name: nextUser.username,
      email: nextUser.email,
      createdAt: nextUser.createdAt
    };

    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return true;
  };

  const register = async (email, password, username = '') => {
    setError('');
    if (!email || !password || password.length < 6 || !email.includes('@')) {
      setError('Email required and password min 6 chars');
      return false;
    }
    if (!username.trim()) {
      setError('Username is required');
      return false;
    }

    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const users = readJsonFromStorage(USERS_KEY, []);
    const existedEmail = users.some((item) => item.email === email);
    if (existedEmail) {
      setError('Email already exists');
      return false;
    }

    const registeredUser = {
      id: Date.now(),
      username: username.trim(),
      email,
      password,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([registeredUser, ...users]));

    const sessionUser = {
      id: registeredUser.id,
      username: registeredUser.username,
      name: registeredUser.username,
      email: registeredUser.email,
      createdAt: registeredUser.createdAt
    };

    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

