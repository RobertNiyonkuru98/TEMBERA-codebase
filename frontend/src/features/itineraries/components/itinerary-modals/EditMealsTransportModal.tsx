import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/components/ui";
import { Button } from "@/shared/components/ui";
import type { Itinerary } from "@/shared/types";
import { updateItinerary, type UpdateItineraryPayload } from "@/core/api";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function EditMealsTransportModal({
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
  
  // Meals
  const [mealsIncluded, setMealsIncluded] = useState(itinerary.mealsIncluded || false);
  const [canBuyFoodOnsite, setCanBuyFoodOnsite] = useState(itinerary.canBuyFoodOnsite || false);
  const [canBringOwnFood, setCanBringOwnFood] = useState(itinerary.canBringOwnFood || false);
  const [foodOptions, setFoodOptions] = useState(itinerary.foodOptions || "");
  const [dietaryAccommodations, setDietaryAccommodations] = useState(itinerary.dietaryAccommodations || "");

  // Transport
  const [transportIncluded, setTransportIncluded] = useState(itinerary.transportIncluded || false);
  const [allowsOwnTransport, setAllowsOwnTransport] = useState(itinerary.allowsOwnTransport || false);
  const [parkingAvailable, setParkingAvailable] = useState(itinerary.parkingAvailable || false);
  const [transportType, setTransportType] = useState(itinerary.transportType || "");
  const [transportNotes, setTransportNotes] = useState(itinerary.transportNotes || "");

  const handleSave = async () => {
    if (!token) return;
    try {
      setIsSaving(true);
      const payload: UpdateItineraryPayload = {
        meals_included: mealsIncluded,
        can_buy_food_onsite: canBuyFoodOnsite,
        can_bring_own_food: canBringOwnFood,
        food_options: foodOptions,
        dietary_accommodations: dietaryAccommodations,
        transport_included: transportIncluded,
        allows_own_transport: allowsOwnTransport,
        parking_available: parkingAvailable,
        transport_type: transportType,
        transport_notes: transportNotes,
      };
      
      await updateItinerary(token, String(itinerary.id), payload);
      toast.success("Meals & Transport updated");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update meals & transport");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Meals & Transport</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Define the logistics regarding food and travel for your attendees.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h4 className="font-semibold border-b border-slate-800 pb-2">Meals & Food</h4>
            
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={mealsIncluded}
                  onChange={(e) => setMealsIncluded(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900"
                />
                Meals Included
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={canBuyFoodOnsite}
                  onChange={(e) => setCanBuyFoodOnsite(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900"
                />
                Can Buy Food Onsite
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={canBringOwnFood}
                  onChange={(e) => setCanBringOwnFood(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900"
                />
                Can Bring Own Food
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Food Options Details</label>
              <input
                value={foodOptions}
                onChange={(e) => setFoodOptions(e.target.value)}
                placeholder="e.g. Buffet lunch, packed sandwiches"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Dietary Accommodations</label>
              <input
                value={dietaryAccommodations}
                onChange={(e) => setDietaryAccommodations(e.target.value)}
                placeholder="e.g. Vegan and gluten-free available upon request"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold border-b border-slate-800 pb-2">Transportation</h4>
            
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={transportIncluded}
                  onChange={(e) => setTransportIncluded(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900"
                />
                Transport Included
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowsOwnTransport}
                  onChange={(e) => setAllowsOwnTransport(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900"
                />
                Own Transport Okay
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={parkingAvailable}
                  onChange={(e) => setParkingAvailable(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900"
                />
                Parking Available
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Transport Type</label>
              <input
                value={transportType}
                onChange={(e) => setTransportType(e.target.value)}
                placeholder="e.g. 4x4 Safari Jeep, Minibus"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Transport Notes / Directions</label>
              <textarea
                value={transportNotes}
                onChange={(e) => setTransportNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Detailed directions or pickup instructions"
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
