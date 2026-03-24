import { useCallback, useMemo } from "react";
import {
  clearAuthError,
  deleteAccount,
  initializeAuth,
  loginUser,
  logout as logoutAction,
  registerUser,
  setActiveRole,
  updateProfile,
} from "@/core/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/core/store/hooks";
import type { UserRole } from "@/shared/types";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, allRoles, activeRole, hasSwitchedRole, isLoading, error, isInitialized } = useAppSelector(
    (state) => state.auth,
  );
  const token = useAppSelector((state) => state.auth.token);

  const initialize = useCallback(
    () => dispatch(initializeAuth()).unwrap(),
    [dispatch],
  );

  const login = useCallback(
    (email: string, password: string) =>
      dispatch(loginUser({ email, password })).unwrap(),
    [dispatch],
  );

  const register = useCallback(
    (
      name: string,
      email: string,
      password: string,
      phoneNumber?: string,
    ) =>
      dispatch(
        registerUser({ name, email, password, phoneNumber }),
      ).unwrap(),
    [dispatch],
  );

  const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);
  const saveProfile = useCallback(
    (name: string, email: string, phoneNumber?: string) =>
      dispatch(updateProfile({ name, email, phoneNumber })).unwrap(),
    [dispatch],
  );
  const removeAccount = useCallback(
    () => dispatch(deleteAccount()).unwrap(),
    [dispatch],
  );
  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch]);
  const switchRole = useCallback(
    (role: UserRole) => dispatch(setActiveRole(role)),
    [dispatch],
  );

  return useMemo(
    () => ({
      user,
      allRoles,
      activeRole,
      hasSwitchedRole,
      token,
      isLoading,
      error,
      isInitialized,
      initialize,
      login,
      register,
      logout,
      saveProfile,
      removeAccount,
      clearError,
      switchRole,
    }),
    [
      activeRole,
      allRoles,
      clearError,
      error,
      hasSwitchedRole,
      initialize,
      isInitialized,
      isLoading,
      login,
      logout,
      register,
      removeAccount,
      saveProfile,
      switchRole,
      user,
      token,
    ],
  );
}
