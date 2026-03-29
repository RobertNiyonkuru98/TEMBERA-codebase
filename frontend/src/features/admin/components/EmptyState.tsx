import { User as UserIcon } from "lucide-react";

type EmptyStateProps = {
  hasFilters: boolean;
};

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-12 text-center">
      <UserIcon className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No users found</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {hasFilters
          ? "Try adjusting your search or filters"
          : "No users have been registered yet"}
      </p>
    </div>
  );
}
