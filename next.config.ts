import type { NextConfig } from "next";
import withDevToolsJSON from "next-plugin-devtools-json";

// Only initialize OpenNext Cloudflare if not on Vercel
if (process.env.VERCEL !== "1") {
	try {
		const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
		initOpenNextCloudflareForDev();
	} catch (error) {
		console.log("OpenNext Cloudflare not available, skipping initialization");
	}
}

const nextConfig: NextConfig = {
	output: "standalone",
};

export default withDevToolsJSON(nextConfig);
