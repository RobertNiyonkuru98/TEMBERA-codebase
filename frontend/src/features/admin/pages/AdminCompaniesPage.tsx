import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchCompanies, fetchItineraries, fetchUsers } from "@/core/api";
import type { Company, Itinerary, User } from "@/shared/types";
import { Building2, Eye, Plus, Loader2, MapPin, Mail, Phone } from "lucide-react";

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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-lg">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center">
        <p className="text-lg font-semibold text-red-900 dark:text-red-100">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Companies</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage all registered companies and their details
            </p>
          </div>
        </div>
        <Link
          to="/admin/companies/create"
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
        >
          <Plus className="h-4 w-4" />
          Create Company
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Companies</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">{companies.length}</p>
            </div>
            <Building2 className="h-10 w-10 text-emerald-400" />
          </div>
        </div>
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Itineraries</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">{itineraries.length}</p>
            </div>
            <MapPin className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Active Owners</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">{new Set(companies.map(c => c.ownerId)).size}</p>
            </div>
            <Building2 className="h-10 w-10 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Companies Table */}
      {companies.length === 0 ? (
        <div className="rounded-xl border-2 border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 p-8 text-center">
          <Building2 className="h-12 w-12 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
          <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">No companies found</p>
          <p className="text-sm text-amber-700 dark:text-amber-200 mt-2">Create your first company to get started</p>
          <Link
            to="/admin/companies/create"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Company
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Company
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Owner
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Contact
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Location
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-center">
                    Itineraries
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={company.name}
                            className="h-10 w-10 rounded-lg object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700">
                            <Building2 className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{company.name}</p>
                          {company.tagline && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">{company.tagline}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-900 dark:text-slate-200">{ownerById.get(String(company.ownerId)) ?? "Unknown"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        {company.email && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                            <Mail className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                            <span className="truncate max-w-[150px]">{company.email}</span>
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                            <Phone className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                            <span>{company.phone}</span>
                          </div>
                        )}
                        {!company.email && !company.phone && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 italic">No contact</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {company.city || company.country ? (
                        <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                          <span>
                            {[company.city, company.country].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 italic">No location</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700/50 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-lg">
                        {itinerariesPerCompany.get(String(company.id)) ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/companies/${company.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCompaniesPage;
