import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar } from "./calendar";

const meta = {
	title: "UI/Calendar",
	component: Calendar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => <Calendar {...args} className="rounded-md border shadow-sm" />,
	args: {
		captionLayout: "dropdown",
		mode: "single",
	},
};

export const Multiple: Story = {
	render: (args) => <Calendar {...args} numberOfMonths={3} className="rounded-md border shadow-sm" />,
	args: {
		captionLayout: "dropdown",
		mode: "single",
	},
};

export const Range: Story = {
	render: (args) => <Calendar {...args} numberOfMonths={2} className="rounded-md border shadow-sm" />,
	args: {
		captionLayout: "dropdown",
		mode: "range",
	},
};

export const WithWeekNumbers: Story = {
	render: (args) => <Calendar {...args} showWeekNumber className="rounded-md border shadow-sm" />,
	args: {
		captionLayout: "dropdown",
		mode: "single",
	},
};

export const DisabledDates: Story = {
	render: (args) => {
		const today = new Date();
		const disabledDays = [
			{ before: new Date(today.getFullYear(), today.getMonth(), 1) },
			{ after: new Date(today.getFullYear(), today.getMonth() + 1, 0) },
			{ dayOfWeek: [0, 6] }, // Disable weekends
		];

		return <Calendar {...args} disabled={disabledDays} className="rounded-md border shadow-sm" />;
	},
	args: {
		captionLayout: "dropdown",
		mode: "single",
	},
};

export const CustomStyling: Story = {
	render: (args) => (
		<Calendar
			{...args}
			className="rounded-md border bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm"
			classNames={{
				day: "hover:bg-slate-200 focus:bg-slate-200",
				day_selected: "bg-blue-500 text-white hover:bg-blue-600",
				day_today: "bg-blue-100 text-blue-900",
			}}
		/>
	),
	args: {
		captionLayout: "dropdown",
		mode: "single",
	},
};

export const ButtonVariants: Story = {
	render: (args) => (
		<div className="space-y-4">
			<div>
				<h3 className="mb-2 text-sm font-medium">Ghost Variant (Default)</h3>
				<Calendar {...args} buttonVariant="ghost" className="rounded-md border shadow-sm" />
			</div>

			<div>
				<h3 className="mb-2 text-sm font-medium">Outline Variant</h3>
				<Calendar {...args} buttonVariant="outline" className="rounded-md border shadow-sm" />
			</div>

			<div>
				<h3 className="mb-2 text-sm font-medium">Secondary Variant</h3>
				<Calendar {...args} buttonVariant="secondary" className="rounded-md border shadow-sm" />
			</div>
		</div>
	),
	args: {
		captionLayout: "dropdown",
		mode: "single",
	},
};
