import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import type { Itinerary } from "../../types";
import { updateItinerary, type UpdateItineraryPayload } from "../../api/platformApi";
import { useAuth } from "../../AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function EditPricingPoliciesModal({
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
  
  const [price, setPrice] = useState(itinerary.price?.toString() || "");
  const [pricePerPerson, setPricePerPerson] = useState(itinerary.pricePerPerson?.toString() || "");
  const [pricePerGroup, setPricePerGroup] = useState(itinerary.pricePerGroup?.toString() || "");
  const [depositRequired, setDepositRequired] = useState(itinerary.depositRequired?.toString() || "");
  const [depositPercentage, setDepositPercentage] = useState(itinerary.depositPercentage?.toString() || "");
  const [refundPolicy, setRefundPolicy] = useState(itinerary.refundPolicy || "");
  const [cancellationPolicy, setCancellationPolicy] = useState(itinerary.cancellationPolicy || "");

  const handleSave = async () => {
    if (!token) return;
    try {
      setIsSaving(true);
      const payload: UpdateItineraryPayload = {
        price: Number(price) || 0,
        price_per_person: pricePerPerson ? Number(pricePerPerson) : undefined,
        price_per_group: pricePerGroup ? Number(pricePerGroup) : undefined,
        deposit_required: depositRequired ? Number(depositRequired) : undefined,
        deposit_percentage: depositPercentage ? Number(depositPercentage) : undefined,
        refund_policy: refundPolicy,
        cancellation_policy: cancellationPolicy,
      };
      
      await updateItinerary(token, String(itinerary.id), payload);
      toast.success("Pricing & policies updated");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update pricing details");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Pricing & Policies</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Configure the pricing structure and your booking terms.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Base Price (Required)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Per Person (Optional)</label>
              <input
                type="number"
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Per Group (Optional)</label>
              <input
                type="number"
                value={pricePerGroup}
                onChange={(e) => setPricePerGroup(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Deposit Required</label>
              <input
                type="number"
                value={depositRequired}
                onChange={(e) => setDepositRequired(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deposit Percentage</label>
              <input
                type="number"
                value={depositPercentage}
                onChange={(e) => setDepositPercentage(e.target.value)}
                placeholder="e.g. 20"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Refund Policy</label>
            <textarea
              value={refundPolicy}
              onChange={(e) => setRefundPolicy(e.target.value)}
              rows={3}
              placeholder="e.g. Full refund up to 7 days before"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cancellation Policy</label>
            <textarea
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(e.target.value)}
              rows={3}
              placeholder="e.g. Free cancellation up to 48 hours in advance"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving} className="border-slate-200 dark:border-slate-800">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !price} className="bg-emerald-600 text-white hover:bg-emerald-700">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
