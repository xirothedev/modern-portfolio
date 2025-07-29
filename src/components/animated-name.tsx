"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function AnimatedName() {
	const [currentColorIndex, setCurrentColorIndex] = useState(0);
	const colors = [
		"from-purple-400 to-pink-600",
		"from-pink-400 to-purple-600",
		"from-blue-400 to-purple-600",
		"from-purple-400 to-blue-600",
		"from-pink-400 to-orange-600",
		"from-orange-400 to-pink-600",
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentColorIndex((prev) => (prev + 1) % colors.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [colors.length]);

	const text = "Xiro The Dev";
	const letters = text.split("");

	return (
		<motion.span
			className="relative inline-block"
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 1, ease: "easeOut" }}
		>
			{letters.map((letter, index) => (
				<motion.span
					key={index}
					className={`inline-block bg-gradient-to-r ${colors[currentColorIndex]} bg-clip-text text-transparent transition-all duration-1000 ease-in-out`}
					initial={{ opacity: 0, y: 30, rotateX: -90 }}
					animate={{
						opacity: 1,
						y: 0,
						rotateX: 0,
						scale: [1, 1.15, 1],
					}}
					transition={{
						duration: 0.8,
						delay: index * 0.01,
						ease: "easeOut",
						scale: {
							duration: 0.4,
							repeat: Infinity,
							repeatDelay: 3,
							delay: index * 0.08 + 1.5,
						},
					}}
					whileHover={{
						scale: 1.3,
						rotateY: 15,
						transition: { duration: 0.3, ease: "easeOut" },
					}}
				>
					{letter === " " ? "\u00A0" : letter}
				</motion.span>
			))}

			{/* Smooth glowing background effect */}
			<motion.div
				className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 blur-xl transition-all duration-1000 ease-in-out"
				animate={{
					opacity: [0.2, 0.6, 0.2],
					scale: [1, 1.08, 1],
				}}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Floating sparkles with smoother movement */}
			{Array.from({ length: 6 }).map((_, i) => (
				<motion.div
					key={i}
					className="absolute h-1.5 w-1.5 rounded-full bg-yellow-300"
					initial={{
						x: Math.random() * 150 - 75,
						y: Math.random() * 80 - 40,
						opacity: 0,
						scale: 0,
					}}
					animate={{
						x: Math.random() * 250 - 125,
						y: Math.random() * 150 - 75,
						opacity: [0, 0.8, 0],
						scale: [0, 1, 0],
					}}
					transition={{
						duration: 5 + Math.random() * 3,
						repeat: Infinity,
						delay: i * 0.8,
						ease: "easeInOut",
					}}
				/>
			))}

			{/* Smooth wave effect */}
			<motion.div
				className="absolute right-0 -bottom-3 left-0 h-1.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
				initial={{ scaleX: 0 }}
				animate={{ scaleX: 1 }}
				transition={{
					duration: 1.5,
					delay: 0.8,
					ease: "easeOut",
				}}
			/>

			{/* Additional smooth color transition overlay */}
			<motion.div
				className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-purple-400/10"
				animate={{
					opacity: [0, 0.3, 0],
				}}
				transition={{
					duration: 5,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
		</motion.span>
	);
}
