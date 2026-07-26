import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiClient } from '../services/ApiClient';

const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = base64.replace(/=+$/, '');
    let output = '';
    
    for (let bc = 0, bs = 0, buffer, idx = 0; (buffer = str.charAt(idx++)); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
      buffer = chars.indexOf(buffer);
    }
    return JSON.parse(output);
  } catch (e) {
    console.error("JWT Decode Error", e);
    return null;
  }
};

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  role: string | null;
  orgId: string | null;
  userId: string | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, explicitUserId?: string | number) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    token: null,
    role: null,
    orgId: null,
    userId: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await ApiClient.getToken();
      if (storedToken) {
        await login(storedToken);
      }
    };
    loadToken();
  }, []);

  const login = async (token: string, explicitUserId?: string | number) => {
    await ApiClient.setToken(token);
    const decoded = decodeJWT(token);
    
    // THE FIX: Pulls the user_id from the new JWT claim if an explicit one isn't passed
    const finalUserId = explicitUserId ? String(explicitUserId) : (decoded?.user_id ? String(decoded.user_id) : null);
    
    setAuthState({
      isLoggedIn: true,
      token,
      role: decoded?.role || null,
      orgId: decoded?.organization_id ? String(decoded.organization_id) : null,
      userId: finalUserId, 
    });
  };

  const logout = async () => {
    await ApiClient.clearToken();
    setAuthState({ isLoggedIn: false, token: null, role: null, orgId: null, userId: null });
  };

  return <AuthContext.Provider value={{ ...authState, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};