"use client";

import { motion } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const experiences = [
	{
		title: "System Architect",
		company: "The Terminal Viet Nam",
		period: "2025 - Now",
		description:
			"Building a full-stack social media platform with microservices architecture. Using NestJS, GraphQL, Prisma, Redis and Docker. Learning about distributed system design and scalability.",
		technologies: ["NestJS", "GraphQL", "Prisma", "Redis", "Docker", "Microservices"],
		phase: "Phase V: Towards Large Scale",
		phaseDescription: "Transitioning from developer to system architect",
	},
	{
		title: "Full-Stack Developer",
		company: "Personal Projects",
		period: "2025 - Now",
		description:
			"Currently diving deep into both frontend and backend development simultaneously. Gradually becoming proficient in frontend technologies such as React/Next.js, TypeScript, TailwindCSS, and Shadcn UI, while also developing the backend using Node.js, Express, NestJS, and modern backend tools.",
		technologies: ["React", "Next.js", "TypeScript", "TailwindCSS", "Shadcn UI", "Node.js", "Express", "NestJs"],
		phase: "Phase IV: Simultaneous Deep Learning",
		phaseDescription: "Parallel development of frontend and backend",
	},
	{
		title: "Frontend Developer",
		company: "Personal Projects",
		period: "2024 - 2025",
		description:
			"Specializing in frontend development with React and Next.js. Focusing on modern UI/UX, accessibility and performance. Building design systems with Shadcn UI and TailwindCSS.",
		technologies: ["React", "Next.js", "TypeScript", "TailwindCSS", "Shadcn UI"],
		phase: "Phase III: Frontend Specialization",
		phaseDescription: "Mastering the modern React ecosystem",
	},
	{
		title: "Backend Developer",
		company: "Discord Ecosystem",
		period: "2024 - Now",
		description:
			"Starting with Discord bot development to learn backend. Building music bots, server management bots and Discord.js v14 templates. Learning event-driven architecture, API integration and database management.",
		technologies: ["Node.js", "TypeScript", "PostgreSQL", "Discord.js", "API Integration"],
		phase: "Phase II: Backend Exploration",
		phaseDescription: "From Discord.js to backend development",
	},
	{
		title: "Basic Web Developer",
		company: "Elaina Team",
		period: "24/07/2023 - 2024",
		description:
			"Starting the programming journey with courses from F8. Learning HTML, CSS, JavaScript basics and React fundamentals. Building a solid foundation for web development.",
		technologies: ["HTML", "CSS", "JavaScript", "React Basics"],
		phase: "Phase I: Web Foundation",
		phaseDescription: "Beginning with basic web development",
	},
];

export function Timeline() {
	const isMobile = useIsMobile();

	return (
		<div className="relative space-y-16">
			{/* Timeline line for desktop */}
			{!isMobile && (
				<div className="absolute left-1/2 h-full w-0.5 -translate-x-px transform bg-gradient-to-b from-blue-500 via-purple-500 to-purple-600"></div>
			)}

			{experiences.map((experience, index) => (
				<div
					key={index}
					className={cn(
						"relative z-10 flex items-center",
						index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row",
					)}
				>
					<motion.div
						className={cn("w-full md:w-1/2", index % 2 === 0 ? "md:pl-10" : "md:pr-10")}
						initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: index * 0.1 }}
						viewport={{ once: true }}
					>
						<div className="relative overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-8 backdrop-blur-sm transition-all duration-500 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10">
							{/* Gradient background effect */}
							<div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-25 blur-sm transition duration-1000 hover:opacity-100 hover:duration-200"></div>

							<div className="relative">
								{/* Phase indicator */}
								<div className="mb-4">
									<span className="inline-block rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
										{experience.phase}
									</span>
								</div>

								{/* Title and company */}
								<h3 className="mb-2 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-2xl font-bold text-transparent">
									{experience.title}
								</h3>
								<div className="mb-4 font-medium text-zinc-400">
									{experience.company} | {experience.period}
								</div>

								{/* Phase description */}
								<p className="mb-4 text-sm text-zinc-500 italic">{experience.phaseDescription}</p>

								{/* Description */}
								<p className="mb-6 leading-relaxed text-zinc-300">{experience.description}</p>

								{/* Technologies */}
								<div className="flex flex-wrap gap-2">
									{experience.technologies.map((tech, techIndex) => (
										<span
											key={techIndex}
											className="rounded-lg border border-zinc-600/50 bg-zinc-700/50 px-3 py-1 text-xs font-medium text-zinc-300 transition-colors duration-200 hover:border-purple-500/50"
										>
											{tech}
										</span>
									))}
								</div>
							</div>
						</div>
					</motion.div>

					{/* Timeline dot for desktop */}
					{!isMobile && (
						<div className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center">
							<motion.div
								className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25"
								initial={{ scale: 0 }}
								whileInView={{ scale: 1 }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<div className="h-3 w-3 rounded-full bg-white shadow-sm"></div>
							</motion.div>
						</div>
					)}

					{/* Mobile timeline dot */}
					{isMobile && (
						<div className="absolute top-8 left-0 flex -translate-x-1/2 items-center justify-center">
							<motion.div
								className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25"
								initial={{ scale: 0 }}
								whileInView={{ scale: 1 }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<div className="h-2 w-2 rounded-full bg-white shadow-sm"></div>
							</motion.div>
						</div>
					)}
				</div>
			))}

			{/* Career progression summary */}
			<motion.div
				className="mt-16 rounded-2xl border border-zinc-700/50 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 p-8 backdrop-blur-sm"
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				viewport={{ once: true }}
			>
				<h3 className="mb-4 text-xl font-bold text-white">Career Development Path</h3>
				<div className="grid gap-6 text-sm text-zinc-300 md:grid-cols-2">
					<div>
						<h4 className="mb-2 font-semibold text-purple-300">Key Lessons:</h4>
						<ul className="space-y-2">
							<li>• Start with a solid foundation (HTML/CSS/JS)</li>
							<li>• Learn backend through real projects (Discord bots)</li>
							<li>• Develop frontend and backend simultaneously</li>
							<li>• Let ambitious projects drive learning</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-2 font-semibold text-pink-300">Development Model:</h4>
						<ul className="space-y-2">
							<li>• Systematic learning from basics to advanced</li>
							<li>• Apply knowledge to real projects</li>
							<li>• Specialize and expand simultaneously</li>
							<li>• From web developer to system architect</li>
						</ul>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
