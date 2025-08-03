"use client";

import { CheckCircle, ExternalLink, Github, Home } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface SuccessPageProps {
	repoName: string;
}

export default function SuccessPage({ repoName }: SuccessPageProps) {
	const orgRepo = `xirothedev-minor/${repoName.split("/")[1]}`;

	return (
		<div className="min-h-screen bg-zinc-900 px-4 py-8">
			<div className="mx-auto max-w-4xl">
				<div className="py-12 text-center">
					<div className="mb-6">
						<CheckCircle className="mx-auto mb-4 h-20 w-20 text-green-500" />
						<h3 className="mb-2 text-2xl font-bold text-white">Access Granted Successfully!</h3>
						<p className="mb-4 text-lg text-zinc-300">
							Access to <span className="font-semibold text-blue-400">{orgRepo}</span> has been granted.
						</p>
					</div>

					<div className="mb-6 rounded-lg border border-green-200/20 bg-green-900/20 p-6">
						<h4 className="mb-2 font-semibold text-green-300">What happens next?</h4>
						<div className="space-y-1 text-sm text-green-200">
							<p>✓ Repository access has been granted</p>
							<p>✓ You can now clone and view the repository</p>
							<p>✓ Access permissions are active immediately</p>
							<p>✓ Contact support if you encounter any issues</p>
						</div>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
						<Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
							<Home className="mr-2 h-4 w-4" />
							<Link href="/">Back to Homepage</Link>
						</Button>
						<Button
							asChild
							className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500"
						>
							<Link href={`https://github.com/${orgRepo}`} target="_blank" rel="noopener noreferrer">
								<Github className="mr-2 h-4 w-4" />
								View Repository
								<ExternalLink className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
