"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { setToken, removeToken, getToken } from "@/lib/auth";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { User, LoginCredentials, RegisterCredentials, AuthResponse, ApiResponse } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await api.get<ApiResponse<User>>("/auth/profile");
      setUser(res.data.data);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (credentials: LoginCredentials) => {
    const res = await api.post<AuthResponse>("/auth/login", credentials);
    const { data } = res.data;
    setToken(data.token);
    setUser(data);
  };

  const register = async (credentials: RegisterCredentials) => {
    const res = await api.post<AuthResponse>("/auth/register", credentials);
    const { data } = res.data;
    setToken(data.token);
    setUser(data);
  };

  const googleLogin = async (credential: string) => {
    const res = await api.post<AuthResponse>("/auth/google", { credential });
    const { data } = res.data;
    setToken(data.token);
    setUser(data);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Logout even if the API call fails
    } finally {
      removeToken();
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider
        value={{ user, loading, login, register, googleLogin, logout, updateUser }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
