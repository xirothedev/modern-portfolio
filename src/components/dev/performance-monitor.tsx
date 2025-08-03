/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
import { performanceMonitor } from "@/lib/animation-utils";

export function PerformanceMonitor() {
	// Only show in development
	if (process.env.NODE_ENV !== "development") {
		return null;
	}

	const [isOpen, setIsOpen] = useState(false);
	const [fps, setFPS] = useState(60);
	const [memoryInfo, setMemoryInfo] = useState<any>(null);

	useEffect(() => {
		// Start monitoring
		performanceMonitor.startMonitoring();

		// Subscribe to FPS changes
		const unsubscribe = performanceMonitor.onFPSChange((newFPS) => {
			setFPS(newFPS);
		});

		// Get memory info if available
		const updateMemoryInfo = () => {
			if ("memory" in performance) {
				setMemoryInfo((performance as any).memory);
			}
		};

		updateMemoryInfo();
		const memoryInterval = setInterval(updateMemoryInfo, 2000);

		return () => {
			unsubscribe();
			clearInterval(memoryInterval);
			performanceMonitor.stopMonitoring();
		};
	}, []);

	const getPerformanceStatus = () => {
		if (fps >= 55) return { status: "Excellent", color: "text-green-400", bg: "bg-green-500" };
		if (fps >= 45) return { status: "Good", color: "text-blue-400", bg: "bg-blue-500" };
		if (fps >= 30) return { status: "Fair", color: "text-yellow-400", bg: "bg-yellow-500" };
		return { status: "Poor", color: "text-red-400", bg: "bg-red-500" };
	};

	const { status, color, bg } = getPerformanceStatus();

	return (
		<div className="fixed right-4 bottom-20 z-50">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`rounded-full p-2 text-white shadow-lg hover:opacity-80 ${bg}`}
				title="Performance Monitor"
			>
				📊
			</button>

			{isOpen && (
				<div className="absolute right-0 bottom-12 w-80 rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="font-semibold text-white">Performance Monitor</h3>
						<button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
							✕
						</button>
					</div>

					<div className="space-y-3 text-sm">
						{/* FPS Display */}
						<div>
							<div className="font-medium text-zinc-300">Frame Rate:</div>
							<div className="flex items-center gap-2">
								<span className={`inline-block h-2 w-2 rounded-full ${bg}`} />
								<span className={color}>
									{fps} FPS ({status})
								</span>
							</div>
						</div>

						{/* Performance Warnings */}
						{performanceMonitor.isLowPerformance() && (
							<div className="rounded bg-yellow-900/50 p-2 text-yellow-300">
								⚠️ Low performance detected. Reducing animation quality.
							</div>
						)}

						{performanceMonitor.isCriticalPerformance() && (
							<div className="rounded bg-red-900/50 p-2 text-red-300">
								🚨 Critical performance. Disabling some animations.
							</div>
						)}

						{/* Memory Info */}
						{memoryInfo && (
							<div>
								<div className="font-medium text-zinc-300">Memory Usage:</div>
								<div className="space-y-1 text-xs text-zinc-400">
									<div>Used: {Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024)}MB</div>
									<div>Total: {Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024)}MB</div>
									<div>Limit: {Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024)}MB</div>
								</div>
							</div>
						)}

						{/* Hardware Info */}
						<div>
							<div className="font-medium text-zinc-300">Hardware:</div>
							<div className="text-xs text-zinc-400">
								<div>Cores: {navigator.hardwareConcurrency || "Unknown"}</div>
								<div>Memory: {(navigator as any).deviceMemory || "Unknown"}GB</div>
								<div>Connection: {(navigator as any).connection?.effectiveType || "Unknown"}</div>
							</div>
						</div>

						{/* Optimization Tips */}
						<div className="border-t border-zinc-700 pt-2">
							<div className="mb-1 font-medium text-zinc-300">Tips:</div>
							<div className="space-y-1 text-xs text-zinc-500">
								{fps < 30 && <div>• Close other browser tabs</div>}
								{fps < 30 && <div>• Enable hardware acceleration</div>}
								{memoryInfo && memoryInfo.usedJSHeapSize > 100 * 1024 * 1024 && (
									<div>• High memory usage detected</div>
								)}
								<div>• Animations adapt to your device</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
