import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://portfolio.xirothedev.workers.dev/";
	const currentDate = new Date().toISOString();

	return [
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${baseUrl}/lethanhtrung-webdeveloper-cv.pdf`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		// External links
		{
			url: "https://github.com/xirothedev",
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: "https://linkedin.com/in/xirothedev",
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: "https://facebook.com/xirothedev",
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.5,
		},
		// Project repositories
		{
			url: "https://github.com/xirothedev/modern-portfolio",
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: "https://github.com/xirothedev/discord.js-template-v14",
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: "https://github.com/xirothedev/discord-bot-dashboard",
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: "https://github.com/xirothedev/xiro-discord-bot-music",
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: "https://github.com/xirothedev/next-15-template",
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.8,
		},
	];
}
