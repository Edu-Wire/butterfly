"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const getProfileCacheKey = (email: string) => `user_profile:${email.toLowerCase()}`;

const mergeCachedProfile = (apiUser: any) => {
  try {
    const email = typeof apiUser?.email === "string" ? apiUser.email : "";
    if (!email) return apiUser;

    const cached = localStorage.getItem(getProfileCacheKey(email));
    if (!cached) return apiUser;

    const parsed = JSON.parse(cached) as Partial<User>;
    return {
      ...apiUser,
      name: parsed.name ?? apiUser.name,
      avatar: parsed.avatar ?? apiUser.avatar,
    };
  } catch {
    return apiUser;
  }
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatar?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const mergedUser = mergeCachedProfile(data.user);
      setUser(mergedUser);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      if (mergedUser?.email) {
        localStorage.setItem(getProfileCacheKey(mergedUser.email), JSON.stringify({
          name: mergedUser.name,
          avatar: mergedUser.avatar,
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const nextUser = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(nextUser));
      if (nextUser.email) {
        localStorage.setItem(getProfileCacheKey(nextUser.email), JSON.stringify({
          name: nextUser.name,
          avatar: nextUser.avatar,
        }));
      }
      return nextUser;
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      const mergedUser = mergeCachedProfile(data.user);
      setUser(mergedUser);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      if (mergedUser?.email) {
        localStorage.setItem(getProfileCacheKey(mergedUser.email), JSON.stringify({
          name: mergedUser.name,
          avatar: mergedUser.avatar,
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    updateUser,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
