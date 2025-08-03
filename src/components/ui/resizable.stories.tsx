import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable";

const meta = {
	title: "UI/Resizable",
	component: ResizablePanelGroup,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default resizable demo with nested panels
export const Default: Story = {
	args: { direction: "horizontal" },
	render: () => (
		<ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border md:min-w-[450px]">
			<ResizablePanel defaultSize={50}>
				<div className="flex h-[200px] items-center justify-center p-6">
					<span className="font-semibold">One</span>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={50}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={25}>
						<div className="flex h-full items-center justify-center p-6">
							<span className="font-semibold">Two</span>
						</div>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={75}>
						<div className="flex h-full items-center justify-center p-6">
							<span className="font-semibold">Three</span>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

// Simple horizontal resizable
export const Horizontal: Story = {
	args: { direction: "horizontal" },
	render: (args) => (
		<ResizablePanelGroup {...args} className="max-w-md rounded-lg border md:min-w-[450px]">
			<ResizablePanel defaultSize={60}>
				<div className="bg-muted flex h-[200px] items-center justify-center p-6">
					<span className="font-semibold">Left Panel (60%)</span>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={40}>
				<div className="bg-background flex h-[200px] items-center justify-center p-6">
					<span className="font-semibold">Right Panel (40%)</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

// Simple vertical resizable
export const Vertical: Story = {
	args: { direction: "vertical" },
	render: (args) => (
		<ResizablePanelGroup {...args} className="h-[300px] max-w-md rounded-lg border">
			<ResizablePanel defaultSize={70}>
				<div className="bg-muted flex h-full items-center justify-center p-6">
					<span className="font-semibold">Top Panel (70%)</span>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={30}>
				<div className="bg-background flex h-full items-center justify-center p-6">
					<span className="font-semibold">Bottom Panel (30%)</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

// Three panel horizontal layout
export const ThreePanels: Story = {
	args: { direction: "horizontal" },
	render: (args) => (
		<ResizablePanelGroup {...args} className="max-w-4xl rounded-lg border md:min-w-[600px]">
			<ResizablePanel defaultSize={25}>
				<div className="bg-muted flex h-[200px] items-center justify-center p-6">
					<span className="font-semibold">Sidebar (25%)</span>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={50}>
				<div className="bg-background flex h-[200px] items-center justify-center p-6">
					<span className="font-semibold">Main Content (50%)</span>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={25}>
				<div className="bg-muted flex h-[200px] items-center justify-center p-6">
					<span className="font-semibold">Details (25%)</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

// Resizable with handle
export const WithHandle: Story = {
	args: { direction: "horizontal" },
	render: (args) => (
		<ResizablePanelGroup {...args} className="max-w-md rounded-lg border md:min-w-[450px]">
			<ResizablePanel defaultSize={50}>
				<div className="bg-muted flex h-[200px] items-center justify-center p-6">
					<span className="font-semibold">Panel One</span>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={50}>
				<div className="bg-background flex h-[200px] items-center justify-center p-6">
					<span className="font-semibold">Panel Two</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

// Complex nested layout
export const ComplexLayout: Story = {
	args: { direction: "horizontal" },
	render: (args) => (
		<ResizablePanelGroup {...args} className="max-w-6xl rounded-lg border md:min-w-[800px]">
			<ResizablePanel defaultSize={20}>
				<div className="bg-muted flex h-[300px] items-center justify-center p-6">
					<span className="font-semibold">Navigation</span>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={80}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={60}>
						<div className="bg-background flex h-full items-center justify-center p-6">
							<span className="font-semibold">Main Content Area</span>
						</div>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={40}>
						<ResizablePanelGroup direction="horizontal">
							<ResizablePanel defaultSize={50}>
								<div className="bg-muted flex h-full items-center justify-center p-6">
									<span className="font-semibold">Console</span>
								</div>
							</ResizablePanel>
							<ResizableHandle />
							<ResizablePanel defaultSize={50}>
								<div className="bg-background flex h-full items-center justify-center p-6">
									<span className="font-semibold">Output</span>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

// Code editor layout
export const CodeEditor: Story = {
	args: { direction: "horizontal" },
	render: (args) => (
		<ResizablePanelGroup {...args} className="max-w-6xl rounded-lg border md:min-w-[800px]">
			<ResizablePanel defaultSize={30}>
				<div className="bg-muted flex h-[400px] items-center justify-center p-6">
					<span className="font-semibold">File Explorer</span>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={70}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={80}>
						<div className="bg-background flex h-full items-center justify-center p-6">
							<span className="font-semibold">Code Editor</span>
						</div>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={20}>
						<div className="bg-muted flex h-full items-center justify-center p-6">
							<span className="font-semibold">Terminal</span>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

// Dashboard layout
export const Dashboard: Story = {
	args: { direction: "horizontal" },
	render: (args) => (
		<ResizablePanelGroup {...args} className="max-w-6xl rounded-lg border md:min-w-[800px]">
			<ResizablePanel defaultSize={25}>
				<div className="bg-muted flex h-[400px] items-center justify-center p-6">
					<span className="font-semibold">Sidebar</span>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={75}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={50}>
						<ResizablePanelGroup direction="horizontal">
							<ResizablePanel defaultSize={50}>
								<div className="bg-background flex h-full items-center justify-center p-6">
									<span className="font-semibold">Chart 1</span>
								</div>
							</ResizablePanel>
							<ResizableHandle />
							<ResizablePanel defaultSize={50}>
								<div className="bg-muted flex h-full items-center justify-center p-6">
									<span className="font-semibold">Chart 2</span>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={50}>
						<ResizablePanelGroup direction="horizontal">
							<ResizablePanel defaultSize={33}>
								<div className="bg-background flex h-full items-center justify-center p-6">
									<span className="font-semibold">Table</span>
								</div>
							</ResizablePanel>
							<ResizableHandle />
							<ResizablePanel defaultSize={33}>
								<div className="bg-muted flex h-full items-center justify-center p-6">
									<span className="font-semibold">Metrics</span>
								</div>
							</ResizablePanel>
							<ResizableHandle />
							<ResizablePanel defaultSize={34}>
								<div className="bg-background flex h-full items-center justify-center p-6">
									<span className="font-semibold">Activity</span>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

// Minimal resizable
export const Minimal: Story = {
	args: { direction: "horizontal" },
	render: (args) => (
		<ResizablePanelGroup {...args} className="max-w-md rounded-lg border md:min-w-[400px]">
			<ResizablePanel defaultSize={50}>
				<div className="flex h-[150px] items-center justify-center p-4">
					<span className="text-sm">Left</span>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={50}>
				<div className="flex h-[150px] items-center justify-center p-4">
					<span className="text-sm">Right</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

// Resizable with custom styling
export const CustomStyling: Story = {
	args: { direction: "horizontal" },
	render: (args) => (
		<ResizablePanelGroup
			{...args}
			className="border-primary/20 max-w-md rounded-lg border-2 shadow-lg md:min-w-[450px]"
		>
			<ResizablePanel defaultSize={50}>
				<div className="flex h-[200px] items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
					<span className="font-semibold text-blue-900">Gradient Panel</span>
				</div>
			</ResizablePanel>
			<ResizableHandle className="bg-primary/20 hover:bg-primary/40" />
			<ResizablePanel defaultSize={50}>
				<div className="flex h-[200px] items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
					<span className="font-semibold text-green-900">Another Gradient</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};
