#!/usr/bin/env node

/**
 * Bundle Size Analysis Script
 * Analyzes bundle size and provides optimization recommendations
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Colors for console output
const colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
};

function colorize(text, color) {
	return `${colors[color]}${text}${colors.reset}`;
}

// Bundle size thresholds (in KB)
const THRESHOLDS = {
	EXCELLENT: 100,
	GOOD: 250,
	FAIR: 500,
	POOR: 1000,
};

// Get bundle size category
function getBundleCategory(sizeKB) {
	if (sizeKB < THRESHOLDS.EXCELLENT) return { category: "EXCELLENT", color: "green" };
	if (sizeKB < THRESHOLDS.GOOD) return { category: "GOOD", color: "blue" };
	if (sizeKB < THRESHOLDS.FAIR) return { category: "FAIR", color: "yellow" };
	if (sizeKB < THRESHOLDS.POOR) return { category: "POOR", color: "red" };
	return { category: "CRITICAL", color: "red" };
}

// Analyze package.json dependencies
function analyzeDependencies() {
	const packagePath = path.join(process.cwd(), "package.json");
	const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

	const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

	// Heavy libraries that should be optimized
	const heavyLibraries = {
		three: { size: 600, optimization: "Dynamic import + tree shaking" },
		"@react-three/fiber": { size: 100, optimization: "Import specific components" },
		"@react-three/drei": { size: 200, optimization: "Import specific helpers" },
		"react-icons": { size: 300, optimization: "Import specific icons only" },
		animejs: { size: 80, optimization: "Import specific functions" },
		motion: { size: 150, optimization: "Use motion/react for smaller bundle" },
		"framer-motion": { size: 200, optimization: "Switch to motion/react" },
		"lucide-react": { size: 120, optimization: "Already optimized with Next.js" },
		"date-fns": { size: 200, optimization: "Import specific functions" },
		lodash: { size: 300, optimization: "Use lodash-es or specific imports" },
		moment: { size: 300, optimization: "Switch to date-fns or dayjs" },
		recharts: { size: 400, optimization: "Dynamic import for charts" },
		"chart.js": { size: 250, optimization: "Dynamic import for charts" },
	};

	const foundHeavyLibs = [];
	let totalEstimatedSize = 0;

	Object.keys(dependencies).forEach((dep) => {
		if (heavyLibraries[dep]) {
			foundHeavyLibs.push({
				name: dep,
				...heavyLibraries[dep],
				version: dependencies[dep],
			});
			totalEstimatedSize += heavyLibraries[dep].size;
		}
	});

	return { foundHeavyLibs, totalEstimatedSize };
}

// Check for optimization opportunities
function checkOptimizations() {
	const optimizations = [];

	// Check if bundle analyzer is configured
	const nextConfigPath = path.join(process.cwd(), "next.config.ts");
	if (fs.existsSync(nextConfigPath)) {
		const nextConfig = fs.readFileSync(nextConfigPath, "utf8");
		if (nextConfig.includes("@next/bundle-analyzer")) {
			optimizations.push({
				type: "CONFIGURED",
				message: "✅ Bundle analyzer is configured",
				impact: "Analysis ready",
			});
		} else {
			optimizations.push({
				type: "MISSING",
				message: "❌ Bundle analyzer not found",
				impact: "Install @next/bundle-analyzer",
			});
		}

		if (nextConfig.includes("optimizePackageImports")) {
			optimizations.push({
				type: "CONFIGURED",
				message: "✅ Package import optimization enabled",
				impact: "Tree shaking active",
			});
		}
	}

	// Check for dynamic imports
	const srcPath = path.join(process.cwd(), "src");
	if (fs.existsSync(srcPath)) {
		const files = getAllFiles(srcPath, [".tsx", ".ts", ".jsx", ".js"]);
		let dynamicImports = 0;
		let heavyImports = 0;

		files.forEach((file) => {
			const content = fs.readFileSync(file, "utf8");
			if (content.includes("dynamic(")) dynamicImports++;
			if (content.includes("three") || content.includes("react-three")) heavyImports++;
		});

		optimizations.push({
			type: "INFO",
			message: `📊 Found ${dynamicImports} dynamic imports`,
			impact: dynamicImports > 0 ? "Code splitting active" : "Consider adding dynamic imports",
		});

		if (heavyImports > 0) {
			optimizations.push({
				type: "INFO",
				message: `🎮 Found ${heavyImports} files with 3D libraries`,
				impact: "Ensure these are dynamically imported",
			});
		}
	}

	return optimizations;
}

// Get all files with specific extensions
function getAllFiles(dirPath, extensions) {
	const files = [];

	function traverse(currentPath) {
		const items = fs.readdirSync(currentPath);

		items.forEach((item) => {
			const fullPath = path.join(currentPath, item);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory() && !item.startsWith(".") && item !== "node_modules") {
				traverse(fullPath);
			} else if (stat.isFile() && extensions.some((ext) => item.endsWith(ext))) {
				files.push(fullPath);
			}
		});
	}

	traverse(dirPath);
	return files;
}

// Generate recommendations
function generateRecommendations(analysis) {
	const recommendations = [];

	if (analysis.totalEstimatedSize > THRESHOLDS.FAIR) {
		recommendations.push("🚨 High bundle size detected - implement code splitting");
	}

	if (analysis.foundHeavyLibs.some((lib) => lib.name === "three")) {
		recommendations.push("🎮 Three.js detected - ensure dynamic import for 3D components");
	}

	if (analysis.foundHeavyLibs.some((lib) => lib.name === "react-icons")) {
		recommendations.push("🎨 React Icons - import specific icons only");
	}

	if (analysis.foundHeavyLibs.some((lib) => lib.name === "framer-motion")) {
		recommendations.push("🎬 Consider switching from framer-motion to motion/react");
	}

	if (analysis.foundHeavyLibs.some((lib) => lib.name === "moment")) {
		recommendations.push("📅 Replace moment.js with date-fns or dayjs");
	}

	recommendations.push("📦 Run `ANALYZE=true pnpm build` for detailed bundle analysis");
	recommendations.push("🔍 Use webpack-bundle-analyzer for visual bundle inspection");
	recommendations.push("⚡ Implement route-based code splitting for admin pages");

	return recommendations;
}

// Main analysis function
function runAnalysis() {
	console.log(colorize("\n🔍 Bundle Size Analysis Report", "bright"));
	console.log(colorize("=====================================", "cyan"));

	// Analyze dependencies
	const analysis = analyzeDependencies();
	const { category, color } = getBundleCategory(analysis.totalEstimatedSize);

	console.log(colorize(`\n📊 Estimated Bundle Size: ${analysis.totalEstimatedSize}KB (${category})`, color));

	if (analysis.foundHeavyLibs.length > 0) {
		console.log(colorize("\n📦 Heavy Dependencies Found:", "yellow"));
		analysis.foundHeavyLibs.forEach((lib) => {
			console.log(`  • ${colorize(lib.name, "bright")} (~${lib.size}KB) - ${lib.optimization}`);
		});
	}

	// Check optimizations
	const optimizations = checkOptimizations();
	console.log(colorize("\n⚙️  Optimization Status:", "blue"));
	optimizations.forEach((opt) => {
		const color = opt.type === "CONFIGURED" ? "green" : opt.type === "MISSING" ? "red" : "yellow";
		console.log(`  ${opt.message} - ${colorize(opt.impact, color)}`);
	});

	// Generate recommendations
	const recommendations = generateRecommendations(analysis);
	console.log(colorize("\n💡 Recommendations:", "magenta"));
	recommendations.forEach((rec) => {
		console.log(`  ${rec}`);
	});

	// Performance score
	let score = 100;
	if (analysis.totalEstimatedSize > THRESHOLDS.EXCELLENT) score -= 20;
	if (analysis.totalEstimatedSize > THRESHOLDS.GOOD) score -= 20;
	if (analysis.totalEstimatedSize > THRESHOLDS.FAIR) score -= 30;
	if (analysis.totalEstimatedSize > THRESHOLDS.POOR) score -= 30;

	const scoreColor = score >= 80 ? "green" : score >= 60 ? "yellow" : "red";
	console.log(colorize(`\n🎯 Bundle Optimization Score: ${score}/100`, scoreColor));

	// Next steps
	console.log(colorize("\n🚀 Next Steps:", "cyan"));
	console.log("  1. Run bundle analyzer: ANALYZE=true pnpm build");
	console.log("  2. Implement dynamic imports for heavy components");
	console.log("  3. Use specific imports instead of entire libraries");
	console.log("  4. Consider lighter alternatives for large dependencies");

	console.log(colorize("\n=====================================\n", "cyan"));
}

// Run the analysis
if (require.main === module) {
	runAnalysis();
}

module.exports = { runAnalysis, analyzeDependencies, getBundleCategory };
