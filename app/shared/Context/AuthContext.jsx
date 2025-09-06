"use client";
import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  role: null,
  isLoading: true,
  showUserMenu: false,
  login: () => {},
  logout: () => {},
  toggleUserMenu: () => {},
  closeUserMenu: () => {},
});
