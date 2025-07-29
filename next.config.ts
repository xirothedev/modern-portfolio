import type { NextConfig } from "next";
import withDevToolsJSON from "next-plugin-devtools-json";

const nextConfig: NextConfig = {
	output: "standalone",
};

export default withDevToolsJSON(nextConfig);
