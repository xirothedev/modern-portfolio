"use client";

import { animate, stagger, svg } from "animejs";

import { useEffect } from "react";

export default function StaggerText() {
	useEffect(() => {
		animate(svg.createDrawable(".line"), {
			draw: ["0 0", "0 1", "1 1"],
			ease: "inOutQuad",
			duration: 5000,
			delay: stagger(200),
			loop: true,
		});
	}, []);

	return (
		<svg className="logo" viewBox="0 0 320 60" xmlns="http://www.w3.org/2000/svg">
			<g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
				{/* --- Xiro --- */}
				<path className="line" d="M10 15 L 40 45 M 40 15 L 10 45" /> {/* X */}
				<path className="line" d="M55 30 V 45 M 55 20 V 20" /> {/* i */}
				<path className="line" d="M70 45 V 30 C 70 22.5 77.5 22.5 85 30" /> {/* r */}
				<path className="line" d="M100 30 A 7.5 7.5 0 1 1 115 30 A 7.5 7.5 0 1 1 100 30" /> {/* o */}
				{/* --- Dev --- */}
				<path className="line" d="M150 15 V 45 C 150 45 175 45 175 30 C 175 15 150 15 150 15" /> {/* D */}
				<path className="line" d="M210 37.5 A 7.5 7.5 0 1 1 195 30 H 210" /> {/* e */}
				<path className="line" d="M225 15 L 240 45 L 255 15" /> {/* v */}
			</g>
		</svg>
	);
}
