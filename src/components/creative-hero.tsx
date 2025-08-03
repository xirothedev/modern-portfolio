"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "motion/react";
import * as THREE from "three";

import { memo, useEffect, useMemo, useRef, useState } from "react";
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

import {
	FrameRateLimiter,
	ObjectPool,
	cleanupManager,
	getAnimationDuration,
	getAnimationScale,
	performanceMonitor,
	prefersReducedMotion,
} from "@/lib/animation-utils";

// Optimized performance configuration
const OPTIMIZED_CONFIG = {
	MIN_PARTICLES: 500,
	MAX_PARTICLES: 2000,
	BATCH_SIZE: 25,
	PARTICLE_SIZE: 0.04,
	ICON_FLOAT_AMPLITUDE: 0.08,
	ICON_FLOAT_SPEED: 0.3,
	REPULSION_RADIUS: 1.2,
	PARTICLE_COLORS: ["#9333ea", "#ec4899"],
	FPS_THRESHOLD: 30,
	PERFORMANCE_TEST_DURATION: 2000, // Reduced to 2 seconds
	REDUCED_MOTION_PARTICLES: 200, // Minimal particles for reduced motion
};

// Enhanced performance detector with memory management
class OptimizedPerformanceDetector {
	private fpsHistory: number[] = [];
	private frameCount = 0;
	private lastTime = performance.now();
	private isTesting = false;
	private testStartTime = 0;
	private frameLimiter = new FrameRateLimiter(60);

	// Detect hardware capabilities with more accurate detection
	static detectHardwareCapabilities() {
		const capabilities = {
			cores: navigator.hardwareConcurrency || 4,
			memory: (navigator as any).deviceMemory || 4,
			connection: (navigator as any).connection?.effectiveType || "4g",
			isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			isLowEnd: false,
			supportsWebGL2: false,
			maxTextureSize: 0,
		};

		// Check WebGL2 support
		try {
			const canvas = document.createElement("canvas");
			const gl = canvas.getContext("webgl2");
			capabilities.supportsWebGL2 = !!gl;
			if (gl) {
				capabilities.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
			}
		} catch {
			capabilities.supportsWebGL2 = false;
		}

		// Enhanced low-end detection
		capabilities.isLowEnd =
			capabilities.cores <= 2 ||
			capabilities.memory <= 2 ||
			capabilities.connection === "slow-2g" ||
			capabilities.connection === "2g" ||
			(capabilities.isMobile && capabilities.cores <= 4) ||
			!capabilities.supportsWebGL2;

		return capabilities;
	}

	startFPSMonitoring() {
		this.isTesting = true;
		this.testStartTime = performance.now();
		this.fpsHistory = [];
		this.frameCount = 0;
		this.lastTime = performance.now();
	}

	updateFPS(currentTime: number) {
		if (!this.isPerformanceTesting()) return;

		// Use frame limiter to avoid excessive calculations
		if (!this.frameLimiter.shouldRender(currentTime)) return;

		this.frameCount++;
		const deltaTime = currentTime - this.lastTime;

		if (deltaTime >= 1000) {
			const fps = Math.round((this.frameCount * 1000) / deltaTime);
			this.fpsHistory.push(fps);
			this.frameCount = 0;
			this.lastTime = currentTime;

			// Limit history size to prevent memory leaks
			if (this.fpsHistory.length > 10) {
				this.fpsHistory.shift();
			}
		}

		// Stop testing after duration
		if (currentTime - this.testStartTime >= OPTIMIZED_CONFIG.PERFORMANCE_TEST_DURATION) {
			this.isTesting = false;
		}
	}

	getAverageFPS(): number {
		if (this.fpsHistory.length === 0) return 60;
		return this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
	}

	isPerformanceTesting(): boolean {
		return this.isTesting;
	}

	calculateOptimalParticleCount(): number {
		const hardware = OptimizedPerformanceDetector.detectHardwareCapabilities();
		const avgFPS = this.getAverageFPS();
		const reducedMotion = prefersReducedMotion();

		// Use minimal particles for reduced motion
		if (reducedMotion) {
			return OPTIMIZED_CONFIG.REDUCED_MOTION_PARTICLES;
		}

		let baseParticles = OPTIMIZED_CONFIG.MIN_PARTICLES;

		// Adjust based on FPS with more conservative scaling
		if (avgFPS >= 55) {
			baseParticles = OPTIMIZED_CONFIG.MAX_PARTICLES;
		} else if (avgFPS >= 45) {
			baseParticles = Math.round(OPTIMIZED_CONFIG.MAX_PARTICLES * 0.7);
		} else if (avgFPS >= 35) {
			baseParticles = Math.round(OPTIMIZED_CONFIG.MAX_PARTICLES * 0.5);
		} else if (avgFPS >= 25) {
			baseParticles = Math.round(OPTIMIZED_CONFIG.MAX_PARTICLES * 0.3);
		} else {
			baseParticles = OPTIMIZED_CONFIG.MIN_PARTICLES;
		}

		// More aggressive reduction for low-end devices
		if (hardware.isLowEnd) {
			baseParticles = Math.round(baseParticles * 0.3);
		} else if (hardware.cores >= 8 && hardware.memory >= 8 && hardware.supportsWebGL2) {
			baseParticles = Math.min(baseParticles + 300, OPTIMIZED_CONFIG.MAX_PARTICLES);
		}

		return Math.max(OPTIMIZED_CONFIG.MIN_PARTICLES, Math.min(baseParticles, OPTIMIZED_CONFIG.MAX_PARTICLES));
	}

	// Cleanup method
	cleanup() {
		this.fpsHistory = [];
		this.isTesting = false;
	}
}

// Particle data interface for object pooling
interface ParticleData {
	position: THREE.Vector3;
	basePosition: THREE.Vector3;
	velocity: THREE.Vector3;
}

// Object pool for particles
const particlePool = new ObjectPool<ParticleData>(
	() => ({
		position: new THREE.Vector3(),
		basePosition: new THREE.Vector3(),
		velocity: new THREE.Vector3(),
	}),
	(particle) => {
		particle.position.set(0, 0, 0);
		particle.basePosition.set(0, 0, 0);
		particle.velocity.set(0, 0, 0);
	},
);

// Optimized Icon3D Component with memory management
function OptimizedIcon3D({
	children,
	position,
	delay = 0,
}: {
	children: React.ReactNode;
	position: [number, number, number];
	delay?: number;
}) {
	const groupRef = useRef<THREE.Group>(null);
	const initialY = position[1];
	const animationScale = getAnimationScale(OPTIMIZED_CONFIG.ICON_FLOAT_AMPLITUDE);
	const reducedMotion = prefersReducedMotion();

	// Set position only once
	useEffect(() => {
		if (groupRef.current) {
			groupRef.current.position.set(position[0], position[1], position[2]);
		}
	}, [position]);

	// Optimized animation with performance monitoring
	useFrame((state) => {
		if (!groupRef.current || reducedMotion) return;

		// Skip animation if performance is critical
		if (performanceMonitor.isCriticalPerformance()) return;

		// Reduce animation frequency on low performance
		if (performanceMonitor.isLowPerformance() && Math.random() > 0.5) return;

		groupRef.current.position.y =
			initialY + Math.sin(state.clock.elapsedTime * OPTIMIZED_CONFIG.ICON_FLOAT_SPEED + delay) * animationScale;
	});

	return (
		<group ref={groupRef} position={position}>
			<Html center className="pointer-events-none">
				<div className="text-4xl">{children}</div>
			</Html>
		</group>
	);
}

// Optimized TechLogos with memoization
const OptimizedTechLogos = memo(() => {
	const techs = useMemo(
		() => [
			{ name: "react", position: [0, 1, 0] as [number, number, number], icon: <SiReact color="#61DAFB" /> },
			{ name: "nextjs", position: [1, 0, 0] as [number, number, number], icon: <SiNextdotjs color="#FFFFFF" /> },
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
			{ name: "nodejs", position: [0, 0, 1] as [number, number, number], icon: <SiNodedotjs color="#68A063" /> },
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
			{ name: "git", position: [-0.5, 0.5, 0.5] as [number, number, number], icon: <SiGit color="#F05133" /> },
		],
		[],
	);

	return (
		<group>
			{techs.map(({ icon, name, position }, index) => (
				<OptimizedIcon3D key={`${name}-${index}`} position={position} delay={index * 0.3}>
					{icon}
				</OptimizedIcon3D>
			))}
		</group>
	);
});

OptimizedTechLogos.displayName = "OptimizedTechLogos";

// Highly optimized particle system
function OptimizedParticleSystem() {
	const pointsRef = useRef<THREE.Points>(null);
	const mouse = new THREE.Vector3(0, 0, 0);
	const performanceDetector = useRef(new OptimizedPerformanceDetector());
	const [totalParticles, setTotalParticles] = useState<number>(OPTIMIZED_CONFIG.MIN_PARTICLES);
	const [isPerformanceTestComplete, setIsPerformanceTestComplete] = useState<boolean>(false);

	// Use object pool for particles
	const particlesRef = useRef<ParticleData[]>([]);
	const loadedCountRef = useRef(0);
	const frameLimiter = useRef(new FrameRateLimiter(60));

	// Initialize performance testing
	useEffect(() => {
		const timer = setTimeout(() => {
			performanceDetector.current.startFPSMonitoring();
		}, 500); // Reduced delay

		// Register cleanup
		const cleanup = () => {
			performanceDetector.current.cleanup();
			particlePool.clear();
		};
		cleanupManager.addCleanupTask(cleanup);

		return () => {
			clearTimeout(timer);
			cleanup();
			cleanupManager.removeCleanupTask(cleanup);
		};
	}, []);

	// Optimized particle buffers with proper cleanup
	const { positions, colors } = useMemo(() => {
		const pos = new Float32Array(OPTIMIZED_CONFIG.MAX_PARTICLES * 3);
		const col = new Float32Array(OPTIMIZED_CONFIG.MAX_PARTICLES * 3);
		return { positions: pos, colors: col };
	}, []);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			// Release all particles back to pool
			particlesRef.current.forEach((particle) => {
				particlePool.release(particle);
			});
			particlesRef.current = [];
		};
	}, []);

	// Optimized animation loop with performance monitoring
	useFrame((state) => {
		const currentTime = performance.now();

		// Update performance monitoring
		performanceDetector.current.updateFPS(currentTime);

		// Skip frame if performance is critical
		if (performanceMonitor.isCriticalPerformance()) return;

		// Use frame limiter for better performance
		if (!frameLimiter.current.shouldRender(currentTime)) return;

		// Check if performance test is complete
		if (!isPerformanceTestComplete && !performanceDetector.current.isPerformanceTesting()) {
			const optimalParticles = performanceDetector.current.calculateOptimalParticleCount();
			setTotalParticles(optimalParticles);
			setIsPerformanceTestComplete(true);

			console.log("Optimized Performance Analysis:", {
				avgFPS: performanceDetector.current.getAverageFPS(),
				hardware: OptimizedPerformanceDetector.detectHardwareCapabilities(),
				optimalParticles,
				reducedMotion: prefersReducedMotion(),
			});
		}

		// Progressive particle loading with object pooling
		if (loadedCountRef.current < totalParticles) {
			const loadedCount = loadedCountRef.current;
			const batchSize = Math.min(OPTIMIZED_CONFIG.BATCH_SIZE, totalParticles - loadedCount);

			for (let i = 0; i < batchSize; i++) {
				const index = loadedCount + i;
				const size = 2.0; // Reduced size for better performance

				const x = (Math.random() - 0.5) * size * 2;
				const y = (Math.random() - 0.5) * size * 2;
				const z = (Math.random() - 0.5) * size * 2;

				// Get particle from pool
				const particle = particlePool.get();
				particle.position.set(x, y, z);
				particle.basePosition.set(x, y, z);
				particle.velocity.set(0, 0, 0);

				particlesRef.current[index] = particle;

				// Update buffers
				positions.set([x, y, z], index * 3);

				const particleColor = new THREE.Color(
					OPTIMIZED_CONFIG.PARTICLE_COLORS[
						Math.floor(Math.random() * OPTIMIZED_CONFIG.PARTICLE_COLORS.length)
					],
				);
				colors.set([particleColor.r, particleColor.g, particleColor.b], index * 3);
			}

			loadedCountRef.current += batchSize;

			// Update geometry
			if (pointsRef.current) {
				const geometry = pointsRef.current.geometry;
				const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
				const colorAttribute = geometry.getAttribute("color") as THREE.BufferAttribute;

				positionAttribute.needsUpdate = true;
				colorAttribute.needsUpdate = true;
				geometry.setDrawRange(0, loadedCountRef.current);
			}
		}
		// Interactive animation with performance throttling
		else if (pointsRef.current && !prefersReducedMotion()) {
			const geometry = pointsRef.current.geometry;
			const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
			const particles = particlesRef.current;

			// Convert mouse position
			mouse.x = (state.pointer.x * state.viewport.width) / 2;
			mouse.y = (state.pointer.y * state.viewport.height) / 2;

			// Reduce particle updates on low performance
			const updateStep = performanceMonitor.isLowPerformance() ? 2 : 1;

			for (let i = 0; i < totalParticles; i += updateStep) {
				const p = particles[i];
				if (!p) continue;

				const distanceToMouse = p.position.distanceTo(mouse);
				const interactionRadius = OPTIMIZED_CONFIG.REPULSION_RADIUS;
				const repulsionStrength = 0.015; // Reduced for better performance
				const returnStrength = 0.008;
				const damping = 0.96;

				// Apply forces
				if (distanceToMouse < interactionRadius) {
					const repulsionDirection = p.position.clone().sub(mouse).normalize();
					const repulsionForce = repulsionDirection.multiplyScalar(
						repulsionStrength * (1 - distanceToMouse / interactionRadius),
					);
					p.velocity.add(repulsionForce);
				}

				const returnDirection = p.basePosition.clone().sub(p.position);
				const returnForce = returnDirection.multiplyScalar(returnStrength);
				p.velocity.add(returnForce);
				p.velocity.multiplyScalar(damping);
				p.position.add(p.velocity);

				positionAttribute.setXYZ(i, p.position.x, p.position.y, p.position.z);
			}

			positionAttribute.needsUpdate = true;

			// Reduced rotation for better performance
			pointsRef.current.rotation.y += 0.0003;
			pointsRef.current.rotation.x += 0.0001;
		}
	});

	return (
		<points ref={pointsRef}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" args={[positions, 3]} />
				<bufferAttribute attach="attributes-color" args={[colors, 3]} />
			</bufferGeometry>
			<pointsMaterial
				size={OPTIMIZED_CONFIG.PARTICLE_SIZE}
				vertexColors
				blending={THREE.AdditiveBlending}
				transparent
				opacity={0.7} // Slightly reduced for better performance
				depthWrite={false}
			/>
		</points>
	);
}

// Main optimized component
export function CreativeHero() {
	const [isReady, setIsReady] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [performanceInfo, setPerformanceInfo] = useState<string>("");
	const containerRef = useRef<HTMLDivElement>(null);

	// Optimized ready detection
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry && entry.contentRect.width > 0) {
				setIsReady(true);
				setIsLoading(false);
				observer.disconnect();
			}
		});

		observer.observe(container);

		return () => {
			observer.disconnect();
		};
	}, []);

	// Performance info with reduced delay
	useEffect(() => {
		const timer = setTimeout(() => {
			const hardware = OptimizedPerformanceDetector.detectHardwareCapabilities();
			const motionText = prefersReducedMotion() ? " (Reduced Motion)" : "";
			setPerformanceInfo(
				`Optimized for your device (${hardware.cores} cores, ${hardware.memory}GB RAM)${motionText}`,
			);
		}, 2000); // Reduced from 4000ms

		return () => clearTimeout(timer);
	}, []);

	// Performance monitoring setup
	useEffect(() => {
		performanceMonitor.startMonitoring();

		return () => {
			performanceMonitor.stopMonitoring();
		};
	}, []);

	const animationDuration = getAnimationDuration(0.5);

	return (
		<motion.div
			className="relative flex aspect-square h-[400px] cursor-all-scroll items-center justify-center md:h-[500px]"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: animationDuration }}
		>
			{/* Background gradient blur effect */}
			<div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-3xl"></div>

			{/* Loading state */}
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
				</div>
			)}

			{/* Main container */}
			<div className="relative" style={{ width: "400px", height: "400px" }}>
				{/* 3D Scene Container */}
				<div
					ref={containerRef}
					className="absolute inset-0"
					style={{
						clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
					}}
				>
					{/* Optimized Three.js Canvas */}
					<Canvas
						camera={{ position: [0, 0, 4.5], fov: 50 }}
						gl={{
							antialias: false, // Disable for better performance
							alpha: true,
							powerPreference: "high-performance",
						}}
						dpr={Math.min(window.devicePixelRatio, 2)} // Limit DPR for performance
					>
						{isReady ? (
							<>
								{/* Optimized lighting */}
								<pointLight position={[0, 0, 2]} intensity={30} color="#eab308" />
								<ambientLight intensity={0.3} />

								{/* Optimized components */}
								<OptimizedParticleSystem />
								<OptimizedTechLogos />

								{/* Optimized controls */}
								<OrbitControls
									enableZoom={false}
									enablePan={false}
									autoRotate={!prefersReducedMotion()}
									autoRotateSpeed={getAnimationScale(OPTIMIZED_CONFIG.ICON_FLOAT_SPEED)}
								/>
							</>
						) : (
							<Html center>
								<div className="text-center">
									<div className="mb-4 text-3xl">🚀</div>
									<div className="text-sm text-zinc-400">Loading 3D Experience</div>
								</div>
							</Html>
						)}
					</Canvas>
				</div>

				{/* Border and effects */}
				<div
					className="pointer-events-none absolute inset-0 border-2 border-purple-500/30"
					style={{
						clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
					}}
				/>

				<div
					className="pointer-events-none absolute inset-2 bg-gradient-to-br from-purple-400/5 via-pink-400/5 to-purple-400/5 blur-sm"
					style={{
						clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
					}}
				/>

				{/* User interaction hint */}
				{!prefersReducedMotion() && (
					<motion.div
						className="absolute -bottom-8 left-1/2 -translate-x-1/2 transform text-center text-xs text-zinc-500"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1, duration: animationDuration }}
					>
						Move your cursor to interact
					</motion.div>
				)}

				{/* Performance info */}
				{performanceInfo && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: animationDuration }}
						className="absolute -top-12 left-1/2 -translate-x-1/2 transform text-center text-xs text-zinc-400"
					>
						{performanceInfo}
					</motion.div>
				)}
			</div>
		</motion.div>
	);
}
