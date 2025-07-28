import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "./select";

const meta = {
	title: "UI/Select",
	component: Select,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	render: (args) => (
		<Select defaultValue={args.defaultValue} {...args}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a fruit" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Fruits</SelectLabel>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectItem value="banana">Banana</SelectItem>
					<SelectItem value="blueberry">Blueberry</SelectItem>
					<SelectItem value="grapes">Grapes</SelectItem>
					<SelectItem value="pineapple">Pineapple</SelectItem>
				</SelectGroup>
				<SelectSeparator />
				<SelectGroup>
					<SelectLabel>Vegetables</SelectLabel>
					<SelectItem value="carrot">Carrot</SelectItem>
					<SelectItem value="broccoli">Broccoli</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	),
	args: {
		defaultValue: "apple",
	},
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PreselectedBanana: Story = {
	args: {
		defaultValue: "banana",
	},
};
