"use client";

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(function ({ id, title, description, action, ...props }) {
				return (
					<Toast key={id} {...props} className="border-zinc-700 bg-zinc-900/95 text-white backdrop-blur-sm">
						<div className="grid gap-1">
							{title && <ToastTitle className="text-white">{title}</ToastTitle>}
							{description && (
								<ToastDescription className="text-zinc-300">{description}</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose className="text-zinc-400 hover:text-zinc-200" />
					</Toast>
				);
			})}
			<ToastViewport className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]" />
		</ToastProvider>
	);
}
