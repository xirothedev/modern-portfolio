import { cn } from "@/lib/utils";
import { memo } from "react";

interface LoadingSkeletonProps {
	className?: string;
	lines?: number;
	height?: string;
	width?: string;
}

export const LoadingSkeleton = memo(function LoadingSkeleton({
	className,
	lines = 1,
	height = "h-4",
	width = "w-full",
}: LoadingSkeletonProps) {
	return (
		<div className={cn("space-y-2", className)}>
			{Array.from({ length: lines }).map((_, index) => (
				<div key={index} className={cn(height, width, "animate-pulse rounded bg-zinc-700/50")} />
			))}
		</div>
	);
});

export const ProjectCardSkeleton = memo(function ProjectCardSkeleton() {
	return (
		<div className="h-80 animate-pulse rounded-xl bg-zinc-800/50">
			<div className="h-48 rounded-t-xl bg-zinc-700/50"></div>
			<div className="space-y-4 p-6">
				<div className="h-6 rounded bg-zinc-700/50"></div>
				<div className="h-4 w-3/4 rounded bg-zinc-700/50"></div>
				<div className="flex gap-2">
					<div className="h-6 w-16 rounded bg-zinc-700/50"></div>
					<div className="h-6 w-20 rounded bg-zinc-700/50"></div>
				</div>
			</div>
		</div>
	);
});

export const HeroSkeleton = memo(function HeroSkeleton() {
	return (
		<div className="flex aspect-square h-[400px] items-center justify-center md:h-[500px]">
			<div className="h-32 w-32 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
		</div>
	);
});
