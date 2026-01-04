import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { AuthState, AllauthResponse } from '../Types/auth';

function getCookie(name: string): string | null {
  let cookieValue: string | null = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

interface AuthContextType extends AuthState {
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:8000/_allauth/browser/v1/auth/session', {
        headers: { 'Accept': 'application/json' },
        credentials: 'include', 
      });
      
      const result: AllauthResponse = await response.json();

      if (response.ok && result.meta.is_authenticated) {
        setState({ user: result.data.user, isAuthenticated: true, loading: false });
      } 
        else {
        setState({ user: null, isAuthenticated: false, loading: false });
      }
    } catch (err) {
      setState({ user: null, isAuthenticated: false, loading: false });
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8000/_allauth/browser/v1/auth/session', {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRFToken': getCookie('csrftoken') || '', 
        },
        credentials: 'include', 
      });

      if (response.ok || response.status == 401) {
        setState({ user: null, isAuthenticated: false, loading: false });
        window.location.assign('/');
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};