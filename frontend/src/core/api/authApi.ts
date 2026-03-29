import type { User, UserRole } from "@/shared/types";
import { requestHelper } from "./requestHelper";

type LoginResponseData = {
  token: string;
};

type RegisterResponseData = {
  userId: string;
};

type VerifyResponseData = {
  userId?: string;
  email?: string;
  iat?: number;
  exp?: number;
};

type EmptyResponseData = null;

type BackendUser = {
  id: string;
  name: string;
  email: string;
  phone_number?: string | null;
  role: UserRole;
  roles: { access_level: UserRole }[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function getAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function mapBackendUser(user: BackendUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phone_number ?? undefined,
    role: user.roles?.[0].access_level || "user",
    roles: user.roles.map((r) => r.access_level),
  };
}

export async function loginRequest(email: string, password: string): Promise<string> {
  const parsed = await requestHelper<LoginResponseData>({
    method: "POST",
    url: `${API_BASE_URL}/api/auth/login`,
    headers: { "Content-Type": "application/json" },
    data: { email, password },
  });
  return parsed.data.token;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
  phoneNumber?: string,
): Promise<string> {
  const parsed = await requestHelper<RegisterResponseData>({
    method: "POST",
    url: `${API_BASE_URL}/api/auth/register`,
    headers: { "Content-Type": "application/json" },
    data: {
      name,
      email,
      password,
      phone_number: phoneNumber,
    },
  });
  return parsed.data.userId;
}

export async function fetchSessionUser(token: string): Promise<User> {
  const verifyPayload = await requestHelper<VerifyResponseData>({
    method: "GET",
    url: `${API_BASE_URL}/api/auth/verify`,
    token,
    headers: getAuthHeaders(token),
  });

  if (!verifyPayload.data.userId) {
    throw new Error("Token payload is missing user id");
  }

  const userPayload = await requestHelper<BackendUser>({
    method: "GET",
    url: `${API_BASE_URL}/api/users/${verifyPayload.data.userId}`,
    token,
    headers: getAuthHeaders(token),
  });

  return mapBackendUser(userPayload.data);
}

export async function updateProfileRequest(
  token: string,
  userId: string,
  payload: { name: string; email: string; phoneNumber?: string },
): Promise<User> {
  const parsed = await requestHelper<BackendUser>({
    method: "PUT",
    url: `${API_BASE_URL}/api/users/${userId}`,
    token,
    headers: getAuthHeaders(token),
    data: {
      name: payload.name,
      email: payload.email,
      phone_number: payload.phoneNumber,
    },
  });
  return mapBackendUser(parsed.data);
}

export async function deleteAccountRequest(
  token: string,
  userId: string,
): Promise<void> {
  await requestHelper<EmptyResponseData>({
    method: "DELETE",
    url: `${API_BASE_URL}/api/users/${userId}`,
    token,
    headers: getAuthHeaders(token),
  });
}

