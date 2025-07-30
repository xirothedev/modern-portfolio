import type { NextConfig } from "next";
import withDevToolsJSON from "next-plugin-devtools-json";

const nextConfig: NextConfig = {
	output: "standalone",
	experimental: {
		optimizePackageImports: ["lucide-react", "react-icons", "@radix-ui/react-icons", "animejs", "date-fns"],
		optimizeCss: true,
	},
};

export default withDevToolsJSON(nextConfig);
