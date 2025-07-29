"use client";

import { motion } from "motion/react";

interface SectionHeadingProps {
	title: string;
	subtitle: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
	return (
		<div className="space-y-4 text-center">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				viewport={{ once: true }}
			>
				<div className="inline-block">
					<div className="relative mb-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-xs">
						<span className="relative z-10">{subtitle}</span>
						<span className="absolute inset-0 animate-pulse rounded-full bg-linear-to-r from-purple-500/20 to-pink-500/20"></span>
					</div>
				</div>
			</motion.div>

			<motion.h2
				className="bg-linear-to-r from-white to-zinc-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				viewport={{ once: true }}
			>
				{title}
			</motion.h2>

			<motion.div
				className="mx-auto mt-6 h-1.5 w-24 rounded-full bg-linear-to-r from-purple-500 to-pink-500"
				initial={{ opacity: 0, scale: 0 }}
				whileInView={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				viewport={{ once: true }}
			/>
		</div>
	);
}
