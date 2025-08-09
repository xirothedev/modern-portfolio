import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, NetworkOnly, CacheFirst, NetworkFirst } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
	interface WorkerGlobalScope extends SerwistGlobalConfig {
		__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
	}
}

declare const self: ServiceWorkerGlobalScope;

const customRuntimeCaching = [
	{
		matcher: ({ url }: { url: URL }) =>
			[
				"www.googletagmanager.com",
				"www.google-analytics.com",
				"connect.facebook.net",
				"analytics.tiktok.com",
				"www.clarity.ms",
				"script.hotjar.com",
				"vitals.vercel-insights.com",
			].includes(url.hostname) || url.pathname.startsWith("/_vercel/insights/"),
		handler: new NetworkOnly(),
	},
	{
		matcher: ({ url }: { url: URL }) =>
			url.pathname.startsWith("/_next/static/") ||
			url.pathname.match(/\.(?:png|jpg|jpeg|svg|gif|webp|avif|mp4|ico)$/),
		handler: new CacheFirst({
			cacheName: "static-assets",
			plugins: [
				{
					cacheWillUpdate: async ({ response }) => (response && response.status === 200 ? response : null),
				},
			],
		}),
	},
	{
		matcher: ({ url }: { url: URL }) => url.pathname.match(/\.(?:woff|woff2|ttf|otf|eot)$/),
		handler: new CacheFirst({
			cacheName: "fonts",
		}),
	},
	{
		matcher: ({ url }: { url: URL }) => url.pathname.startsWith("/api/"),
		handler: new NetworkFirst({
			cacheName: "api-cache",
			networkTimeoutSeconds: 3,
		}),
	},
	...defaultCache,
];

const serwist = new Serwist({
	precacheEntries: self.__SW_MANIFEST,
	skipWaiting: true,
	clientsClaim: true,
	navigationPreload: true,
	runtimeCaching: customRuntimeCaching,
});

serwist.addEventListeners();
