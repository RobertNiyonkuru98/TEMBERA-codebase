import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";
import { createBooking, fetchItineraries } from "../api/platformApi";
import type { Itinerary } from "../types";
import { Calendar, MapPin, Users, Plus, X, Loader2, CreditCard, FileText, CheckCircle2, User, Phone, Mail } from "lucide-react";

type GroupMember = {
  name: string;
  phoneNumber: string;
  email: string;
  nationalId: string;
};

type GroupType = "personal" | "couple" | "family" | "other";

function CreateBookingPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [groupType, setGroupType] = useState<GroupType>("personal");
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { name: "", phoneNumber: "", email: "", nationalId: "" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadItineraries() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const fetched = await fetchItineraries(token);
        setItineraries(fetched);
        if (fetched[0]) {
          setSelectedItineraryId(String(fetched[0].id));
        }
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load itineraries",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadItineraries();
  }, [token]);

  if (!user) {
    return null;
  }

  const currentUserId = String(user.id);

  function handleMemberChange(
    index: number,
    field: keyof GroupMember,
    value: string,
  ) {
    setGroupMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function addMember() {
    setGroupMembers((prev) => [
      ...prev,
      { name: "", phoneNumber: "", email: "", nationalId: "" },
    ]);
  }

  function removeMember(index: number) {
    setGroupMembers((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!token) {
      setError("Missing authentication token");
      toast.error("Something went wrong");
      return;
    }

    if (!selectedItineraryId) {
      setError("Please select an itinerary");
      toast.error("Something went wrong");
      return;
    }

    const type = isGroup ? "group" : "personal";
    const normalizedMembers = groupMembers
      .map((member) => ({
        name: member.name.trim(),
        email: member.email.trim() || undefined,
        phone: member.phoneNumber.trim() || undefined,
      }))
      .filter((member) => member.name.length > 0);

    if (type === "group" && normalizedMembers.length === 0) {
      setError("Add at least one person for group booking");
      toast.error("Add at least one person for group booking");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const baseDescription =
        description || (isGroup ? "Group booking" : "Personal booking");

      const booking = await createBooking(token, {
        user_id: currentUserId,
        itineraryId: selectedItineraryId,
        type,
        description: isGroup ? `${baseDescription} (${groupType})` : baseDescription,
        date: new Date().toISOString().slice(0, 10),
        members: type === "group" ? normalizedMembers : [],
      });

      if (!booking) {
        throw new Error("Booking creation failed");
      }

      toast.success("Booking created successfully");

      navigate("/my-bookings");
    } catch (submitError) {
      const errorMsg =
        submitError instanceof Error
          ? submitError.message
          : "Failed to create booking";
      setError(errorMsg);
      toast.error(errorMsg || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedItinerary = itineraries.find(
    (itinerary) => String(itinerary.id) === selectedItineraryId,
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading itineraries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="mx-auto w-[95%] max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("newBooking.title")}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">{t("newBooking.subtitle")}</p>
        </div>

        {!isLoading && itineraries.length === 0 && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">No itineraries available for booking yet.</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        className="space-y-6"
      >
        {/* Select Itinerary Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
          <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500 p-2">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("newBooking.selectItinerary")}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="relative">
              <select
                id="itinerary"
                value={selectedItineraryId}
                onChange={(event) => setSelectedItineraryId(event.target.value)}
                className="w-full appearance-none rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-12 pr-10 py-4 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600"
                disabled={isLoading || itineraries.length === 0}
              >
                {itineraries.map((itinerary) => (
                  <option key={itinerary.id} value={String(itinerary.id)}>
                    {itinerary.title} - {itinerary.location} ({new Date(itinerary.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {selectedItinerary && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 p-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Price per person</span>
                </div>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedItinerary.price.toLocaleString()} RWF
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Booking Note Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
          <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-500 p-2">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("newBooking.note")}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[100px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
              placeholder={t("newBooking.notePlaceholder")}
            />
          </div>
        </div>

        {/* Group Booking Toggle */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
          <div className="p-6 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isGroup}
                onChange={(event) => setIsGroup(event.target.checked)}
                className="h-5 w-5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("newBooking.isGroup")}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400">{t("newBooking.groupHelper")}</p>
              </div>
            </label>
          </div>
        </div>

        {/* Group Members Card */}
        {isGroup && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-500 p-2">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t("newBooking.groupMembers")}
                  </h2>
                </div>
                <div className="relative">
                  <select
                    value={groupType}
                    onChange={(event) => setGroupType(event.target.value as GroupType)}
                    className="appearance-none rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-4 pr-10 py-2.5 text-xs font-semibold text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    <option value="personal">{t("newBooking.personal")}</option>
                    <option value="couple">{t("newBooking.couple")}</option>
                    <option value="family">{t("newBooking.family")}</option>
                    <option value="other">{t("newBooking.other")}</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {groupMembers.map((member, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-linear-to-br from-white to-slate-50 dark:from-slate-900/50 dark:to-slate-900/80 p-5 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/50"
                >
                  {/* Member Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 text-white font-bold text-sm shadow-md">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          Member #{index + 1}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Fill in details below</p>
                      </div>
                    </div>
                    {groupMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="inline-flex items-center gap-1.5 rounded-xl border-2 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 transition-all hover:bg-red-100 dark:hover:bg-red-900/30 hover:scale-105"
                      >
                        <X className="h-4 w-4" />
                        {t("newBooking.remove")}
                      </button>
                    )}
                  </div>

                  {/* Member Input Fields */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <input
                          type="text"
                          placeholder={t("bookings.memberName")}
                          value={member.name}
                          onChange={(event) =>
                            handleMemberChange(index, "name", event.target.value)
                          }
                          className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <input
                          type="tel"
                          placeholder={t("bookings.memberPhone")}
                          value={member.phoneNumber}
                          onChange={(event) =>
                            handleMemberChange(index, "phoneNumber", event.target.value)
                          }
                          className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <input
                          type="email"
                          placeholder={t("bookings.memberEmail")}
                          value={member.email}
                          onChange={(event) =>
                            handleMemberChange(index, "email", event.target.value)
                          }
                          className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {/* National ID Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        National ID
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <input
                          type="text"
                          placeholder={t("newBooking.memberNationalId")}
                          value={member.nationalId}
                          onChange={(event) =>
                            handleMemberChange(index, "nationalId", event.target.value)
                          }
                          className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addMember}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-600"
              >
                <Plus className="h-4 w-4" />
                {t("newBooking.addMember")}
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || itineraries.length === 0}
          className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t("newBooking.submitting")}
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 transition-transform group-hover:scale-110" />
              {t("newBooking.submit")}
            </>
          )}
        </button>
      </form>
      </div>
    </div>
  );
}

export default CreateBookingPage;
