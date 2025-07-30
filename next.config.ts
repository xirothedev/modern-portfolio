import type { NextConfig } from "next";
import withDevToolsJSON from "next-plugin-devtools-json";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
	output: "standalone",
	experimental: {
		optimizePackageImports: ["lucide-react", "react-icons", "@radix-ui/react-icons", "animejs", "date-fns"],
		optimizeCss: true,
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

export default withDevToolsJSON(withSerwist(nextConfig));
