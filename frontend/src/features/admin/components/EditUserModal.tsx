import { useState, useEffect } from "react";
import type { User, UserRole } from "@/shared/types";
import { X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

type EditUserModalProps = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string | number, updates: {
    name: string;
    email: string;
    phoneNumber?: string;
    role: UserRole;
    accessStatus: "active" | "inactive";
  }) => Promise<void>;
};

export function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [role, setRole] = useState<UserRole>(user.role);
  const [accessStatus, setAccessStatus] = useState<"active" | "inactive">(user.accessStatus || "active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber || "");
      setRole(user.role);
      setAccessStatus(user.accessStatus || "active");
      setErrors({});
    }
  }, [isOpen, user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(user.id, {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        role,
        accessStatus,
      });
      toast.success(`User ${name} updated successfully`);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div 
        className="w-full max-w-2xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit User</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Update user information</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-lg border ${
                errors.name 
                  ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20" 
                  : "border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"
              } bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2`}
              placeholder="Enter full name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border ${
                errors.email 
                  ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20" 
                  : "border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"
              } bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2`}
              placeholder="Enter email address"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Enter phone number (optional)"
              disabled={isSubmitting}
            />
          </div>

          {/* Role Field */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              disabled={isSubmitting}
            >
              <option value="admin">Admin</option>
              <option value="company">Company</option>
              <option value="user">User</option>
              <option value="visitor">Visitor</option>
            </select>
          </div>

          {/* Access Status Field */}
          <div>
            <label htmlFor="accessStatus" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Access Status <span className="text-red-500">*</span>
            </label>
            <select
              id="accessStatus"
              value={accessStatus}
              onChange={(e) => setAccessStatus(e.target.value as "active" | "inactive")}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              disabled={isSubmitting}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
