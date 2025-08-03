import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "./context-menu";

const meta = {
	title: "UI/ContextMenu",
	component: ContextMenu,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic context menu with navigation items
export const Default: Story = {
	render: (args) => (
		<ContextMenu {...args}>
			<ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
				Right click here
			</ContextMenuTrigger>
			<ContextMenuContent className="w-52">
				<ContextMenuItem inset>
					Back
					<ContextMenuShortcut>⌘[</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuItem inset disabled>
					Forward
					<ContextMenuShortcut>⌘]</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuItem inset>
					Reload
					<ContextMenuShortcut>⌘R</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuSub>
					<ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
					<ContextMenuSubContent className="w-44">
						<ContextMenuItem>Save Page...</ContextMenuItem>
						<ContextMenuItem>Create Shortcut...</ContextMenuItem>
						<ContextMenuItem>Name Window...</ContextMenuItem>
						<ContextMenuSeparator />
						<ContextMenuItem>Developer Tools</ContextMenuItem>
						<ContextMenuSeparator />
						<ContextMenuItem variant="destructive">Delete</ContextMenuItem>
					</ContextMenuSubContent>
				</ContextMenuSub>
				<ContextMenuSeparator />
				<ContextMenuCheckboxItem checked>Show Bookmarks</ContextMenuCheckboxItem>
				<ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
				<ContextMenuSeparator />
				<ContextMenuRadioGroup value="pedro">
					<ContextMenuLabel inset>People</ContextMenuLabel>
					<ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
					<ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
				</ContextMenuRadioGroup>
			</ContextMenuContent>
		</ContextMenu>
	),
};

// Simple context menu with basic items
export const Simple: Story = {
	render: (args) => (
		<ContextMenu {...args}>
			<ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
				Right click for simple menu
			</ContextMenuTrigger>
			<ContextMenuContent className="w-48">
				<ContextMenuItem>Copy</ContextMenuItem>
				<ContextMenuItem>Cut</ContextMenuItem>
				<ContextMenuItem>Paste</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem>Select All</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	),
};

// Context menu with destructive actions
export const WithDestructiveActions: Story = {
	render: (args) => (
		<ContextMenu {...args}>
			<ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
				Right click for destructive actions
			</ContextMenuTrigger>
			<ContextMenuContent className="w-48">
				<ContextMenuItem>Edit</ContextMenuItem>
				<ContextMenuItem>Duplicate</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem variant="destructive">Delete</ContextMenuItem>
				<ContextMenuItem variant="destructive">Remove from Library</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	),
};

// Context menu with checkboxes
export const WithCheckboxes: Story = {
	render: (args) => (
		<ContextMenu {...args}>
			<ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
				Right click for checkbox options
			</ContextMenuTrigger>
			<ContextMenuContent className="w-56">
				<ContextMenuLabel inset>View Options</ContextMenuLabel>
				<ContextMenuCheckboxItem checked>Show Grid</ContextMenuCheckboxItem>
				<ContextMenuCheckboxItem checked>Show Labels</ContextMenuCheckboxItem>
				<ContextMenuCheckboxItem>Show Details</ContextMenuCheckboxItem>
				<ContextMenuCheckboxItem>Show Thumbnails</ContextMenuCheckboxItem>
				<ContextMenuSeparator />
				<ContextMenuLabel inset>Sort Options</ContextMenuLabel>
				<ContextMenuCheckboxItem checked>Sort by Name</ContextMenuCheckboxItem>
				<ContextMenuCheckboxItem>Sort by Date</ContextMenuCheckboxItem>
				<ContextMenuCheckboxItem>Sort by Size</ContextMenuCheckboxItem>
			</ContextMenuContent>
		</ContextMenu>
	),
};

// Context menu with radio groups
export const WithRadioGroups: Story = {
	render: (args) => (
		<ContextMenu {...args}>
			<ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
				Right click for radio options
			</ContextMenuTrigger>
			<ContextMenuContent className="w-56">
				<ContextMenuRadioGroup value="light">
					<ContextMenuLabel inset>Theme</ContextMenuLabel>
					<ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
					<ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
					<ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
				</ContextMenuRadioGroup>
				<ContextMenuSeparator />
				<ContextMenuRadioGroup value="en">
					<ContextMenuLabel inset>Language</ContextMenuLabel>
					<ContextMenuRadioItem value="en">English</ContextMenuRadioItem>
					<ContextMenuRadioItem value="es">Spanish</ContextMenuRadioItem>
					<ContextMenuRadioItem value="fr">French</ContextMenuRadioItem>
				</ContextMenuRadioGroup>
			</ContextMenuContent>
		</ContextMenu>
	),
};

// Context menu with nested submenus
export const WithNestedSubmenus: Story = {
	render: (args) => (
		<ContextMenu {...args}>
			<ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
				Right click for nested menus
			</ContextMenuTrigger>
			<ContextMenuContent className="w-56">
				<ContextMenuItem>New</ContextMenuItem>
				<ContextMenuItem>Open</ContextMenuItem>
				<ContextMenuItem>Save</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuSub>
					<ContextMenuSubTrigger inset>Export</ContextMenuSubTrigger>
					<ContextMenuSubContent className="w-48">
						<ContextMenuItem>As PDF</ContextMenuItem>
						<ContextMenuItem>As Image</ContextMenuItem>
						<ContextMenuSub>
							<ContextMenuSubTrigger inset>As Document</ContextMenuSubTrigger>
							<ContextMenuSubContent className="w-48">
								<ContextMenuItem>Word Document</ContextMenuItem>
								<ContextMenuItem>Text File</ContextMenuItem>
								<ContextMenuItem>Markdown</ContextMenuItem>
							</ContextMenuSubContent>
						</ContextMenuSub>
					</ContextMenuSubContent>
				</ContextMenuSub>
				<ContextMenuSeparator />
				<ContextMenuItem>Print</ContextMenuItem>
				<ContextMenuItem variant="destructive">Exit</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	),
};

// Context menu with shortcuts
export const WithShortcuts: Story = {
	render: (args) => (
		<ContextMenu {...args}>
			<ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
				Right click for shortcuts
			</ContextMenuTrigger>
			<ContextMenuContent className="w-56">
				<ContextMenuItem>
					Undo
					<ContextMenuShortcut>⌘Z</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuItem>
					Redo
					<ContextMenuShortcut>⌘⇧Z</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem>
					Cut
					<ContextMenuShortcut>⌘X</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuItem>
					Copy
					<ContextMenuShortcut>⌘C</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuItem>
					Paste
					<ContextMenuShortcut>⌘V</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem>
					Find
					<ContextMenuShortcut>⌘F</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuItem>
					Replace
					<ContextMenuShortcut>⌘⇧F</ContextMenuShortcut>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	),
};

// Context menu with disabled items
export const WithDisabledItems: Story = {
	render: (args) => (
		<ContextMenu {...args}>
			<ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
				Right click for disabled items
			</ContextMenuTrigger>
			<ContextMenuContent className="w-48">
				<ContextMenuItem>Enabled Item</ContextMenuItem>
				<ContextMenuItem disabled>Disabled Item</ContextMenuItem>
				<ContextMenuItem>Another Enabled Item</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuCheckboxItem checked disabled>
					Disabled Checkbox
				</ContextMenuCheckboxItem>
				<ContextMenuCheckboxItem disabled>Another Disabled Checkbox</ContextMenuCheckboxItem>
				<ContextMenuSeparator />
				<ContextMenuRadioGroup value="option1">
					<ContextMenuRadioItem value="option1">Option 1</ContextMenuRadioItem>
					<ContextMenuRadioItem value="option2" disabled>
						Option 2 (Disabled)
					</ContextMenuRadioItem>
					<ContextMenuRadioItem value="option3">Option 3</ContextMenuRadioItem>
				</ContextMenuRadioGroup>
			</ContextMenuContent>
		</ContextMenu>
	),
};

// Context menu with custom styling
export const CustomStyling: Story = {
	render: (args) => (
		<ContextMenu {...args}>
			<ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border-2 border-blue-300 bg-blue-50 text-sm font-medium text-blue-700">
				Right click for custom styling
			</ContextMenuTrigger>
			<ContextMenuContent className="w-56 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
				<ContextMenuItem className="hover:bg-blue-100 focus:bg-blue-100">
					<span className="text-blue-700">Blue Item</span>
				</ContextMenuItem>
				<ContextMenuItem className="hover:bg-green-100 focus:bg-green-100">
					<span className="text-green-700">Green Item</span>
				</ContextMenuItem>
				<ContextMenuItem className="hover:bg-purple-100 focus:bg-purple-100">
					<span className="text-purple-700">Purple Item</span>
				</ContextMenuItem>
				<ContextMenuSeparator className="bg-slate-300" />
				<ContextMenuItem variant="destructive" className="hover:bg-red-100 focus:bg-red-100">
					<span className="text-red-700">Destructive Action</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	),
};
