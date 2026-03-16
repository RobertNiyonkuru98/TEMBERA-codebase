import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  deleteAccountRequest,
  fetchSessionUser,
  loginRequest,
  registerRequest,
  switchRoleRequest,
  updateProfileRequest,
} from "../api/authApi";
import type { User, UserRole } from "../types";

const TOKEN_STORAGE_KEY = "tembera_auth_token";
const USER_STORAGE_KEY = "tembera_auth_user";

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  token: window.localStorage.getItem(TOKEN_STORAGE_KEY),
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      return { token: null, user: null as User | null };
    }

    try {
      const user = await fetchSessionUser(token);
      return { token, user };
    } catch (error) {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem(USER_STORAGE_KEY);
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to initialize session",
      );
    }
  },
);

export const switchRole = createAsyncThunk(
  "auth/switchRole",
  async (role: UserRole, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const { token } = state.auth;

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const newToken = await switchRoleRequest(token, role);
      const user = await fetchSessionUser(newToken);

      window.localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

      return { token: newToken, user };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Role switch failed"
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    payload: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const token = await loginRequest(payload.email, payload.password);
      const user = await fetchSessionUser(token);

      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed",
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    payload: {
      name: string;
      email: string;
      password: string;
      phoneNumber?: string;
    },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await registerRequest(
        payload.name,
        payload.email,
        payload.password,
        payload.phoneNumber,
      );

      const resultAction = await dispatch(
        loginUser({ email: payload.email, password: payload.password }),
      );

      if (loginUser.rejected.match(resultAction)) {
        throw new Error(
          (resultAction.payload as string) ||
            resultAction.error.message ||
            "Auto-login after registration failed",
        );
      }

      return (resultAction.payload as { token: string; user: User }).user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Registration failed",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    payload: { name: string; email: string; phoneNumber?: string },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      const userId = state.auth.user?.id;

      if (!token || !userId) {
        throw new Error("You must be logged in to update profile");
      }

      const updatedUser = await updateProfileRequest(token, String(userId), payload);
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Profile update failed",
      );
    }
  },
);

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      const userId = state.auth.user?.id;

      if (!token || !userId) {
        throw new Error("You must be logged in to delete account");
      }

      await deleteAccountRequest(token, String(userId));
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem(USER_STORAGE_KEY);
      return true;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Account deletion failed",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isInitialized = true;
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem(USER_STORAGE_KEY);
    },
    clearAuthError(state) {
      state.error = null;
    },
    hydrateFromStorage(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isInitialized = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isInitialized = true;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })
      .addCase(switchRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        switchRole.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.isLoading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
        },
      )
      .addCase(switchRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Registration failed";
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Profile update failed";
      })
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Account deletion failed";
      });
  },
});

export const { logout, clearAuthError, hydrateFromStorage } = authSlice.actions;
export default authSlice.reducer;
