/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "./types";
import { users as mockUsers } from "./mockData";

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (
    name: string,
    email: string,
    password: string,
    phoneNumber?: string,
  ) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "tembera_mock_user_email";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedEmail = window.localStorage.getItem(STORAGE_KEY);
    if (!savedEmail) return null;
    const existing = mockUsers.find((u) => u.email === savedEmail);
    return existing ?? null;
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (email: string, password: string) => {
        const existing = mockUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        );
        if (existing && (!existing.password || existing.password === password)) {
          window.localStorage.setItem(STORAGE_KEY, existing.email);
          setUser(existing);
        }
      },
      register: (
        name: string,
        email: string,
        password: string,
        phoneNumber?: string,
      ) => {
        const existing = mockUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        );
        const userToUse =
          existing ?? {
            id: mockUsers.length + 1,
            name,
            email,
            phoneNumber,
            password,
          };
        if (!existing) {
          mockUsers.push(userToUse);
        }
        window.localStorage.setItem(STORAGE_KEY, userToUse.email);
        setUser(userToUse);
      },
      logout: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      },
    }),
    [user],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

