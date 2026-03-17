import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";
import { createBooking, fetchItineraries } from "../api/platformApi";
import type { Itinerary } from "../types";

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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          {t("booking.createTitle")}
        </h1>
        <p className="text-sm text-slate-300">{t("booking.createSubtitle")}</p>
      </div>

      {isLoading && <p className="text-sm text-slate-300">Loading itineraries...</p>}

      {!isLoading && itineraries.length === 0 && (
        <p className="text-sm text-slate-300">No itineraries available for booking yet.</p>
      )}

      {error && <p className="text-sm text-red-300">{error}</p>}

      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5"
      >
        <div className="space-y-1 text-sm">
          <label
            htmlFor="itinerary"
            className="block text-xs font-medium text-slate-200"
          >
            {t("booking.itineraryLabel")}
          </label>
          <select
            id="itinerary"
            value={selectedItineraryId}
            onChange={(event) => setSelectedItineraryId(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            disabled={isLoading || itineraries.length === 0}
          >
            {itineraries.map((itinerary) => (
              <option key={itinerary.id} value={String(itinerary.id)}>
                {itinerary.title} - {itinerary.location} (
                {new Date(itinerary.date).toLocaleDateString()})
              </option>
            ))}
          </select>
          {selectedItinerary && (
            <p className="pt-1 text-xs text-slate-400">
              Selected itinerary price:{" "}
              <span className="font-semibold text-emerald-300">
                {selectedItinerary.price.toLocaleString()} RWF
              </span>
            </p>
          )}
        </div>

        <div className="space-y-1 text-sm">
          <label
            htmlFor="description"
            className="block text-xs font-medium text-slate-200"
          >
            {t("booking.noteLabel")}
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder={t("booking.notePlaceholder")}
          />
        </div>

        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-200">
            <input
              type="checkbox"
              checked={isGroup}
              onChange={(event) => setIsGroup(event.target.checked)}
              className="h-3 w-3 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
            />
            {t("booking.groupCheckbox")}
          </label>
          <p className="text-xs text-slate-400">{t("booking.groupHelper")}</p>
        </div>

        {isGroup && (
          <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-200">
                {t("booking.groupMembers")}
              </p>
              <select
                value={groupType}
                onChange={(event) => setGroupType(event.target.value as GroupType)}
                className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
              >
                <option value="personal">{t("booking.groupType.personal")}</option>
                <option value="couple">{t("booking.groupType.couple")}</option>
                <option value="family">{t("booking.groupType.family")}</option>
                <option value="other">{t("booking.groupType.other")}</option>
              </select>
            </div>
            {groupMembers.map((member, index) => (
              <div
                key={index}
                className="space-y-2 rounded-md border border-slate-800 bg-slate-900/80 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-slate-300">
                    Member #{index + 1}
                  </p>
                  {groupMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-[11px] text-slate-400 hover:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder={t("booking.memberName")}
                    value={member.name}
                    onChange={(event) =>
                      handleMemberChange(index, "name", event.target.value)
                    }
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
                  />
                  <input
                    type="tel"
                    placeholder={t("booking.memberPhone")}
                    value={member.phoneNumber}
                    onChange={(event) =>
                      handleMemberChange(index, "phoneNumber", event.target.value)
                    }
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
                  />
                  <input
                    type="email"
                    placeholder={t("booking.memberEmail")}
                    value={member.email}
                    onChange={(event) =>
                      handleMemberChange(index, "email", event.target.value)
                    }
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
                  />
                  <input
                    type="text"
                    placeholder={t("booking.memberId")}
                    value={member.nationalId}
                    onChange={(event) =>
                      handleMemberChange(index, "nationalId", event.target.value)
                    }
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addMember}
              className="text-xs font-medium text-emerald-300 hover:text-emerald-200"
            >
              {t("booking.addMember")}
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || itineraries.length === 0}
          className="w-full rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : t("booking.submit")}
        </button>
      </form>
    </div>
  );
}

export default CreateBookingPage;
