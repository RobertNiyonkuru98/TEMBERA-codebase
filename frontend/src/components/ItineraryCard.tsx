import React from "react";
import type { Company, Itinerary } from "../types";

interface ItineraryCardProps {
	itinerary: Itinerary;
	company?: Company;
	as?: "link" | "a";
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary, company }) => {
	return (
		<a
			key={itinerary.id}
			href={`/itineraries/${itinerary.id}`}
			className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-emerald-400/70 hover:bg-slate-900 transition"
		>
			{itinerary.imageUrl && (
				<img
					src={itinerary.imageUrl}
					alt={itinerary.activity ?? "Itinerary"}
					className="rounded-lg mb-3 w-full h-40 object-cover"
				/>
			)}
			<div className="flex items-center justify-between gap-2 pb-2">
				<p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
					{itinerary.activity ?? "Experience"}
				</p>
				<p className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700">
					{new Date(itinerary.date).toLocaleDateString()}
				</p>
			</div>
			<h3 className="text-sm font-semibold text-slate-50 group-hover:text-emerald-200">
				{itinerary.title}
			</h3>
			<p className="mt-1 line-clamp-2 text-xs text-slate-400">
				{itinerary.description}
			</p>
			<p className="mt-2 text-xs text-slate-400">
				{itinerary.location}
			</p>
			<div className="mt-3 flex items-center justify-between">
				<p className="text-sm font-semibold text-emerald-300">
					{itinerary.price.toLocaleString()} RWF
				</p>
				{company && (
					<p className="text-[11px] text-slate-400">
						by <span className="text-slate-200">{company.name}</span>
					</p>
				)}
			</div>
		</a>
	);
};

export default ItineraryCard;
