"use client";

import { motion } from "motion/react";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-black text-white">
			<div className="container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mx-auto max-w-md text-center"
				>
					<div className="mb-6 text-8xl">🔍</div>

					<h1 className="mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent">
						Project Not Found
					</h1>

					<p className="mb-8 text-xl text-zinc-400">
						The project you&apos;re looking for doesn&apos;t exist or may have been moved.
					</p>

					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<Link href="/projects">
							<Button
								variant="outline"
								className="border-zinc-600 hover:border-purple-500 hover:bg-purple-500/10"
							>
								<Search className="mr-2 h-4 w-4" />
								Browse All Projects
							</Button>
						</Link>

						<Link href="/">
							<Button variant="ghost">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Home
							</Button>
						</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
