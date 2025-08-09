"use client";

import { motion } from "motion/react";
import { ArrowLeft, Filter, Search } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGitHubProjects } from "@/hooks/use-github-projects";
import { ProjectCardSkeleton } from "@/components/loading-skeleton";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
	const { projects, loading, error } = useGitHubProjects();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTag, setSelectedTag] = useState<string | null>(null);

	// Get all unique tags from projects
	const allTags = useMemo(() => {
		const tags = new Set<string>();
		projects.forEach((project) => {
			project.tags.forEach((tag) => tags.add(tag));
		});
		return Array.from(tags).sort();
	}, [projects]);

	// Filter projects based on search term and selected tag
	const filteredProjects = useMemo(() => {
		return projects.filter((project) => {
			const matchesSearch =
				project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.description.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesTag = !selectedTag || project.tags.includes(selectedTag);

			return matchesSearch && matchesTag;
		});
	}, [projects, searchTerm, selectedTag]);

	if (error) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="container mx-auto px-4 py-8">
					<div className="text-center">
						<h1 className="mb-4 text-2xl font-bold text-red-400">Error Loading Projects</h1>
						<p className="text-zinc-400">{error}</p>
						<Link href="/">
							<Button variant="outline" className="mt-4">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Home
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<div className="border-b border-zinc-800">
				<div className="container mx-auto px-4 py-8">
					<div className="mb-6 flex items-center justify-between">
						<Link href="/">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Home
							</Button>
						</Link>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
							All Projects
						</h1>
						<p className="max-w-2xl text-xl text-zinc-400">
							Explore my collection of projects, from web applications to open-source contributions.
						</p>
					</motion.div>
				</div>
			</div>

			{/* Filters */}
			<div className="container mx-auto px-4 py-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="mb-8 flex flex-col gap-4 md:flex-row"
				>
					{/* Search */}
					<div className="relative flex-1">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-400" />
						<Input
							placeholder="Search projects..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="border-zinc-700 bg-zinc-900/50 pl-10 focus:border-purple-500"
						/>
					</div>

					{/* Tag Filter */}
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-zinc-400" />
						<div className="flex flex-wrap gap-2">
							<Badge
								variant={selectedTag === null ? "default" : "secondary"}
								className={cn(
									"cursor-pointer transition-colors",
									!selectedTag
										? "bg-purple-500 hover:bg-purple-600"
										: "bg-zinc-200/80 hover:bg-zinc-100",
								)}
								onClick={() => setSelectedTag(null)}
							>
								All
							</Badge>
							{allTags.slice(0, 8).map((tag) => (
								<Badge
									key={tag}
									variant={selectedTag === tag ? "default" : "secondary"}
									className={cn(
										"cursor-pointer transition-colors",
										selectedTag === tag
											? "bg-purple-500 hover:bg-purple-600"
											: "bg-zinc-200/80 hover:bg-zinc-100",
									)}
									onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
								>
									{tag}
								</Badge>
							))}
						</div>
					</div>
				</motion.div>

				{/* Results Count */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3, delay: 0.2 }}
					className="mb-6"
				>
					<p className="text-zinc-400">
						{loading
							? "Loading..."
							: `${filteredProjects.length} project${filteredProjects.length !== 1 ? "s" : ""} found`}
						{selectedTag && (
							<span className="ml-2">
								filtered by{" "}
								<Badge variant="outline" className="ml-1">
									{selectedTag}
								</Badge>
							</span>
						)}
					</p>
				</motion.div>
			</div>

			{/* Projects Grid */}
			<div className="container mx-auto px-4 pb-16">
				{loading ? (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, index) => (
							<ProjectCardSkeleton key={index} />
						))}
					</div>
				) : filteredProjects.length > 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
					>
						{filteredProjects.map((project, index) => (
							<motion.div
								key={project.repoName}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="h-full"
							>
								<ProjectCard
									title={project.title}
									description={project.description}
									tags={project.tags}
									image={project.image}
									repoUrl={project.repoUrl}
									demoUrl={project.demoUrl}
									stars={project.stars}
									forks={project.forks}
									language={project.language}
									languages={project.languages}
									lastUpdated={project.lastUpdated}
									isFromGitHub={project.isFromGitHub}
									repoName={project.repoName}
								/>
							</motion.div>
						))}
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="py-16 text-center"
					>
						<div className="mb-4 text-6xl">🔍</div>
						<h3 className="mb-2 text-xl font-semibold">No projects found</h3>
						<p className="mb-4 text-zinc-400">Try adjusting your search terms or removing filters.</p>
						<Button
							variant="outline"
							onClick={() => {
								setSearchTerm("");
								setSelectedTag(null);
							}}
						>
							Clear Filters
						</Button>
					</motion.div>
				)}
			</div>
		</div>
	);
}
