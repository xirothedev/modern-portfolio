import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";

import type React from "react";

import Footer from "@/components/footer";
import { MouseFollower } from "@/components/mouse-follower";
import { ScrollProgress } from "@/components/scroll-progress";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_BASE_URL ??
			(process.env.NODE_ENV === "production" ? "https://xiro-portfolio.vercel.app" : "http://localhost:3000"),
	),
	applicationName: "Xiro The Dev - Portfolio",
	title: { default: "Xiro The Dev - Web Developer", template: "Xiro | %s" },
	description: "Xiro's Portfolio - Full Stack & Discord Bot Developer",
	keywords: ["Web Developer", "Full Stack", "Discord Bot", "React", "Next.js", "TypeScript"],
	authors: [{ name: "Xiro The Dev", url: "https://github.com/xirothedev/" }],
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
	formatDetection: {
		email: true,
		address: false,
		telephone: false,
	},
	referrer: "origin-when-cross-origin",
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
		<ClerkProvider
			appearance={{
				baseTheme: [dark],
				variables: {
					colorPrimary: "#a855f7", // Purple-500 to match your blob animation
					colorBackground: "#18181b", // Zinc-900 to match your background
					colorText: "#ffffff",
					colorInputText: "#ffffff",
					colorInputBackground: "#27272a", // Zinc-800 for subtle contrast
					borderRadius: "0.5rem",
				},
				elements: {
					card: "backdrop-blur-lg bg-zinc-900/50",
					formButtonPrimary: "bg-purple-500 hover:bg-purple-600",
					socialButtonsIconButton: "hover:bg-zinc-800",
					footerActionLink: "text-purple-400 hover:text-purple-300",
				},
			}}
		>
			<html lang="en" dir="ltr" suppressHydrationWarning>
				<GoogleAnalytics gaId="G-MGK3BM8C3J" />
				<GoogleTagManager gtmId="GTM-MMWR3898" />

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
					<MouseFollower />
					<ScrollProgress />
					<div className="pointer-events-none absolute inset-0 z-0">
						<div className="animate-blob absolute top-20 left-10 h-72 w-72 rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
						<div className="animate-blob animation-delay-2000 absolute top-40 right-10 h-72 w-72 rounded-full bg-yellow-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
						<div className="animate-blob animation-delay-4000 absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-pink-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
					</div>
					<div className="min-h-screen overflow-hidden bg-linear-to-b from-zinc-900 via-zinc-900 to-black text-white">
						{children}
						<Footer />
						<Analytics />
						<Toaster />
					</div>
				</body>
			</html>
		</ClerkProvider>
	);
}
