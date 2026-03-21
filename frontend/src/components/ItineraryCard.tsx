import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, DollarSign, Clock, Users, Star, TrendingUp } from "lucide-react";
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

	const durationText = itinerary.durationDays
		? `${itinerary.durationDays}d${itinerary.durationHours ? ` ${itinerary.durationHours}h` : ''}`
		: itinerary.durationHours
		? `${itinerary.durationHours}h`
		: null;

	const hasRatings = itinerary.averageRating && itinerary.totalRatings && itinerary.totalRatings > 0;

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
					<div className="absolute top-3 left-3 flex gap-2">
						{itinerary.activity && (
							<span className="inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
								{itinerary.activity}
							</span>
						)}
						{itinerary.difficultyLevel && (
							<span className="inline-block rounded-full bg-slate-900/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white shadow-lg">
								{itinerary.difficultyLevel}
							</span>
						)}
					</div>
					{itinerary.isFeatured && (
						<div className="absolute top-3 right-3">
							<span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
								<Star className="h-3 w-3 fill-current" />
								Featured
							</span>
						</div>
					)}
				</div>
			)}
			
			<div className="flex flex-col flex-1 p-5 space-y-3">
				<Link
					to={`/itinerary/${itinerary.id}`}
					className="text-lg font-bold text-slate-900 dark:text-slate-50 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2"
				>
					{itinerary.title}
				</Link>
				
				{itinerary.description && (
					<p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
						{itinerary.description}
					</p>
				)}

				{/* Ratings */}
				{hasRatings && (
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1">
							<Star className="h-4 w-4 fill-amber-400 text-amber-400" />
							<span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
								{itinerary.averageRating?.toFixed(1)}
							</span>
						</div>
						<span className="text-xs text-slate-500 dark:text-slate-400">
							({itinerary.totalRatings} {itinerary.totalRatings === 1 ? 'review' : 'reviews'})
						</span>
					</div>
				)}
				
				<div className="grid grid-cols-2 gap-2 pt-2">
					{itinerary.location && (
						<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
							<MapPin className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
							<span className="truncate">{itinerary.location}</span>
						</div>
					)}
					<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
						<Calendar className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
						<span>{new Date(itinerary.date).toLocaleDateString()}</span>
					</div>
					{durationText && (
						<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
							<Clock className="h-4 w-4 text-blue-500 dark:text-blue-400 shrink-0" />
							<span>{durationText}</span>
						</div>
					)}
					{(itinerary.minParticipants || itinerary.maxParticipants) && (
						<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
							<Users className="h-4 w-4 text-purple-500 dark:text-purple-400 shrink-0" />
							<span>
								{itinerary.minParticipants && itinerary.maxParticipants
									? `${itinerary.minParticipants}-${itinerary.maxParticipants}`
									: itinerary.maxParticipants || itinerary.minParticipants}
							</span>
						</div>
					)}
				</div>

				{/* Quick highlights */}
				{(itinerary.mealsIncluded || itinerary.transportIncluded || itinerary.insuranceIncluded) && (
					<div className="flex flex-wrap gap-1.5 pt-2">
						{itinerary.mealsIncluded && (
							<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-xs font-medium text-emerald-700 dark:text-emerald-300">
								<TrendingUp className="h-3 w-3" />
								Meals
							</span>
						)}
						{itinerary.transportIncluded && (
							<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-xs font-medium text-blue-700 dark:text-blue-300">
								<TrendingUp className="h-3 w-3" />
								Transport
							</span>
						)}
						{itinerary.insuranceIncluded && (
							<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-900/20 text-xs font-medium text-purple-700 dark:text-purple-300">
								<TrendingUp className="h-3 w-3" />
								Insurance
							</span>
						)}
					</div>
				)}
				
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
