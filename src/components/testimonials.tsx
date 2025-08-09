import Image from "next/image";
import { GlowingEffect } from "@/components/glowing-effect";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

export type VideoAspect = "16:9" | "9:16" | "1:1";

export type TestimonialItem = {
	name: string;
	title: string;
	avatar: string;
	comment?: string;
	imageSrc?: string; // optional image evidence
	videoSrc?: string; // optional video evidence (mp4 or YouTube URL)
	videoAspect?: VideoAspect; // optional per-item aspect ratio for video
};

export type TestimonialsProps = {
	id?: string;
	title?: string;
	subtitle?: string;
	layout?: "auto" | "stacked" | "sideBySide";
	mediaFirst?: boolean; // for sideBySide: put media column first
	defaultVideoAspect?: VideoAspect; // default if item not specified
};

const testimonials: TestimonialItem[] = [
	{
		name: "Thanh Tin",
		title: "Customer",
		avatar: "/testimonials/thanhtin.png",
		comment:
			"I'll tell you this — even though you don't have much experience, when you promise to make a bot, you actually get it done. You're reliable. Many others only make promises.",
	},
	{
		name: "Lê Xuân Hiệp",
		title: "CEO, Techbyte Technology Investment Company Limited",
		avatar: "/testimonials/codertayto.png",
		comment:
			"Okay, for a high school student like you, this is already really good. Keep it up. You're doing much better than average. Any school will be fine for you. There's nothing to criticize.",
		videoSrc: "/testimonials/codertayto.mp4",
		videoAspect: "9:16",
	},
	{
		name: "Nguyen Thai An",
		title: "Collaborator",
		avatar: "/testimonials/nguyenthaian.png",
		comment:
			"Okay, I'll say a few words to my brother. Actually, I can call him teacher or colleague hehe. He came to me very normally. He and I worked on a project together and built a platform. Over time, he supported me a lot, gave me new ideas and technologies. On the surface, he is cold but very friendly. Sometimes I wonder why he has so much knowledge, sometimes I feel sad because I'm not as good as him, but I know he is a hard worker. Keep it up, boy.",
	},
];

function aspectClass(aspect: VideoAspect) {
	switch (aspect) {
		case "16:9":
			return "aspect-video";
		case "9:16":
			return "aspect-[9/16]";
		case "1:1":
			return "aspect-square";
		default:
			return "aspect-video";
	}
}

function MediaBlock({
	imageSrc,
	videoSrc,
	videoAspect,
}: {
	imageSrc?: string;
	videoSrc?: string;
	videoAspect: VideoAspect;
}) {
	if (!imageSrc && !videoSrc) return null;

	const wrapperAspect = aspectClass(videoAspect);

	return (
		<div className="space-y-3">
			{videoSrc && (
				<div className={cn("overflow-hidden rounded-lg border border-zinc-800", wrapperAspect)}>
					<video controls className="h-full w-full object-cover">
						<source src={videoSrc} />
					</video>
				</div>
			)}

			{imageSrc && (
				<div className="overflow-hidden rounded-lg border border-zinc-800">
					<Image
						src={imageSrc}
						alt="testimonial image"
						width={800}
						height={450}
						className="h-48 w-full object-cover"
					/>
				</div>
			)}
		</div>
	);
}

export function Testimonials({
	id = "testimonials",
	title = "Testimonials",
	subtitle = "What clients and peers say",
	layout = "auto",
	mediaFirst = true,
	defaultVideoAspect = "16:9",
}: TestimonialsProps) {
	return (
		<section id={id} className="relative py-32">
			<div className="absolute inset-0 z-0">
				<div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
				<div className="absolute right-1/3 bottom-1/3 h-64 w-64 rounded-full bg-pink-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
			</div>

			<div className="relative z-10 container">
				<SectionHeading title={title} subtitle={subtitle} />

				<div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{testimonials.map((t, idx) => {
						const hasMedia = !!(t.imageSrc || t.videoSrc);
						const itemVideoAspect = (t.videoSrc ? (t as any).videoAspect : undefined) ?? defaultVideoAspect;
						const isInlineForVideo = t.videoSrc
							? itemVideoAspect === "1:1" || itemVideoAspect === "9:16"
							: false;
						const useSideBySide = t.videoSrc
							? isInlineForVideo
							: layout === "sideBySide" || (layout === "auto" && hasMedia);

						return (
							<div
								key={`${t.name}-${idx}`}
								className={cn(
									"relative h-full rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm",
									testimonials.length === 1 && "col-start-2",
								)}
							>
								<GlowingEffect
									disabled={false}
									proximity={50}
									spread={30}
									borderWidth={2}
									movementDuration={1.5}
								/>

								{useSideBySide ? (
									<div
										className={cn(
											"grid gap-6 md:grid-cols-2",
											!mediaFirst && "md:[&>*:first-child]:order-2",
										)}
									>
										{/* Media */}
										<div>
											<MediaBlock
												imageSrc={t.imageSrc}
												videoSrc={t.videoSrc}
												videoAspect={itemVideoAspect}
											/>
										</div>

										{/* Text */}
										<div className="min-w-0">
											<div className="flex items-center gap-4">
												<Image
													src={t.avatar}
													alt={t.name}
													width={48}
													height={48}
													className="h-12 w-12 rounded-full object-cover"
												/>
												<div className="min-w-0">
													<div className="font-semibold">{t.name}</div>
													<div className="truncate text-sm text-zinc-500">{t.title}</div>
												</div>
											</div>
											{t.comment && <p className="mt-4 text-zinc-300">{t.comment}</p>}
										</div>
									</div>
								) : (
									<div>
										{/* Header */}
										<div className="flex items-center gap-4">
											<Image
												src={t.avatar}
												alt={t.name}
												width={48}
												height={48}
												className="h-12 w-12 rounded-full object-cover"
											/>
											<div className="min-w-0">
												<div className="font-semibold">{t.name}</div>
												<div className="truncate text-sm text-zinc-500">{t.title}</div>
											</div>
										</div>

										{t.comment && <p className="mt-4 text-zinc-300">{t.comment}</p>}

										<div className="mt-6">
											<MediaBlock
												imageSrc={t.imageSrc}
												videoSrc={t.videoSrc}
												videoAspect={itemVideoAspect}
											/>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
