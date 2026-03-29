type UserListHeaderProps = {
  title: string;
  description: string;
  userCount: number;
};

export function UserListHeader({ title, description, userCount }: UserListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {userCount} {userCount === 1 ? 'User' : 'Users'}
          </p>
        </div>
      </div>
    </div>
  );
}
