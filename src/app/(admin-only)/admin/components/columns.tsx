"use client";

import { User, UserJSON } from "@clerk/nextjs/server";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Shield, ShieldCheck, ShieldX, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Roles } from "@/types/globals";

import { removeRole, setRole } from "../actions";

interface UserData extends Partial<User> {
	id: string;
	publicMetadata: UserPublicMetadata;
	avatar: string;
	emailAddress: string;
	username: string;
	createdAt: number;
	referralPlatform: string;
	raw: UserJSON | null;
}

const getRoleColor = (role: Roles) => {
	switch (role) {
		case "admin":
			return "bg-red-100 text-red-800";
		case "moderator":
			return "bg-blue-100 text-blue-800";
		// case "user":
		// return "bg-green-100 text-green-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export const columns: ColumnDef<UserData>[] = [
	{
		accessorKey: "user",
		header: "User",
		cell: ({ row }) => {
			const user = row.original;

			return (
				<div className="flex items-center space-x-3">
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.avatar || "/placeholder.svg"} alt={row.getValue("username")} />
					</Avatar>
					<div>
						<div className="font-medium">{row.getValue("username")}</div>
						<div className="text-muted-foreground text-sm">{user.emailAddress}</div>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "id",
		header: "Id",
	},
	{
		accessorKey: "referralPlatform",
		header: "Platform",
	},
	{
		accessorKey: "emailAddress",
		header: "Email",
		enableSorting: true,
		enableHiding: true,
		cell: ({ row }) => {
			const user = row.original;
			return <div className="font-medium">{user.emailAddress}</div>;
		},
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const user = row.original;
			const role = user.publicMetadata.role as Roles;

			return <Badge className={cn(getRoleColor(role), "capitalize")}>{role ?? "User"}</Badge>;
		},
	},
	{
		accessorKey: "username",
		header: "Username",
	},
	{
		accessorKey: "createdAt",
		header: () => <div>Create at</div>,
		cell: ({ row }) => {
			const formatted = format(row.getValue("createdAt"), "Pp");

			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => {
			const user = row.original;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const router = useRouter();

			return (
				<div className="flex justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="border-zinc-700 bg-zinc-900/95 text-white" align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<UserCog className="mr-2 h-4 w-4" />
									Manage Role
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent className="border-zinc-700 bg-zinc-900/95 text-white backdrop-blur-sm">
									<DropdownMenuLabel>Change role</DropdownMenuLabel>
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={async () => {
											await setRole({ userId: user.id, role: "admin" });
											router.refresh();
										}}
									>
										<ShieldCheck className="mr-2 h-4 w-4 text-red-400" />
										Set as Admin
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={async () => {
											await setRole({ userId: user.id, role: "moderator" });
											router.refresh();
										}}
									>
										<Shield className="mr-2 h-4 w-4 text-blue-400" />
										Set as Moderator
									</DropdownMenuItem>
									<DropdownMenuSeparator className="bg-zinc-700" />
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={async () => {
											await removeRole({ userId: user.id });
											router.refresh();
										}}
									>
										<ShieldX className="mr-2 h-4 w-4 text-gray-400" />
										Remove Role
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => navigator.clipboard.writeText(user.id)}
							>
								Copy user ID
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => navigator.clipboard.writeText(JSON.stringify(user.raw, null, 2))}
								className="cursor-pointer"
							>
								Copy user json
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
