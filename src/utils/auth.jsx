import { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

// Create Authentication Context
export const AuthContext = createContext(null);

// Custom Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const initAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          // Accept stored user without backend validation in dev mode / local usage
          setUser(JSON.parse(userStr));
        } catch (error) {
          console.error('Token/user parse error:', error);
          // If parse fails, clear stored data and fallback to default creation logic
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          createDefaultIfNeeded();
        }
      } else {
        createDefaultIfNeeded();
      }

      setLoading(false);
    };

    const createDefaultIfNeeded = () => {
      // If user already set by other flow, skip
      if (localStorage.getItem('user')) return;

      // Determine desired default role:
      // 1) REACT_APP_DEFAULT_ROLE env var (useful for CI/dev)
      // 2) infer from current path (pharmacist pages)
      // 3) fall back to LABTECH for backward compatibility
      const envRole = (process.env.REACT_APP_DEFAULT_ROLE || '').trim().toUpperCase();
      const path = (window.location.pathname || '').toLowerCase();

      let defaultRole = envRole;
      if (!defaultRole) {
        if (path.includes('/pharmacist')) defaultRole = 'PHARMACIST';
        else if (path.includes('/labtech')) defaultRole = 'LABTECH';
        else defaultRole = 'LABTECH';
      }

      // Only create a dev default user when running locally (not recommended in production)
      const allowDevUser = process.env.NODE_ENV !== 'production';

      if (!allowDevUser) return;

      const defaultUser = {
        id: `dev-${Date.now()}`,
        name: defaultRole === 'PHARMACIST' ? 'Dev Pharmacist' : `Dev ${defaultRole}`,
        email: `${defaultRole.toLowerCase()}@example.com`,
        role: defaultRole
      };

      localStorage.setItem('token', `dev-token-${Date.now()}`);
      localStorage.setItem('user', JSON.stringify(defaultUser));
      setUser(defaultUser);
      console.info(`Auth: created default dev user role=${defaultRole}`);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const loginUser = (userData, token) => {
    // Accept either (userData, token) or backend response object { token, user }
    let u = userData;
    let t = token;
    if (userData && typeof userData === 'object' && !token && userData.token && userData.user) {
      t = userData.token;
      u = userData.user;
    }

    if (t) localStorage.setItem('token', t);
    if (u) {
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Authentication Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helpers used elsewhere (ProtectedRoute)
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) return false;
    const user = JSON.parse(userStr);
    if (!user || !user.role) return false;
    return true;
  } catch (error) {
    console.error('isAuthenticated error:', error);
    return false;
  }
};

export const getUserRole = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.role ? String(user.role).toUpperCase() : null;
  } catch (error) {
    console.error('getUserRole parse error:', error);
    return null;
  }
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('getUser parse error:', error);
    return null;
  }
};