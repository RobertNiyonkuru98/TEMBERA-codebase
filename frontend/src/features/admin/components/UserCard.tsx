import type { User } from "@/shared/types";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Building2, 
  User as UserIcon,
  CheckCircle2,
  XCircle
} from "lucide-react";

type UserCardProps = {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin": return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    case "company": return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "user": return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    default: return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  }
};

const getStatusBadgeColor = (status: string) => {
  return status === "active" 
    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
};

export function UserCard({ user, onView, onEdit, onDelete }: UserCardProps) {
  const status = user.accessStatus ?? "active";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-700">
      {/* User Avatar & Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 text-white font-semibold text-lg shadow-md">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {user.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
              {user.role === "admin" && <Shield className="h-3 w-3" />}
              {user.role === "company" && <Building2 className="h-3 w-3" />}
              {(user.role === "user" || user.role === "visitor") && <UserIcon className="h-3 w-3" />}
              {user.role}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusBadgeColor(status)}`}>
              {status === "active" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Mail className="h-4 w-4 shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        {user.phoneNumber && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{user.phoneNumber}</span>
          </div>
        )}
        {user.createdAt && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        )}
        {user.roles && user.roles.length > 1 && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Shield className="h-4 w-4 shrink-0" />
            <span className="text-xs">
              Multiple roles: {user.roles.join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => onView(user)}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
          View
        </button>
        <button
          onClick={() => onEdit(user)}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          title="Edit User"
        >
          <Edit className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(user)}
          className="flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          title="Delete User"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
