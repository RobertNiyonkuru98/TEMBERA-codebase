import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext";
import { fetchCompanies, fetchItineraries, fetchUsers } from "../api/platformApi";
import type { Company, Itinerary, User } from "../types";

function AdminCompaniesPage() {
  const { token } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const [allCompanies, allItineraries, allUsers] = await Promise.all([
          fetchCompanies(token),
          fetchItineraries(token),
          fetchUsers(token),
        ]);
        setCompanies(allCompanies);
        setItineraries(allItineraries);
        setUsers(allUsers);
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load companies",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [token]);

  const ownerById = useMemo(
    () => new Map(users.map((user) => [String(user.id), user.name])),
    [users],
  );

  const itinerariesPerCompany = useMemo(() => {
    const counts = new Map<string, number>();
    itineraries.forEach((itinerary) => {
      const key = String(itinerary.companyId);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [itineraries]);

  if (isLoading) {
    return <p className="text-sm text-slate-300">Loading companies...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Admin Companies</h1>
        <p className="text-sm text-slate-300">Registered companies and ownership details.</p>
      </header>

      {companies.length === 0 ? (
        <p className="text-sm text-slate-300">No companies found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full min-w-[820px] text-left text-sm text-slate-200">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Company name</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Created itineraries</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created at</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b border-slate-800/60">
                  <td className="px-4 py-3">{company.name}</td>
                  <td className="px-4 py-3">{ownerById.get(String(company.ownerId)) ?? "Unknown"}</td>
                  <td className="px-4 py-3">{itinerariesPerCompany.get(String(company.id)) ?? 0}</td>
                  <td className="px-4 py-3 capitalize">{company.status ?? "active"}</td>
                  <td className="px-4 py-3">
                    {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "-"}
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

export default AdminCompaniesPage;
