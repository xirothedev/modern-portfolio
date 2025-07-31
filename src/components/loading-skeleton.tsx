import { memo } from "react";

interface LoadingSkeletonProps {
	className?: string;
	lines?: number;
	height?: string;
	width?: string;
}

export const LoadingSkeleton = memo(function LoadingSkeleton({
	className = "",
	lines = 1,
	height = "h-4",
	width = "w-full",
}: LoadingSkeletonProps) {
	return (
		<div className={`space-y-2 ${className}`}>
			{Array.from({ length: lines }).map((_, index) => (
				<div key={index} className={`${height} ${width} animate-pulse rounded bg-zinc-700/50`} />
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

export const SkillsSkeleton = memo(function SkillsSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, index) => (
				<div key={index} className="h-32 animate-pulse rounded-xl bg-zinc-800/50">
					<div className="space-y-3 p-4">
						<div className="h-4 w-1/2 rounded bg-zinc-700/50"></div>
						<div className="h-3 w-3/4 rounded bg-zinc-700/50"></div>
						<div className="flex gap-2">
							<div className="h-6 w-12 rounded bg-zinc-700/50"></div>
							<div className="h-6 w-16 rounded bg-zinc-700/50"></div>
						</div>
					</div>
				</div>
			))}
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

export const RepositoryManagerSkeleton = memo(function RepositoryManagerSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div className="h-10 w-full max-w-md animate-pulse rounded-md bg-zinc-700/50" />
				<div className="h-10 w-32 animate-pulse rounded-md bg-zinc-700/50" />
			</div>
			<div className="space-y-4">
				{Array.from({ length: 3 }).map((_, index) => (
					<div key={index} className="relative rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-6">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex-1 space-y-2">
									<div className="h-6 w-48 animate-pulse rounded bg-zinc-700/50" />
									<div className="h-4 w-32 animate-pulse rounded bg-zinc-700/50" />
								</div>
								<div className="flex gap-2">
									<div className="h-8 w-16 animate-pulse rounded bg-zinc-700/50" />
									<div className="h-8 w-16 animate-pulse rounded bg-zinc-700/50" />
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});
