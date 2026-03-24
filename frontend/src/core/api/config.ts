import type { UserRole } from "@/shared/types";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export function resolveUserRole(email: string, rawRole?: string): UserRole {
  if (
    rawRole === "admin" ||
    rawRole === "company" ||
    rawRole === "user" ||
    rawRole === "visitor"
  ) {
    return rawRole;
  }

  const normalizedEmail = email.toLowerCase();
  if (normalizedEmail.includes("admin")) return "admin";
  if (normalizedEmail.includes("company")) return "company";
  if (normalizedEmail.includes("visitor")) return "visitor";
  return "user";
}

export function getAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
