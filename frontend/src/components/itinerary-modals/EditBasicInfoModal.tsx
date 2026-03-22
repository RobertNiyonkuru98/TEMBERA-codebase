import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import type { Itinerary } from "../../types";
import { updateItinerary, type UpdateItineraryPayload } from "../../api/platformApi";
import { useAuth } from "../../AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function EditBasicInfoModal({
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
  
  // Local state for the form
  const [title, setTitle] = useState(itinerary.title || "");
  const [activity, setActivity] = useState(itinerary.activity || "");
  const [location, setLocation] = useState(itinerary.location || "");
  const [description, setDescription] = useState(itinerary.description || "");
  const [category, setCategory] = useState(itinerary.category || "");

  const handleSave = async () => {
    if (!token) return;
    try {
      setIsSaving(true);
      const payload: UpdateItineraryPayload = {
        title,
        activity,
        location,
        description,
        category,
      };
      await updateItinerary(token, String(itinerary.id), payload);
      toast.success("Basic info updated successfully");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update basic info");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-150 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Basic Information</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Update the fundamental details of your itinerary. Unsaved changes will be lost.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Activity Type</label>
              <input
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Safari, Trekking"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location Summary</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSaving} className="border-slate-200 dark:border-slate-800">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !title.trim()} className="bg-emerald-600 text-white hover:bg-emerald-700">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
