/**
 * Animation Performance Utilities
 * Provides optimized animation helpers with memory management and frame limiting
 */

// Animation performance configuration
export const ANIMATION_CONFIG = {
	// Frame rate limiting
	TARGET_FPS: 60,
	FRAME_TIME: 1000 / 60, // 16.67ms per frame

	// Performance thresholds
	LOW_FPS_THRESHOLD: 30,
	CRITICAL_FPS_THRESHOLD: 20,

	// Memory management
	MAX_ANIMATION_INSTANCES: 50,
	CLEANUP_INTERVAL: 30000, // 30 seconds

	// Reduced motion preferences
	REDUCED_MOTION_SCALE: 0.3,
	REDUCED_MOTION_DURATION: 0.5,
} as const;

// Performance monitor for animations
class AnimationPerformanceMonitor {
	private static instance: AnimationPerformanceMonitor;
	private frameCount = 0;
	private lastTime = performance.now();
	private fps = 60;
	private isMonitoring = false;
	private callbacks: Array<(fps: number) => void> = [];

	static getInstance(): AnimationPerformanceMonitor {
		if (!AnimationPerformanceMonitor.instance) {
			AnimationPerformanceMonitor.instance = new AnimationPerformanceMonitor();
		}
		return AnimationPerformanceMonitor.instance;
	}

	startMonitoring(): void {
		if (this.isMonitoring) return;
		this.isMonitoring = true;
		this.measureFPS();
	}

	stopMonitoring(): void {
		this.isMonitoring = false;
	}

	private measureFPS(): void {
		if (!this.isMonitoring) return;

		const now = performance.now();
		this.frameCount++;

		if (now - this.lastTime >= 1000) {
			this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
			this.frameCount = 0;
			this.lastTime = now;

			// Notify callbacks
			this.callbacks.forEach((callback) => callback(this.fps));
		}

		requestAnimationFrame(() => this.measureFPS());
	}

	getFPS(): number {
		return this.fps;
	}

	onFPSChange(callback: (fps: number) => void): () => void {
		this.callbacks.push(callback);
		return () => {
			const index = this.callbacks.indexOf(callback);
			if (index > -1) {
				this.callbacks.splice(index, 1);
			}
		};
	}

	isLowPerformance(): boolean {
		return this.fps < ANIMATION_CONFIG.LOW_FPS_THRESHOLD;
	}

	isCriticalPerformance(): boolean {
		return this.fps < ANIMATION_CONFIG.CRITICAL_FPS_THRESHOLD;
	}
}

// Frame rate limiter
export class FrameRateLimiter {
	private lastFrameTime = 0;
	private targetFrameTime: number;

	constructor(targetFPS: number = ANIMATION_CONFIG.TARGET_FPS) {
		this.targetFrameTime = 1000 / targetFPS;
	}

	shouldRender(currentTime: number): boolean {
		if (currentTime - this.lastFrameTime >= this.targetFrameTime) {
			this.lastFrameTime = currentTime;
			return true;
		}
		return false;
	}

	setTargetFPS(fps: number): void {
		this.targetFrameTime = 1000 / fps;
	}
}

// Object pool for animation objects to reduce garbage collection
export class ObjectPool<T> {
	private pool: T[] = [];
	private createFn: () => T;
	private resetFn: (obj: T) => void;
	private maxSize: number;

	constructor(
		createFn: () => T,
		resetFn: (obj: T) => void,
		maxSize: number = ANIMATION_CONFIG.MAX_ANIMATION_INSTANCES,
	) {
		this.createFn = createFn;
		this.resetFn = resetFn;
		this.maxSize = maxSize;
	}

	get(): T {
		if (this.pool.length > 0) {
			return this.pool.pop()!;
		}
		return this.createFn();
	}

	release(obj: T): void {
		if (this.pool.length < this.maxSize) {
			this.resetFn(obj);
			this.pool.push(obj);
		}
	}

	clear(): void {
		this.pool.length = 0;
	}

	size(): number {
		return this.pool.length;
	}
}

// Detect user's motion preferences
export function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") return false;

	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Get animation duration based on user preferences
export function getAnimationDuration(baseDuration: number): number {
	if (prefersReducedMotion()) {
		return baseDuration * ANIMATION_CONFIG.REDUCED_MOTION_DURATION;
	}
	return baseDuration;
}

// Get animation scale based on user preferences
export function getAnimationScale(baseScale: number): number {
	if (prefersReducedMotion()) {
		return baseScale * ANIMATION_CONFIG.REDUCED_MOTION_SCALE;
	}
	return baseScale;
}

// Throttle animation updates based on performance
export function createPerformanceThrottledAnimation(
	animationFn: (deltaTime: number) => void,
	fallbackFn?: () => void,
): (deltaTime: number) => void {
	const monitor = AnimationPerformanceMonitor.getInstance();

	return (deltaTime: number) => {
		if (monitor.isCriticalPerformance() && fallbackFn) {
			fallbackFn();
			return;
		}

		if (monitor.isLowPerformance()) {
			// Reduce animation frequency on low performance
			if (Math.random() > 0.5) {
				animationFn(deltaTime);
			}
		} else {
			animationFn(deltaTime);
		}
	};
}

// Cleanup utility for animations
export class AnimationCleanupManager {
	private static instance: AnimationCleanupManager;
	private cleanupTasks: Array<() => void> = [];
	private intervalId: NodeJS.Timeout | null = null;

	static getInstance(): AnimationCleanupManager {
		if (!AnimationCleanupManager.instance) {
			AnimationCleanupManager.instance = new AnimationCleanupManager();
		}
		return AnimationCleanupManager.instance;
	}

	addCleanupTask(task: () => void): void {
		this.cleanupTasks.push(task);

		// Start cleanup interval if not already running
		if (!this.intervalId) {
			this.intervalId = setInterval(() => {
				this.runCleanup();
			}, ANIMATION_CONFIG.CLEANUP_INTERVAL);
		}
	}

	removeCleanupTask(task: () => void): void {
		const index = this.cleanupTasks.indexOf(task);
		if (index > -1) {
			this.cleanupTasks.splice(index, 1);
		}
	}

	private runCleanup(): void {
		this.cleanupTasks.forEach((task) => {
			try {
				task();
			} catch (error) {
				console.warn("Animation cleanup task failed:", error);
			}
		});
	}

	destroy(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		this.cleanupTasks.length = 0;
	}
}

// Hook for animation performance monitoring
export interface AnimationPerformanceHook {
	fps: number;
	isLowPerformance: boolean;
	isCriticalPerformance: boolean;
	startMonitoring: () => void;
	stopMonitoring: () => void;
}

// Optimized requestAnimationFrame with performance monitoring
export function createOptimizedAnimationFrame(
	callback: (deltaTime: number) => void,
	options: {
		targetFPS?: number;
		enablePerformanceMonitoring?: boolean;
		enableFrameLimiting?: boolean;
	} = {},
): () => void {
	const {
		targetFPS = ANIMATION_CONFIG.TARGET_FPS,
		enablePerformanceMonitoring = true,
		enableFrameLimiting = true,
	} = options;

	let animationId: number;
	let lastTime = 0;
	const frameLimiter = enableFrameLimiting ? new FrameRateLimiter(targetFPS) : null;
	const monitor = enablePerformanceMonitoring ? AnimationPerformanceMonitor.getInstance() : null;

	if (monitor) {
		monitor.startMonitoring();
	}

	const animate = (currentTime: number) => {
		const deltaTime = currentTime - lastTime;

		if (!frameLimiter || frameLimiter.shouldRender(currentTime)) {
			callback(deltaTime);
			lastTime = currentTime;
		}

		animationId = requestAnimationFrame(animate);
	};

	animationId = requestAnimationFrame(animate);

	// Return cleanup function
	return () => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
		if (monitor) {
			monitor.stopMonitoring();
		}
	};
}

// Export singleton instances
export const performanceMonitor = AnimationPerformanceMonitor.getInstance();
export const cleanupManager = AnimationCleanupManager.getInstance();
