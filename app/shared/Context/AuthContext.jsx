"use client";
import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  role: null,
  isLoading: true,
  showUserMenu: false,
  tokenExpirationDate: null,
  login: () => {},
  logout: () => {},
  toggleUserMenu: () => {},
  closeUserMenu: () => {},
});
