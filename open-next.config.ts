// Only load OpenNext Cloudflare if not on Vercel
if (process.env.VERCEL !== "1") {
	const { defineCloudflareConfig } = require("@opennextjs/cloudflare");

	module.exports = defineCloudflareConfig({
		// Uncomment to enable R2 cache,
		// It should be imported as:
		// `import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";`
		// See https://opennext.js.org/cloudflare/caching for more details
		// incrementalCache: r2IncrementalCache,
	});
} else {
	// Export empty config for Vercel
	module.exports = {};
}
