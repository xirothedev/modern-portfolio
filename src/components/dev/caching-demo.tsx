"use client";

import { useState } from "react";

import { useGitHubProjects } from "@/hooks/use-github-projects";

export function CachingDemo() {
	const [mountCount, setMountCount] = useState(1);
	const [showDemo, setShowDemo] = useState(false);

	if (process.env.NODE_ENV !== "development") {
		return null;
	}

	return (
		<div className="fixed top-4 right-4 z-50">
			<button
				onClick={() => setShowDemo(!showDemo)}
				className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
			>
				Cache Demo
			</button>

			{showDemo && (
				<div className="absolute top-10 right-0 w-96 rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="font-semibold text-white">SWR Caching Demo</h3>
						<button onClick={() => setShowDemo(false)} className="text-zinc-400 hover:text-white">
							✕
						</button>
					</div>

					<div className="space-y-4">
						<div className="text-sm text-zinc-300">
							This demo shows how SWR prevents unnecessary API calls:
						</div>

						<div className="space-y-2">
							{Array.from({ length: mountCount }, (_, i) => (
								<CacheTestComponent key={i} index={i + 1} />
							))}
						</div>

						<div className="flex gap-2">
							<button
								onClick={() => setMountCount((prev) => prev + 1)}
								className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
							>
								Add Component
							</button>
							<button
								onClick={() => setMountCount(1)}
								className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
							>
								Reset
							</button>
						</div>

						<div className="text-xs text-zinc-500">
							<div>• First component triggers API call</div>
							<div>• Additional components use cached data</div>
							<div>• Check browser network tab to verify</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

function CacheTestComponent({ index }: { index: number }) {
	const { projects, loading, error } = useGitHubProjects();
	const [mountTime] = useState(() => new Date().toLocaleTimeString());

	return (
		<div className="rounded border border-zinc-700 bg-zinc-800 p-2 text-xs">
			<div className="flex items-center justify-between">
				<span className="font-medium text-white">Component #{index}</span>
				<span className="text-zinc-400">{mountTime}</span>
			</div>
			<div className="mt-1 text-zinc-400">
				{loading ? (
					<span className="text-yellow-400">Loading...</span>
				) : error ? (
					<span className="text-red-400">Error: {error}</span>
				) : (
					<span className="text-green-400">{projects.length} projects cached</span>
				)}
			</div>
		</div>
	);
}
