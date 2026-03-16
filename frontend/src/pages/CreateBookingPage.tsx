import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { bookingItems, bookings, itineraries } from "../mockData";
import type { Booking, BookingItem } from "../types";
import { useI18n } from "../i18n";

type GroupMember = {
  name: string;
  phoneNumber: string;
  email: string;
  nationalId: string;
};

type GroupType = "personal" | "couple" | "family" | "other";

function CreateBookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [selectedItineraryId, setSelectedItineraryId] = useState<number>(
    itineraries[0]?.id ?? 0,
  );
  const [description, setDescription] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [groupType, setGroupType] = useState<GroupType>("personal");
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);

  if (!user) {
    return null;
  }

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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const newBookingId =
      bookings.reduce((max, b) => (b.id > max ? b.id : max), 0) + 1;
    const newItemId =
      bookingItems.reduce((max, i) => (i.id > max ? i.id : max), 0) + 1;

    const baseDescription = description || (isGroup ? "Group booking" : "Personal booking");

    const newBooking: Booking = {
      id: newBookingId,
      userId: user.id,
      description: isGroup ? `${baseDescription} (${groupType})` : baseDescription,
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
    };

    const newBookingItem: BookingItem = {
      id: newItemId,
      bookingId: newBookingId,
      itineraryId: selectedItineraryId,
    };

    bookings.push(newBooking);
    bookingItems.push(newBookingItem);

    // groupMembers are only kept in-memory here to illustrate the structure
    // eslint-disable-next-line no-console
    console.log("Mock group members saved with booking:", {
      bookingId: newBookingId,
      groupMembers: isGroup ? groupMembers : [],
    });

    navigate("/bookings");
  }

  const selectedItinerary = itineraries.find(
    (i) => i.id === selectedItineraryId,
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          {t("booking.createTitle")}
        </h1>
        <p className="text-sm text-slate-300">
          {t("booking.createSubtitle")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
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
            onChange={(e) => setSelectedItineraryId(Number(e.target.value))}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
          >
            {itineraries.map((itinerary) => (
              <option key={itinerary.id} value={itinerary.id}>
                {itinerary.title} — {itinerary.location} (
                {new Date(itinerary.date).toLocaleDateString()})
              </option>
            ))}
          </select>
          {selectedItinerary && (
            <p className="text-xs text-slate-400 pt-1">
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
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder={t("booking.notePlaceholder")}
          />
        </div>

        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-200">
            <input
              type="checkbox"
              checked={isGroup}
              onChange={(e) => setIsGroup(e.target.checked)}
              className="h-3 w-3 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
            />
            {t("booking.groupCheckbox")}
          </label>
          <p className="text-xs text-slate-400">
            {t("booking.groupHelper")}
          </p>
        </div>

        {isGroup && (
          <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-200">
                {t("booking.groupMembers")}
              </p>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value as GroupType)}
                className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
                >
                <option value="personal">
                  {t("booking.groupType.personal")}
                </option>
                <option value="couple">
                  {t("booking.groupType.couple")}
                </option>
                <option value="family">
                  {t("booking.groupType.family")}
                </option>
                <option value="other">
                  {t("booking.groupType.other")}
                </option>
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
                    onChange={(e) =>
                      handleMemberChange(index, "name", e.target.value)
                    }
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
                  />
                  <input
                    type="tel"
                    placeholder={t("booking.memberPhone")}
                    value={member.phoneNumber}
                    onChange={(e) =>
                      handleMemberChange(index, "phoneNumber", e.target.value)
                    }
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
                  />
                  <input
                    type="email"
                    placeholder={t("booking.memberEmail")}
                    value={member.email}
                    onChange={(e) =>
                      handleMemberChange(index, "email", e.target.value)
                    }
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
                  />
                  <input
                    type="text"
                    placeholder={t("booking.memberId")}
                    value={member.nationalId}
                    onChange={(e) =>
                      handleMemberChange(index, "nationalId", e.target.value)
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
          className="w-full rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
        >
          {t("booking.submit")}
        </button>
      </form>
    </div>
  );
}

export default CreateBookingPage;

