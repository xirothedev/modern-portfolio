"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	resetError = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback;
				return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
			}

			return (
				<div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 p-8 text-center">
					<AlertTriangle className="mb-4 h-12 w-12 text-red-500" />
					<h3 className="mb-2 text-lg font-semibold text-red-400">Something went wrong</h3>
					<p className="mb-4 text-sm text-zinc-400">
						{this.state.error?.message || "An unexpected error occurred"}
					</p>
					<Button onClick={this.resetError} variant="outline" size="sm">
						<RefreshCw className="mr-2 h-4 w-4" />
						Try Again
					</Button>
				</div>
			);
		}

		return this.props.children;
	}
}

export { ErrorBoundary };
