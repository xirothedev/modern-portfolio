"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface GlassmorphicCardProps {
	children: ReactNode;
}

export function GlassmorphicCard({ children }: GlassmorphicCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
			whileHover={{ y: -5 }}
		>
			<div className="relative overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-xs transition-all duration-300 hover:border-purple-500/50">
				<div className="absolute -inset-1 rounded-xl bg-linear-to-r from-purple-500/10 to-pink-500/10 opacity-25 blur-sm transition duration-1000 hover:opacity-100 hover:duration-200"></div>

				<div className="relative">{children}</div>
			</div>
		</motion.div>
	);
}
