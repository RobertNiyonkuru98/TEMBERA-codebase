import { useState } from "react";
import type { User } from "@/shared/types";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

type DeleteUserDialogProps = {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string | number) => Promise<void>;
};

export function DeleteUserDialog({ user, isOpen, onClose, onConfirm }: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (!user) return;

    if (confirmText.toLowerCase() !== "delete") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm(user.id);
      toast.success(`User ${user.name} has been deleted`);
      onClose();
      setConfirmText("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText("");
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleClose}>
      <div 
        className="w-full max-w-md rounded-xl border border-red-200 dark:border-red-800 bg-white dark:bg-slate-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-6 py-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-red-900 dark:text-red-100">Delete User</h2>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">This action cannot be undone</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="rounded-lg p-1 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* User Info */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 text-white font-semibold shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium capitalize">
                {user.role}
              </span>
              {user.phoneNumber && (
                <span className="text-slate-600 dark:text-slate-400">
                  • {user.phoneNumber}
                </span>
              )}
            </div>
          </div>

          {/* Warning Message */}
          <div className="space-y-2">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Are you sure you want to delete this user? This will:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400 ml-2">
              <li>Permanently remove the user account</li>
              <li>Delete all associated user data</li>
              <li>Revoke all access permissions</li>
              <li>Cannot be recovered after deletion</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div>
            <label htmlFor="confirmText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Type <span className="font-bold text-red-600 dark:text-red-400">DELETE</span> to confirm
            </label>
            <input
              id="confirmText"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              disabled={isDeleting}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-red-500 dark:focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-6 py-4">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || confirmText.toLowerCase() !== "delete"}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete User
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
