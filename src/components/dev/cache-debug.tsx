"use client";

import { useState } from "react";

import { useGitHubProjects, useGitHubProjectsCache } from "@/hooks/use-github-projects";

export function CacheDebug() {
	const [isOpen, setIsOpen] = useState(false);
	const { projects, loading, error, isValidating } = useGitHubProjects();
	const { refreshProjects, clearCache } = useGitHubProjectsCache();

	// Only show in development
	if (process.env.NODE_ENV !== "development") {
		return null;
	}

	return (
		<div className="fixed right-4 bottom-4 z-50">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="rounded-full bg-purple-600 p-2 text-white shadow-lg hover:bg-purple-700"
				title="Cache Debug Panel"
			>
				🔧
			</button>

			{isOpen && (
				<div className="absolute right-0 bottom-12 w-80 rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="font-semibold text-white">Cache Debug</h3>
						<button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
							✕
						</button>
					</div>

					<div className="space-y-3 text-sm">
						{/* Cache Status */}
						<div>
							<div className="font-medium text-zinc-300">Status:</div>
							<div className="flex gap-2">
								<span
									className={`inline-block h-2 w-2 rounded-full ${
										loading ? "bg-yellow-500" : error ? "bg-red-500" : "bg-green-500"
									}`}
								/>
								<span className="text-zinc-400">{loading ? "Loading" : error ? "Error" : "Ready"}</span>
								{isValidating && <span className="text-blue-400">(Revalidating)</span>}
							</div>
						</div>

						{/* Projects Count */}
						<div>
							<div className="font-medium text-zinc-300">Projects:</div>
							<div className="text-zinc-400">{projects.length} loaded</div>
						</div>

						{/* Error Info */}
						{error && (
							<div>
								<div className="font-medium text-red-400">Error:</div>
								<div className="text-xs text-red-300">{error}</div>
							</div>
						)}

						{/* Cache Actions */}
						<div className="space-y-2 border-t border-zinc-700 pt-2">
							<button
								onClick={refreshProjects}
								disabled={loading}
								className="w-full rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
							>
								Refresh Cache
							</button>
							<button
								onClick={clearCache}
								className="w-full rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
							>
								Clear Cache
							</button>
						</div>

						{/* Cache Info */}
						<div className="border-t border-zinc-700 pt-2 text-xs text-zinc-500">
							<div>SWR Client-Side Caching</div>
							<div>Refresh: 30min | Dedupe: 10min</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
