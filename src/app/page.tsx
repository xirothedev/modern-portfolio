"use client";

import { ContactForm } from "@/components/contact-form";
import { ErrorBoundary } from "@/components/error-boundary";
import { FloatingNav } from "@/components/floating-nav";
import { GlowingEffect } from "@/components/glowing-effect";
import { HeroSkeleton, ProjectCardSkeleton } from "@/components/loading-skeleton";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SkillsWithProjects } from "@/components/skills-with-projects";
import { Testimonials, type TestimonialItem } from "@/components/testimonials";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { useGitHubProjects } from "@/hooks/use-github-projects";
import { createTimeline, stagger, text } from "animejs";
import { ArrowRight, Download, Facebook, Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const AnimatedName = dynamic(
	() => import("@/components/animated-name").then((mod) => ({ default: mod.AnimatedName })),
	{
		ssr: false,
	},
);

const CreativeHero = dynamic(
	() => import("@/components/creative-hero").then((mod) => ({ default: mod.CreativeHero })),
	{
		ssr: false,
		loading: () => <HeroSkeleton />,
	},
);

export default function Portfolio() {
	const { projects, loading, error } = useGitHubProjects();

	useEffect(() => {
		const { chars } = text.split("#description", {
			chars: {
				wrap: "clip",
				clone: "bottom",
			},
		});

		createTimeline().add(
			chars,
			{
				y: "-100%",
				loop: true,
				loopDelay: 3750,
				duration: 750,
				ease: "inOut(2)",
			},
			stagger(150, { from: "first" }),
		);
	}, []);

	return (
		<>
			<FloatingNav />

			{/* Hero Section */}
			<section className="relative flex min-h-screen items-center justify-center overflow-hidden">
				<div className="relative z-10 container grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
					<div className="space-y-6">
						<div className="inline-block">
							<div className="relative mt-4 mb-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-xs">
								<span className="relative z-10">Full Stack & Discord Bot Developer</span>
								<span className="absolute inset-0 animate-pulse rounded-full bg-linear-to-r from-purple-500/20 to-pink-500/20"></span>
							</div>
						</div>
						<h1 className="text-5xl font-bold tracking-tight md:text-7xl">
							<span className="block">Hi, I&apos;m</span>
							<AnimatedName />
						</h1>
						<p id="description" className="max-w-[600px] text-xl text-zinc-400">
							I craft exceptional digital experiences with code, creativity, and a passion for innovation.
						</p>
						<div className="flex flex-wrap gap-4 pt-4">
							<Button variant="primary" className="group relative overflow-hidden">
								<span className="relative z-10 flex items-center">
									View Projects{" "}
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</span>
								<span className="absolute inset-0 bg-linear-to-r from-pink-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
							</Button>
							<Button
								variant="outline"
								className="border-zinc-700 bg-transparent text-pink-500 hover:border-zinc-500 hover:text-pink-700"
							>
								Contact Me
							</Button>
						</div>
						<div className="flex gap-4 pt-4">
							{[
								{
									href: "https://github.com/xirothedev",
									target: "_blank",
									rel: "noopener noreferrer",
									icon: <Github className="h-5 w-5" />,
									label: "GitHub",
								},
								{
									href: "https://www.linkedin.com/in/xirothedev/",
									target: "_blank",
									rel: "noopener noreferrer",
									icon: <Linkedin className="h-5 w-5" />,
									label: "LinkedIn",
								},
								{
									href: "mailto:lethanhtrung.trungle@gmail.com",
									icon: <Mail className="h-5 w-5" />,
									label: "Email",
								},
								{
									href: "https://discord.com/users/1216624112139632711",
									target: "_blank",
									rel: "noopener noreferrer",
									icon: <MessageCircle className="h-5 w-5" />,
									label: "Discord",
								},
								{
									href: "https://www.facebook.com/xirothedev",
									target: "_blank",
									rel: "noopener noreferrer",
									icon: <Facebook className="h-5 w-5" />,
									label: "Facebook",
								},
							].map(({ href, target, rel, icon, label }) => (
								<Link key={label} href={href} target={target} rel={rel}>
									<Button
										variant="ghost"
										size="icon"
										className="rounded-full bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white"
									>
										{icon}
										<span className="sr-only">{label}</span>
									</Button>
								</Link>
							))}
						</div>
					</div>
					<div className="flex justify-center">
						<ErrorBoundary>
							<CreativeHero />
						</ErrorBoundary>
					</div>
				</div>

				<Link
					href="#about"
					className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 animate-bounce lg:inline-block"
				>
					<div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/20 p-1">
						<div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60"></div>
					</div>
				</Link>
			</section>

			{/* About Section */}
			<section id="about" className="relative py-32">
				<div className="absolute inset-0 z-0">
					<div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
					<div className="absolute bottom-1/3 left-1/3 h-64 w-64 rounded-full bg-pink-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
				</div>

				<div className="relative z-10 container">
					<SectionHeading title="About Me" subtitle="My background and journey" />

					<div className="mt-16 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
						<div className="relative">
							<div className="absolute -inset-4 rounded-xl bg-linear-to-r from-purple-500/20 to-pink-500/20 opacity-70 blur-xl"></div>
							<div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-800">
								<Image
									src="/thumbnail.jpeg"
									alt="XiroTheDev"
									sizes="(max-width: 768px) 100vw, 50vw"
									height={0}
									width={0}
									priority
									className="h-full w-full object-cover"
								/>
								<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
								<div className="absolute bottom-0 left-0 w-full p-6">
									<div className="flex items-center gap-2">
										<div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
										<span className="text-sm font-medium">Available for work</span>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-6">
							<div className="relative rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-8 backdrop-blur-sm">
								<GlowingEffect
									disabled={false}
									proximity={50}
									spread={30}
									borderWidth={2}
									movementDuration={1.5}
								/>
								<p className="text-lg text-zinc-300">
									I&apos;m a passionate software engineer with experience building web applications
									and digital products. I specialize in frontend development with React and Next.js,
									but I&apos;m also comfortable working with backend technologies like Node.js and
									NestJS.
								</p>
								<p className="mt-4 text-lg text-zinc-300">
									My journey in tech started with a strong foundation in software development.
									I&apos;ve worked with enthusiams friends to create intuitive, performant, and
									accessible digital experiences.
								</p>
								<p className="mt-4 text-lg text-zinc-300">
									When I&apos;m not coding, you can find me exploring new technologies, contributing
									to open-source projects, and staying up-to-date with the latest industry trends.
								</p>

								<div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
									<div className="space-y-1">
										<div className="text-sm text-zinc-500">Full Name</div>
										<div className="font-medium">Lê Thành Trung</div>
									</div>
									<div className="space-y-1">
										<div className="text-sm text-zinc-500">Email</div>
										<div className="max-w-[180px] truncate font-medium">
											lethanhtrung.trungle@gmail.com
										</div>
									</div>
									<div className="space-y-1">
										<div className="text-sm text-zinc-500">Location</div>
										<div className="font-medium">Viet Nam 🇻🇳</div>
									</div>
									<div className="space-y-1">
										<div className="text-sm text-zinc-500">Availability</div>
										<div className="font-medium text-green-500">Open to opportunities</div>
									</div>
								</div>

								<div className="mt-8">
									<Link
										href="/lethanhtrung-webdeveloper-cv.pdf"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Button className="bg-zinc-800 text-white hover:bg-zinc-700">
											<Download className="mr-2 h-4 w-4" />
											Download Resume
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Skills Section */}
			<section id="skills" className="relative py-32">
				<div className="absolute inset-0 z-0">
					<div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-blue-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
					<div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
				</div>

				<div className="relative z-10 container">
					<SectionHeading title="My Skills" subtitle="Technologies I work with" />

					<div className="mt-16">
						<SkillsWithProjects />
					</div>
				</div>
			</section>

			{/* Projects Section */}
			<section id="projects" className="relative py-32">
				<div className="absolute inset-0 z-0">
					<div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-pink-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
					<div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-yellow-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
				</div>

				<div className="relative z-10 container">
					<SectionHeading title="Featured Projects" subtitle="Some of my recent work" />

					<div className="mt-16 grid auto-rows-fr grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						{loading ? (
							// Loading skeleton
							<>
								{[...Array(6)].map((_, index) => (
									<ProjectCardSkeleton key={index} />
								))}
							</>
						) : error ? (
							// Error state
							<div className="col-span-full py-12 text-center">
								<div className="mb-4 text-red-400">Failed to load projects</div>
								<Button
									onClick={() => window.location.reload()}
									variant="outline"
									className="border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
								>
									Try Again
								</Button>
							</div>
						) : (
							// Projects from GitHub API
							<>
								{projects.map((project) => (
									<ProjectCard key={project.repoName} {...project} />
								))}
								{/* Coming Soon card */}
								<ProjectCard
									title="Coming Soon"
									description="An exciting new project is in development. Stay tuned for updates and be the first to know when it launches!"
									tags={["In Development", "Coming Soon", "Stay Tuned"]}
									image="/placeholder.png"
									demoUrl="#"
									repoUrl="#"
								/>
							</>
						)}
					</div>
				</div>
			</section>

			{/* Experience Section */}
			<section id="experience" className="relative py-32">
				<div className="absolute inset-0 z-0">
					<div className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
					<div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
				</div>

				<div className="relative z-10 container">
					<SectionHeading title="Work Experience" subtitle="My professional journey" />

					<div className="mt-16">
						<Timeline />
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<Testimonials layout="auto" />

			{/* Contact Section */}
			<section id="contact" className="relative py-32">
				<div className="absolute inset-0 z-0">
					<div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-pink-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
					<div className="absolute right-1/3 bottom-1/3 h-64 w-64 rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
				</div>

				<div className="relative z-10 container">
					<SectionHeading title="Get In Touch" subtitle="Let's work together" />

					<div className="mt-16 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
						<div className="relative rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-8 backdrop-blur-sm">
							<GlowingEffect
								disabled={false}
								proximity={50}
								spread={30}
								borderWidth={2}
								movementDuration={1.5}
							/>
							<h3 className="mb-6 text-2xl font-bold">Contact Information</h3>
							<div className="space-y-6">
								{[
									{
										icon: <Mail className="h-5 w-5 text-purple-400" />,
										label: "Email",
										value: "lethanhtrung.trungle@gmail.com",
									},
									{
										icon: <Linkedin className="h-5 w-5 text-purple-400" />,
										label: "LinkedIn",
										value: "linkedin.com/in/xirothedev",
									},
									{
										icon: <Github className="h-5 w-5 text-purple-400" />,
										label: "GitHub",
										value: "github.com/xirothedev",
									},
									{
										icon: <MessageCircle className="h-5 w-5 text-purple-400" />,
										label: "Discord",
										value: "@xirothedev",
									},
								].map((item, idx) => (
									<div key={idx} className="flex items-center gap-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
											{item.icon}
										</div>
										<div className="min-w-0 flex-1">
											<div className="text-sm text-zinc-500">{item.label}</div>
											<div className="truncate font-medium">{item.value}</div>
										</div>
									</div>
								))}
							</div>

							<div className="mt-8 border-t border-zinc-800 pt-8">
								<h4 className="mb-4 text-lg font-medium">Current Status</h4>
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
									<span>Available for freelance work and remote part-time opportunities</span>
								</div>
							</div>
						</div>

						<ContactForm />
					</div>
				</div>
			</section>
		</>
	);
}
