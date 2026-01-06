import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  ciudad?: string;
  rol: 'cliente' | 'empresa' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono?: string;
    ciudad?: string;
    rol?: 'cliente' | 'empresa' | 'admin';
  }) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.auth.getMe();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      const { user: userData, token: tokenData } = response.data;
      
      localStorage.setItem('token', tokenData);
      setToken(tokenData);
      setUser(userData);

      // Redirect based on role
      if (userData.rol === 'admin') {
        navigate('/admin');
      } else if (userData.rol === 'empresa') {
        navigate('/empresa');
      } else {
        navigate('/cliente');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (data: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono?: string;
    ciudad?: string;
    rol?: 'cliente' | 'empresa' | 'admin';
  }) => {
    try {
      const response = await api.auth.register(data);
      const { user: userData, token: tokenData } = response.data;
      
      localStorage.setItem('token', tokenData);
      setToken(tokenData);
      setUser(userData);

      // Redirect based on role
      if (userData.rol === 'admin') {
        navigate('/admin');
      } else if (userData.rol === 'empresa') {
        navigate('/empresa');
      } else {
        navigate('/cliente');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const response = await api.usuarios.updateProfile(data);
      setUser(response.data);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


