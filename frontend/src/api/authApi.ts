import type { User, UserRole } from "../types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  resp_code: number;
  data: T;
};

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

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const parsed = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !parsed.success) {
    throw new Error(parsed.message || "Request failed");
  }
  return parsed;
}

export async function loginRequest(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const parsed = await parseResponse<LoginResponseData>(response);
  return parsed.data.token;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
  phoneNumber?: string,
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      phone_number: phoneNumber,
    }),
  });

  const parsed = await parseResponse<RegisterResponseData>(response);
  return parsed.data.userId;
}

export async function fetchSessionUser(token: string): Promise<User> {
  const authHeaders = getAuthHeaders(token);

  const verifyResponse = await fetch(`${API_BASE_URL}/api/auth/verify`, {
    headers: authHeaders,
  });
  const verifyPayload = await parseResponse<VerifyResponseData>(verifyResponse);

  if (!verifyPayload.data.userId) {
    throw new Error("Token payload is missing user id");
  }

  const userResponse = await fetch(
    `${API_BASE_URL}/api/users/${verifyPayload.data.userId}`,
    { headers: authHeaders },
  );
  const userPayload = await parseResponse<BackendUser>(userResponse);

  return mapBackendUser(userPayload.data);
}

export async function updateProfileRequest(
  token: string,
  userId: string,
  payload: { name: string; email: string; phoneNumber?: string },
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone_number: payload.phoneNumber,
    }),
  });

  const parsed = await parseResponse<BackendUser>(response);
  return mapBackendUser(parsed.data);
}

export async function deleteAccountRequest(
  token: string,
  userId: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  await parseResponse<EmptyResponseData>(response);
}

