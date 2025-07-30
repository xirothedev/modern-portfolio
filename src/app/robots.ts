import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/_next/",
					"/admin/",
					"/*.json$",
					"/*.xml$",
					"/*.txt$",
					"/.env",
					"/.git/",
					"/node_modules/",
					"/package.json",
					"/package-lock.json",
					"/pnpm-lock.yaml",
				],
			},
			{
				userAgent: "Googlebot",
				allow: "/",
				crawlDelay: 1,
			},
			{
				userAgent: "Googlebot-Image",
				allow: ["/", "/*.jpg", "/*.jpeg", "/*.png", "/*.gif", "/*.webp", "/*.avif"],
			},
			{
				userAgent: "Googlebot-Mobile",
				allow: "/",
			},
			{
				userAgent: "Bingbot",
				allow: "/",
				crawlDelay: 1,
			},
			{
				userAgent: "Twitterbot",
				allow: "/",
			},
			{
				userAgent: "facebookexternalhit",
				allow: "/",
			},
			{
				userAgent: "LinkedInBot",
				allow: "/",
			},
			{
				userAgent: "WhatsApp",
				allow: "/",
			},
			// Block bad bots
			{
				userAgent: "AhrefsBot",
				disallow: "/",
			},
			{
				userAgent: "SemrushBot",
				disallow: "/",
			},
			{
				userAgent: "MJ12bot",
				disallow: "/",
			},
			{
				userAgent: "DotBot",
				disallow: "/",
			},
			{
				userAgent: "ia_archiver",
				disallow: "/",
			},
		],
		sitemap: "https://portfolio.xirothedev.workers.dev/sitemap.xml",
	};
}
