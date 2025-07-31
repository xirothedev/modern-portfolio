"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Repository } from "@/typings/github";
import type { Project } from "generated/prisma";
import { useEffect, useState } from "react";
import { addProject, deleteProject, getProjects, updateProject } from "../actions";
import { RepositoryManagerSkeleton } from "@/components/loading-skeleton";

export function RepositoryManager() {
	const [data, setData] = useState<{ project: Project; repository: Repository | null }[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [editingProject, setEditingProject] = useState<Project | null>(null);
	const [formData, setFormData] = useState({
		repoName: "",
		slug: "",
	});
	const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		loadProjects();
	}, []);

	async function loadProjects() {
		try {
			setLoading(true);
			const result = await getProjects();
			if (result.success) {
				setData(result.data);
			}
		} catch (error) {
			console.error("Failed to load projects:", error);
		} finally {
			setLoading(false);
		}
	}

	function resetForm() {
		setFormData({
			repoName: "",
			slug: "",
		});
		setEditingProject(null);
		setSubmitStatus("idle");
		setErrorMessage("");
	}

	function handleEdit(project: Project) {
		setEditingProject(project);
		setFormData({
			repoName: project.repoName,
			slug: project.slug,
		});
		setIsAddDialogOpen(true);
	}

	async function handleSubmit() {
		setSubmitStatus("loading");
		setErrorMessage("");
		try {
			let result;
			if (editingProject) {
				result = await updateProject(editingProject.id, formData);
			} else {
				result = await addProject(formData);
			}
			if (result.success) {
				setSubmitStatus("success");
				await loadProjects();
				setTimeout(() => {
					setIsAddDialogOpen(false);
					resetForm();
				}, 1000);
			} else {
				setSubmitStatus("error");
				setErrorMessage(result.message || "An error occurred");
			}
		} catch {
			setSubmitStatus("error");
			setErrorMessage("Network error occurred");
		}
	}

	async function handleDelete(id: string) {
		try {
			const result = await deleteProject(id);
			if (result.success) {
				await loadProjects();
			}
		} catch (error) {
			console.error("Failed to delete project:", error);
		}
	}

	const filteredData = data.filter(
		({ repository, project }) =>
			repository?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.slug.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (loading) {
		return <RepositoryManagerSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div className="relative max-w-md flex-1">
					<Input
						placeholder="Search projects..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="border-zinc-700/50 bg-zinc-800/50 pl-10 text-white placeholder:text-zinc-400 focus:border-zinc-600/50 focus:bg-zinc-800/70"
					/>
				</div>
				<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
					<DialogTrigger asChild>
						<Button
							onClick={resetForm}
							className="flex items-center gap-2 border-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500"
						>
							Add Project
						</Button>
					</DialogTrigger>
					<DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle className="text-white">
								{editingProject ? "Edit Project" : "Add New Project"}
							</DialogTitle>
							<DialogDescription className="text-zinc-400">
								{editingProject ? "Update project info." : "Add a new project to the system."}
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="repoName">Repository Name *</Label>
								<Input
									id="repoName"
									value={formData.repoName}
									onChange={(e) => setFormData({ ...formData, repoName: e.target.value })}
									placeholder="my-awesome-repo"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="slug">Slug *</Label>
								<Input
									id="slug"
									value={formData.slug}
									onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
									placeholder="my-awesome-repo"
								/>
							</div>
						</div>
						{submitStatus === "error" && (
							<Alert variant="destructive">
								<AlertDescription>{errorMessage}</AlertDescription>
							</Alert>
						)}
						{submitStatus === "success" && (
							<Alert>
								<AlertDescription>
									Project {editingProject ? "updated" : "added"} successfully!
								</AlertDescription>
							</Alert>
						)}
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => {
									setIsAddDialogOpen(false);
									resetForm();
								}}
								disabled={submitStatus === "loading"}
								className="border-zinc-600/50 bg-zinc-700/50 text-zinc-300 hover:border-zinc-500/50 hover:bg-zinc-700/70"
							>
								Cancel
							</Button>
							<Button
								onClick={handleSubmit}
								disabled={submitStatus === "loading" || !formData.repoName || !formData.slug}
								className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500"
							>
								{submitStatus === "loading" ? "Saving..." : editingProject ? "Update" : "Add Project"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
			<div className="space-y-4">
				{filteredData.length === 0 ? (
					<div className="relative rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-12 text-center backdrop-blur-sm">
						<h3 className="mb-2 text-lg font-semibold text-white">No projects found</h3>
						<p className="mb-4 text-zinc-400">
							{searchTerm
								? "No projects match your search criteria."
								: "Get started by adding your first project."}
						</p>
						{!searchTerm && (
							<Button
								onClick={() => setIsAddDialogOpen(true)}
								className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500"
							>
								Add Project
							</Button>
						)}
						<div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-black/5"></div>
					</div>
				) : (
					filteredData.map(({ project, repository }) => (
						<div
							key={project.id}
							className="relative rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:border-zinc-600/50 hover:bg-zinc-800/70"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="mb-2 flex items-center gap-3">
										<h3 className="text-lg font-semibold text-white">
											{repository?.name ?? project.slug}
										</h3>
										<span className="ml-2 text-xs text-zinc-400">Slug: {project.slug}</span>
									</div>
									<div className="mb-3 flex items-center gap-4 text-sm text-zinc-400">
										<span className="flex items-center gap-1">
											Created: {new Date(project.createdAt).toLocaleDateString()}
										</span>
									</div>
								</div>
								<div className="ml-4 flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(project)}
										className="border-zinc-600/50 bg-zinc-700/50 text-zinc-300 hover:border-zinc-500/50 hover:bg-zinc-700/70"
									>
										Edit
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="border-zinc-600/50 bg-zinc-700/50 text-zinc-300 hover:border-zinc-500/50 hover:bg-zinc-700/70"
											>
												Delete
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent className="border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm">
											<AlertDialogHeader>
												<AlertDialogTitle className="text-white">
													Delete Project
												</AlertDialogTitle>
												<AlertDialogDescription className="text-zinc-400">
													Are you sure you want to delete &quot;{project.repoName}&quot;? This
													action cannot be undone.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel className="border-zinc-600/50 bg-zinc-700/50 text-zinc-300 hover:border-zinc-500/50 hover:bg-zinc-700/70">
													Cancel
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleDelete(project.id)}
													className="bg-red-600 hover:bg-red-700"
												>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
							<div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-black/5"></div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
