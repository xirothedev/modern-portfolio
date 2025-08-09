import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/cms/", "/admin/", "/*.json$", "/*.xml$", "/*.txt$"],
				crawlDelay: 10,
			},
			{
				userAgent: "Googlebot-Image",
				allow: ["/", "/*.jpg", "/*.jpeg", "/*.png", "/*.gif", "/*.webp", "/*.avif"],
			},
		],
		sitemap: "https://xiro-portfolio.vercel.app/sitemap.xml",
	};
}
