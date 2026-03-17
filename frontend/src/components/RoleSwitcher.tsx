import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useAuth } from "@/AuthContext";
import type { UserRole } from "@/types";

export function RoleSwitcher() {
  const { allRoles, activeRole, switchRole } = useAuth();

  if (!allRoles || allRoles.length <= 1 || !activeRole) {
    return null;
  }

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
  };

  return (
    <Menubar className="border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger>{`Role: ${activeRole}`}</MenubarTrigger>
        <MenubarContent>
          {allRoles.map((role) => (
            <MenubarItem
              key={role}
              onClick={() => handleRoleSwitch(role)}
              disabled={role === activeRole}
            >
              {role}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}