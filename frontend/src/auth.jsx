import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { attachToken } from "./api";
import {jwtDecode}from "jwt-decode";
//This gives you an object that React internally wires into its fiber tree.
const AuthCtx = createContext(); //React’s createContext provides a way to share state (like user, role, token) without manually passing props down every component level.

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));//AuthProvider reads this token on page reload
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    return t ? parseJwtSafe(t) : null;
  });

  function parseJwtSafe(t) {
    try { return jwtDecode(t); } catch { return null; } //Frontend decodes token using jwt-decode to get user info & role
  }

  function login(token, role, name) {
    localStorage.setItem("token", token);
    setToken(token);
    setUser({ ...parseJwtSafe(token), role, name });
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    attachToken(() => token, logout);
  }, [token]);

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}

export function Protected({ roles, children }) {
  const { user } = useAuth();
  const loc = useLocation(); //useLocation is a React Router hook that returns the current location object.
  // Essentially, it tells you what page the user was trying to access.
  
  
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (roles?.length && !roles.includes(user.role))
    return <Navigate to="/" replace />;
  return children;
}



// state={{ from: loc }}
// Passes the current location (loc) in state.
// Why? So after login, you can redirect the user back to the page they were trying to access