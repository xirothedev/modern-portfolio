"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import { UseFormSetValue, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

import { addToken, deleteToken, getProjectsForSelect, updateToken } from "../actions";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

const tokenSchema = z.object({
	id: z.string().optional(),
	projectId: z.string().min(1, "Project is required"),
	scope: z.enum(["PULL", "PUSH", "ADMIN"]),
	expireAt: z.date().min(new Date()).optional(),
});

export type TokenForm = z.infer<typeof tokenSchema>;

interface TokenManagerDialogContextProps {
	setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
	setIsEdit: Dispatch<SetStateAction<boolean>>;
	setValue: UseFormSetValue<TokenForm>;
	handleDelete: (id: string) => Promise<void>;
}
export const TokenManagerDialogContext = createContext<TokenManagerDialogContextProps>({
	setIsDialogOpen: () => false,
	setIsEdit: () => false,
	setValue: () => {},
	handleDelete: async () => {},
});

export const DEFAULT_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days

export function TokenManagerTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [projects, setProjects] = useState<{ id: string; slug: string; repoName: string }[]>([]);

	const router = useRouter();
	const { toast } = useToast();

	// Fetch projects for select
	useEffect(() => {
		async function fetchProjects() {
			try {
				const result = await getProjectsForSelect();
				if (result.success && result.projects) {
					setProjects(result.projects);
				} else {
					toast({
						title: "Error",
						description: "Failed to load projects for token creation.",
						variant: "destructive",
					});
				}
			} catch (error) {
				console.error("Failed to fetch projects:", error);
				toast({
					title: "Error",
					description: "Failed to load projects. Please try again.",
					variant: "destructive",
				});
			}
		}
		fetchProjects();
	}, [toast]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<TokenForm>({
		resolver: zodResolver(tokenSchema),
		defaultValues: {
			scope: "PULL",
			expireAt: new Date(Date.now() + DEFAULT_EXPIRE_TIME),
		},
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});

	const onSubmit = async (data: TokenForm) => {
		setIsSubmitting(true);

		try {
			let result;

			if (isEdit) {
				if (!data.id) {
					throw new Error("Token id is not provided");
				}

				result = await updateToken(data.id, {
					expireAt: data.expireAt,
					scope: data.scope,
					projectId: data.projectId,
				});
			} else {
				if (!data.projectId) {
					throw new Error("Project is required for new tokens");
				}

				if (!data.expireAt) {
					throw new Error("Expire time is required for new tokens");
				}

				result = await addToken({
					projectId: data.projectId,
					expireAt: data.expireAt,
					scope: data.scope,
				});
			}

			if (result.success) {
				toast({
					title: isEdit ? "Token Updated" : "Token Created",
					description: result.message || `${isEdit ? "Updated" : "Created"} token successfully!`,
				});
				setIsDialogOpen(false);
				router.refresh();
				void reset();
			} else {
				toast({
					title: "Error",
					description: result.message || "An error occurred while processing your request.",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			toast({
				title: "Unexpected Error",
				description: "An unexpected error occurred. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			const result = await deleteToken(id);

			if (result.success) {
				toast({
					title: "Token Deleted",
					description: result.message || "Token deleted successfully.",
				});
				router.refresh();
			} else {
				toast({
					title: "Error",
					description: result.message || "Failed to delete token.",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error deleting token:", error);
			toast({
				title: "Unexpected Error",
				description: "An unexpected error occurred while deleting the token.",
				variant: "destructive",
			});
		}
	};

	return (
		<TokenManagerDialogContext.Provider value={{ setIsDialogOpen, setIsEdit, setValue, handleDelete }}>
			<div className="w-full">
				<div className="flex items-center py-4">
					<Input
						placeholder="Filter token ID..."
						value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("id")?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
					<div className="ml-auto">
						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<Button
									onClick={() => {
										setIsEdit(false);
										reset();
									}}
									variant="outline"
									className="flex items-center gap-2"
								>
									<Plus className="h-4 w-4" />
									Add Token
								</Button>
							</DialogTrigger>
							<DialogContent showCloseButton={false} className="sm:max-w-[425px]">
								<form onSubmit={handleSubmit(onSubmit)}>
									<DialogHeader>
										<DialogTitle>{isEdit ? "Edit" : "Add"} Token</DialogTitle>
										<DialogDescription>
											{isEdit ? "Update" : "Add"} a new token for API authentication
										</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4">
										{!isEdit && (
											<div className="grid gap-3">
												<Label htmlFor="token-id">Token ID *</Label>
												<Input
													id="token-id"
													type="password"
													placeholder="Enter token value"
													{...register("id", { required: !isEdit })}
													aria-invalid={!!errors.id}
													aria-describedby={errors.id ? "id-error" : undefined}
													disabled={isSubmitting}
												/>
												{errors.id && (
													<p id="id-error" className="text-sm text-red-500">
														{errors.id.message}
													</p>
												)}
											</div>
										)}
										<div className="flex gap-4">
											<div className="gap-3">
												<Label htmlFor="token-scope" className="mb-2 inline-block">
													Scope *
												</Label>
												<Select
													value={watch("scope")}
													onValueChange={(value) =>
														setValue("scope", value as "PULL" | "PUSH" | "ADMIN")
													}
													disabled={isSubmitting}
												>
													<SelectTrigger
														id="token-scope"
														className="border-zinc-700/50 bg-zinc-800/50 text-zinc-100 placeholder-zinc-500 focus:border-purple-500/50 focus:ring-purple-500/20"
														aria-invalid={!!errors.scope}
														aria-describedby={errors.scope ? "scope-error" : undefined}
													>
														<SelectValue placeholder="Select scope" defaultValue="PULL" />
													</SelectTrigger>
													<SelectContent className="border-zinc-700 bg-zinc-900/95 text-zinc-100">
														<SelectItem value="PULL">Pull</SelectItem>
														<SelectItem value="PUSH">Push</SelectItem>
														<SelectItem value="ADMIN">Admin</SelectItem>
													</SelectContent>
												</Select>
												{errors.scope && (
													<p id="scope-error" className="text-sm text-red-500">
														{errors.scope.message}
													</p>
												)}
											</div>
											<div className="flex-1 gap-3">
												<Label htmlFor="token-project" className="mb-2 inline-block">
													Project *
												</Label>
												<Select
													value={watch("projectId")}
													onValueChange={(value) => setValue("projectId", value)}
													disabled={isSubmitting}
												>
													<SelectTrigger
														id="token-project"
														className="w-full border-zinc-700/50 bg-zinc-800/50 text-zinc-100 placeholder-zinc-500 focus:border-purple-500/50 focus:ring-purple-500/20"
														aria-invalid={!!errors.projectId}
														aria-describedby={
															errors.projectId ? "project-error" : undefined
														}
													>
														<SelectValue placeholder="Select a project" />
													</SelectTrigger>
													<SelectContent className="border-zinc-700 bg-zinc-900/95 text-zinc-100">
														{projects.map((project) => (
															<SelectItem key={project.id} value={project.id}>
																<span className="block max-w-56 truncate">
																	{project.slug} ({project.repoName})
																</span>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												{errors.projectId && (
													<p id="project-error" className="text-sm text-red-500">
														{errors.projectId.message}
													</p>
												)}
											</div>
										</div>
										<div className="grid gap-3">
											<Label htmlFor="token-expire">Expires At</Label>
											<Calendar
												mode="single"
												selected={watch("expireAt")}
												onSelect={(date) => setValue("expireAt", date || undefined)}
												className="w-full rounded-md border border-zinc-700/50 bg-zinc-800/50 text-zinc-200 shadow-sm"
												captionLayout="dropdown"
												disabled={(date) => date < new Date() || isSubmitting}
											/>
											{errors.expireAt && (
												<p id="expire-error" className="text-sm text-red-500">
													{errors.expireAt.message}
												</p>
											)}
										</div>
									</div>
									<DialogFooter className="mt-2">
										<DialogClose asChild>
											<Button type="button" variant="outline" disabled={isSubmitting}>
												Cancel
											</Button>
										</DialogClose>
										<Button type="submit" variant="primary" disabled={isSubmitting}>
											{isSubmitting ? "Processing..." : isEdit ? "Update" : "Add"} Token
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="ml-2" variant="outline">
								Columns <ChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="border-zinc-700 bg-zinc-900/95 text-white backdrop-blur-sm"
							align="end"
						>
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="cursor-pointer capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) => column.toggleVisibility(!!value)}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 shadow-xl backdrop-blur-sm">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id} className="border-zinc-800 hover:bg-zinc-800/30">
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												className="border-zinc-700 bg-zinc-800/50 px-4 py-3 font-semibold text-white"
												key={header.id}
											>
												{header.isPlaceholder
													? null
													: flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row, index) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
										className={cn(
											"border-zinc-800 transition-colors duration-200",
											index % 2 === 0
												? "bg-zinc-900/30 hover:bg-zinc-800/40"
												: "bg-zinc-900/50 hover:bg-zinc-800/50",
										)}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												className="border-zinc-800 px-4 py-3 text-zinc-100"
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 border-zinc-800 text-center text-zinc-400"
									>
										No tokens found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</TokenManagerDialogContext.Provider>
	);
}
