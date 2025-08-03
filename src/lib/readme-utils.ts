/**
 * README fetching and processing utilities
 */

export interface GitHubReadmeResponse {
	content: string;
	encoding: string;
	name: string;
	path: string;
	sha: string;
	size: number;
	type: string;
	url: string;
	download_url: string;
}

/**
 * Fetch README content from GitHub repository
 */
export async function fetchGitHubReadme(repoUrl: string): Promise<string | null> {
	try {
		// Extract owner and repo from GitHub URL
		const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
		if (!match) {
			console.error("Invalid GitHub URL format:", repoUrl);
			return null;
		}

		const [, owner, repo] = match;
		const cleanRepo = repo.replace(/\.git$/, ""); // Remove .git suffix if present

		// Try to fetch README from GitHub API
		const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/readme`;

		const response = await fetch(apiUrl, {
			headers: {
				Accept: "application/vnd.github.v3+json",
				"User-Agent": "Portfolio-App",
			},
		});

		if (!response.ok) {
			if (response.status === 404) {
				console.log("README not found for repository:", `${owner}/${cleanRepo}`);
				return null;
			}
			throw new Error(`GitHub API error: ${response.status}`);
		}

		const data: GitHubReadmeResponse = await response.json();

		// Decode base64 content with proper UTF-8 handling
		if (data.encoding === "base64") {
			const base64Content = data.content.replace(/\n/g, "");

			// Use proper UTF-8 decoding for emoji and special characters
			try {
				const binaryString = atob(base64Content);
				const bytes = new Uint8Array(binaryString.length);
				for (let i = 0; i < binaryString.length; i++) {
					bytes[i] = binaryString.charCodeAt(i);
				}
				const decodedContent = new TextDecoder("utf-8").decode(bytes);
				return decodedContent;
			} catch (error) {
				console.warn("UTF-8 decoding failed, falling back to atob:", error);
				return atob(base64Content);
			}
		}

		return data.content;
	} catch (error) {
		console.error("Error fetching README:", error);
		return null;
	}
}

/**
 * Process markdown content for display
 */
export function processMarkdownContent(content: string, repoUrl: string): string {
	if (!content) return "";

	// Extract owner and repo for relative URL processing
	const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
	if (!match) return content;

	const [, owner, repo] = match;
	const cleanRepo = repo.replace(/\.git$/, "");
	const baseUrl = `https://github.com/${owner}/${cleanRepo}`;

	// Process relative image URLs
	let processedContent = content.replace(/!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g, `![$1](${baseUrl}/raw/main/$2)`);

	// Process relative links
	processedContent = processedContent.replace(
		/\[([^\]]+)\]\((?!https?:\/\/)([^)]+)\)/g,
		`[$1](${baseUrl}/blob/main/$2)`,
	);

	return processedContent;
}
