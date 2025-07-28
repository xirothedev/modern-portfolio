import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Toaster } from "./sonner";
import { toast } from "sonner";

const meta = {
	title: "UI/Sonner",
	component: Toaster,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div>
				<Story />
				<Toaster />
			</div>
		),
	],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default toast demo
export const Default: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast("Event has been created", {
					description: "Sunday, December 03, 2023 at 9:00 AM",
					action: {
						label: "Undo",
						onClick: () => console.log("Undo"),
					},
				})
			}
		>
			Show Toast
		</Button>
	),
};

// Simple toast
export const Simple: Story = {
	render: () => (
		<Button variant="outline" onClick={() => toast("This is a simple toast message")}>
			Simple Toast
		</Button>
	),
};

// Toast with description
export const WithDescription: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast("Success!", {
					description: "Your changes have been saved successfully.",
				})
			}
		>
			Toast with Description
		</Button>
	),
};

// Success toast
export const Success: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast.success("Success!", {
					description: "Your profile has been updated.",
				})
			}
		>
			Success Toast
		</Button>
	),
};

// Error toast
export const ErrorToast: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast.error("Error!", {
					description: "Something went wrong. Please try again.",
				})
			}
		>
			Error Toast
		</Button>
	),
};

// Warning toast
export const Warning: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast.warning("Warning!", {
					description: "Please check your input before proceeding.",
				})
			}
		>
			Warning Toast
		</Button>
	),
};

// Info toast
export const Info: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast.info("Information", {
					description: "Here's some useful information for you.",
				})
			}
		>
			Info Toast
		</Button>
	),
};

// Toast with action
export const WithAction: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast("File uploaded", {
					description: "document.pdf has been uploaded to your account.",
					action: {
						label: "View",
						onClick: () => console.log("View file"),
					},
				})
			}
		>
			Toast with Action
		</Button>
	),
};

// Toast with multiple actions
export const WithMultipleActions: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast("Message sent", {
					description: "Your message has been delivered to the recipient.",
					action: {
						label: "Reply",
						onClick: () => console.log("Reply"),
					},
					cancel: {
						label: "Dismiss",
						onClick: () => console.log("Dismiss"),
					},
				})
			}
		>
			Toast with Multiple Actions
		</Button>
	),
};

// Promise toast
export const PromiseToast: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() => {
				toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
					loading: "Uploading files...",
					success: "Files uploaded successfully!",
					error: "Upload failed. Please try again.",
				});
			}}
		>
			Promise Toast
		</Button>
	),
};

// Custom promise toast
export const CustomPromise: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() => {
				toast.promise(
					new Promise((resolve, reject) => {
						setTimeout(() => {
							if (Math.random() > 0.5) resolve("Success");
							else reject("Error");
						}, 2000);
					}),
					{
						loading: "Processing your request...",
						success: (data) => `Request completed: ${data}`,
						error: (error) => `Request failed: ${error}`,
					},
				);
			}}
		>
			Custom Promise Toast
		</Button>
	),
};

// Toast with custom duration
export const CustomDuration: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast("This toast will stay for 10 seconds", {
					duration: 10000,
				})
			}
		>
			Custom Duration (10s)
		</Button>
	),
};

// Toast with custom styling
export const CustomStyling: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast("Custom styled toast", {
					description: "This toast has custom styling",
					className: "bg-blue-500 text-white border-blue-600",
				})
			}
		>
			Custom Styled Toast
		</Button>
	),
};

// Multiple toasts
export const MultipleToasts: Story = {
	render: () => (
		<div className="flex gap-2">
			<Button variant="outline" onClick={() => toast("First toast")}>
				Toast 1
			</Button>
			<Button variant="outline" onClick={() => toast.success("Second toast")}>
				Toast 2
			</Button>
			<Button variant="outline" onClick={() => toast.error("Third toast")}>
				Toast 3
			</Button>
		</div>
	),
};

// Toast with rich content
export const RichContent: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast("New message received", {
					description: (
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-green-500" />
							<span>John Doe sent you a message</span>
						</div>
					),
					action: {
						label: "Reply",
						onClick: () => console.log("Reply to message"),
					},
				})
			}
		>
			Rich Content Toast
		</Button>
	),
};

// Toast with dismiss button
export const WithDismiss: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast("Dismissible toast", {
					description: "This toast can be dismissed manually",
					dismissible: true,
				})
			}
		>
			Dismissible Toast
		</Button>
	),
};

// Toast with custom position
export const CustomPosition: Story = {
	render: () => (
		<div className="flex gap-2">
			<Button
				variant="outline"
				onClick={() =>
					toast("Top-left toast", {
						position: "top-left",
					})
				}
			>
				Top-Left
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					toast("Top-center toast", {
						position: "top-center",
					})
				}
			>
				Top-Center
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					toast("Top-right toast", {
						position: "top-right",
					})
				}
			>
				Top-Right
			</Button>
		</div>
	),
};

// Toast with custom icon
export const CustomIcon: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() =>
				toast("Custom icon toast", {
					description: "This toast has a custom icon",
					icon: "🎉",
				})
			}
		>
			Custom Icon Toast
		</Button>
	),
};

// Toast with loading state
export const Loading: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() => {
				const toastId = toast.loading("Loading...", {
					description: "Please wait while we process your request",
				});

				setTimeout(() => {
					toast.success("Completed!", {
						id: toastId,
						description: "Your request has been processed successfully",
					});
				}, 3000);
			}}
		>
			Loading Toast
		</Button>
	),
};

// Toast with update
export const WithUpdate: Story = {
	render: () => (
		<Button
			variant="outline"
			onClick={() => {
				const toastId = toast("Initial message");

				setTimeout(() => {
					toast.dismiss(toastId);
					toast.success("Done!", {
						description: "Updated description",
						action: {
							label: "Updated Action",
							onClick: () => console.log("Updated action"),
						},
					});
				}, 1000);
			}}
		>
			Update Toast
		</Button>
	),
};
