/**
 * Bundle Size Analysis Utilities
 * Provides tools to analyze and optimize bundle size
 */

// Bundle size analysis configuration
export const BUNDLE_CONFIG = {
	// Size thresholds (in KB)
	THRESHOLDS: {
		SMALL: 50,
		MEDIUM: 200,
		LARGE: 500,
		HUGE: 1000,
	},

	// Critical libraries that should be optimized
	CRITICAL_LIBRARIES: [
		"three",
		"@react-three/fiber",
		"@react-three/drei",
		"react-icons",
		"animejs",
		"motion",
		"lucide-react",
	],

	// Libraries that can be lazy loaded
	LAZY_LOADABLE: ["three", "@react-three/fiber", "@react-three/drei", "animejs"],
} as const;

// Bundle optimization strategies
export const OPTIMIZATION_STRATEGIES = {
	// Tree shaking optimizations
	TREE_SHAKING: {
		"react-icons": {
			issue: "Importing entire icon library",
			solution: "Import specific icons only",
			example: "import { SiReact } from 'react-icons/si'",
			savings: "~200KB",
		},
		"lucide-react": {
			issue: "Large icon library",
			solution: "Use optimizePackageImports in next.config.ts",
			example: "Already configured",
			savings: "~100KB",
		},
		animejs: {
			issue: "Full animation library",
			solution: "Import specific functions only",
			example: "import { timeline } from 'animejs'",
			savings: "~50KB",
		},
	},

	// Code splitting strategies
	CODE_SPLITTING: {
		"3d-components": {
			issue: "Three.js loaded on initial page load",
			solution: "Dynamic import with loading state",
			example: 'dynamic(() => import("./3d-component"))',
			savings: "~600KB from initial bundle",
		},
		"admin-pages": {
			issue: "Admin components in main bundle",
			solution: "Route-based code splitting",
			example: "Already implemented with (admin-only) folder",
			savings: "~100KB",
		},
	},

	// Dependency optimization
	DEPENDENCY_OPTIMIZATION: {
		"date-fns": {
			issue: "Large date utility library",
			solution: "Import specific functions only",
			example: "import { format } from 'date-fns'",
			savings: "~30KB",
		},
		lodash: {
			issue: "Full utility library (if used)",
			solution: "Use lodash-es or specific imports",
			example: "import debounce from 'lodash/debounce'",
			savings: "~50KB",
		},
	},
} as const;

// Bundle analysis results interface
export interface BundleAnalysis {
	totalSize: number;
	gzippedSize: number;
	largestChunks: Array<{
		name: string;
		size: number;
		percentage: number;
	}>;
	optimizationOpportunities: Array<{
		library: string;
		currentSize: number;
		potentialSavings: number;
		strategy: string;
		priority: "high" | "medium" | "low";
	}>;
	recommendations: string[];
}

// Analyze bundle composition (mock analysis based on known libraries)
export function analyzeBundleComposition(): BundleAnalysis {
	// This would normally parse actual bundle stats
	// For now, we'll provide estimated analysis based on common patterns

	const estimatedSizes = {
		three: 600,
		"@react-three/fiber": 100,
		"@react-three/drei": 200,
		"react-icons": 300,
		animejs: 80,
		motion: 150,
		"lucide-react": 120,
		next: 200,
		react: 50,
		"react-dom": 150,
	};

	const totalSize = Object.values(estimatedSizes).reduce((sum, size) => sum + size, 0);
	const gzippedSize = Math.round(totalSize * 0.3); // Rough gzip estimate

	const largestChunks = Object.entries(estimatedSizes)
		.map(([name, size]) => ({
			name,
			size,
			percentage: Math.round((size / totalSize) * 100),
		}))
		.sort((a, b) => b.size - a.size)
		.slice(0, 5);

	const optimizationOpportunities = [
		{
			library: "three",
			currentSize: 600,
			potentialSavings: 200,
			strategy: "Dynamic import + tree shaking",
			priority: "high" as const,
		},
		{
			library: "react-icons",
			currentSize: 300,
			potentialSavings: 200,
			strategy: "Import specific icons only",
			priority: "high" as const,
		},
		{
			library: "@react-three/drei",
			currentSize: 200,
			potentialSavings: 100,
			strategy: "Import specific components only",
			priority: "medium" as const,
		},
		{
			library: "motion",
			currentSize: 150,
			potentialSavings: 50,
			strategy: "Use motion/react instead of framer-motion",
			priority: "medium" as const,
		},
	];

	const recommendations = [
		"Implement dynamic imports for Three.js components",
		"Use specific icon imports instead of entire libraries",
		"Enable tree shaking for all libraries in next.config.ts",
		"Consider using lighter alternatives for heavy libraries",
		"Implement route-based code splitting",
		"Use webpack-bundle-analyzer to get accurate measurements",
	];

	return {
		totalSize,
		gzippedSize,
		largestChunks,
		optimizationOpportunities,
		recommendations,
	};
}

// Generate optimization report
export function generateOptimizationReport(): string {
	const analysis = analyzeBundleComposition();

	const report = `
# Bundle Size Optimization Report

## Current Bundle Analysis
- **Total Size**: ${analysis.totalSize}KB
- **Gzipped Size**: ${analysis.gzippedSize}KB

## Largest Chunks
${analysis.largestChunks.map((chunk) => `- **${chunk.name}**: ${chunk.size}KB (${chunk.percentage}%)`).join("\n")}

## Optimization Opportunities
${analysis.optimizationOpportunities
	.map(
		(opp) =>
			`### ${opp.library} (${opp.priority.toUpperCase()} Priority)
- Current Size: ${opp.currentSize}KB
- Potential Savings: ${opp.potentialSavings}KB
- Strategy: ${opp.strategy}`,
	)
	.join("\n\n")}

## Recommendations
${analysis.recommendations.map((rec) => `- ${rec}`).join("\n")}

## Implementation Priority
1. **High Priority**: Three.js and react-icons optimization (~400KB savings)
2. **Medium Priority**: Component-specific imports (~150KB savings)
3. **Low Priority**: Fine-tuning and polishing (~50KB savings)

Total Potential Savings: **~600KB** (${Math.round((600 / analysis.totalSize) * 100)}% reduction)
`;

	return report.trim();
}

// Check if a library should be dynamically imported
export function shouldBeDynamicallyImported(libraryName: string): boolean {
	return BUNDLE_CONFIG.LAZY_LOADABLE.includes(libraryName as any);
}

// Get optimization strategy for a library
export function getOptimizationStrategy(libraryName: string): string | null {
	const strategies = {
		...OPTIMIZATION_STRATEGIES.TREE_SHAKING,
		...OPTIMIZATION_STRATEGIES.CODE_SPLITTING,
		...OPTIMIZATION_STRATEGIES.DEPENDENCY_OPTIMIZATION,
	};

	return (strategies as any)[libraryName]?.solution || null;
}

// Bundle size categories
export function getBundleSizeCategory(sizeKB: number): {
	category: string;
	color: string;
	recommendation: string;
} {
	if (sizeKB < BUNDLE_CONFIG.THRESHOLDS.SMALL) {
		return {
			category: "Excellent",
			color: "green",
			recommendation: "Bundle size is optimal",
		};
	} else if (sizeKB < BUNDLE_CONFIG.THRESHOLDS.MEDIUM) {
		return {
			category: "Good",
			color: "blue",
			recommendation: "Bundle size is acceptable",
		};
	} else if (sizeKB < BUNDLE_CONFIG.THRESHOLDS.LARGE) {
		return {
			category: "Fair",
			color: "yellow",
			recommendation: "Consider optimization",
		};
	} else if (sizeKB < BUNDLE_CONFIG.THRESHOLDS.HUGE) {
		return {
			category: "Poor",
			color: "orange",
			recommendation: "Optimization needed",
		};
	} else {
		return {
			category: "Critical",
			color: "red",
			recommendation: "Immediate optimization required",
		};
	}
}
