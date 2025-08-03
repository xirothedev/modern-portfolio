"use client";

import { AlertCircle, Calendar, Github, Lock, Users } from "lucide-react";
import { notFound, useSearchParams } from "next/navigation";
import { use, useEffect, useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { checkToken, grantAccess } from "./actions";
import ErrorPage from "./error";
import SuccessPage from "./success";

type SubmitStatus = "idle" | "success" | "error";

interface ProjectPageProps {
	params: Promise<{ slug: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = use(params);
	const [project, setProject] = useState<any>(null);
	const [projectLoading, setProjectLoading] = useState(true);
	const [username, setUsername] = useState<string>("");
	const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [tokenValid, setTokenValid] = useState<boolean | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const searchParams = useSearchParams();
	const [pending, startTransition] = useTransition();
	const token = searchParams.get("token");
	const { toast } = useToast();

	// Fetch project data
	useEffect(() => {
		const fetchProject = async () => {
			try {
				const response = await fetch(`/api/projects/${slug}`);
				if (!response.ok) {
					throw new Error("Project not found");
				}
				const projectData = await response.json();
				setProject(projectData);
			} catch (error) {
				console.error("Error fetching project:", error);
				setProject(null);
			} finally {
				setProjectLoading(false);
			}
		};

		fetchProject();
	}, [slug]);

	// Validate token
	useEffect(() => {
		if (!token) {
			setTokenValid(false);
			setLoading(false);
			return;
		}

		const validateToken = async () => {
			try {
				const result = await checkToken(token, slug);
				setTokenValid(result.valid);
				if (!result.valid) {
					setErrorMessage(result.message ?? "Server error");
				}
			} catch {
				setTokenValid(false);
				setErrorMessage("Error validating token");
			} finally {
				setLoading(false);
			}
		};

		validateToken();
	}, [token, slug]);

	const onSubmit = () => {
		startTransition(async () => {
			const result = await grantAccess({ username, token: token!, slug });
			if (result.success) {
				setSubmitStatus("success");
			} else {
				setSubmitStatus("error");
				setErrorMessage(result.message);
			}
			toast({
				title: result.success ? "Success" : "Failed",
				description: result.message,
			});
		});
	};

	// Loading states
	if (projectLoading || loading) {
		return (
			<div className="min-h-screen bg-zinc-900 px-4 py-8">
				<div className="mx-auto max-w-4xl">
					<div className="py-12 text-center">
						<div className="mb-6">
							<div className="mx-auto mb-4 h-20 w-20 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
							<h3 className="mb-2 text-2xl font-bold text-white">
								{projectLoading ? "Loading Project..." : "Validating Access Token"}
							</h3>
							<p className="text-lg text-zinc-300">
								{projectLoading
									? "Please wait while we load project details..."
									: "Please wait while we verify your credentials..."}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Project not found
	if (!project) {
		notFound();
	}

	// Token validation failed
	if (!tokenValid || !token) {
		return <ErrorPage message={errorMessage} />;
	}

	// Success state
	if (submitStatus === "success") {
		return <SuccessPage repoName={project.repoName} />;
	}

	const orgRepo = `xirothedev-minor/${project.repoName.split("/")[1]}`;

	return (
		<div className="min-h-screen bg-zinc-900 px-4 py-8">
			<div className="mx-auto max-w-4xl">
				{/* Header Section */}
				<div className="mb-8 text-center">
					<div className="mb-4 flex items-center justify-center gap-3">
						<div className="rounded-full bg-zinc-800/50 p-3">
							<Github className="h-8 w-8 text-blue-400" />
						</div>
						<h1 className="text-4xl font-bold text-white">Repository Access Portal</h1>
					</div>
					<p className="mx-auto max-w-2xl text-lg text-zinc-300">
						Grant access to private repositories and manage GitHub permissions securely
					</p>
				</div>

				{/* Repository Info Card */}
				<Card className="relative mb-8 overflow-hidden border-zinc-700/50 bg-zinc-800/50 shadow-lg backdrop-blur-sm">
					<div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>
					<CardHeader className="pb-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Lock className="h-5 w-5 text-zinc-400" />
								<div>
									<CardTitle className="text-xl text-white">Target Repository</CardTitle>
									<CardDescription className="text-zinc-400">
										Private repository access request
									</CardDescription>
								</div>
							</div>
							<Badge variant="secondary" className="border-red-700/50 bg-red-900/30 text-red-300">
								<Lock className="mr-1 h-3 w-3" />
								Private
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="rounded-lg bg-zinc-900/50 p-4">
							<div className="mb-2 flex items-center gap-2">
								<Github className="h-4 w-4 text-zinc-400" />
								<span className="font-mono text-lg font-semibold text-blue-400">{orgRepo}</span>
							</div>
							<div className="mt-4 grid grid-cols-1 gap-4 text-sm text-zinc-400 md:grid-cols-3">
								<div className="flex items-center gap-2">
									<Users className="h-4 w-4" />
									<span>HR Access Required</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									<span>24h Processing Time</span>
								</div>
								<div className="flex items-center gap-2">
									<Lock className="h-4 w-4" />
									<span>Read-Only Access</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Main Form Card */}
				<Card className="border-0 border-zinc-700/50 bg-zinc-800/50 shadow-xl backdrop-blur-sm">
					<CardHeader className="pb-6 text-center">
						<CardTitle className="flex items-center justify-center gap-2 text-2xl text-white">
							<Users className="h-6 w-6 text-blue-400" />
							Repository Access Request
						</CardTitle>
						<CardDescription className="text-base text-zinc-300">
							Enter the GitHub username to grant access to this repository
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
									<Github className="h-4 w-4" />
									GitHub Username *
								</label>
								<Input
									placeholder="Enter GitHub username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
									disabled={pending}
									className="border-zinc-700 bg-zinc-900/50 text-white selection:bg-blue-500 selection:text-white placeholder:text-zinc-400 focus:border-blue-500 focus:ring-blue-500/20"
								/>
								<p className="text-xs text-zinc-400">
									Enter the GitHub username to grant access to this repository
								</p>
							</div>

							{submitStatus === "error" && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{errorMessage}</AlertDescription>
								</Alert>
							)}

							<Button
								onClick={onSubmit}
								type="button"
								disabled={pending || !username.trim()}
								className="w-full bg-gradient-to-r from-blue-500 to-purple-500 py-6 text-lg hover:from-purple-500 hover:to-blue-500"
							>
								{pending ? (
									<>
										<div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
										Processing Request...
									</>
								) : (
									<>
										<Users className="mr-2 h-5 w-5" />
										Grant Repository Access
									</>
								)}
							</Button>

							{/* Repository Info Summary */}
							<div className="rounded-lg border border-blue-900/30 bg-blue-900/20 p-6">
								<div className="flex items-start gap-4">
									<div className="mt-1 text-blue-400">
										<Github className="h-6 w-6" />
									</div>
									<div className="flex-1">
										<h4 className="mb-3 text-lg font-semibold text-blue-200">Request Summary</h4>
										<div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
											<div>
												<p className="text-blue-300">
													<strong>Target Repository:</strong> {orgRepo}
												</p>
												<p className="text-blue-300">
													<strong>GitHub User:</strong> {username || "Not specified"}
												</p>
											</div>
											<div>
												<p className="text-blue-300">
													<strong>Access Type:</strong> Private Repository
												</p>
												<p className="text-blue-300">
													<strong>Permission Level:</strong> Read-only
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Info Section */}
				<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
					<Card className="border-green-800/50 bg-zinc-800/50 backdrop-blur-sm">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-lg text-green-300">
								<div className="h-2 w-2 rounded-full bg-green-500"></div>
								Access Process
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm text-zinc-300">
							<p>• Submit your GitHub username and details</p>
							<p>• Auto check and grant you access to a minor repository</p>
							<p>• You&apos;ll receive email notification upon approval</p>
							<p>• Access is granted with appropriate permissions</p>
						</CardContent>
					</Card>

					<Card className="border-blue-800/50 bg-zinc-800/50 backdrop-blur-sm">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-lg text-blue-300">
								<div className="h-2 w-2 rounded-full bg-blue-500"></div>
								Security Notice
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm text-zinc-300">
							<p>• All requests are logged for security audit</p>
							<p>• Access is granted based on intended use</p>
							<p>• Permissions will be removed 3 days after being granted</p>
							<p>• Contact IT support for access issues</p>
						</CardContent>
					</Card>
				</div>

				{/* Footer */}
				<div className="mt-12 border-t border-zinc-700 pt-8 text-center text-sm text-zinc-400">
					<p className="mb-2">
						<strong>Need help?</strong> Contact the IT Support team or HR department
					</p>
					<p>
						This system is monitored for security and compliance purposes.
						<br />
						All repository access requests are subject to organizational policies.
					</p>
				</div>
			</div>
		</div>
	);
}
