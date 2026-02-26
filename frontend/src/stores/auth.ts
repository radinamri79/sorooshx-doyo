import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthTokens } from "@/types";
import { authApi } from "@/lib/api";

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password1: string;
    password2: string;
  }) => Promise<void>;
  googleLogin: (code: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(email, password);
          set({
            tokens: { access: response.access, refresh: response.refresh },
            user: response.user,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(data);
          set({
            tokens: { access: response.access, refresh: response.refresh },
            user: response.user,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      googleLogin: async (code) => {
        set({ isLoading: true });
        try {
          const response = await authApi.googleLogin(code);
          set({
            tokens: { access: response.access, refresh: response.refresh },
            user: response.user,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, tokens: null });
      },

      fetchUser: async () => {
        try {
          const user = await authApi.getMe();
          set({ user });
        } catch {
          set({ user: null, tokens: null });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        tokens: state.tokens,
        user: state.user,
      }),
    }
  )
);
