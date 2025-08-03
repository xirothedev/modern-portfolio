"use client";

import { ArrowLeft, ArrowUpRight, Clock, Code2, GitFork, Github, Globe, Star } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useMemo } from "react";

import { GitHubInfoBadge } from "@/components/github-info-badge";
import { LanguageBar } from "@/components/language-bar";
import { ReadmeViewer } from "@/components/preview/readme-viewer";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGitHubProjects } from "@/hooks/use-github-projects";
import {
	findProjectBySlug,
	formatLastUpdated,
	getDominantLanguage,
	getRelatedProjects,
	getTotalLinesOfCode,
} from "@/lib/project-utils";
interface ProjectDetailPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
	const { projects, loading, error } = useGitHubProjects();
	const { slug } = use(params);

	const project = useMemo(() => {
		if (!projects.length) return null;
		return findProjectBySlug(projects, slug);
	}, [projects, slug]);

	const relatedProjects = useMemo(() => {
		if (!project || !projects.length) return [];
		return getRelatedProjects(project, projects, 3);
	}, [project, projects]);

	const projectStats = useMemo(() => {
		if (!project) return null;

		const dominantLanguage = getDominantLanguage(project.languages);
		const totalLines = getTotalLinesOfCode(project.languages);

		return {
			dominantLanguage,
			totalLines,
			languageCount: Object.keys(project.languages).length,
		};
	}, [project]);

	if (loading) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="container mx-auto px-4 py-8">
					<div className="animate-pulse">
						<div className="mb-8 h-8 w-32 rounded bg-zinc-800"></div>
						<div className="mb-4 h-12 w-3/4 rounded bg-zinc-800"></div>
						<div className="mb-8 h-6 w-1/2 rounded bg-zinc-800"></div>
						<div className="mb-8 h-64 rounded bg-zinc-800"></div>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="h-32 rounded bg-zinc-800"></div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="container mx-auto px-4 py-8">
					<div className="text-center">
						<h1 className="mb-4 text-2xl font-bold text-red-400">Error Loading Project</h1>
						<p className="mb-4 text-zinc-400">{error}</p>
						<Link href="/projects">
							<Button variant="outline">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Projects
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (!project) {
		notFound();
	}

	const isComingSoon = !project.demoUrl || project.demoUrl === "#";

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<div className="border-b border-zinc-800">
				<div className="container mx-auto px-4 py-8">
					<Link href="/projects">
						<Button variant="ghost" size="sm" className="mb-6">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Projects
						</Button>
					</Link>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="flex flex-col gap-8 lg:flex-row"
					>
						{/* Project Image */}
						<div className="lg:w-1/2">
							<div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-700/50">
								<Image
									src={project.image || "/placeholder.svg"}
									alt={project.title}
									fill
									className="object-cover object-top"
									sizes="(max-width: 1024px) 100vw, 50vw"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
							</div>
						</div>

						{/* Project Info */}
						<div className="space-y-6 lg:w-1/2">
							<div>
								<h1 className="mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
									{project.title}
								</h1>
								<p className="text-xl leading-relaxed text-zinc-300">{project.description}</p>
							</div>

							{/* Tags */}
							<div className="space-y-3">
								<div className="flex flex-wrap gap-2">
									{project.tags.map((tag, index) => (
										<Badge
											key={index}
											variant="secondary"
											className="bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700"
										>
											{tag}
										</Badge>
									))}
								</div>
								<GitHubInfoBadge isFromGitHub={project.isFromGitHub} />
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-4">
								<Button
									variant="outline"
									className="border-zinc-600 hover:border-purple-500 hover:bg-purple-500/10"
									asChild
								>
									<Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
										<Github className="mr-2 h-4 w-4" />
										View Code
									</Link>
								</Button>

								{!isComingSoon && (
									<Button
										className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500"
										asChild
									>
										<Link href={project.demoUrl!} target="_blank" rel="noopener noreferrer">
											<Globe className="mr-2 h-4 w-4" />
											Live Demo
											<ArrowUpRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
								)}
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Project Stats */}
			<div className="container mx-auto px-4 py-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
				>
					{/* GitHub Stats */}
					<Card className="border-zinc-700/50 bg-zinc-900/50">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center text-sm font-medium text-zinc-400">
								<Star className="mr-2 h-4 w-4" />
								GitHub Stars
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-yellow-400">{project.stars.toLocaleString()}</div>
						</CardContent>
					</Card>

					<Card className="border-zinc-700/50 bg-zinc-900/50">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center text-sm font-medium text-zinc-400">
								<GitFork className="mr-2 h-4 w-4" />
								Forks
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-400">{project.forks.toLocaleString()}</div>
						</CardContent>
					</Card>

					<Card className="border-zinc-700/50 bg-zinc-900/50">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center text-sm font-medium text-zinc-400">
								<Code2 className="mr-2 h-4 w-4" />
								Languages
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-400">{projectStats?.languageCount || 0}</div>
							{projectStats?.dominantLanguage && (
								<div className="mt-1 text-sm text-zinc-400">
									Primary: {projectStats.dominantLanguage}
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="border-zinc-700/50 bg-zinc-900/50">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center text-sm font-medium text-zinc-400">
								<Clock className="mr-2 h-4 w-4" />
								Last Updated
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-sm font-medium text-purple-400">
								{formatLastUpdated(project.lastUpdated)}
							</div>
							<div className="mt-1 text-xs text-zinc-500">
								{new Date(project.lastUpdated).toLocaleDateString()}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Language Breakdown */}
				{Object.keys(project.languages).length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="mb-12"
					>
						<Card className="border-zinc-700/50 bg-zinc-900/50">
							<CardHeader>
								<CardTitle className="flex items-center text-white">
									<Code2 className="mr-2 h-5 w-5" />
									Language Breakdown
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<LanguageBar languages={project.languages} showPercentages />
							</CardContent>
						</Card>
					</motion.div>
				)}

				{/* README Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.35 }}
					className="mb-12"
				>
					<ReadmeViewer repoUrl={project.repoUrl} projectTitle={project.title} />
				</motion.div>

				{/* Related Projects */}
				{relatedProjects.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.45 }}
					>
						<div className="mb-8 flex items-center justify-between">
							<h2 className="text-2xl font-bold">Related Projects</h2>
							<Link href="/projects">
								<Button variant="ghost" size="sm">
									View All
									<ArrowUpRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
						</div>

						<div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{relatedProjects.map((relatedProject, index) => (
								<motion.div
									key={relatedProject.repoName}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
									className="h-full"
								>
									<ProjectCard
										title={relatedProject.title}
										description={relatedProject.description}
										tags={relatedProject.tags}
										image={relatedProject.image}
										repoUrl={relatedProject.repoUrl}
										demoUrl={relatedProject.demoUrl}
										stars={relatedProject.stars}
										forks={relatedProject.forks}
										language={relatedProject.language}
										languages={relatedProject.languages}
										lastUpdated={relatedProject.lastUpdated}
										isFromGitHub={relatedProject.isFromGitHub}
										repoName={relatedProject.repoName}
									/>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
}
