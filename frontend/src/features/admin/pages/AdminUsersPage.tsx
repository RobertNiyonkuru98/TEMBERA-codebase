import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchUsers } from "@/core/api";
import type { User } from "@/shared/types";

function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Admin Users</h1>
        <p className="text-sm text-slate-300">
          All registered users in the system.
        </p>
      </header>

      {isLoading && <p className="text-sm text-slate-300">Loading users...</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full min-w-[620px] text-left text-sm text-slate-200">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created at</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-800/60">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.accessStatus ?? "active"}</td>
                  <td className="px-4 py-3">{user.phoneNumber ?? "-"}</td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsersPage;
