"use client";

import { AlertCircle } from "lucide-react";

interface ErrorPageProps {
	message?: string;
}

export default function ErrorPage({ message }: ErrorPageProps) {
	return (
		<div className="min-h-screen bg-zinc-900 px-4 py-8">
			<div className="mx-auto max-w-4xl">
				<div className="py-12 text-center">
					<div className="mb-6">
						<AlertCircle className="mx-auto mb-4 h-20 w-20 text-red-500" />
						<h3 className="mb-2 text-2xl font-bold text-white">Access Token Invalid</h3>
						<p className="mb-4 text-lg text-zinc-300">
							{message || "The provided access token is invalid or has expired."}
						</p>
					</div>

					<div className="mb-6 rounded-lg border border-red-200/20 bg-red-900/20 p-6">
						<h4 className="mb-2 font-semibold text-red-300">What went wrong?</h4>
						<div className="space-y-1 text-sm text-red-200">
							<p>• Token may have expired</p>
							<p>• Token has already been used</p>
							<p>• Invalid or missing token</p>
							<p>• Please contact your administrator</p>
						</div>
					</div>

					<div className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm">
						<h4 className="mb-3 text-lg font-semibold text-zinc-200">Troubleshooting Steps</h4>
						<div className="space-y-2 text-sm text-zinc-300">
							<p>1. Check if you have the correct access link</p>
							<p>2. Ensure the token hasn&apos;t expired</p>
							<p>3. Contact your system administrator</p>
							<p>4. Try accessing the link again</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
