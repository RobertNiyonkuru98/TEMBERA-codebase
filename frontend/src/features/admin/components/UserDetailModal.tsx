import type { User } from "@/shared/types";
import { X, Edit } from "lucide-react";

type UserDetailModalProps = {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
};

export function UserDetailModal({ user, isOpen, onClose, onEdit }: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 text-white font-bold text-2xl shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">User ID: {user.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</p>
            <p className="text-sm text-slate-900 dark:text-white">{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</p>
            <p className="text-sm text-slate-900 dark:text-white">{user.phoneNumber || "Not provided"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</p>
            <p className="text-sm text-slate-900 dark:text-white capitalize">{user.role}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</p>
            <p className="text-sm text-slate-900 dark:text-white capitalize">{user.accessStatus ?? "active"}</p>
          </div>
          {user.createdAt && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created At</p>
              <p className="text-sm text-slate-900 dark:text-white">{new Date(user.createdAt).toLocaleString()}</p>
            </div>
          )}
          {user.roles && user.roles.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">All Roles</p>
              <p className="text-sm text-slate-900 dark:text-white">{user.roles.join(", ")}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              onEdit(user);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit User
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
