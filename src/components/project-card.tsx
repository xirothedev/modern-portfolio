"use client";

import { generateProjectSlug } from "@/lib/project-utils";
import { cn } from "@/lib/utils";
import { ArrowUpRight, GitFork, Github, Star } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { GitHubInfoBadge } from "./github-info-badge";
import { LanguageBar } from "./language-bar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

interface ProjectCardProps {
	title: string;
	description: string;
	tags: string[];
	image: string;
	repoUrl: string;
	demoUrl?: string;
	stars?: number;
	forks?: number;
	language?: string | null;
	languages?: { [key: string]: number };
	lastUpdated?: string;
	isFromGitHub?: boolean;
	repoName?: string;
}

function ProjectCardComponent({
	title,
	description,
	tags,
	image,
	demoUrl,
	repoUrl,
	stars = 0,
	forks = 0,
	languages = {},
	isFromGitHub = false,
	repoName,
}: ProjectCardProps) {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const isComingSoon = !demoUrl || demoUrl === "#";

	// Generate project slug for detail page link
	const projectSlug = repoName
		? generateProjectSlug({
				title,
				repoName,
				description,
				tags,
				image,
				repoUrl,
				demoUrl,
				stars: stars || 0,
				forks: forks || 0,
				language: null,
				languages,
				lastUpdated: "",
				isFromGitHub: isFromGitHub || false,
			})
		: null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
			className={cn("group", isComingSoon && "opacity-60")}
		>
			<div
				className={cn(
					"relative h-full overflow-hidden rounded-xl border bg-zinc-800/50 backdrop-blur-xs transition-all duration-300",
					isComingSoon
						? "cursor-not-allowed border-zinc-600/30 bg-zinc-800/30"
						: "border-zinc-700/50 group-hover:border-purple-500/50",
				)}
				onMouseEnter={() => !isComingSoon && setIsHovered(true)}
				onMouseLeave={() => !isComingSoon && setIsHovered(false)}
			>
				<div className="absolute -inset-1 rounded-xl bg-linear-to-r from-purple-500/10 to-pink-500/10 opacity-25 blur-sm transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>

				<div className="relative flex h-full flex-col">
					<div className="relative h-48 overflow-hidden">
						<div className="absolute inset-0 z-10 bg-linear-to-b from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

						{!isComingSoon && (
							<Dialog>
								<DialogTrigger asChild>
									<button
										className="absolute inset-0 z-20 h-full w-full cursor-pointer border-0 bg-transparent p-0"
										onClick={(e) => e.stopPropagation()}
										aria-label={`View ${title} project details`}
									>
										<Image
											src={image || "/placeholder.svg"}
											alt={title}
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											height={0}
											width={0}
											className={cn(
												"h-full w-full object-cover object-top transition-transform duration-700",
												isHovered && "scale-110",
											)}
										/>
									</button>
								</DialogTrigger>
								<DialogContent
									showCloseButton={false}
									className="max-h-[90vh] !w-[95vw] !max-w-[95vw] overflow-hidden border-zinc-700/50 bg-zinc-900/95 p-0 backdrop-blur-sm"
								>
									<DialogTitle className="sr-only">{title}</DialogTitle>
									<div className="relative h-full max-h-[90vh] w-full overflow-y-auto">
										<Image
											src={image || "/placeholder.svg"}
											alt={title}
											sizes="100vw"
											height={0}
											width={0}
											className="h-auto w-full object-contain"
										/>
										<div className="sticky right-0 bottom-0 left-0 border-t border-zinc-700/50 bg-black/60 p-4 backdrop-blur-sm">
											<h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
											<p className="text-sm text-zinc-300">{description}</p>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						)}
					</div>

					<div className="flex h-full flex-col p-6">
						{/* Top content - title and description */}
						<div className="flex flex-1 flex-col">
							<h3 className="mb-2 line-clamp-2 text-xl font-bold">{title}</h3>
							<p className="line-clamp-3 flex-1 text-zinc-400">{description}</p>
						</div>

						{/* Bottom content - tags, stats, and buttons */}
						<div className="mt-6 space-y-4">
							{/* Tags */}
							<div>
								<div className="mb-2 flex flex-wrap gap-2">
									{tags.map((tag, index) => (
										<Badge
											key={index}
											variant="secondary"
											className="bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700"
										>
											{tag}
										</Badge>
									))}
								</div>
								<GitHubInfoBadge isFromGitHub={isFromGitHub} />
							</div>

							{/* GitHub Stats */}
							{!isComingSoon && (stars > 0 || forks > 0 || Object.keys(languages).length > 0) && (
								<div className="space-y-3">
									{/* Stars and Forks */}
									{(stars > 0 || forks > 0) && (
										<div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
											{stars > 0 && (
												<div className="flex items-center gap-1">
													<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
													<span>{stars.toLocaleString()}</span>
												</div>
											)}
											{forks > 0 && (
												<div className="flex items-center gap-1">
													<GitFork className="h-3 w-3" />
													<span>{forks.toLocaleString()}</span>
												</div>
											)}
										</div>
									)}

									{/* Language Bar */}
									<LanguageBar languages={languages} />
								</div>
							)}

							{/* Buttons */}
							<div className="flex flex-col gap-2 border-t border-zinc-700/50 pt-4">
								{/* Top row - Code and View Details */}
								<div className="flex gap-2">
									<Button
										variant="ghost"
										size="sm"
										className="flex-1 text-zinc-400 hover:bg-zinc-700/50 hover:text-white"
										asChild
									>
										<Link href={repoUrl} target="_blank" rel="noopener noreferrer">
											<Github className="mr-2 h-4 w-4" />
											Code
										</Link>
									</Button>

									{projectSlug && (
										<Button
											variant="outline"
											size="sm"
											className="flex-1 border-zinc-600 hover:border-purple-500 hover:bg-purple-500/10"
											asChild
										>
											<Link href={`/projects/${projectSlug}`}>
												<ArrowUpRight className="mr-2 h-4 w-4" />
												Details
											</Link>
										</Button>
									)}
								</div>

								{/* Bottom row - Live Demo */}
								<Button
									size="sm"
									disabled={isComingSoon}
									className={cn(
										"w-full border-0",
										isComingSoon
											? "cursor-not-allowed! bg-zinc-600/50 text-zinc-400"
											: "bg-linear-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500",
									)}
									asChild
								>
									{!isComingSoon ? (
										<Link href={demoUrl} target="_blank" rel="noopener noreferrer">
											Live Demo
											<ArrowUpRight className="ml-2 h-4 w-4" />
										</Link>
									) : (
										<div>
											Coming Soon
											<ArrowUpRight className="ml-2 h-4 w-4" />
										</div>
									)}
								</Button>
							</div>
						</div>
					</div>

					<div className="absolute top-3 right-3 z-20">
						<div
							className={cn(
								"h-3 w-3 rounded-full transition-colors duration-300",
								isComingSoon ? "bg-yellow-500" : isHovered ? "bg-green-500" : "bg-zinc-500",
							)}
						></div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export const ProjectCard = memo(ProjectCardComponent);
