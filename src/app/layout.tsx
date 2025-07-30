import type React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
	title: "Xiro The Dev - Web Developer",
	description: "Xiro's Portfolio - Full Stack & Discord Bot Developer",
	keywords: ["Web Developer", "Full Stack", "Discord Bot", "React", "Next.js", "TypeScript"],
	authors: [{ name: "Xiro The Dev" }],
	creator: "Xiro The Dev",
	publisher: "Xiro The Dev",
	robots: "index, follow",
	openGraph: {
		title: "Xiro The Dev - Web Developer",
		description: "Xiro's Portfolio - Full Stack & Discord Bot Developer",
		type: "website",
		locale: "vi_VN",
	},
	twitter: {
		card: "summary_large_image",
		title: "Xiro The Dev - Web Developer",
		description: "Xiro's Portfolio - Full Stack & Discord Bot Developer",
	},
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
	manifest: "/manifest.json",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: "#000000",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* Preconnect to external domains */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="preconnect" href="https://api.github.com" />
				<link rel="preconnect" href="https://vercel.live" />

				{/* Preload critical resources */}
				<link rel="preload" href="/thumbnail.jpeg" as="image" type="image/jpeg" />
				<link rel="preload" href="/placeholder.svg" as="image" type="image/svg+xml" />

				{/* DNS prefetch for performance */}
				<link rel="dns-prefetch" href="//fonts.googleapis.com" />
				<link rel="dns-prefetch" href="//api.github.com" />
				<link rel="dns-prefetch" href="//vercel.live" />
			</head>
			<body id="home" className="scroll-smooth">
				<div className="min-h-screen overflow-hidden bg-linear-to-b from-zinc-900 via-zinc-900 to-black text-white">
					{children}
					<Footer />
					<Analytics />
				</div>
			</body>
		</html>
	);
}
