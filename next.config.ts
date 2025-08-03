import withBundleAnalyzer from "@next/bundle-analyzer";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";
import withDevToolsJSON from "next-plugin-devtools-json";

const nextConfig: NextConfig = {
	output: "standalone",
	turbopack: {
		rules: {
			"*.svg": {
				loaders: ["@svgr/webpack"],
				as: "*.js",
			},
		},
	},
	experimental: {
		optimizePackageImports: [
			"lucide-react",
			"react-icons",
			"@radix-ui/react-icons",
			"animejs",
			"date-fns",
			"three",
			"@react-three/fiber",
			"@react-three/drei",
		],
		optimizeCss: true,
		viewTransition: true,
	},
	// Nginx will do gzip compression. We disable
	// compression here so we can prevent buffering
	// streaming responses
	// compress: false,

	// Optional: override the default (1 year) `stale-while-revalidate`
	// header time for static pages
	// swrDelta: 3600 // seconds
};

const withSerwist = withSerwistInit({
	swSrc: "src/app/sw.ts",
	swDest: "public/sw.js",
	disable: process.env.NODE_ENV !== "production",
	dontCacheBustURLsMatching: /^dist\/static\/([a-zA-Z0-9]+)\.([a-z0-9]+)\.(css|js)$/,
	include: [/\.(js|css|json)$/, ({ asset }) => asset.name.startsWith("client/")],
	exclude: [/\.map$/, /^manifest.*\.js$/, ({ asset }) => asset.name.startsWith("server/")],
});

const withAnalyzer = withBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

export default withDevToolsJSON(withSerwist(withAnalyzer(nextConfig)));
