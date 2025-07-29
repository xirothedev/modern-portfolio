"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function ContactForm() {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 1500));

		toast({
			title: "Message sent!",
			description: "Thanks for reaching out. I'll get back to you soon.",
		});

		setIsSubmitting(false);
		e.currentTarget.reset();
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
		>
			<div className="relative overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-xs transition-all duration-300 hover:border-purple-500/50">
				<div className="absolute -inset-1 rounded-xl bg-linear-to-r from-purple-500/10 to-pink-500/10 opacity-25 blur-sm transition duration-1000 hover:opacity-100 hover:duration-200"></div>

				<div className="relative">
					<h3 className="mb-6 text-2xl font-bold">Send Me a Message</h3>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Input
								placeholder="Your Name"
								required
								className="border-zinc-700 bg-zinc-900/50 focus:border-purple-500 focus:ring-purple-500/20"
							/>
						</div>
						<div className="space-y-2">
							<Input
								type="email"
								placeholder="Your Email"
								required
								className="border-zinc-700 bg-zinc-900/50 focus:border-purple-500 focus:ring-purple-500/20"
							/>
						</div>
						<div className="space-y-2">
							<Input
								placeholder="Subject"
								required
								className="border-zinc-700 bg-zinc-900/50 focus:border-purple-500 focus:ring-purple-500/20"
							/>
						</div>
						<div className="space-y-2">
							<Textarea
								placeholder="Your Message"
								rows={5}
								required
								className="border-zinc-700 bg-zinc-900/50 focus:border-purple-500 focus:ring-purple-500/20"
							/>
						</div>
						<Button
							type="submit"
							className="w-full border-0 bg-linear-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>Sending...</>
							) : (
								<>
									Send Message <Send className="ml-2 h-4 w-4" />
								</>
							)}
						</Button>
					</form>
				</div>
			</div>
		</motion.div>
	);
}
