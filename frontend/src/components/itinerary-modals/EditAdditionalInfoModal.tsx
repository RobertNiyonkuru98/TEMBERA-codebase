import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import type { Itinerary } from "../../types";
import { updateItinerary, type UpdateItineraryPayload } from "../../api/platformApi";
import { useAuth } from "../../AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function EditAdditionalInfoModal({
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
  
  const [weatherNotes, setWeatherNotes] = useState(itinerary.weatherNotes || "");
  const [weatherDependency, setWeatherDependency] = useState(itinerary.weatherDependency || false);
  const [whatToWear, setWhatToWear] = useState(itinerary.whatToWear || "");
  const [guideInfo, setGuideInfo] = useState(itinerary.guideInfo || "");
  const [languagesOffered, setLanguagesOffered] = useState(itinerary.languagesOffered?.join(", ") || "");
  const [additionalNotes, setAdditionalNotes] = useState(itinerary.additionalNotes || "");
  const [termsAndConditions, setTermsAndConditions] = useState(itinerary.termsAndConditions || "");

  const handleSave = async () => {
    if (!token) return;
    try {
      setIsSaving(true);
      const payload: UpdateItineraryPayload = {
        weather_notes: weatherNotes,
        weather_dependency: weatherDependency,
        what_to_wear: whatToWear,
        guide_info: guideInfo,
        languages_offered: languagesOffered.split(",").map(lang => lang.trim()).filter(Boolean),
        additional_notes: additionalNotes,
        terms_and_conditions: termsAndConditions,
      };
      
      await updateItinerary(token, String(itinerary.id), payload);
      toast.success("Additional information updated successfully");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update information");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Additional Information</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Guide details, weather notes, and terms & conditions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h4 className="font-semibold border-b border-slate-800 pb-2">Guide & Preparation</h4>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Guide Information</label>
              <input
                value={guideInfo}
                onChange={(e) => setGuideInfo(e.target.value)}
                placeholder="e.g. Certified local guide included"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Languages Offered (Comma separated)</label>
              <input
                value={languagesOffered}
                onChange={(e) => setLanguagesOffered(e.target.value)}
                placeholder="e.g. English, French, Kinyarwanda"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">What to Wear</label>
              <input
                value={whatToWear}
                onChange={(e) => setWhatToWear(e.target.value)}
                placeholder="e.g. Comfortable hiking shoes, light jacket"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold border-b border-slate-800 pb-2">Weather</h4>
            
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={weatherDependency}
                onChange={(e) => setWeatherDependency(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900"
              />
              Weather Dependent
            </label>

            <div className="space-y-2">
              <label className="text-sm font-medium">Weather Notes</label>
              <textarea
                value={weatherNotes}
                onChange={(e) => setWeatherNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Subject to cancellation during heavy rain"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold border-b border-slate-800 pb-2">Notes & Terms</h4>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
                placeholder="Any other important information for attendees"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Terms and Conditions</label>
              <textarea
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                rows={4}
                placeholder="Specific rules or terms"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
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
