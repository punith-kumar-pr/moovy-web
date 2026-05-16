import { create } from "zustand";
import { STORAGE_KEYS } from "@/lib/constants";
import type { AuthResponse } from "@/types";

interface AuthState {
  token: string | null;
  user: Pick<AuthResponse, "userId" | "username" | "email" | "roles"> | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  login: (data: AuthResponse) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isAdmin: false,

  login: (data: AuthResponse) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({
        userId: data.userId,
        username: data.username,
        email: data.email,
        roles: data.roles,
      })
    );
    set({
      token: data.token,
      user: {
        userId: data.userId,
        username: data.username,
        email: data.email,
        roles: data.roles,
      },
      isAuthenticated: true,
      isAdmin: data.roles.includes("ROLE_ADMIN"),
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  },

  hydrate: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin: user.roles?.includes("ROLE_ADMIN") ?? false,
        });
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
  },
}));
