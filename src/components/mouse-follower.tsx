"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function MouseFollower() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isVisible, setIsVisible] = useState(false);
	const [isHoveringClickable, setIsHoveringClickable] = useState(false);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
			setIsVisible(true);

			// Check if the element under cursor has cursor-pointer or is an anchor/button tag (including parent elements)
			const element = document.elementFromPoint(e.clientX, e.clientY);
			if (element) {
				const computedStyle = window.getComputedStyle(element);
				const cursor = computedStyle.cursor;

				// Check current element and all its parent elements
				let currentElement: Element | null = element;
				let isClickable = cursor === "pointer";

				while (currentElement && currentElement !== document.body) {
					const tagName = currentElement.tagName.toLowerCase();
					if (tagName === "a" || tagName === "button" || tagName === "canvas") {
						isClickable = true;
						break;
					}
					currentElement = currentElement.parentElement;
				}

				setIsHoveringClickable(isClickable);
			}
		};

		const handleMouseLeave = () => {
			setIsVisible(false);
			setIsHoveringClickable(false);
		};

		window.addEventListener("mousemove", handleMouseMove);
		document.body.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			document.body.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, []);

	return (
		<>
			<motion.div
				className="pointer-events-none fixed top-0 left-0 z-50 h-8 w-8 rounded-full mix-blend-difference"
				animate={{
					x: mousePosition.x - 16,
					y: mousePosition.y - 16,
					opacity: isVisible && !isHoveringClickable ? 1 : 0,
				}}
				transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.5 }}
			>
				<div className="h-full w-full rounded-full bg-white opacity-50"></div>
			</motion.div>

			<motion.div
				className="pointer-events-none fixed top-0 left-0 z-50 h-2 w-2 rounded-full bg-white"
				animate={{
					x: mousePosition.x - 1,
					y: mousePosition.y - 1,
					opacity: isVisible && !isHoveringClickable ? 1 : 0,
				}}
			/>
		</>
	);
}
