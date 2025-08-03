/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
import { analyzeBundleComposition, generateOptimizationReport, getBundleSizeCategory } from "@/lib/bundle-analyzer";
import { analyzeBundleSplitting } from "@/lib/route-splitting";

export function BundleMonitor() {
	const [isOpen, setIsOpen] = useState(false);
	const [analysis, setAnalysis] = useState<any>(null);
	const [splittingAnalysis, setSplittingAnalysis] = useState<any>(null);

	// Only show in development
	if (process.env.NODE_ENV !== "development") {
		return null;
	}

	useEffect(() => {
		setAnalysis(analyzeBundleComposition());
		setSplittingAnalysis(analyzeBundleSplitting());
	}, []);

	if (!analysis) return null;

	const { category, color, recommendation } = getBundleSizeCategory(analysis.totalSize);

	const getColorClasses = (color: string) => {
		const colors = {
			green: { bg: "bg-green-500", text: "text-green-400" },
			blue: { bg: "bg-blue-500", text: "text-blue-400" },
			yellow: { bg: "bg-yellow-500", text: "text-yellow-400" },
			orange: { bg: "bg-orange-500", text: "text-orange-400" },
			red: { bg: "bg-red-500", text: "text-red-400" },
		};
		return colors[color as keyof typeof colors] || colors.blue;
	};

	const colorClasses = getColorClasses(color);

	return (
		<div className="fixed right-4 bottom-24 z-50">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`cursor-pointer rounded-full p-2 text-white shadow-lg hover:opacity-80 ${colorClasses.bg}`}
				title="Bundle Size Monitor"
			>
				📦
			</button>

			{isOpen && (
				<div className="absolute right-0 bottom-12 max-h-96 w-96 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="font-semibold text-white">Bundle Monitor</h3>
						<button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
							✕
						</button>
					</div>

					<div className="space-y-4 text-sm">
						{/* Bundle Size Overview */}
						<div>
							<div className="font-medium text-zinc-300">Bundle Size:</div>
							<div className="flex items-center gap-2">
								<span className={`inline-block h-2 w-2 rounded-full ${colorClasses.bg}`} />
								<span className={colorClasses.text}>
									{analysis.totalSize}KB ({category})
								</span>
							</div>
							<div className="mt-1 text-xs text-zinc-400">Gzipped: ~{analysis.gzippedSize}KB</div>
							<div className="mt-1 text-xs text-zinc-500">{recommendation}</div>
						</div>

						{/* Largest Chunks */}
						<div>
							<div className="mb-2 font-medium text-zinc-300">Largest Chunks:</div>
							<div className="space-y-1">
								{analysis.largestChunks.slice(0, 5).map((chunk: any) => (
									<div key={chunk.name} className="flex justify-between text-xs">
										<span className="text-zinc-400">{chunk.name}</span>
										<span className="text-zinc-300">
											{chunk.size}KB ({chunk.percentage}%)
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Optimization Opportunities */}
						<div>
							<div className="mb-2 font-medium text-zinc-300">Top Optimizations:</div>
							<div className="space-y-2">
								{analysis.optimizationOpportunities.slice(0, 3).map((opp: any) => (
									<div key={opp.library} className="rounded bg-zinc-800 p-2">
										<div className="flex items-center justify-between">
											<span className="font-medium text-zinc-300">{opp.library}</span>
											<span
												className={`rounded px-2 py-1 text-xs ${
													opp.priority === "high"
														? "bg-red-900 text-red-300"
														: opp.priority === "medium"
															? "bg-yellow-900 text-yellow-300"
															: "bg-blue-900 text-blue-300"
												}`}
											>
												{opp.priority}
											</span>
										</div>
										<div className="mt-1 text-xs text-zinc-400">Save ~{opp.potentialSavings}KB</div>
										<div className="mt-1 text-xs text-zinc-500">{opp.strategy}</div>
									</div>
								))}
							</div>
						</div>

						{/* Code Splitting Status */}
						{splittingAnalysis && (
							<div>
								<div className="mb-2 font-medium text-zinc-300">Code Splitting:</div>
								<div className="space-y-1 text-xs">
									{splittingAnalysis.lazyLoadedComponents.map((component: string) => (
										<div key={component} className="flex items-center gap-2">
											<span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
											<span className="text-zinc-400">{component}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Estimated Savings */}
						<div>
							<div className="mb-2 font-medium text-zinc-300">Potential Savings:</div>
							<div className="space-y-1 text-xs text-zinc-400">
								{splittingAnalysis?.estimatedSavings &&
									Object.entries(splittingAnalysis.estimatedSavings).map(([key, value]) => (
										<div key={key} className="flex justify-between">
											<span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
											<span className="text-green-400">{value as any}</span>
										</div>
									))}
							</div>
						</div>

						{/* Quick Actions */}
						<div className="border-t border-zinc-700 pt-2">
							<div className="mb-2 font-medium text-zinc-300">Quick Actions:</div>
							<div className="space-y-1">
								<button
									onClick={() => {
										console.log("Bundle Analysis Report:");
										console.log(generateOptimizationReport());
									}}
									className="w-full text-left text-xs text-blue-400 hover:text-blue-300"
								>
									📊 Log detailed report
								</button>
								<button
									onClick={() => {
										if (typeof window !== "undefined") {
											window.open(
												"https://nextjs.org/docs/advanced-features/analyzing-bundles",
												"_blank",
											);
										}
									}}
									className="w-full text-left text-xs text-blue-400 hover:text-blue-300"
								>
									📖 Bundle analysis guide
								</button>
							</div>
						</div>

						{/* Tips */}
						<div className="border-t border-zinc-700 pt-2">
							<div className="mb-1 font-medium text-zinc-300">Tips:</div>
							<div className="space-y-1 text-xs text-zinc-500">
								<div>• Run `ANALYZE=true pnpm build` for detailed analysis</div>
								<div>• Use dynamic imports for heavy components</div>
								<div>• Import specific functions, not entire libraries</div>
								<div>• Consider lighter alternatives for large dependencies</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
