"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

interface Certificate {
	name: string;
	filename: string;
	category: string;
	description: string;
	icon: React.ReactNode;
}

const certificates: Certificate[] = [
	{
		name: "Microsoft PowerPoint Office 2019",
		filename: "MicrosoftPowerPointOffice2019.pdf",
		category: "Microsoft Office",
		description:
			"Professional certification in Microsoft PowerPoint Office 2019, demonstrating advanced presentation and slide design skills.",
		icon: <FileText className="h-8 w-8 text-blue-500" />,
	},
	{
		name: "Microsoft Excel Office 2019",
		filename: "MicrosoftExcelOffice2019.pdf",
		category: "Microsoft Office",
		description:
			"Professional certification in Microsoft Excel Office 2019, showcasing advanced spreadsheet and data analysis capabilities.",
		icon: <FileText className="h-8 w-8 text-green-500" />,
	},
	{
		name: "Microsoft Word Office 2019",
		filename: "MicrosoftWordOffice2019.pdf",
		category: "Microsoft Office",
		description:
			"Professional certification in Microsoft Word Office 2019, highlighting advanced document creation and formatting skills.",
		icon: <FileText className="h-8 w-8 text-blue-600" />,
	},
];

const categories = ["All", "Microsoft Office"];

export default function Certs() {
	const [selectedCategory, setSelectedCategory] = useState("All");

	const filteredCertificates =
		selectedCategory === "All" ? certificates : certificates.filter((cert) => cert.category === selectedCategory);

	const handleDownload = (filename: string) => {
		const link = document.createElement("a");
		link.href = `/certs/${filename}`;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleView = (filename: string) => {
		window.open(`/certs/${filename}`, "_blank");
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<div className="border-b border-zinc-800">
				<div className="container mx-auto px-4 py-8">
					<div className="mb-6 flex items-center justify-between">
						<Link href="/">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Home
							</Button>
						</Link>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
							Professional Certificates
						</h1>
						<p className="max-w-2xl text-xl text-zinc-400">
							Explore my professional certifications and achievements that demonstrate my expertise and
							commitment to continuous learning.
						</p>
					</motion.div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="mb-8"
				>
					<div className="flex flex-wrap gap-2">
						{categories.map((category) => (
							<Button
								key={category}
								variant={selectedCategory === category ? "default" : "outline"}
								size="sm"
								onClick={() => setSelectedCategory(category)}
								className="transition-all duration-200 hover:scale-105"
							>
								{category}
							</Button>
						))}
					</div>
				</motion.div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredCertificates.map((cert, index) => (
						<motion.div
							key={cert.filename}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							whileHover={{ y: -5 }}
							className="group"
						>
							<Card className="h-full border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-purple-500/20">
								<CardHeader className="pb-4">
									<div className="flex items-start justify-between">
										<div className="flex items-center space-x-3">
											{cert.icon}
											<div>
												<CardTitle className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-purple-400">
													{cert.name}
												</CardTitle>
												<Badge
													variant="secondary"
													className="mt-2 border-purple-500/30 bg-purple-500/20 text-purple-300"
												>
													{cert.category}
												</Badge>
											</div>
										</div>
									</div>
								</CardHeader>

								<CardContent className="pt-0">
									<CardDescription className="mb-6 line-clamp-3 text-zinc-400">
										{cert.description}
									</CardDescription>

									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleView(cert.filename)}
											className="flex-1 border-zinc-700 transition-all duration-200 hover:border-purple-500 hover:bg-purple-500/10"
										>
											<ExternalLink className="mr-2 h-4 w-4" />
											View
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDownload(cert.filename)}
											className="flex-1 border-zinc-700 transition-all duration-200 hover:border-green-500 hover:bg-green-500/10"
										>
											<Download className="mr-2 h-4 w-4" />
											Download
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				{filteredCertificates.length === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="py-12 text-center"
					>
						<div className="text-lg text-zinc-400">No certificates found in the selected category.</div>
					</motion.div>
				)}
			</div>
		</div>
	);
}
