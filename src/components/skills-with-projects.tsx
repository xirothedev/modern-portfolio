"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSkills, useSkillsCache } from "@/hooks/use-skills";
import { cn } from "@/lib/utils";
import { ExternalLink, Github, Loader2, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export function SkillsWithProjects() {
	const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
	const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

	// Fetch skills data from GitHub API
	const { skills: skillsData, loading, error, isValidating, metadata } = useSkills();
	const { refreshSkills } = useSkillsCache();

	const handleSkillClick = (skillName: string) => {
		setSelectedSkill(selectedSkill === skillName ? null : skillName);
	};

	const getSkillProjects = (skillName: string) => {
		return skillsData.find((skill) => skill.name === skillName)?.projects || [];
	};

	const getSkillData = (skillName: string) => {
		return skillsData.find((skill) => skill.name === skillName);
	};

	// Show loading state
	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="flex items-center gap-3">
					<Loader2 className="h-6 w-6 animate-spin text-purple-500" />
					<p className="text-zinc-400">Loading skills from GitHub...</p>
				</div>
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className="py-12 text-center">
				<div className="space-y-4">
					<p className="text-red-400">Failed to load skills: {error}</p>
					<Button
						onClick={() => refreshSkills()}
						variant="outline"
						className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	// Show empty state
	if (!skillsData || skillsData.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-zinc-400">
					No skills found. Make sure you have repositories with topics and languages.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header with metadata */}
			{metadata && (
				<div className="space-y-2 text-center">
					<p className="text-sm text-zinc-500">
						Found {metadata.totalSkills} skills from {metadata.totalRepositories} original repositories
						{metadata.excludesForks && <span className="text-xs text-zinc-600"> (forks excluded)</span>}
					</p>
					{isValidating && (
						<div className="flex items-center justify-center gap-2">
							<Loader2 className="h-4 w-4 animate-spin text-purple-500" />
							<span className="text-xs text-zinc-400">Updating...</span>
						</div>
					)}
				</div>
			)}

			{/* Skills Badges Grid */}
			<div className="flex flex-wrap justify-center gap-3">
				{skillsData.map((skill) => (
					<motion.div
						key={skill.name}
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3 }}
						viewport={{ once: true }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Badge
							variant="secondary"
							className={cn(
								"relative cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300",
								selectedSkill === skill.name
									? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg"
									: "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white",
								hoveredSkill === skill.name && "shadow-md",
							)}
							onClick={() => handleSkillClick(skill.name)}
							onMouseEnter={() => setHoveredSkill(skill.name)}
							onMouseLeave={() => setHoveredSkill(null)}
						>
							<span className="relative z-10 flex items-center gap-2">
								<div className={cn("h-2 w-2 rounded-full", skill.color)} />
								{skill.name}
								<span className="text-xs opacity-70">({skill.projects.length})</span>
							</span>
						</Badge>
					</motion.div>
				))}
			</div>

			{/* Selected Skill Details */}
			<AnimatePresence mode="wait">
				{selectedSkill && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="mt-8"
					>
						<Card className="border-zinc-700/50 bg-zinc-800/50 backdrop-blur-xs">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div
											className={cn("h-4 w-4 rounded-full", getSkillData(selectedSkill)?.color)}
										/>
										<CardTitle className="text-2xl text-white">{selectedSkill}</CardTitle>
										<Badge variant="outline" className="border-purple-400 text-purple-400">
											{getSkillData(selectedSkill)?.type}
										</Badge>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setSelectedSkill(null)}
										className="text-zinc-400 hover:bg-white/30"
									>
										✕
									</Button>
								</div>
								<CardDescription className="text-zinc-400">
									Projects utilizing {selectedSkill} ({getSkillProjects(selectedSkill).length}{" "}
									projects)
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
									{getSkillProjects(selectedSkill).map((project, index) => (
										<motion.div
											key={`${selectedSkill}-${project.repoUrl}-${index}`}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: index * 0.1 }}
										>
											<Card className="h-full border-zinc-700/50 bg-zinc-900/50 transition-all duration-300 hover:border-purple-500/50">
												<CardHeader className="pb-3">
													<CardTitle className="flex items-center justify-between text-lg text-white">
														<div className="min-w-0 flex-1">
															<div className="truncate">{project.name}</div>
															<div className="mt-1 flex items-center gap-2">
																{project.language && (
																	<Badge
																		variant="outline"
																		className="border-zinc-600 text-xs text-zinc-400"
																	>
																		{project.language}
																	</Badge>
																)}
																{project.private && (
																	<Badge
																		variant="outline"
																		className="border-orange-600 text-xs text-orange-400"
																	>
																		Private
																	</Badge>
																)}
																<div className="flex items-center gap-1 text-xs text-zinc-500">
																	<span>⭐ {project.stars}</span>
																	<span>🍴 {project.forks}</span>
																</div>
															</div>
														</div>
														<div className="ml-2 flex gap-2">
															<Button
																variant="ghost"
																size="icon"
																className={cn(
																	"h-6 w-6 transition-colors",
																	project.private
																		? "cursor-not-allowed text-zinc-600"
																		: "text-zinc-400 hover:bg-purple-500/10 hover:text-purple-400",
																)}
																disabled={project.private}
																asChild={!project.private}
															>
																{project.private ? (
																	<div title="Private Repository">
																		<Github className="h-3 w-3" />
																	</div>
																) : (
																	<Link
																		href={project.repoUrl}
																		target="_blank"
																		rel="noopener noreferrer"
																		title="View Repository"
																	>
																		<Github className="h-3 w-3" />
																	</Link>
																)}
															</Button>
															{project.demoUrl && (
																<Button
																	variant="ghost"
																	size="icon"
																	className="h-6 w-6 text-zinc-400 transition-colors hover:bg-cyan-500/10 hover:text-white"
																	asChild
																>
																	<Link
																		href={project.demoUrl}
																		target="_blank"
																		rel="noopener noreferrer"
																		title="View Demo"
																	>
																		<ExternalLink className="h-3 w-3" />
																	</Link>
																</Button>
															)}
														</div>
													</CardTitle>
												</CardHeader>
												<CardContent className="pt-0">
													<p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
														{project.description}
													</p>
													<div className="mt-2 text-xs text-zinc-500">
														Updated: {new Date(project.lastUpdated).toLocaleDateString()}
													</div>
												</CardContent>
											</Card>
										</motion.div>
									))}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Instructions */}
			<motion.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.5 }}
				viewport={{ once: true }}
				className="space-y-2 text-center"
			>
				<p className="text-sm text-zinc-500">
					Click on any skill badge to see the original GitHub repositories where it was used
				</p>
				{metadata && (
					<div className="flex items-center justify-center gap-4 text-xs text-zinc-600">
						<span className="group">
							Data from{" "}
							<Link
								className="rounded-full px-1 py-0.5 group-hover:bg-white/20 group-hover:text-white"
								href={`https://github.com/${metadata.username}`}
							>
								@{metadata.username}
							</Link>
						</span>
						<Button
							onClick={() => refreshSkills()}
							variant="ghost"
							size="sm"
							className="h-6 px-2 text-xs hover:bg-white/20 hover:text-white"
							disabled={isValidating}
						>
							<RefreshCw className={cn("mr-1 h-3 w-3", isValidating && "animate-spin")} />
							Refresh
						</Button>
					</div>
				)}
			</motion.div>
		</div>
	);
}
