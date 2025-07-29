import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

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
				{children}
			</body>
		</html>
	);
}
