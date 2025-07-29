import type { NextConfig } from "next";
import withDevToolsJSON from "next-plugin-devtools-json";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();
const nextConfig: NextConfig = {
	output: "standalone",
};

export default withDevToolsJSON(nextConfig);
