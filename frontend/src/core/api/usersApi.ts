import type { User, UserRole } from "@/shared/types";
import { resolveUserRole } from "./config";
import { BaseApiService } from "./baseApi";

export type BackendUser = {
  id: string;
  name: string;
  email: string;
  phone_number?: string | null;
  role?: UserRole;
  created_at?: string;
  roles?: { access_level: UserRole; access_status: string }[];
};

export function mapUser(user: BackendUser): User {
  const activeRole = user.roles?.find((role) => role.access_status === "active");
  const accessStatus = user.roles?.some((role) => role.access_status === "active")
    ? "active"
    : "inactive";

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phone_number ?? undefined,
    role: resolveUserRole(user.email, user.role ?? activeRole?.access_level),
    accessStatus,
    createdAt: user.created_at,
  };
}

class UsersApiService extends BaseApiService<User, BackendUser> {}
export const usersService = new UsersApiService("/api/users", mapUser);

export async function fetchUsers(token: string): Promise<User[]> {
  return usersService.getAll(token);
}
