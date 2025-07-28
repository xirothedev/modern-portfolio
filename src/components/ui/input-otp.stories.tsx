import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputOTPDemo, InputOTPSizesDemo } from "./input-otp-demo";

const meta = {
	title: "UI/InputOTP",
	component: InputOTPDemo,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		maxLength: {
			control: { type: "number", min: 1, max: 10 },
			description: "Maximum number of digits",
		},
		disabled: {
			control: { type: "boolean" },
			description: "Whether the input is disabled",
		},
		autoFocus: {
			control: { type: "boolean" },
			description: "Whether the input should auto-focus",
		},
		showSeparator: {
			control: { type: "boolean" },
			description: "Show separator between groups (only works with 6 digits)",
		},
		customStyling: {
			control: { type: "boolean" },
			description: "Apply custom blue styling",
		},
		showValidation: {
			control: { type: "boolean" },
			description: "Show validation error for repeated digits",
		},
		showClearButton: {
			control: { type: "boolean" },
			description: "Show clear button",
		},
		size: {
			control: { type: "select" },
			options: ["small", "default", "large"],
			description: "Size of the input slots",
		},
	},
} satisfies Meta<typeof InputOTPDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic OTP input with 4 digits
export const Default: Story = {
	args: {
		maxLength: 4,
	},
};

// OTP input with 6 digits
export const SixDigits: Story = {
	args: {
		maxLength: 6,
	},
};

// OTP input with separators
export const WithSeparators: Story = {
	args: {
		maxLength: 6,
		showSeparator: true,
	},
};

// OTP input with custom styling
export const CustomStyling: Story = {
	args: {
		maxLength: 4,
		customStyling: true,
		containerClassName: "gap-3",
	},
};

// OTP input with validation
export const WithValidation: Story = {
	args: {
		maxLength: 4,
		showValidation: true,
	},
};

// OTP input with different sizes
export const Sizes: Story = {
	render: () => <InputOTPSizesDemo />,
};

// OTP input with disabled state
export const Disabled: Story = {
	args: {
		maxLength: 4,
		disabled: true,
	},
};

// OTP input with auto-focus
export const AutoFocus: Story = {
	args: {
		maxLength: 4,
		autoFocus: true,
	},
};

// OTP input with clear functionality
export const WithClearButton: Story = {
	args: {
		maxLength: 4,
		showClearButton: true,
	},
};
