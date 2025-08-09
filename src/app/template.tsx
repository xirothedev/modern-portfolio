"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Pacifico } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Pacifico({
	weight: ["400"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-pacifico",
});

export default function Template({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 3000);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	return (
		<>
			<AnimatePresence mode="wait">
				{isLoading && (
					<motion.div
						key="overlay"
						className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
						initial={{ opacity: 1 }}
						exit={{
							opacity: 0,
							transition: {
								duration: 1.0,
								ease: [0.76, 0, 0.24, 1],
							},
						}}
					>
						{/* Main content container */}
						<motion.div
							className="relative z-10 text-center"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{
								opacity: 0,
								y: -50,
								transition: { duration: 0.6, ease: "easeInOut" },
							}}
							transition={{ delay: 0.2, duration: 0.8 }}
						>
							{/* Main title */}
							<motion.div
								className="mb-8"
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
							>
								<h1
									className={cn(
										"mb-2 text-5xl font-light tracking-wider text-white md:text-7xl",
										font.className,
									)}
								>
									{"XIRO THE DEV".split("").map((char, i) => (
										<motion.span
											key={i}
											initial={{ opacity: 0, y: 50 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.6,
												delay: 0.8 + i * 0.08,
												ease: [0.25, 0.46, 0.45, 0.94],
											}}
											className="inline-block"
										>
											{char === " " ? "\u00A0" : char}
										</motion.span>
									))}
								</h1>
								<motion.div
									className="mx-auto h-px w-xl bg-gradient-to-r from-transparent via-purple-500 to-transparent"
									initial={{ scaleX: 0 }}
									animate={{ scaleX: 1 }}
									transition={{ delay: 2.0, duration: 0.8, ease: "easeInOut" }}
								/>
							</motion.div>

							{/* Loading progress */}
							<motion.div
								className="mx-auto w-64"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 2.0, duration: 0.4 }}
							/>

							{/* Subtitle */}
							<motion.p
								className="mt-8 text-sm font-light tracking-widest text-white/40"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 2.4, duration: 0.6 }}
							>
								FULL STACK & DISCORD BOT DEVELOPER
							</motion.p>
						</motion.div>

						{/* Minimal corner elements */}
						<motion.div
							className="absolute top-8 left-8 h-8 w-8 border-t border-l border-white/20"
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.3, duration: 0.6 }}
						/>
						<motion.div
							className="absolute top-8 right-8 h-8 w-8 border-t border-r border-white/20"
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.4, duration: 0.6 }}
						/>
						<motion.div
							className="absolute bottom-8 left-8 h-8 w-8 border-b border-l border-white/20"
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.5, duration: 0.6 }}
						/>
						<motion.div
							className="absolute right-8 bottom-8 h-8 w-8 border-r border-b border-white/20"
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.6, duration: 0.6 }}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Nội dung chính */}
			<motion.div
				initial={{ opacity: 0, y: 50, scale: 0.95 }}
				animate={{
					opacity: isLoading ? 0 : 1,
					y: isLoading ? 50 : 0,
					scale: isLoading ? 0.95 : 1,
				}}
				exit={{
					opacity: 0,
					y: -30,
					scale: 1.05,
					transition: { duration: 0.4, ease: "easeInOut" },
				}}
				transition={{
					duration: 0.8,
					ease: [0.25, 0.46, 0.45, 0.94],
				}}
			>
				{children}
			</motion.div>
		</>
	);
}
