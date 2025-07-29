"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	SiDocker,
	SiExpress,
	SiGit,
	SiGraphql,
	SiJavascript,
	SiNestjs,
	SiNextdotjs,
	SiNodedotjs,
	SiPostgresql,
	SiReact,
	SiRedis,
	SiTailwindcss,
	SiThreedotjs,
	SiTypescript,
} from "react-icons/si";
import * as THREE from "three";

// Configuration constants for particle system
const TOTAL_PARTICLES = 3000; // Total number of particles to create
const BATCH_SIZE = 50; // Number of particles to create per frame for smooth loading

// Type definitions for TypeScript
interface Icon3DProps {
	children: React.ReactNode;
	position: [number, number, number]; // 3D position coordinates [x, y, z]
	delay?: number; // Animation delay for staggered movement
}

/**
 * 3D Icon Component - Renders technology icons in 3D space with floating animation
 * Each icon floats up and down with a sine wave motion for visual appeal
 */
function Icon3D({ children, position, delay = 0 }: Icon3DProps) {
	const groupRef = useRef<THREE.Group>(null);
	const initialY = position[1]; // Store initial Y position for animation reference

	// Ensure position is set correctly when component mounts
	useEffect(() => {
		if (groupRef.current) {
			groupRef.current.position.set(position[0], position[1], position[2]);
		}
	}, [position]);

	// Animation frame loop - creates floating motion for each icon
	useFrame((state) => {
		if (groupRef.current) {
			// Create smooth floating animation using sine wave
			// Each icon has a different delay to create staggered movement
			groupRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime + delay) * 0.1;
		}
	});

	return (
		<group ref={groupRef} position={position}>
			<Html center className="pointer-events-none">
				<div className="text-5xl">{children}</div>
			</Html>
		</group>
	);
}

/**
 * Technology Logos Component - Displays tech stack icons in a 3D arrangement
 * Icons are positioned in a cross pattern around the center
 */
function TechLogos() {
	// Define technology icons and their 3D positions
	const techs = useMemo(
		() => [
			{ name: "react", position: [0, 1, 0] as [number, number, number], icon: <SiReact color="#61DAFB" /> },
			{
				name: "nextjs",
				position: [1, 0, 0] as [number, number, number],
				icon: <SiNextdotjs color="#FFFFFF" />,
			},
			{
				name: "threejs",
				position: [-1, 0, 0] as [number, number, number],
				icon: <SiThreedotjs color="#FFFFFF" />,
			},
			{
				name: "tailwind",
				position: [0, -1, 0] as [number, number, number],
				icon: <SiTailwindcss color="#38B2AC" />,
			},
			{
				name: "nodejs",
				position: [0, 0, 1] as [number, number, number],
				icon: <SiNodedotjs color="#68A063" />,
			},
			{ name: "nestjs", position: [0, 0, -1] as [number, number, number], icon: <SiNestjs color="#EA2859" /> },
			{
				name: "expressjs",
				position: [0.5, 0.5, -0.5] as [number, number, number],
				icon: <SiExpress color="#FFFFFF" />,
			},
			{
				name: "docker",
				position: [0.5, 0.5, 0.5] as [number, number, number],
				icon: <SiDocker color="#1D63ED" />,
			},
			{
				name: "graphql",
				position: [-0.5, -0.5, 0.5] as [number, number, number],
				icon: <SiGraphql color="#F6009B" />,
			},
			{
				name: "postgresql",
				position: [-0.5, -0.5, -0.5] as [number, number, number],
				icon: <SiPostgresql color="#336791" />,
			},
			{
				name: "javascript",
				position: [0.5, -0.5, -0.5] as [number, number, number],
				icon: <SiJavascript color="#F7DF1E" className="rounded-lg" />,
			},
			{
				name: "typescript",
				position: [-0.5, 0.5, -0.5] as [number, number, number],
				icon: <SiTypescript color="#3178C6" className="rounded-lg" />,
			},
			{
				name: "redis",
				position: [0.5, -0.5, 0.5] as [number, number, number],
				icon: <SiRedis color="#FF4438" />,
			},
			{
				name: "git",
				position: [-0.5, 0.5, 0.5] as [number, number, number],
				icon: <SiGit color="#F05133" />,
			},
		],
		[],
	);
	return (
		<group>
			{techs.map(({ icon, name, position }, index) => (
				<Icon3D key={`${name}-${index}`} position={position} delay={index * 0.5}>
					{icon}
				</Icon3D>
			))}
		</group>
	);
}

/**
 * Particle Octagon System - Creates an interactive particle field
 * Features:
 * - Progressive loading for smooth performance
 * - Mouse interaction that repels particles
 * - Octagon-shaped particle distribution
 * - Color variation between purple and pink
 */
function ParticleOctagon() {
	const pointsRef = useRef<THREE.Points>(null);
	const mouse = new THREE.Vector3(0, 0, 0); // Track mouse position in 3D space

	// Store particle data for physics calculations
	const particlesRef = useRef<
		Array<{ position: THREE.Vector3; basePosition: THREE.Vector3; velocity: THREE.Vector3 }>
	>([]);
	const loadedCountRef = useRef(0); // Track how many particles have been created

	// Initialize particle buffers for efficient rendering
	// These buffers store position and color data for all particles
	const { positions, colors } = useMemo(() => {
		const pos = new Float32Array(TOTAL_PARTICLES * 3); // 3 coordinates per particle
		const col = new Float32Array(TOTAL_PARTICLES * 3); // RGB values per particle
		return { positions: pos, colors: col };
	}, []);

	// Main animation loop - runs every frame
	useFrame((state) => {
		// --- STAGE 1: PROGRESSIVE PARTICLE LOADING ---
		// Load particles in batches to avoid frame drops
		if (loadedCountRef.current < TOTAL_PARTICLES) {
			const loadedCount = loadedCountRef.current;
			const particles = particlesRef.current;

			// Create new batch of particles in this frame
			for (let i = 0; i < BATCH_SIZE && loadedCount + i < TOTAL_PARTICLES; i++) {
				const index = loadedCount + i;
				const size = 2.5; // Size of the particle field

				// Generate random positions within the octagon area
				const x = (Math.random() - 0.5) * size * 2;
				const y = (Math.random() - 0.5) * size * 2;
				const z = (Math.random() - 0.5) * size * 2;

				// Store particle data for physics calculations
				particles[index] = {
					position: new THREE.Vector3(x, y, z), // Current position
					basePosition: new THREE.Vector3(x, y, z), // Original position for return force
					velocity: new THREE.Vector3(0, 0, 0), // Movement velocity
				};

				// Update position buffer for rendering
				positions.set([x, y, z], index * 3);

				// Randomly assign purple or pink color to each particle
				const particleColor = new THREE.Color(Math.random() > 0.5 ? "#9333ea" : "#ec4899");
				colors.set([particleColor.r, particleColor.g, particleColor.b], index * 3);
			}

			loadedCountRef.current += BATCH_SIZE;

			// Update geometry to reflect new particles
			if (pointsRef.current) {
				const geometry = pointsRef.current.geometry;
				const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
				const colorAttribute = geometry.getAttribute("color") as THREE.BufferAttribute;

				// Notify Three.js that buffers have changed
				positionAttribute.needsUpdate = true;
				colorAttribute.needsUpdate = true;

				// Key for loading animation: only render particles that have been created
				geometry.setDrawRange(0, loadedCountRef.current);
			}
		}
		// --- STAGE 2: INTERACTIVE ANIMATION AFTER LOADING ---
		// Once all particles are loaded, enable mouse interaction
		else if (pointsRef.current) {
			const geometry = pointsRef.current.geometry;
			const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
			const particles = particlesRef.current;

			// Convert mouse position to 3D space coordinates
			mouse.x = (state.pointer.x * state.viewport.width) / 2;
			mouse.y = (state.pointer.y * state.viewport.height) / 2;

			// Apply physics to each particle based on mouse position
			for (let i = 0; i < TOTAL_PARTICLES; i++) {
				const p = particles[i];

				// Calculate distance from mouse to particle
				const distanceToMouse = p.position.distanceTo(mouse);
				const interactionRadius = 1.5; // Radius of mouse influence
				const repulsionStrength = 0.02; // Strength of repulsion force
				const returnStrength = 0.01; // Strength of return force to base position
				const damping = 0.95; // Velocity damping for smooth movement

				// Apply repulsion force when mouse is near
				if (distanceToMouse < interactionRadius) {
					const repulsionDirection = p.position.clone().sub(mouse).normalize();
					const repulsionForce = repulsionDirection.multiplyScalar(
						repulsionStrength * (1 - distanceToMouse / interactionRadius),
					);
					p.velocity.add(repulsionForce);
				}

				// Apply return force to original position
				const returnDirection = p.basePosition.clone().sub(p.position);
				const returnForce = returnDirection.multiplyScalar(returnStrength);
				p.velocity.add(returnForce);

				// Apply velocity damping for smooth movement
				p.velocity.multiplyScalar(damping);

				// Update particle position based on velocity
				p.position.add(p.velocity);

				// Update geometry buffer with new positions
				positionAttribute.setXYZ(i, p.position.x, p.position.y, p.position.z);
			}

			// Notify Three.js that position buffer has changed
			positionAttribute.needsUpdate = true;

			// Add subtle rotation to the entire particle system
			pointsRef.current.rotation.y += 0.0005;
			pointsRef.current.rotation.x += 0.0002;
		}
	});

	// Render the particle system
	return (
		<points ref={pointsRef}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" args={[positions, 3]} />
				<bufferAttribute attach="attributes-color" args={[colors, 3]} />
			</bufferGeometry>
			<pointsMaterial
				size={0.05} // Size of each particle
				vertexColors // Use individual particle colors
				blending={THREE.AdditiveBlending} // Creates glowing effect
				transparent
				opacity={0.8}
				depthWrite={false} // Prevents z-fighting issues
			/>
		</points>
	);
}

/**
 * Main Creative Hero Component
 * Features:
 * - Octagon-shaped 3D scene with particle system
 * - Floating technology icons
 * - Responsive design with loading states
 * - Interactive mouse controls
 */
export function CreativeHero() {
	const [isReady, setIsReady] = useState<boolean>(false); // Track if component is ready to render
	const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state
	const containerRef = useRef<HTMLDivElement>(null);

	// Wait for container to be properly sized before rendering 3D scene
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Use ResizeObserver to detect when container has proper dimensions
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry && entry.contentRect.width > 0) {
				setIsReady(true); // Mark component as ready
				setIsLoading(false); // Mark loading as complete
				observer.disconnect(); // Stop observing once ready
			}
		});

		observer.observe(container);

		// Cleanup observer and listener on component unmount
		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<motion.div className="relative flex aspect-square h-[400px] cursor-all-scroll items-center justify-center md:h-[500px]">
			{/* Background gradient blur effect */}
			<div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-3xl"></div>

			{/* Loading state */}
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
				</div>
			)}

			{/* Main container with fixed dimensions */}
			<div className="relative" style={{ width: "400px", height: "400px" }}>
				{/* 3D Scene Container with Octagon Clip Path */}
				<div
					ref={containerRef}
					className="absolute inset-0"
					style={{
						// Octagon shape using CSS clip-path
						clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
					}}
				>
					{/* Three.js Canvas - only render when ready */}
					<Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
						{isReady ? (
							<>
								{/* Lighting setup */}
								<pointLight position={[0, 0, 2]} intensity={50} color="#eab308" />
								<ambientLight intensity={0.5} />

								{/* 3D Components */}
								<ParticleOctagon />
								<TechLogos />

								{/* Camera controls */}
								<OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
							</>
						) : (
							<div className="flex h-full w-full items-center justify-center">
								<div className="text-center">
									<div className="mb-4 text-4xl">🚀</div>
									<div className="text-sm text-zinc-400">Interactive 3D Experience</div>
								</div>
							</div>
						)}
					</Canvas>
				</div>

				{/* Octagon border overlay */}
				<div
					className="pointer-events-none absolute inset-0 border-2 border-purple-500/30"
					style={{
						clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
					}}
				/>

				{/* Inner glow effect */}
				<div
					className="pointer-events-none absolute inset-2 bg-gradient-to-br from-purple-400/5 via-pink-400/5 to-purple-400/5 blur-sm"
					style={{
						clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
					}}
				/>

				{/* User interaction hint */}
				<motion.div className="absolute -bottom-8 left-1/2 -translate-x-1/2 transform text-center text-xs text-zinc-500">
					Move your cursor to interact
				</motion.div>
			</div>
		</motion.div>
	);
}
