import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  getSessionFn,
  loginFn,
  logoutFn,
  signupFn,
} from '@/server/controllers/auth.controller';

export type UserRole = 'student' | 'teacher' | 'admin';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const session = await getSessionFn();
        if (isMounted) {
          setUser(session.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    const nextUser = await loginFn({
      data: {
        email,
        password,
        role,
      },
    });
    setUser(nextUser);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => {
    const nextUser = await signupFn({
      data: {
        name,
        email,
        password,
        role,
      },
    });
    setUser(nextUser);
  };

  const logout = async () => {
    await logoutFn();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
