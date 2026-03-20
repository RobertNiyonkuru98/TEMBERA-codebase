type RolePlaceholderPageProps = {
  title: string;
  subtitle: string;
  items: string[];
};

function RolePlaceholderPage({ title, subtitle, items }: RolePlaceholderPageProps) {
  return (
    <section className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">{title}</h1>
        <p className="text-sm text-slate-300">{subtitle}</p>
      </div>

      <ul className="space-y-2 text-sm text-slate-200">
        {items.map((item) => (
          <li key={item} className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RolePlaceholderPage;
