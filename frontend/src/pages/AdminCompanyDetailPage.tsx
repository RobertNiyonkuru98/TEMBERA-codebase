import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { fetchCompanyById, deleteCompany } from "../api/platformApi";
import type { Company } from "../types";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Users,
  Clock,
  Shield,
  FileText,
  Image as ImageIcon,
  Facebook,
  Instagram,
  Twitter,
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

function AdminCompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompany() {
      if (!token || !id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCompanyById(token, id);
        setCompany(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load company details"
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadCompany();
  }, [token, id]);

  const handleDelete = async () => {
    if (!token || !id || !company) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${company.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteCompany(token, id);
      toast.success("Company deleted successfully");
      navigate("/admin/companies", { replace: true });
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error ? deleteError.message : "Failed to delete company"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-lg">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/companies"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Link>
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-3" />
          <p className="text-lg font-semibold text-red-900 dark:text-red-100">{error || "Company not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Link
            to="/admin/companies"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Companies
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{company.name}</h1>
              {company.tagline && (
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">{company.tagline}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/admin/companies/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Branding */}
      {(company.logoUrl || company.coverImageUrl) && (
        <div className="grid gap-4 md:grid-cols-2">
          {company.logoUrl && (
            <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Logo</h3>
              </div>
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className="w-full h-48 object-contain rounded-lg bg-slate-100 dark:bg-slate-800/50"
              />
            </div>
          )}
          {company.coverImageUrl && (
            <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Cover Image</h3>
              </div>
              <img
                src={company.coverImageUrl}
                alt={`${company.name} cover`}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {company.description && (
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Description</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{company.description}</p>
        </div>
      )}

      {/* Contact & Location Info */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Location */}
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Location</h3>
          </div>
          <div className="space-y-3 text-sm">
            {company.address && (
              <div className="flex items-start gap-2">
                <span className="text-slate-600 dark:text-slate-400 min-w-[80px]">Address:</span>
                <span className="text-slate-900 dark:text-slate-200">{company.address}</span>
              </div>
            )}
            {company.city && (
              <div className="flex items-start gap-2">
                <span className="text-slate-600 dark:text-slate-400 min-w-[80px]">City:</span>
                <span className="text-slate-900 dark:text-slate-200">{company.city}</span>
              </div>
            )}
            {company.country && (
              <div className="flex items-start gap-2">
                <span className="text-slate-600 dark:text-slate-400 min-w-[80px]">Country:</span>
                <span className="text-slate-900 dark:text-slate-200">{company.country}</span>
              </div>
            )}
            {!company.address && !company.city && !company.country && (
              <p className="text-slate-400 dark:text-slate-500 italic">No location information</p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Contact Information</h3>
          </div>
          <div className="space-y-3 text-sm">
            {company.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <a
                  href={`mailto:${company.email}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {company.email}
                </a>
              </div>
            )}
            {company.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <a
                  href={`tel:${company.phone}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {company.phone}
                </a>
              </div>
            )}
            {company.emergencyPhone && (
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-500 dark:text-red-400" />
                <span className="text-slate-600 dark:text-slate-400 text-xs">Emergency:</span>
                <a
                  href={`tel:${company.emergencyPhone}`}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  {company.emergencyPhone}
                </a>
              </div>
            )}
            {!company.email && !company.phone && !company.emergencyPhone && (
              <p className="text-slate-400 dark:text-slate-500 italic">No contact information</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Details */}
      <div className="grid gap-4 md:grid-cols-2">
        {company.specializations && Array.isArray(company.specializations) && company.specializations.length > 0 && (
          <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Specializations</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {company.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded-lg"
                >
                  {String(spec).replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}

        {company.languages && Array.isArray(company.languages) && company.languages.length > 0 && (
          <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {company.languages.map((lang, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700/50 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-lg uppercase"
                >
                  {String(lang)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Operational Details */}
      <div className="grid gap-4 md:grid-cols-2">
        {company.operatingDays && (
          <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Operating Days</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300">{company.operatingDays}</p>
          </div>
        )}

        {company.operatingHours && (
          <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Operating Hours</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300">{company.operatingHours}</p>
          </div>
        )}
      </div>

      {/* Online Presence */}
      <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Online Presence</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors group"
            >
              <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">Website</span>
              <ExternalLink className="h-3 w-3 text-slate-400 dark:text-slate-500 ml-auto" />
            </a>
          )}
          {company.facebookUrl && (
            <a
              href={company.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors group"
            >
              <Facebook className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">Facebook</span>
              <ExternalLink className="h-3 w-3 text-slate-400 dark:text-slate-500 ml-auto" />
            </a>
          )}
          {company.instagramUrl && (
            <a
              href={company.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors group"
            >
              <Instagram className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">Instagram</span>
              <ExternalLink className="h-3 w-3 text-slate-400 dark:text-slate-500 ml-auto" />
            </a>
          )}
          {company.twitterUrl && (
            <a
              href={company.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors group"
            >
              <Twitter className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">Twitter</span>
              <ExternalLink className="h-3 w-3 text-slate-400 dark:text-slate-500 ml-auto" />
            </a>
          )}
        </div>
        {!company.website && !company.facebookUrl && !company.instagramUrl && !company.twitterUrl && (
          <p className="text-slate-400 dark:text-slate-500 italic text-sm">No online presence information</p>
        )}
      </div>

      {/* Additional Information */}
      {company.insuranceInfo && (
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Insurance Information</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">{company.insuranceInfo}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Metadata</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          <div>
            <span className="text-slate-600 dark:text-slate-400 block mb-1">Company ID</span>
            <span className="text-slate-900 dark:text-slate-200 font-mono text-xs">{company.id}</span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400 block mb-1">Owner ID</span>
            <span className="text-slate-900 dark:text-slate-200 font-mono text-xs">{company.ownerId}</span>
          </div>
          {company.createdAt && (
            <div>
              <span className="text-slate-600 dark:text-slate-400 block mb-1">Created At</span>
              <span className="text-slate-900 dark:text-slate-200">{new Date(company.createdAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCompanyDetailPage;
