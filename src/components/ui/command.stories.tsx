import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useState } from "react";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "./command";

const meta = {
	title: "UI/Command",
	component: CommandDialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof CommandDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [open, setOpen] = useState<boolean>(true);

		return (
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>

					<CommandGroup heading="Suggestions">
						<CommandItem>Profile</CommandItem>
						<CommandItem>
							Settings <CommandShortcut>⌘S</CommandShortcut>
						</CommandItem>
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading="Actions">
						<CommandItem>
							Log out <CommandShortcut>⇧⌘Q</CommandShortcut>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		);
	},
};
