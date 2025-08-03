/**
 * Advanced Route-based Code Splitting
 * Implements intelligent code splitting strategies for optimal bundle loading
 */

import dynamic from "next/dynamic";
import { ComponentType } from "react";

// Route priorities for loading optimization
export const ROUTE_PRIORITIES = {
	CRITICAL: ["/", "/about"], // Load immediately
	HIGH: ["/projects", "/contact"], // Preload on hover
	MEDIUM: ["/blog", "/resume"], // Load on demand
	LOW: ["/admin", "/cms"], // Load only when accessed
} as const;

// Component loading strategies
export const LOADING_STRATEGIES = {
	IMMEDIATE: "immediate", // No lazy loading
	PRELOAD: "preload", // Preload on interaction
	LAZY: "lazy", // Load on demand
	DEFER: "defer", // Load after main content
} as const;

// Bundle splitting configuration
export interface SplitConfig {
	strategy: keyof typeof LOADING_STRATEGIES;
	preloadTrigger?: "hover" | "viewport" | "idle";
	chunkName?: string;
	priority?: "high" | "low";
}

// Create optimized dynamic imports
export function createOptimizedDynamic<T extends ComponentType<any>>(
	importFn: () => Promise<{ default: T }>,
	config: SplitConfig = { strategy: "LAZY" },
) {
	const defaultLoading = () => (
		<div className="flex h-64 items-center justify-center">
			<div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
		</div>
	);

	switch (config.strategy) {
		case "IMMEDIATE":
			return dynamic(importFn, {
				ssr: true,
				loading: defaultLoading,
			});

		case "PRELOAD":
			return dynamic(importFn, {
				ssr: false,
				loading: () => (
					<div className="flex h-32 items-center justify-center">
						<div className="text-center">
							<div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
							<div className="text-xs text-zinc-400">Preloading...</div>
						</div>
					</div>
				),
			});

		case "LAZY":
			return dynamic(importFn, {
				ssr: false,
				loading: defaultLoading,
			});

		case "DEFER":
			return dynamic(importFn, {
				ssr: false,
				loading: () => <div className="h-16 w-full animate-pulse rounded bg-zinc-800/50" />,
			});

		default:
			return dynamic(importFn, {
				ssr: false,
				loading: defaultLoading,
			});
	}
}

// Preload components on user interaction
export function preloadComponent(importFn: () => Promise<any>) {
	if (typeof window === "undefined") return;

	// Use requestIdleCallback if available
	if ("requestIdleCallback" in window) {
		(window as any).requestIdleCallback(() => {
			importFn().catch(console.error);
		});
	} else {
		// Fallback to setTimeout
		setTimeout(() => {
			importFn().catch(console.error);
		}, 100);
	}
}

// Smart preloading based on user behavior
export class SmartPreloader {
	private static instance: SmartPreloader;
	private preloadedRoutes = new Set<string>();
	private hoverTimeouts = new Map<string, NodeJS.Timeout>();

	static getInstance(): SmartPreloader {
		if (!SmartPreloader.instance) {
			SmartPreloader.instance = new SmartPreloader();
		}
		return SmartPreloader.instance;
	}

	// Preload on link hover
	preloadOnHover(href: string, importFn: () => Promise<any>) {
		if (this.preloadedRoutes.has(href)) return;

		const timeout = setTimeout(() => {
			this.preloadedRoutes.add(href);
			importFn().catch(console.error);
		}, 100); // Small delay to avoid accidental hovers

		this.hoverTimeouts.set(href, timeout);
	}

	// Cancel preload if hover ends quickly
	cancelPreload(href: string) {
		const timeout = this.hoverTimeouts.get(href);
		if (timeout) {
			clearTimeout(timeout);
			this.hoverTimeouts.delete(href);
		}
	}

	// Preload based on viewport intersection
	preloadOnViewport(href: string, importFn: () => Promise<any>) {
		if (this.preloadedRoutes.has(href) || typeof window === "undefined") return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						this.preloadedRoutes.add(href);
						importFn().catch(console.error);
						observer.disconnect();
					}
				});
			},
			{ rootMargin: "100px" },
		);

		// Find links to this route and observe them
		const links = document.querySelectorAll(`a[href="${href}"]`);
		links.forEach((link) => observer.observe(link));
	}

	// Preload during browser idle time
	preloadOnIdle(importFns: Array<() => Promise<any>>) {
		if (typeof window === "undefined") return;

		const preloadNext = () => {
			const nextImport = importFns.shift();
			if (!nextImport) return;

			nextImport()
				.then(() => {
					if (importFns.length > 0) {
						// Continue preloading other components
						if ("requestIdleCallback" in window) {
							(window as any).requestIdleCallback(preloadNext);
						} else {
							setTimeout(preloadNext, 100);
						}
					}
				})
				.catch(console.error);
		};

		if ("requestIdleCallback" in window) {
			(window as any).requestIdleCallback(preloadNext);
		} else {
			setTimeout(preloadNext, 1000); // Wait a bit before starting
		}
	}
}

// Bundle chunk naming for better caching
export function getChunkName(componentPath: string): string {
	const segments = componentPath.split("/");
	const filename = segments[segments.length - 1];
	return filename.replace(/\.(tsx?|jsx?)$/, "").toLowerCase();
}

// Analyze and optimize bundle splitting
export function analyzeBundleSplitting() {
	const analysis = {
		criticalRoutes: ROUTE_PRIORITIES.CRITICAL,
		lazyLoadedComponents: ["CreativeHero (3D Scene)", "AdminPanel", "ChartComponents", "HeavyAnimations"],
		estimatedSavings: {
			initialBundle: "~600KB (Three.js moved to lazy chunk)",
			adminRoutes: "~200KB (Admin components split)",
			charts: "~150KB (Chart libraries lazy loaded)",
			animations: "~100KB (Heavy animations deferred)",
		},
		recommendations: [
			"Implement route-based preloading",
			"Use intersection observer for viewport-based loading",
			"Defer non-critical animations",
			"Split admin functionality into separate chunks",
		],
	};

	return analysis;
}

// Export singleton instance
export const smartPreloader = SmartPreloader.getInstance();
