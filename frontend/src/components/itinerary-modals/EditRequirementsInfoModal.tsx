import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import type { Itinerary } from "../../types";
import { updateItinerary, type UpdateItineraryPayload } from "../../api/platformApi";
import { useAuth } from "../../AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function EditRequirementsInfoModal({
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
  
  const [minAge, setMinAge] = useState(itinerary.minAge?.toString() || "");
  const [maxAge, setMaxAge] = useState(itinerary.maxAge?.toString() || "");
  const [fitnessLevelRequired, setFitnessLevelRequired] = useState(itinerary.fitnessLevelRequired || "");
  const [medicalRequirements, setMedicalRequirements] = useState(itinerary.medicalRequirements || "");
  const [accessibilityInfo, setAccessibilityInfo] = useState(itinerary.accessibilityInfo || "");
  const [insuranceIncluded, setInsuranceIncluded] = useState(itinerary.insuranceIncluded || false);
  const [insuranceDetails, setInsuranceDetails] = useState(itinerary.insuranceDetails || "");
  const [providedEquipment, setProvidedEquipment] = useState(itinerary.providedEquipment?.join(", ") || "");
  const [requiredItems, setRequiredItems] = useState(itinerary.requiredItems?.join(", ") || "");

  const handleSave = async () => {
    if (!token) return;
    try {
      setIsSaving(true);
      const payload: UpdateItineraryPayload = {
        min_age: minAge ? Number(minAge) : undefined,
        max_age: maxAge ? Number(maxAge) : undefined,
        fitness_level_required: fitnessLevelRequired,
        medical_requirements: medicalRequirements,
        accessibility_info: accessibilityInfo,
        insurance_included: insuranceIncluded,
        insurance_details: insuranceDetails,
        provided_equipment: providedEquipment.split(",").map(i => i.trim()).filter(Boolean),
        required_items: requiredItems.split(",").map(i => i.trim()).filter(Boolean),
      };
      
      await updateItinerary(token, String(itinerary.id), payload);
      toast.success("Requirements updated successfully");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update requirements");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Safety & Requirements</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Define who can participate, necessary precautions, and required equipment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h4 className="font-semibold border-b border-slate-800 pb-2">Participant Rules</h4>
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Age</label>
              <input
                type="number"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Maximum Age</label>
              <input
                type="number"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fitness Level</label>
              <input
                value={fitnessLevelRequired}
                onChange={(e) => setFitnessLevelRequired(e.target.value)}
                placeholder="e.g. Moderate, High"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            <div className="space-y-2 flex items-center pt-6">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={insuranceIncluded}
                  onChange={(e) => setInsuranceIncluded(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900"
                />
                Insurance Included
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Medical Requirements</label>
            <input
              value={medicalRequirements}
              onChange={(e) => setMedicalRequirements(e.target.value)}
              placeholder="e.g. Yellow fever vaccination required"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Accessibility Info</label>
            <input
              value={accessibilityInfo}
              onChange={(e) => setAccessibilityInfo(e.target.value)}
              placeholder="e.g. Wheelchair accessible"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Insurance Details (If included)</label>
              <input
                value={insuranceDetails}
                onChange={(e) => setInsuranceDetails(e.target.value)}
                placeholder="e.g. Full medical coverage up to $50k"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold border-b border-slate-800 pb-2">Equipment</h4>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Provided Equipment (Comma separated)</label>
              <textarea
                value={providedEquipment}
                onChange={(e) => setProvidedEquipment(e.target.value)}
                placeholder="e.g. Tents, Sleeping bags, Cooking gear"
                rows={2}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Required Items (Comma separated)</label>
              <textarea
                value={requiredItems}
                onChange={(e) => setRequiredItems(e.target.value)}
                placeholder="e.g. Flashlight, Warm jacket, Water bottle"
                rows={2}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
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
