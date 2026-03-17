import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import type { Company, Itinerary } from "../types";
import { useI18n } from "../i18n";

interface ItineraryCardProps {
	itinerary: Itinerary;
	company?: Company;
	as?: "link" | "a";
	onAttend?: (itinerary: Itinerary) => void;
	attendLabel?: string;
	isAttending?: boolean;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({
	itinerary,
	company,
	onAttend,
	attendLabel,
	isAttending = false,
}) => {
	const { t } = useI18n();
	const defaultAttendLabel = attendLabel || t("card.attend");

	return (
		<div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-all duration-300 hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-400/70 hover:-translate-y-1">
			{itinerary.imageUrl && (
				<div className="relative overflow-hidden h-48">
					<img
						src={itinerary.imageUrl}
						alt={itinerary.activity ?? "Itinerary"}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />
					<div className="absolute top-3 left-3">
						<span className="inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
							{itinerary.activity ?? "Experience"}
						</span>
					</div>
				</div>
			)}
			
			<div className="flex flex-col flex-1 p-5 space-y-3">
				<Link
					to={`/itinerary/${itinerary.id}`}
					className="text-lg font-bold text-slate-900 dark:text-slate-50 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2"
				>
					{itinerary.title}
				</Link>
				
				<p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
					{itinerary.description}
				</p>
				
				<div className="flex flex-col gap-2 pt-2">
					<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
						<MapPin className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
						<span>{itinerary.location}</span>
					</div>
					<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
						<Calendar className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
						<span>{new Date(itinerary.date).toLocaleDateString()}</span>
					</div>
				</div>
				
				<div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-200 dark:border-slate-800">
					<div className="flex items-center gap-1.5">
						<DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
						<span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
							{itinerary.price.toLocaleString()}
						</span>
						<span className="text-sm text-slate-500 dark:text-slate-400">RWF</span>
					</div>
					{company && (
						<p className="text-xs text-slate-500 dark:text-slate-400">
							{t("card.by")} <span className="font-medium text-slate-700 dark:text-slate-200">{company.name}</span>
						</p>
					)}
				</div>

				{onAttend && (
					<button
						type="button"
						onClick={() => onAttend(itinerary)}
						disabled={isAttending}
						className="w-full mt-3 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isAttending ? t("card.attending") : defaultAttendLabel}
					</button>
				)}
			</div>
		</div>
	);
};

export default ItineraryCard;
