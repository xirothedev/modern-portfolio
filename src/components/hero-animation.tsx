"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";

export function HeroAnimation() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas dimensions
		const setCanvasDimensions = () => {
			const devicePixelRatio = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();

			canvas.width = rect.width * devicePixelRatio;
			canvas.height = rect.height * devicePixelRatio;

			ctx.scale(devicePixelRatio, devicePixelRatio);
		};

		setCanvasDimensions();
		window.addEventListener("resize", setCanvasDimensions);

		// Particle class
		class Particle {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			color: string;

			constructor() {
				// Ensure canvas and devicePixelRatio are defined
				const devicePixelRatio = window.devicePixelRatio || 1;
				const width = canvas?.width ?? 0;
				const height = canvas?.height ?? 0;

				this.x = (Math.random() * width) / devicePixelRatio;
				this.y = (Math.random() * height) / devicePixelRatio;
				this.size = Math.random() * 5 + 1;
				this.speedX = Math.random() * 2 - 1;
				this.speedY = Math.random() * 2 - 1;
				this.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`;
			}

			update() {
				this.x += this.speedX;
				this.y += this.speedY;

				if (!canvas) return;
				const devicePixelRatio = window.devicePixelRatio || 1;

				if (this.x > canvas.width / devicePixelRatio || this.x < 0) {
					this.speedX = -this.speedX;
				}

				if (this.y > canvas.height / devicePixelRatio || this.y < 0) {
					this.speedY = -this.speedY;
				}
			}

			draw() {
				if (!ctx) return;
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		// Create particles
		const particlesArray: Particle[] = [];
		const particleCount = 50;

		for (let i = 0; i < particleCount; i++) {
			particlesArray.push(new Particle());
		}

		// Animation loop
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw connections
			ctx.strokeStyle = "rgba(120, 180, 255, 0.1)";
			ctx.lineWidth = 1;

			for (let i = 0; i < particlesArray.length; i++) {
				for (let j = i; j < particlesArray.length; j++) {
					const dx = particlesArray[i].x - particlesArray[j].x;
					const dy = particlesArray[i].y - particlesArray[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < 100) {
						ctx.beginPath();
						ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
						ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
						ctx.stroke();
					}
				}
			}

			// Update and draw particles
			for (let i = 0; i < particlesArray.length; i++) {
				particlesArray[i].update();
				particlesArray[i].draw();
			}

			requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", setCanvasDimensions);
		};
	}, []);

	return (
		<motion.div
			className="relative h-[400px] w-full md:h-[500px]"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
			<canvas ref={canvasRef} className="h-full w-full" style={{ display: "block" }} />
		</motion.div>
	);
}
