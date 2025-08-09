import { Facebook, Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Footer() {
	return (
		<footer className="relative overflow-hidden border-t border-zinc-800 py-12">
			<div className="animate-border-flow absolute top-0 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-[length:300%_300%] opacity-90" />
			<div className="relative z-10 container flex flex-col items-center justify-between gap-8 md:flex-row">
				<div>
					<Link href="/" className="text-xl font-bold">
						<span className="bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
							Xiro{" "}
						</span>
						<span className="text-white">The Dev</span>
					</Link>
					<p className="mt-2 text-sm text-zinc-500">
						© {new Date().getFullYear()} Xiro The Dev. All rights reserved.
					</p>
				</div>
				<div className="flex gap-4">
					{[
						{
							href: "https://github.com/xirothedev",
							icon: <Github className="h-5 w-5" />,
							label: "GitHub",
							external: true,
						},
						{
							href: "https://www.linkedin.com/in/xirothedev/",
							icon: <Linkedin className="h-5 w-5" />,
							label: "LinkedIn",
							external: true,
						},
						{
							href: "mailto:lethanhtrung.trungle@gmail.com",
							icon: <Mail className="h-5 w-5" />,
							label: "Email",
							external: false,
						},
						{
							href: "https://discord.com/users/1216624112139632711",
							icon: <MessageCircle className="h-5 w-5" />,
							label: "Discord",
							external: true,
						},
						{
							href: "https://www.facebook.com/xirothedev",
							icon: <Facebook className="h-5 w-5" />,
							label: "Facebook",
							external: true,
						},
					].map(({ href, icon, label, external }) => (
						<Link
							key={label}
							href={href}
							{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
						>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white"
							>
								{icon}
								<span className="sr-only">{label}</span>
							</Button>
						</Link>
					))}
				</div>
			</div>

			{/* Navigation Links */}
			<div className="relative z-10 container mt-8 border-t border-zinc-800 pt-8">
				<div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-12">
					<div className="flex flex-wrap justify-center gap-6 text-sm">
						{[
							{ href: "/", label: "Home" },
							{ href: "/projects", label: "Projects" },
							// { href: "/blogs", label: "Blogs" },
							// { href: "/contact", label: "Contact" },
						].map(({ href, label }) => (
							<Link key={label} href={href} className="text-zinc-400 transition-colors hover:text-white">
								{label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
