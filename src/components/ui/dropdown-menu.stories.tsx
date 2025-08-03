import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useState } from "react";

import { Button } from "./button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = {
	title: "UI/DropdownMenu",
	component: DropdownMenu,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [showLineNumber, setShowLineNumber] = useState<boolean>(true);
		const [theme, setTheme] = useState<string>("light");

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline">Open Menu</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Settings</DropdownMenuLabel>
					<DropdownMenuCheckboxItem
						checked={showLineNumber}
						onCheckedChange={(val) => setShowLineNumber(!!val)}
					>
						Show line numbers
					</DropdownMenuCheckboxItem>

					<DropdownMenuSeparator />

					<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
						<DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>

					<DropdownMenuSeparator />

					<DropdownMenuItem>
						Account settings
						<DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
					</DropdownMenuItem>

					<DropdownMenuItem variant="destructive">Delete account</DropdownMenuItem>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>More tools</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>Import</DropdownMenuItem>
							<DropdownMenuItem>Export</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	},
};
