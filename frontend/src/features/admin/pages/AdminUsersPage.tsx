import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchUsers, updateUser, deleteUser } from "@/core/api";
import type { User } from "@/shared/types";
import { useI18n } from "@/core/i18n";
import {
  EditUserModal,
  DeleteUserDialog,
  UserCard,
  UserDetailModal,
  SearchAndFilters,
  UserListHeader,
  EmptyState,
  LoadingState,
} from "@/features/admin/components";
import { XCircle } from "lucide-react";
import { toast } from "sonner";

function AdminUsersPage() {
  const { token } = useAuth();
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUsers() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        setUsers(await fetchUsers(token));
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load users",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadUsers();
  }, [token]);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || (user.accessStatus ?? "active") === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    toast.info(`Viewing details for ${user.name}`);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
  };

  const handleSaveUser = async (
    userId: string | number,
    updates: {
      name: string;
      email: string;
      phoneNumber?: string;
      role: User["role"];
      accessStatus: "active" | "inactive";
    }
  ) => {
    if (!token) throw new Error("No authentication token");

    const payload = {
      name: updates.name,
      email: updates.email,
      phone_number: updates.phoneNumber,
      role: updates.role,
      access_status: updates.accessStatus,
    };

    const updatedUser = await updateUser(userId, payload, token);
    
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? updatedUser : user))
    );
  };

  const handleConfirmDelete = async (userId: string | number) => {
    if (!token) throw new Error("No authentication token");

    await deleteUser(userId, token);
    
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const handleClearFilters = () => {
    setRoleFilter("all");
    setStatusFilter("all");
    setSearchQuery("");
  };

  const hasFilters = searchQuery !== "" || roleFilter !== "all" || statusFilter !== "all";

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <UserListHeader
        title={t("admin.usersTitle")}
        description="Manage all registered users in the system"
        userCount={filteredUsers.length}
      />

      {/* Search and Filters */}
      <SearchAndFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearFilters={handleClearFilters}
      />

      {/* Loading State */}
      {isLoading && <LoadingState />}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Users Grid */}
      {!isLoading && !error && (
        <>
          {filteredUsers.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onView={handleViewUser}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onEdit={handleEditUser}
      />

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}

      {/* Delete User Dialog */}
      <DeleteUserDialog
        user={deletingUser}
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default AdminUsersPage;
