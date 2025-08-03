import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "./menubar";

const meta = {
	title: "UI/Menubar",
	component: Menubar,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default menubar with all features
export const Default: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						New Tab <MenubarShortcut>⌘T</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						New Window <MenubarShortcut>⌘N</MenubarShortcut>
					</MenubarItem>
					<MenubarItem disabled>New Incognito Window</MenubarItem>
					<MenubarSeparator />
					<MenubarSub>
						<MenubarSubTrigger>Share</MenubarSubTrigger>
						<MenubarSubContent>
							<MenubarItem>Email link</MenubarItem>
							<MenubarItem>Messages</MenubarItem>
							<MenubarItem>Notes</MenubarItem>
						</MenubarSubContent>
					</MenubarSub>
					<MenubarSeparator />
					<MenubarItem>
						Print... <MenubarShortcut>⌘P</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Edit</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						Undo <MenubarShortcut>⌘Z</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarSub>
						<MenubarSubTrigger>Find</MenubarSubTrigger>
						<MenubarSubContent>
							<MenubarItem>Search the web</MenubarItem>
							<MenubarSeparator />
							<MenubarItem>Find...</MenubarItem>
							<MenubarItem>Find Next</MenubarItem>
							<MenubarItem>Find Previous</MenubarItem>
						</MenubarSubContent>
					</MenubarSub>
					<MenubarSeparator />
					<MenubarItem>Cut</MenubarItem>
					<MenubarItem>Copy</MenubarItem>
					<MenubarItem>Paste</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>View</MenubarTrigger>
				<MenubarContent>
					<MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
					<MenubarCheckboxItem checked>Always Show Full URLs</MenubarCheckboxItem>
					<MenubarSeparator />
					<MenubarItem inset>
						Reload <MenubarShortcut>⌘R</MenubarShortcut>
					</MenubarItem>
					<MenubarItem disabled inset>
						Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem inset>Toggle Fullscreen</MenubarItem>
					<MenubarSeparator />
					<MenubarItem inset>Hide Sidebar</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Profiles</MenubarTrigger>
				<MenubarContent>
					<MenubarRadioGroup value="benoit">
						<MenubarRadioItem value="andy">Andy</MenubarRadioItem>
						<MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
						<MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
					</MenubarRadioGroup>
					<MenubarSeparator />
					<MenubarItem inset>Edit...</MenubarItem>
					<MenubarSeparator />
					<MenubarItem inset>Add Profile...</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Simple menubar with basic items
export const Simple: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>New</MenubarItem>
					<MenubarItem>Open</MenubarItem>
					<MenubarItem>Save</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Exit</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Edit</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Cut</MenubarItem>
					<MenubarItem>Copy</MenubarItem>
					<MenubarItem>Paste</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Help</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>About</MenubarItem>
					<MenubarItem>Documentation</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Menubar with shortcuts
export const WithShortcuts: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						New File <MenubarShortcut>⌘N</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Open... <MenubarShortcut>⌘O</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Save <MenubarShortcut>⌘S</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Save As... <MenubarShortcut>⇧⌘S</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						Print... <MenubarShortcut>⌘P</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Edit</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						Undo <MenubarShortcut>⌘Z</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						Cut <MenubarShortcut>⌘X</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Copy <MenubarShortcut>⌘C</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Paste <MenubarShortcut>⌘V</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Menubar with disabled items
export const WithDisabledItems: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>New</MenubarItem>
					<MenubarItem disabled>Open</MenubarItem>
					<MenubarItem disabled>Save</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Close</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Edit</MenubarTrigger>
				<MenubarContent>
					<MenubarItem disabled>Undo</MenubarItem>
					<MenubarItem disabled>Redo</MenubarItem>
					<MenubarSeparator />
					<MenubarItem disabled>Cut</MenubarItem>
					<MenubarItem disabled>Copy</MenubarItem>
					<MenubarItem>Paste</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Menubar with checkboxes
export const WithCheckboxes: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>View</MenubarTrigger>
				<MenubarContent>
					<MenubarCheckboxItem>Show Toolbar</MenubarCheckboxItem>
					<MenubarCheckboxItem checked>Show Status Bar</MenubarCheckboxItem>
					<MenubarCheckboxItem>Show Sidebar</MenubarCheckboxItem>
					<MenubarSeparator />
					<MenubarCheckboxItem>Word Wrap</MenubarCheckboxItem>
					<MenubarCheckboxItem checked>Line Numbers</MenubarCheckboxItem>
					<MenubarCheckboxItem>Minimap</MenubarCheckboxItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Theme</MenubarTrigger>
				<MenubarContent>
					<MenubarCheckboxItem checked>Dark Mode</MenubarCheckboxItem>
					<MenubarCheckboxItem>Light Mode</MenubarCheckboxItem>
					<MenubarCheckboxItem>Auto</MenubarCheckboxItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Menubar with radio groups
export const WithRadioGroups: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Language</MenubarTrigger>
				<MenubarContent>
					<MenubarRadioGroup value="javascript">
						<MenubarRadioItem value="javascript">JavaScript</MenubarRadioItem>
						<MenubarRadioItem value="typescript">TypeScript</MenubarRadioItem>
						<MenubarRadioItem value="python">Python</MenubarRadioItem>
						<MenubarRadioItem value="rust">Rust</MenubarRadioItem>
					</MenubarRadioGroup>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Font Size</MenubarTrigger>
				<MenubarContent>
					<MenubarRadioGroup value="14">
						<MenubarRadioItem value="12">12px</MenubarRadioItem>
						<MenubarRadioItem value="14">14px</MenubarRadioItem>
						<MenubarRadioItem value="16">16px</MenubarRadioItem>
						<MenubarRadioItem value="18">18px</MenubarRadioItem>
					</MenubarRadioGroup>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Menubar with submenus
export const WithSubmenus: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>New</MenubarItem>
					<MenubarItem>Open</MenubarItem>
					<MenubarSeparator />
					<MenubarSub>
						<MenubarSubTrigger>Export</MenubarSubTrigger>
						<MenubarSubContent>
							<MenubarItem>As PDF</MenubarItem>
							<MenubarItem>As Word</MenubarItem>
							<MenubarItem>As HTML</MenubarItem>
						</MenubarSubContent>
					</MenubarSub>
					<MenubarSub>
						<MenubarSubTrigger>Share</MenubarSubTrigger>
						<MenubarSubContent>
							<MenubarItem>Email</MenubarItem>
							<MenubarItem>Slack</MenubarItem>
							<MenubarItem>Teams</MenubarItem>
						</MenubarSubContent>
					</MenubarSub>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Tools</MenubarTrigger>
				<MenubarContent>
					<MenubarSub>
						<MenubarSubTrigger>Format</MenubarSubTrigger>
						<MenubarSubContent>
							<MenubarItem>Bold</MenubarItem>
							<MenubarItem>Italic</MenubarItem>
							<MenubarItem>Underline</MenubarItem>
						</MenubarSubContent>
					</MenubarSub>
					<MenubarSub>
						<MenubarSubTrigger>Insert</MenubarSubTrigger>
						<MenubarSubContent>
							<MenubarItem>Image</MenubarItem>
							<MenubarItem>Table</MenubarItem>
							<MenubarItem>Link</MenubarItem>
						</MenubarSubContent>
					</MenubarSub>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Menubar with inset items
export const WithInsetItems: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Settings</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>General</MenubarItem>
					<MenubarItem>Appearance</MenubarItem>
					<MenubarSeparator />
					<MenubarItem inset>Keyboard Shortcuts</MenubarItem>
					<MenubarItem inset>Extensions</MenubarItem>
					<MenubarItem inset>Updates</MenubarItem>
					<MenubarSeparator />
					<MenubarItem inset>About</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Window</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Minimize</MenubarItem>
					<MenubarItem>Zoom</MenubarItem>
					<MenubarSeparator />
					<MenubarItem inset>Bring All to Front</MenubarItem>
					<MenubarItem inset>Arrange by Name</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Menubar with destructive items
export const WithDestructiveItems: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>New</MenubarItem>
					<MenubarItem>Open</MenubarItem>
					<MenubarItem>Save</MenubarItem>
					<MenubarSeparator />
					<MenubarItem variant="destructive">Delete</MenubarItem>
					<MenubarItem variant="destructive">Move to Trash</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Account</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Profile</MenubarItem>
					<MenubarItem>Settings</MenubarItem>
					<MenubarSeparator />
					<MenubarItem variant="destructive">Sign Out</MenubarItem>
					<MenubarItem variant="destructive">Delete Account</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Complex menubar with all features
export const Complex: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						New Project <MenubarShortcut>⌘N</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Open... <MenubarShortcut>⌘O</MenubarShortcut>
					</MenubarItem>
					<MenubarItem disabled>Open Recent</MenubarItem>
					<MenubarSeparator />
					<MenubarSub>
						<MenubarSubTrigger>Export</MenubarSubTrigger>
						<MenubarSubContent>
							<MenubarItem>As PDF</MenubarItem>
							<MenubarItem>As Word</MenubarItem>
							<MenubarItem>As HTML</MenubarItem>
						</MenubarSubContent>
					</MenubarSub>
					<MenubarSeparator />
					<MenubarItem variant="destructive">Delete Project</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Edit</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						Undo <MenubarShortcut>⌘Z</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						Cut <MenubarShortcut>⌘X</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Copy <MenubarShortcut>⌘C</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Paste <MenubarShortcut>⌘V</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>View</MenubarTrigger>
				<MenubarContent>
					<MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
					<MenubarCheckboxItem>Show Sidebar</MenubarCheckboxItem>
					<MenubarCheckboxItem checked>Show Status Bar</MenubarCheckboxItem>
					<MenubarSeparator />
					<MenubarRadioGroup value="dark">
						<MenubarRadioItem value="light">Light Theme</MenubarRadioItem>
						<MenubarRadioItem value="dark">Dark Theme</MenubarRadioItem>
						<MenubarRadioItem value="auto">Auto</MenubarRadioItem>
					</MenubarRadioGroup>
					<MenubarSeparator />
					<MenubarItem inset>
						Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
					</MenubarItem>
					<MenubarItem inset>
						Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Help</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Documentation</MenubarItem>
					<MenubarItem>Keyboard Shortcuts</MenubarItem>
					<MenubarSeparator />
					<MenubarItem inset>Check for Updates</MenubarItem>
					<MenubarItem inset>About</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};
