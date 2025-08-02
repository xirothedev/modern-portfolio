import { z } from "zod";

// Basic slug validation (for project slug field)
export const zodSlug = z
	.string()
	.min(1, "Slug must not be empty")
	.refine((val) => /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(val), {
		message: "Slug can only contain letters, numbers, and hyphens. Must not start or end with a hyphen.",
	});

// Repository name validation (owner/repo format)
export const zodRepoName = z
	.string()
	.min(1, "Repository name must not be empty")
	.refine(
		(val) => {
			// GitHub repository name format: owner/repo
			const repoRegex = /^[A-Za-z0-9][A-Za-z0-9\._-]*\/[A-Za-z0-9][A-Za-z0-9\._-]*$/;
			return repoRegex.test(val);
		},
		{
			message: "Repository name must be in format 'owner/repo' (e.g., 'facebook/react')",
		},
	)
	.refine(
		(val) => {
			const parts = val.split("/");
			if (parts.length !== 2) return false;

			const [owner, repo] = parts;

			// Owner validation (GitHub username rules)
			if (owner.length > 39 || owner.length < 1) return false;
			if (owner.startsWith("-") || owner.endsWith("-")) return false;
			if (owner.startsWith(".") || owner.endsWith(".")) return false;

			// Repo validation (GitHub repo name rules)
			if (repo.length > 100 || repo.length < 1) return false;
			if (repo.startsWith(".") || repo.endsWith(".")) return false;

			return true;
		},
		{
			message:
				"Invalid GitHub owner/repository format. Owner: 1-39 chars, Repo: 1-100 chars, cannot start/end with dots or hyphens",
		},
	);

// Combined validation for forms that might accept both formats
export const zodSlugOrRepo = z
	.string()
	.min(1, "Value must not be empty")
	.refine(
		(val) => {
			// Check if it's a valid slug
			const slugRegex = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;
			// Check if it's a valid repo name
			const repoRegex = /^[A-Za-z0-9\._-]+\/[A-Za-z0-9\._-]+$/;

			return slugRegex.test(val) || repoRegex.test(val);
		},
		{
			message: "Must be either a valid slug (letters, numbers, hyphens) or repository name (owner/repo format)",
		},
	);

// Strict GitHub repository name validation with additional checks
export const zodGitHubRepo = z
	.string()
	.min(1, "Repository name is required")
	.transform((val) => val.trim()) // Remove whitespace
	.refine(
		(val) => {
			// Basic format check
			const parts = val.split("/");
			return parts.length === 2 && parts[0] && parts[1];
		},
		{
			message: "Repository must be in 'owner/repo' format",
		},
	)
	.refine(
		(val) => {
			const [owner, repo] = val.split("/");

			// GitHub owner/organization name rules
			const ownerRegex = /^[A-Za-z0-9]([A-Za-z0-9\-])*[A-Za-z0-9]$|^[A-Za-z0-9]$/;
			if (!ownerRegex.test(owner)) return false;
			if (owner.length > 39) return false;

			// GitHub repository name rules
			const repoRegex = /^[A-Za-z0-9\._-]+$/;
			if (!repoRegex.test(repo)) return false;
			if (repo.length > 100) return false;
			if (repo.startsWith(".") || repo.endsWith(".")) return false;

			// Reserved names
			const reservedNames = [
				"CON",
				"PRN",
				"AUX",
				"NUL",
				"COM1",
				"COM2",
				"COM3",
				"COM4",
				"COM5",
				"COM6",
				"COM7",
				"COM8",
				"COM9",
				"LPT1",
				"LPT2",
				"LPT3",
				"LPT4",
				"LPT5",
				"LPT6",
				"LPT7",
				"LPT8",
				"LPT9",
			];
			if (reservedNames.includes(repo.toUpperCase())) return false;

			return true;
		},
		{
			message:
				"Invalid GitHub repository format. Owner: 1-39 chars, alphanumeric/hyphens. Repo: 1-100 chars, cannot start/end with dots.",
		},
	);
