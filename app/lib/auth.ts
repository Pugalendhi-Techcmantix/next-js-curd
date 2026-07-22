// src/lib/auth.ts

export const TOKEN_KEY = "access_token";
export const USER_KEY = "auth_user";

// Token
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

// User
export const getUser = () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
};

export const setUser = (user: any) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(USER_KEY);
};

// Save Login
export const login = (token: string, user: any) => {
  setToken(token);
  setUser(user);
};

// Check Login
export const isAuthenticated = () => {
  return !!getToken();
};

// Logout
export const logout = () => {
  removeToken();
  removeUser();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};
