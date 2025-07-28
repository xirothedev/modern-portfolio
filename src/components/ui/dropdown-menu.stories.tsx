import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	DropdownMenuLabel,
	DropdownMenuShortcut,
} from "./dropdown-menu";
import { Button } from "./button";
import { useState } from "react";

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
		const [showLineNumber, setShowLineNumber] = useState(true);
		const [theme, setTheme] = useState("light");

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
