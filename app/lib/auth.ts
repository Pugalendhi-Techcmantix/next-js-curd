// src/lib/auth.ts

export const TOKEN_KEY = "access_token";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  removeToken();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};