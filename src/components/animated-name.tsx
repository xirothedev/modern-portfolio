"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

const gradients = [
	{ from: "#a78bfa", to: "#ec4899" },
	{ from: "#ec4899", to: "#a78bfa" },
	{ from: "#60a5fa", to: "#a78bfa" },
	{ from: "#a78bfa", to: "#3b82f6" },
	{ from: "#ec4899", to: "#f97316" },
	{ from: "#f97316", to: "#ec4899" },
];

export function AnimatedName() {
	const [index, setIndex] = useState(0);
	const [sparkles, setSparkles] = useState<Array<{ x: number; y: number }>>([]);

	useEffect(() => {
		const generated = Array.from({ length: 6 }).map(() => ({
			x: Math.random() * 150 - 75,
			y: Math.random() * 80 - 40,
		}));
		setSparkles(generated);
	}, []);

	const progress = useMotionValue(0);
	const smoothProgress = useSpring(progress, { stiffness: 40, damping: 20 });

	const fromColor = useTransform(
		smoothProgress,
		[0, 1],
		[gradients[index].from, gradients[(index + 1) % gradients.length].from],
	);

	const toColor = useTransform(
		smoothProgress,
		[0, 1],
		[gradients[index].to, gradients[(index + 1) % gradients.length].to],
	);

	useEffect(() => {
		const interval = setInterval(() => {
			// animate from 0 to 1, then reset and advance index
			progress.set(0); // start from 0
			progress.set(1); // instantly set to 1 to trigger spring

			setTimeout(() => {
				setIndex((prev) => (prev + 1) % gradients.length);
				progress.set(0); // reset to 0 for next transition
			}, 1000); // duration of transition
		}, 5000);

		return () => clearInterval(interval);
	}, [progress]);

	const text = "Xiro The Dev";
	const letters = text.split("");
	const backgroundImage = useTransform(
		[fromColor, toColor],
		([from, to]) => `linear-gradient(to right, ${from}, ${to})`,
	);

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
					className="inline-block bg-clip-text text-transparent"
					style={{
						backgroundImage,
						backgroundSize: "200% 200%",
					}}
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
			{sparkles.map((_, i) => (
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
