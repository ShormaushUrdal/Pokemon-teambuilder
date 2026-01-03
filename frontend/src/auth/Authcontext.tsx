import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { AuthState, AllauthResponse } from '../Types/auth';

interface AuthContextType extends AuthState {
  checkAuth: () => Promise<void>;
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
    } else {
      setState({ user: null, isAuthenticated: false, loading: false });
    }
  } catch (err) {
    setState({ user: null, isAuthenticated: false, loading: false });
  }
};
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};