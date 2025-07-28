import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
	title: "UI/Tabs",
	component: Tabs,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	render: () => (
		<Tabs defaultValue="tab1" className="w-[300px]">
			<TabsList>
				<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				<TabsTrigger value="tab3">Tab 3</TabsTrigger>
			</TabsList>
			<TabsContent value="tab1">Content Tab 1</TabsContent>
			<TabsContent value="tab2">Content Tab 2</TabsContent>
			<TabsContent value="tab3">Content Tab 3</TabsContent>
		</Tabs>
	),
};
