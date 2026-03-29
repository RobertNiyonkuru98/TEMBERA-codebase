import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/shared/components/ui";
import { useAuth } from "@/features/auth/AuthContext";
import type { UserRole } from "@/shared/types";
import { Eye, Shield, Building2, User, Check } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/core/i18n";

// Role metadata for better UX
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRoleMetadata = (t: any): Record<UserRole, { icon: React.ComponentType<{ className?: string }>; description: string; label: string }> => ({
  admin: {
    icon: Shield,
    description: t("roles.admin.description"),
    label: t("roles.admin.label")
  },
  company: {
    icon: Building2,
    description: t("roles.company.description"),
    label: t("roles.company.label")
  },
  user: {
    icon: User,
    description: t("roles.user.description"),
    label: t("roles.user.label")
  },
  visitor: {
    icon: User,
    description: t("roles.visitor.description"),
    label: t("roles.visitor.label")
  }
});

export function RoleSwitcher() {
  const { allRoles, activeRole, switchRole } = useAuth();
  const { t } = useI18n();
  const roleMetadata = getRoleMetadata(t);

  if (!allRoles || allRoles.length <= 1 || !activeRole) {
    return null;
  }

  const handleRoleSwitch = (role: UserRole) => {
    const roleLabel = roleMetadata[role]?.label || role;
    switchRole(role);
    toast.success(`${t("roles.switched")} ${roleLabel}`, {
      description: roleMetadata[role]?.description || `${t("roles.viewingAs")} ${role}`,
      duration: 2000,
    });
  };

  const ActiveRoleIcon = roleMetadata[activeRole]?.icon || Eye;
  const activeRoleLabel = roleMetadata[activeRole]?.label || activeRole;

  return (
    <Menubar className="border-none bg-transparent p-0 h-auto">
      <MenubarMenu>
        <MenubarTrigger className="w-full flex flex-col items-start gap-2 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2.5 text-sm font-semibold text-emerald-900 dark:text-emerald-100 transition-all hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:shadow-md data-[state=open]:bg-emerald-100 dark:data-[state=open]:bg-emerald-900/40">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs text-emerald-700 dark:text-emerald-300">{t("roles.viewingAs")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ActiveRoleIcon className="h-3.5 w-3.5" />
            <span>{activeRoleLabel}</span>
          </div>
        </MenubarTrigger>
        <MenubarContent className="min-w-[280px] p-2">
          <div className="px-2 py-1.5 mb-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("roles.switchView")}</p>
          </div>
          {allRoles.map((role) => {
            const RoleIcon = roleMetadata[role]?.icon || User;
            const isActive = role === activeRole;
            const roleLabel = roleMetadata[role]?.label || role;
            const roleDesc = roleMetadata[role]?.description || "";
            
            return (
              <MenubarItem
                key={role}
                onClick={() => handleRoleSwitch(role)}
                disabled={isActive}
                className={`gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-all ${
                  isActive 
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800" 
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <RoleIcon className={`h-5 w-5 shrink-0 ${
                  isActive 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-slate-500 dark:text-slate-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-semibold ${
                      isActive 
                        ? "text-emerald-900 dark:text-emerald-100" 
                        : "text-slate-900 dark:text-slate-100"
                    }`}>
                      {roleLabel}
                    </span>
                    {isActive && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{t("roles.active")}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{roleDesc}</p>
                </div>
              </MenubarItem>
            );
          })}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}