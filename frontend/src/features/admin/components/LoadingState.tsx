export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Loading users...</p>
      </div>
    </div>
  );
}
