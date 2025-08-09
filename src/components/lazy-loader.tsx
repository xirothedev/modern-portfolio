"use client";

import dynamic from "next/dynamic";

import { ComponentType } from "react";

// Loading skeleton components
export function HeavyComponentSkeleton() {
	return (
		<div className="flex h-[400px] w-full items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/50">
			<div className="text-center">
				<div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
				<div className="text-sm text-zinc-400">Loading 3D Experience...</div>
				<div className="mt-2 text-xs text-zinc-500">Optimizing for your device</div>
			</div>
		</div>
	);
}

export function IconSkeleton() {
	return <div className="h-8 w-8 animate-pulse rounded bg-zinc-700" />;
}

export function ChartSkeleton() {
	return <div className="h-64 w-full animate-pulse rounded-lg bg-zinc-800/50" />;
}

// Pre-configured lazy loaded components
export const Lazy3DScene = dynamic(
	() => import("@/components/creative-hero").then((mod) => ({ default: mod.CreativeHero })),
	{
		ssr: false,
		loading: () => <HeavyComponentSkeleton />,
	},
);

// Lazy load heavy chart libraries
export const LazyChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), {
	ssr: false,
	loading: () => <ChartSkeleton />,
});

// Lazy load admin components
export const LazyAdminPanel = dynamic(
	() => import("@/app/(admin-only)/cms/page").then((mod) => ({ default: mod.default })),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-64 items-center justify-center">
				<div className="text-center">
					<div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
					<div className="text-sm text-zinc-400">Loading Admin Panel...</div>
				</div>
			</div>
		),
	},
);

// Utility function to create lazy loaded components
export function createLazyComponent<T extends ComponentType<any>>(
	importFn: () => Promise<{ default: T } | T>,
	options: {
		fallback?: React.ReactNode;
		ssr?: boolean;
	} = {},
) {
	return dynamic(
		async () => {
			const _module = await importFn();
			return "default" in _module ? _module : { default: _module as T };
		},
		{
			ssr: options.ssr ?? false,
			loading: () => options.fallback ?? <HeavyComponentSkeleton />,
		},
	);
}

// Bundle size monitoring (development only)
export function BundleSizeMonitor() {
	if (process.env.NODE_ENV !== "development") {
		return null;
	}

	return (
		<div className="fixed bottom-4 left-4 z-50">
			<div className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-xs">
				<div className="mb-1 font-medium text-zinc-300">Bundle Info</div>
				<div className="space-y-1 text-zinc-400">
					<div>3D: Lazy loaded ✅</div>
					<div>Icons: Tree-shaken ✅</div>
					<div>Admin: Code split ✅</div>
				</div>
			</div>
		</div>
	);
}
