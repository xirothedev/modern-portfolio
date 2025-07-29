import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
	title: "Xiro The Dev - Web Developer",
	description: "Xiro's Portfolio - Full Stack & Discord Bot Developer",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
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
