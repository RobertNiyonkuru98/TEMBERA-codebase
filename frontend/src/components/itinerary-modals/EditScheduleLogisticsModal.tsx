import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import type { Itinerary } from "../../types";
import { updateItinerary, type UpdateItineraryPayload } from "../../api/platformApi";
import { useAuth } from "../../AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function EditScheduleLogisticsModal({
  itinerary,
  isOpen,
  onClose,
  onSaved,
}: {
  itinerary: Itinerary;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [durationDays, setDurationDays] = useState(itinerary.durationDays?.toString() || "");
  const [durationHours, setDurationHours] = useState(itinerary.durationHours?.toString() || "");
  const [scheduleDetails, setScheduleDetails] = useState(itinerary.scheduleDetails || "");
  const [meetingPoint, setMeetingPoint] = useState(itinerary.meetingPoint || "");
  const [endPoint, setEndPoint] = useState(itinerary.endPoint || "");
  const [locationDetails, setLocationDetails] = useState(itinerary.locationDetails || "");

  const handleSave = async () => {
    if (!token) return;
    try {
      setIsSaving(true);
      const payload: UpdateItineraryPayload = {
        duration_days: durationDays ? Number(durationDays) : undefined,
        duration_hours: durationHours ? Number(durationHours) : undefined,
        schedule_details: scheduleDetails,
        meeting_point: meetingPoint,
        end_point: endPoint,
        location_details: locationDetails,
      };
      
      await updateItinerary(token, String(itinerary.id), payload);
      toast.success("Schedule & location details updated");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update schedule logistics");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-150 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Schedule & Logistics</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Provide detailed schedules, meeting points, and durations.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (Days)</label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (Hours)</label>
              <input
                type="number"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                placeholder="4"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Schedule Details</label>
            <textarea
              value={scheduleDetails}
              onChange={(e) => setScheduleDetails(e.target.value)}
              rows={4}
              placeholder="e.g. 08:00 AM - Departure from Kigali
10:00 AM - Arrival at Akagera"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Point</label>
              <input
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                placeholder="e.g. Kigali Convention Centre"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Point</label>
              <input
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                placeholder="e.g. Amahoro Stadium"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Location Details</label>
            <textarea
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              rows={2}
              placeholder="Additional location context or instructions"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving} className="border-slate-200 dark:border-slate-800">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 text-white hover:bg-emerald-700">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
