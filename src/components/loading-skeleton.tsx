import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

export function RepositoryManagerSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header area */}
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div className="relative max-w-md flex-1">
					<Input disabled className="animate-pulse border-zinc-700/50 bg-zinc-800/50 pl-10 text-white" />
				</div>
				<Button disabled className="animate-pulse bg-gradient-to-r from-purple-500/50 to-pink-500/50">
					Add Project
				</Button>
			</div>

			{/* Table area */}
			<div className="relative rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-white">Name</TableHead>
							<TableHead className="text-white">Slug</TableHead>
							<TableHead className="text-white">Created At</TableHead>
							<TableHead className="text-right text-white">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(5)].map((_, index) => (
							<TableRow key={index}>
								<TableCell>
									<div className="h-4 w-48 animate-pulse rounded bg-zinc-700/50" />
								</TableCell>
								<TableCell>
									<div className="h-4 w-32 animate-pulse rounded bg-zinc-700/50" />
								</TableCell>
								<TableCell>
									<div className="h-4 w-24 animate-pulse rounded bg-zinc-700/50" />
								</TableCell>
								<TableCell className="text-right">
									<div className="flex items-center justify-end gap-2">
										<div className="h-8 w-8 animate-pulse rounded bg-zinc-700/50" />
										<div className="h-8 w-8 animate-pulse rounded bg-zinc-700/50" />
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

export function TokenManagerSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header Actions */}
			<div className="flex items-center justify-end">
				<div className="h-10 w-32 animate-pulse rounded-md bg-gradient-to-r from-purple-500/50 to-pink-500/50" />
			</div>

			{/* Security Notice */}
			<div className="relative rounded-lg border border-red-700/50 bg-red-900/20 p-4">
				<div className="flex items-center gap-2">
					<div className="h-4 w-4 animate-pulse rounded-full bg-red-500/50" />
					<div className="h-4 w-64 animate-pulse rounded bg-red-500/50" />
				</div>
			</div>

			{/* Table */}
			<div className="relative rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-white">Token ID</TableHead>
							<TableHead className="text-white">Status</TableHead>
							<TableHead className="text-white">Scope</TableHead>
							<TableHead className="text-white">Created / Used At</TableHead>
							<TableHead className="text-white">Used By</TableHead>
							<TableHead className="text-right text-white">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(3)].map((_, index) => (
							<TableRow key={index}>
								<TableCell>
									<div className="h-4 w-32 animate-pulse rounded bg-zinc-700/50" />
								</TableCell>
								<TableCell>
									<div className="h-6 w-20 animate-pulse rounded-full bg-zinc-700/50" />
								</TableCell>
								<TableCell>
									<div className="h-6 w-24 animate-pulse rounded-full bg-zinc-700/50" />
								</TableCell>
								<TableCell>
									<div className="space-y-2">
										<div className="h-4 w-28 animate-pulse rounded bg-zinc-700/50" />
										<div className="h-4 w-28 animate-pulse rounded bg-zinc-700/50" />
									</div>
								</TableCell>
								<TableCell>
									<div className="h-4 w-20 animate-pulse rounded bg-zinc-700/50" />
								</TableCell>
								<TableCell className="text-right">
									<div className="flex items-center justify-end gap-2">
										<div className="h-8 w-8 animate-pulse rounded bg-zinc-700/50" />
										<div className="h-8 w-8 animate-pulse rounded bg-zinc-700/50" />
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
