import { DollarSign, CreditCard } from "lucide-react";
import type { StepProps } from "./types";

const PAYMENT_OPTIONS = ["cash", "card", "mobile_money", "bank_transfer"];

export function PricingPaymentStep({ formData, updateFormData }: StepProps) {
  const togglePaymentMethod = (method: string) => {
    const current = formData.paymentMethods || [];
    if (current.includes(method)) {
      updateFormData({ paymentMethods: current.filter((m) => m !== method) });
    } else {
      updateFormData({ paymentMethods: [...current, method] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-teal-600 shadow-lg">
          <DollarSign className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Pricing & Payment
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Set prices and payment policies
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Base Price */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Base Price *
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-colors"
              required
            />
            <select
              value={formData.currency}
              onChange={(e) => updateFormData({ currency: e.target.value })}
              className="px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-colors"
            >
              <option value="RWF">RWF</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* Price Per Person */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Price Per Person
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.pricePerPerson}
            onChange={(e) => updateFormData({ pricePerPerson: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-colors"
          />
        </div>

        {/* Price Per Group */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Price Per Group
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.pricePerGroup}
            onChange={(e) => updateFormData({ pricePerGroup: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-colors"
          />
        </div>

        {/* Deposit Required */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Deposit Required
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.depositRequired}
            onChange={(e) => updateFormData({ depositRequired: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-colors"
          />
        </div>

        {/* Deposit Percentage */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Deposit Percentage (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.depositPercentage}
            onChange={(e) => updateFormData({ depositPercentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-colors"
          />
        </div>

        {/* Payment Methods */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
            <CreditCard className="inline h-4 w-4 mr-1" />
            Accepted Payment Methods
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PAYMENT_OPTIONS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => togglePaymentMethod(method)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all capitalize ${
                  formData.paymentMethods.includes(method)
                    ? "bg-teal-600 text-white border-2 border-teal-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400"
                }`}
              >
                {method.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Refund Policy */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Refund Policy
          </label>
          <textarea
            value={formData.refundPolicy}
            onChange={(e) => updateFormData({ refundPolicy: e.target.value })}
            placeholder="Describe your refund policy (e.g., Full refund if cancelled 7 days before, 50% refund if cancelled 3 days before, etc.)..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-colors resize-none"
          />
        </div>

        {/* Cancellation Policy */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Cancellation Policy
          </label>
          <textarea
            value={formData.cancellationPolicy}
            onChange={(e) => updateFormData({ cancellationPolicy: e.target.value })}
            placeholder="Describe your cancellation policy and any associated fees..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}
