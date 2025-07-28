import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AspectRatio } from "./aspect-ratio";
import Image from "next/image";

const meta = {
	title: "UI/AspectRatio",
	component: AspectRatio,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	args: {
		ratio: 16 / 9,
	},
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default 16:9 aspect ratio
export const Default: Story = {
	render: (args) => (
		<div className="w-[400px]">
			<AspectRatio {...args}>
				<Image
					src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
					height={0}
					width={0}
					alt="Mountain landscape with trees"
					className="h-full w-full rounded-md object-cover"
				/>
			</AspectRatio>
		</div>
	),
};

// Square aspect ratio (1:1)
export const Square: Story = {
	render: (args) => (
		<div className="w-[300px]">
			<AspectRatio {...args} ratio={1}>
				<Image
					src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
					height={0}
					width={0}
					alt="Mountain landscape with trees"
					className="h-full w-full rounded-md object-cover"
				/>
			</AspectRatio>
		</div>
	),
};

// Portrait aspect ratio (3:4)
export const Portrait: Story = {
	render: (args) => (
		<div className="w-[300px]">
			<AspectRatio {...args} ratio={3 / 4}>
				<Image
					src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
					height={0}
					width={0}
					alt="Mountain landscape with trees"
					className="h-full w-full rounded-md object-cover"
				/>
			</AspectRatio>
		</div>
	),
};

// Ultra-wide aspect ratio (21:9)
export const UltraWide: Story = {
	render: (args) => (
		<div className="w-[600px]">
			<AspectRatio {...args} ratio={21 / 9}>
				<Image
					src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
					height={0}
					width={0}
					alt="Mountain landscape with trees"
					className="h-full w-full rounded-md object-cover"
				/>
			</AspectRatio>
		</div>
	),
};

// Video aspect ratio (4:3)
export const Video: Story = {
	render: (args) => (
		<div className="w-[400px]">
			<AspectRatio {...args} ratio={4 / 3}>
				<iframe
					src="https://www.youtube.com/embed/dQw4w9WgXcQ"
					title="YouTube video player"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					className="h-full w-full rounded-md"
				/>
			</AspectRatio>
		</div>
	),
};

// Custom content with aspect ratio
export const CustomContent: Story = {
	render: (args) => (
		<div className="w-[400px]">
			<AspectRatio {...args}>
				<div className="flex flex-col items-center justify-center rounded-md border border-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 p-6">
					<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
						<svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<title>Image icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h3 className="mb-2 text-lg font-semibold text-slate-800">Custom Content</h3>
					<p className="text-center text-sm text-slate-600">
						This demonstrates how AspectRatio can contain any content while maintaining the specified ratio.
					</p>
				</div>
			</AspectRatio>
		</div>
	),
};
