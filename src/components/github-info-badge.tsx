"use client";

import { Github } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface GitHubInfoBadgeProps {
	isFromGitHub: boolean;
	className?: string;
}

export function GitHubInfoBadge({ isFromGitHub, className = "" }: GitHubInfoBadgeProps) {
	if (!isFromGitHub) return null;

	return (
		<Badge
			variant="outline"
			className={cn("inline-flex items-center gap-1 border-purple-500/30 text-xs text-purple-400", className)}
		>
			<Github className="h-3 w-3" />
			<span>GitHub Topics</span>
		</Badge>
	);
}
