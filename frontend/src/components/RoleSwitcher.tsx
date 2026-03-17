import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import { useAuth } from "../AuthContext";
import type { UserRole } from "../types";
import { RefreshCw, CheckCircle2 } from "lucide-react";

export function RoleSwitcher() {
  const { allRoles, activeRole, switchRole } = useAuth();

  if (!allRoles || allRoles.length <= 1 || !activeRole) {
    return null;
  }

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
  };

  return (
    <Menubar className="border-none bg-transparent p-0 h-auto">
      <MenubarMenu>
        <MenubarTrigger className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-slate-800">
          <RefreshCw className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="capitalize">{activeRole}</span>
        </MenubarTrigger>
        <MenubarContent className="min-w-[200px]">
          {allRoles.map((role) => (
            <MenubarItem
              key={role}
              onClick={() => handleRoleSwitch(role)}
              disabled={role === activeRole}
              className="gap-2"
            >
              <div className="flex items-center justify-between w-full">
                <span className="capitalize">{role}</span>
                {role === activeRole && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              </div>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}