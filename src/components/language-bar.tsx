"use client";

import { getLanguageColor } from "@/lib/github-colors";
import { cn } from "@/lib/utils";

interface LanguageBarProps {
	languages: { [key: string]: number };
	className?: string;
	showPercentages?: boolean;
}

export function LanguageBar({ languages, className, showPercentages = false }: LanguageBarProps) {
	if (!languages || Object.keys(languages).length === 0) {
		return null;
	}

	// Calculate total bytes
	const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

	// Convert to percentages and sort by percentage (descending)
	const languagePercentages = Object.entries(languages)
		.map(([language, bytes]) => ({
			language,
			percentage: (bytes / totalBytes) * 100,
			bytes,
		}))
		.sort((a, b) => b.percentage - a.percentage)
		.slice(0, 5); // Show top 5 languages

	if (languagePercentages.length === 0) {
		return null;
	}

	return (
		<div className={cn("space-y-2", className)}>
			{/* Language bar */}
			<div className="flex h-2 overflow-hidden rounded-full bg-zinc-700/50">
				{languagePercentages.map(({ language, percentage }) => (
					<div
						key={language}
						className="h-full transition-all duration-300 hover:brightness-110"
						style={{
							width: `${percentage}%`,
							backgroundColor: getLanguageColor(language),
						}}
						title={`${language}: ${percentage.toFixed(1)}%`}
					/>
				))}
			</div>

			{/* Language labels */}
			<div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
				{languagePercentages.map(({ language, percentage }) => (
					<div key={language} className="flex items-center gap-1">
						<div className="h-2 w-2 rounded-full" style={{ backgroundColor: getLanguageColor(language) }} />
						<span className="font-medium">{language}</span>
						{showPercentages && <span className="text-zinc-500">{percentage.toFixed(1)}%</span>}
					</div>
				))}
			</div>
		</div>
	);
}
