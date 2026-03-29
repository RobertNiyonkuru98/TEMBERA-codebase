import { Link } from "react-router-dom";

export type NavItem = {
  to: string;
  label: string;
  emphasis?: boolean;
};

type BaseNavbarProps = {
  items: NavItem[];
};

function BaseNavbar({ items }: BaseNavbarProps) {
  return (
    <>
      {items.map((item) => (
        <Link
          key={`${item.to}-${item.label}`}
          to={item.to}
          className={
            item.emphasis
              ? "rounded-md px-3 py-1.5 text-emerald-200 border border-emerald-400/60 hover:bg-emerald-500 hover:text-slate-950 transition"
              : "rounded-md px-3 py-1.5 text-slate-200 hover:bg-slate-800 hover:text-white transition"
          }
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

export default BaseNavbar;
