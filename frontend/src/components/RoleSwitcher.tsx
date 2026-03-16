import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { switchRole } from "@/store/authSlice";
import type { UserRole } from "@/types";

export function RoleSwitcher() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  if (!user || !user.roles || user.roles.length <= 1) {
    return null;
  }

  const handleRoleSwitch = (role: UserRole) => {
    dispatch(switchRole(role));
  };

  return (
    <Menubar className="border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger>Switch Role</MenubarTrigger>
        <MenubarContent>
          {user.roles.map((role) => (
            <MenubarItem
              key={role}
              onClick={() => handleRoleSwitch(role)}
              disabled={role === user.role}
            >
              {role}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}