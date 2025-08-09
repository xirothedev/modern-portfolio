"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchGitHubReadme, processMarkdownContent } from "@/lib/readme-utils";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";

interface ReadmeViewerProps {
	repoUrl: string;
	projectTitle: string;
}

// GitHub-like markdown components
const MarkdownComponents = {
	// Code blocks with syntax highlighting
	code({ inline, className, children, ...props }: any) {
		const match = /language-(\w+)/.exec(className || "");
		const language = match ? match[1] : "";

		// Force inline for single-line code without newlines
		const content = String(children);
		const isReallyInline = inline || (!content.includes("\n") && content.length < 100);

		// Only treat as block code if explicitly not inline AND has language or multiple lines
		if (!isReallyInline && language && SyntaxHighlighter && vscDarkPlus) {
			return (
				<SyntaxHighlighter
					style={vscDarkPlus}
					language={language}
					PreTag="div"
					customStyle={{
						margin: "0",
						padding: "1.25rem",
						background: "#1e1e1e",
						border: "1px solid #404040",
						borderRadius: "0.5rem",
						fontSize: "0.875rem",
						lineHeight: "1.5",
					}}
					{...props}
				>
					{content.replace(/\n$/, "")}
				</SyntaxHighlighter>
			);
		}

		// Fallback for code blocks when SyntaxHighlighter is not loaded
		if (!isReallyInline && language) {
			return (
				<pre className="overflow-x-auto rounded-lg border border-zinc-600 bg-zinc-900/90 p-5 text-sm leading-6 whitespace-pre">
					<code
						className="block text-zinc-100"
						style={{
							fontFamily:
								'"Cascadia Code", "Fira Code", "JetBrains Mono", "Source Code Pro", Menlo, Monaco, Consolas, "Courier New", monospace',
							fontFeatureSettings: '"liga" 0',
							unicodeBidi: "isolate",
						}}
					>
						{content}
					</code>
				</pre>
			);
		}

		// Handle multi-line code blocks without language (like project structure)
		if (!isReallyInline && content.includes("\n")) {
			return (
				<pre className="overflow-x-auto rounded-lg border border-zinc-600 bg-zinc-900/90 p-5 text-sm leading-6 whitespace-pre">
					<code
						className="block text-zinc-100"
						style={{
							fontFamily:
								'"Cascadia Code", "Fira Code", "JetBrains Mono", "Source Code Pro", Menlo, Monaco, Consolas, "Courier New", monospace',
							fontFeatureSettings: '"liga" 0',
							unicodeBidi: "isolate",
						}}
					>
						{content}
					</code>
				</pre>
			);
		}

		// Inline code - GitHub style
		return (
			<code
				className="rounded border border-zinc-700/50 bg-zinc-800/80 px-1.5 py-0.5 font-mono text-sm text-zinc-200"
				{...props}
			>
				{children}
			</code>
		);
	},

	// Headers with GitHub styling
	h1: ({ children }: React.ComponentProps<"h1">) => (
		<h1 className="mt-8 mb-6 border-b border-zinc-700 pb-3 text-3xl font-bold text-white first:mt-0">{children}</h1>
	),
	h2: ({ children }: React.ComponentProps<"h2">) => (
		<h2 className="mt-8 mb-4 border-b border-zinc-800 pb-2 text-2xl font-semibold text-white">{children}</h2>
	),
	h3: ({ children }: React.ComponentProps<"h3">) => (
		<h3 className="mt-6 mb-3 text-xl font-semibold text-white">{children}</h3>
	),
	h4: ({ children }: React.ComponentProps<"h4">) => (
		<h4 className="mt-4 mb-2 text-lg font-semibold text-white">{children}</h4>
	),
	h5: ({ children }: React.ComponentProps<"h5">) => (
		<h5 className="mt-4 mb-2 text-base font-semibold text-white">{children}</h5>
	),
	h6: ({ children }: React.ComponentProps<"h6">) => (
		<h6 className="mt-4 mb-2 text-sm font-semibold text-zinc-300">{children}</h6>
	),

	// Paragraphs
	p: ({ children }: React.ComponentProps<"p">) => <p className="mb-4 leading-relaxed text-zinc-300">{children}</p>,

	// Links with GitHub styling
	a: ({ href, children }: React.ComponentProps<"a">) => {
		// Check if this is a GitHub link (commit, issue, PR, mention)
		const isGitHubLink = href && href.includes("github.com");
		const isMention = children && typeof children === "string" && children.startsWith("@");
		const isIssueOrPR = href && (href.includes("/issues/") || href.includes("/pull/"));
		const isCommit = href && href.includes("/commit/");

		// Check if this is a package/library link (like @react-three/fiber)
		const isPackageLink = children && typeof children === "string" && children.startsWith("@") && !isGitHubLink;

		let linkClass = "text-blue-400 underline transition-colors hover:text-blue-300 hover:no-underline";

		if (isPackageLink) {
			// Package links should look like regular text, not mentions
			linkClass = "text-blue-400 underline transition-colors hover:text-blue-300 hover:no-underline";
		} else if (isGitHubLink) {
			if (isMention) {
				linkClass = "text-blue-400 font-semibold no-underline hover:underline";
			} else if (isIssueOrPR) {
				linkClass = "text-blue-400 no-underline hover:underline";
			} else if (isCommit) {
				linkClass = "text-blue-400 font-mono text-sm no-underline hover:underline";
			}
		}

		return (
			<a href={href} className={linkClass} target="_blank" rel="noopener noreferrer">
				{children}
			</a>
		);
	},

	// Lists
	ul: ({ children }: React.ComponentProps<"ul">) => <ul className="mb-4 space-y-1 pl-4 text-zinc-300">{children}</ul>,
	ol: ({ children }: React.ComponentProps<"ol">) => <ol className="mb-4 space-y-1 pl-6 text-zinc-300">{children}</ol>,
	li: ({ children, ...props }: React.ComponentProps<"li">) => {
		// Check if this is a task list item
		const isTaskList =
			typeof children === "string" &&
			(children.includes("[ ]") || children.includes("[x]") || children.includes("[X]"));

		if (isTaskList) {
			const isChecked = children.includes("[x]") || children.includes("[X]");
			const text = children.replace(/^\[[ xX]\]\s*/, "");

			return (
				<li className="flex list-none items-start gap-2 leading-relaxed text-zinc-300">
					<input
						type="checkbox"
						checked={isChecked}
						disabled
						className="mt-1 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
					/>
					<span className={cn(isChecked ? "text-zinc-500 line-through" : "")}>{text}</span>
				</li>
			);
		}

		return (
			<li className="mb-1 leading-relaxed text-zinc-300" {...props}>
				{children}
			</li>
		);
	},

	// Blockquotes
	blockquote: ({ children }: React.ComponentProps<"blockquote">) => (
		<blockquote className="my-4 rounded-r-lg border-l-4 border-zinc-600 bg-zinc-900/30 py-2 pl-4">
			<div className="text-zinc-400 italic">{children}</div>
		</blockquote>
	),

	// Tables
	table: ({ children }: React.ComponentProps<"table">) => (
		<div className="my-6 overflow-x-auto">
			<table className="min-w-full overflow-hidden rounded-lg border border-zinc-700">{children}</table>
		</div>
	),
	thead: ({ children }: React.ComponentProps<"thead">) => <thead className="bg-zinc-800">{children}</thead>,
	th: ({ children }: React.ComponentProps<"th">) => (
		<th className="border border-zinc-700 bg-zinc-800 px-4 py-3 text-left font-semibold text-white">{children}</th>
	),
	td: ({ children }: React.ComponentProps<"td">) => (
		<td className="border border-zinc-700 px-4 py-3 text-zinc-300">{children}</td>
	),

	// Images with better styling and badge detection
	img: ({ src, alt }: any) => {
		// Check if this is a badge (common badge services)
		const isBadge =
			src &&
			(src.includes("shields.io") ||
				src.includes("badge") ||
				src.includes("img.shields.io") ||
				src.includes("travis-ci") ||
				src.includes("codecov") ||
				src.includes("circleci") ||
				(src.includes("github.com") && src.includes("workflows")) ||
				(alt && alt.toLowerCase().includes("badge")));

		if (isBadge) {
			return (
				<Image
					unoptimized
					width={120}
					height={20}
					src={src}
					alt={alt}
					className="mx-1 my-1 inline-block h-5 w-auto"
					loading="eager"
				/>
			);
		}

		return (
			<div className="my-6 text-center">
				<Image
					unoptimized
					width={800}
					height={400}
					src={src}
					alt={alt}
					className="inline-block h-auto max-w-full rounded-lg border border-zinc-700 shadow-lg"
					loading="lazy"
				/>
				{alt && <p className="mt-2 text-sm text-zinc-500 italic">{alt}</p>}
			</div>
		);
	},

	// Horizontal rule
	hr: () => <hr className="my-8 border-zinc-700" />,

	// Strong and emphasis
	strong: ({ children }: React.ComponentProps<"strong">) => {
		// Check if this is a GitHub mention wrapped in strong (not package names)
		const isGitHubMention =
			children &&
			typeof children === "string" &&
			children.startsWith("@") &&
			// Only treat as mention if it looks like a username (no slashes)
			!children.includes("/");
		const className = isGitHubMention ? "font-semibold text-blue-400" : "font-semibold text-white";

		return <strong className={className}>{children}</strong>;
	},
	em: ({ children }: React.ComponentProps<"em">) => <em className="text-zinc-300 italic">{children}</em>,

	// Pre blocks (for code without language specification)
	pre: ({ children }: React.ComponentProps<"pre">) => (
		<pre className="overflow-x-auto rounded-lg bg-zinc-900/90 text-sm leading-6 whitespace-pre">
			<code
				className="block text-zinc-100"
				style={{
					fontFamily:
						'"Cascadia Code", "Fira Code", "JetBrains Mono", "Source Code Pro", Menlo, Monaco, Consolas, "Courier New", monospace',
					fontFeatureSettings: '"liga" 0',
					unicodeBidi: "isolate",
				}}
			>
				{children}
			</code>
		</pre>
	),

	// Details/Summary (collapsible sections)
	details: ({ children }: React.ComponentProps<"details">) => (
		<details className="my-4 overflow-hidden rounded-lg border border-zinc-700">{children}</details>
	),
	summary: ({ children }: React.ComponentProps<"summary">) => (
		<summary className="cursor-pointer bg-zinc-800 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-700">
			{children}
		</summary>
	),
};

export function ReadmeViewer({ repoUrl, projectTitle }: ReadmeViewerProps) {
	const [readmeContent, setReadmeContent] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Extract repository info from GitHub URL
	const getRepositoryInfo = (url: string) => {
		try {
			const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
			if (match) {
				return `${match[1]}/${match[2]}`;
			}
		} catch {
			console.warn("Could not parse repository URL:", url);
		}
		return null;
	};

	const repository = getRepositoryInfo(repoUrl);

	// Configure remark plugins
	const remarkPlugins = [remarkGfm, remarkBreaks, ...(repository ? [[remarkGithub, { repository }]] : [])];

	useEffect(() => {
		const loadReadme = async () => {
			try {
				setLoading(true);
				setError(null);

				const content = await fetchGitHubReadme(repoUrl);
				if (content) {
					const processedContent = processMarkdownContent(content, repoUrl);
					setReadmeContent(processedContent);
				} else {
					setReadmeContent(null);
				}
			} catch (err) {
				console.error("Error loading README:", err);
				setError("Failed to load README");
			} finally {
				setLoading(false);
			}
		};

		if (repoUrl) {
			loadReadme();
		}
	}, [repoUrl]);

	if (loading) {
		return (
			<Card className="border-zinc-700/50 bg-zinc-900/50">
				<CardHeader>
					<CardTitle className="flex items-center">
						<FileText className="mr-2 h-5 w-5" />
						README {projectTitle}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="h-4 animate-pulse rounded bg-zinc-800"></div>
						<div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800"></div>
						<div className="h-4 w-1/2 animate-pulse rounded bg-zinc-800"></div>
						<div className="h-32 animate-pulse rounded bg-zinc-800"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className="border-zinc-700/50 bg-zinc-900/50">
				<CardHeader>
					<CardTitle className="flex items-center">
						<FileText className="mr-2 h-5 w-5" />
						README
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="py-8 text-center">
						<p className="mb-4 text-zinc-400">{error}</p>
						<Button variant="outline" size="sm" onClick={() => window.location.reload()}>
							Try Again
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!readmeContent) {
		return (
			<Card className="border-zinc-700/50 bg-zinc-900/50">
				<CardHeader>
					<CardTitle className="flex items-center">
						<FileText className="mr-2 h-5 w-5" />
						README
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="py-8 text-center">
						<FileText className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
						<p className="mb-4 text-zinc-400">No README found for this repository</p>
						<Button variant="outline" size="sm" asChild>
							<a href={repoUrl} target="_blank" rel="noopener noreferrer">
								<ExternalLink className="mr-2 h-4 w-4" />
								View on GitHub
							</a>
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-zinc-700/50 bg-zinc-900/50">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center">
						<FileText className="mr-2 h-5 w-5" />
						README
					</CardTitle>
					<Button variant="ghost" size="sm" asChild>
						<a href={`${repoUrl}#readme`} target="_blank" rel="noopener noreferrer">
							<ExternalLink className="mr-2 h-4 w-4" />
							View on GitHub
						</a>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="max-w-none">
					<div className="readme-content prose prose-invert prose-zinc max-w-none">
						<ReactMarkdown
							remarkPlugins={remarkPlugins as any}
							rehypePlugins={[rehypeRaw]}
							components={MarkdownComponents}
						>
							{readmeContent}
						</ReactMarkdown>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
