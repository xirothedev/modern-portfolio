import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const meta = {
	title: "UI/Carousel",
	component: Carousel,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic carousel with numbered cards
export const Default: Story = {
	render: (args) => (
		<Carousel className="w-full max-w-xs" {...args}>
			<CarouselContent>
				{Array.from({ length: 5 }).map((_, index) => (
					<CarouselItem key={index}>
						<div className="p-1">
							<Card>
								<CardContent className="flex aspect-square items-center justify-center p-6">
									<span className="text-4xl font-semibold">{index + 1}</span>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	),
};

// Carousel with images
export const WithImages: Story = {
	render: (args) => (
		<Carousel className="w-full max-w-xs" {...args}>
			<CarouselContent>
				{Array.from({ length: 5 }).map((_, index) => (
					<CarouselItem key={index}>
						<div className="p-1">
							<Card>
								<CardContent className="flex aspect-square items-center justify-center p-6">
									<div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
										<span className="text-2xl font-semibold">Image {index + 1}</span>
									</div>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	),
};

// Multiple slides per view
export const MultipleSlides: Story = {
	render: (args) => (
		<Carousel
			className="w-full max-w-sm"
			opts={{
				align: "start",
				loop: true,
			}}
			{...args}
		>
			<CarouselContent>
				{Array.from({ length: 10 }).map((_, index) => (
					<CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
						<div className="p-1">
							<Card>
								<CardContent className="flex aspect-square items-center justify-center p-6">
									<span className="text-2xl font-semibold">{index + 1}</span>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	),
};

// Vertical carousel
export const Vertical: Story = {
	render: (args) => (
		<Carousel
			orientation="vertical"
			className="w-full max-w-xs"
			opts={{
				align: "start",
			}}
			{...args}
		>
			<CarouselContent className="-mt-2 h-[200px]">
				{Array.from({ length: 5 }).map((_, index) => (
					<CarouselItem key={index} className="pt-2 md:basis-1/2">
						<div className="p-1">
							<Card>
								<CardContent className="flex aspect-square items-center justify-center p-6">
									<span className="text-4xl font-semibold">{index + 1}</span>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	),
};

// Carousel with custom content
export const CustomContent: Story = {
	render: (args) => (
		<Carousel className="w-full max-w-xs" {...args}>
			<CarouselContent>
				{[
					{
						title: "Feature 1",
						description: "Amazing feature description",
						color: "from-blue-500 to-cyan-500",
					},
					{
						title: "Feature 2",
						description: "Another great feature",
						color: "from-purple-500 to-pink-500",
					},
					{
						title: "Feature 3",
						description: "The best feature ever",
						color: "from-green-500 to-emerald-500",
					},
					{
						title: "Feature 4",
						description: "Innovative solution",
						color: "from-orange-500 to-red-500",
					},
					{
						title: "Feature 5",
						description: "Game changing feature",
						color: "from-indigo-500 to-purple-500",
					},
				].map((item, index) => (
					<CarouselItem key={index}>
						<div className="p-1">
							<Card>
								<CardContent
									className={`flex aspect-square items-center justify-center bg-gradient-to-br p-6 ${item.color} text-white`}
								>
									<div className="text-center">
										<h3 className="mb-2 text-xl font-bold">{item.title}</h3>
										<p className="text-sm opacity-90">{item.description}</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	),
};

// Carousel with loop enabled
export const WithLoop: Story = {
	render: (args) => (
		<Carousel
			className="w-full max-w-xs"
			opts={{
				loop: true,
			}}
			{...args}
		>
			<CarouselContent>
				{Array.from({ length: 3 }).map((_, index) => (
					<CarouselItem key={index}>
						<div className="p-1">
							<Card>
								<CardContent className="flex aspect-square items-center justify-center p-6">
									<span className="text-4xl font-semibold">{index + 1}</span>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	),
};

// Carousel with custom button variants
export const CustomButtons: Story = {
	render: (args) => (
		<Carousel className="w-full max-w-xs" {...args}>
			<CarouselContent>
				{Array.from({ length: 5 }).map((_, index) => (
					<CarouselItem key={index}>
						<div className="p-1">
							<Card>
								<CardContent className="flex aspect-square items-center justify-center p-6">
									<span className="text-4xl font-semibold">{index + 1}</span>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious variant="default" size="default" className="h-10 w-10" />
			<CarouselNext variant="default" size="default" className="h-10 w-10" />
		</Carousel>
	),
};

// Large carousel
export const Large: Story = {
	render: (args) => (
		<Carousel className="w-full max-w-2xl" {...args}>
			<CarouselContent>
				{Array.from({ length: 5 }).map((_, index) => (
					<CarouselItem key={index}>
						<div className="p-1">
							<Card>
								<CardContent className="flex aspect-video items-center justify-center p-6">
									<span className="text-6xl font-semibold">{index + 1}</span>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	),
};

// Carousel without navigation buttons
export const WithoutButtons: Story = {
	render: (args) => (
		<Carousel className="w-full max-w-xs" {...args}>
			<CarouselContent>
				{Array.from({ length: 5 }).map((_, index) => (
					<CarouselItem key={index}>
						<div className="p-1">
							<Card>
								<CardContent className="flex aspect-square items-center justify-center p-6">
									<span className="text-4xl font-semibold">{index + 1}</span>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	),
};
