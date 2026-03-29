import { type HTMLAttributes } from "react";
import { cn } from "@/shared/utils/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card"
      className={cn("rounded-xl border border-slate-800 bg-slate-900 text-slate-100", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-content" className={cn("p-4", className)} {...props} />;
}
