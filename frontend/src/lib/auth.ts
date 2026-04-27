import { create } from "zustand";
import { api } from "./api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client";
  avatar?: string;
};

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  async hydrate() {
    try {
      const r = await api.get<{ data: AuthUser }>("/auth/me");
      set({ user: r.data.data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  async login(email, password) {
    const r = await api.post<{ data: { user: AuthUser } }>("/auth/login", { email, password });
    set({ user: r.data.data.user });
    return r.data.data.user;
  },
  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null });
    }
  },
}));
