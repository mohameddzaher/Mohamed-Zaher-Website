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
  hydrated: boolean;
  hydrate: (force?: boolean) => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

let hydratePromise: Promise<void> | null = null;

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  hydrated: false,
  async hydrate(force = false) {
    // Already hydrated and not forcing — nothing to do. Avoids the
    // login → push("/admin") → AdminShell mount → hydrate() race that
    // briefly flips user to null and bounces the user back to /login.
    if (!force && get().hydrated) return;
    if (hydratePromise) return hydratePromise;
    hydratePromise = (async () => {
      try {
        const r = await api.get<{ data: AuthUser }>("/auth/me");
        set({ user: r.data.data, loading: false, hydrated: true });
      } catch {
        set({ user: null, loading: false, hydrated: true });
      } finally {
        hydratePromise = null;
      }
    })();
    return hydratePromise;
  },
  async login(email, password) {
    const r = await api.post<{ data: { user: AuthUser } }>("/auth/login", { email, password });
    // Mark as hydrated so the shell doesn't re-fetch /me before the
    // cookie has propagated to the next request.
    set({ user: r.data.data.user, loading: false, hydrated: true });
    return r.data.data.user;
  },
  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, hydrated: true });
    }
  },
}));
