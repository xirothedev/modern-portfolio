"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";

function ParticleOctagon() {
	const pointsRef = useRef<THREE.Points>(null);

	const mouse = new THREE.Vector3(0, 0, 0);

	const particles = useMemo(() => {
		const temp = [];
		const count = 3000;
		const size = 2.5;
		const cornerCut = size * 0.3;

		for (let i = 0; i < count; i++) {
			const x = (Math.random() - 0.5) * size * 2;
			const y = (Math.random() - 0.5) * size * 2;
			const z = (Math.random() - 0.5) * size * 2;

			if (
				Math.abs(x) + Math.abs(y) > size * 1.4 ||
				Math.abs(y) + Math.abs(z) > size * 1.4 ||
				Math.abs(x) + Math.abs(z) > size * 1.4
			) {
				continue;
			}

			temp.push({
				position: new THREE.Vector3(x, y, z),
				basePosition: new THREE.Vector3(x, y, z),
				velocity: new THREE.Vector3(0, 0, 0),
				color: Math.random() > 0.5 ? "#9333ea" : "#ec4899", // Purple or Pink
			});
		}
		return temp;
	}, []);

	const positions = useMemo(() => new Float32Array(particles.map((p) => p.position.toArray()).flat()), [particles]);
	const colors = useMemo(
		() => new Float32Array(particles.map((p) => new THREE.Color(p.color).toArray()).flat()),
		[particles],
	);

	useFrame((state) => {
		// Cập nhật vị trí chuột 3D
		mouse.x = (state.mouse.x * state.viewport.width) / 2;
		mouse.y = (state.mouse.y * state.viewport.height) / 2;

		if (pointsRef.current) {
			const positionAttribute = pointsRef.current.geometry.getAttribute("position");

			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];

				const distance = p.position.distanceTo(mouse);
				const maxDistance = 2;

				if (distance < maxDistance) {
					const force = (maxDistance - distance) / maxDistance;
					const direction = new THREE.Vector3().subVectors(p.position, mouse).normalize();
					p.velocity.add(direction.multiplyScalar(force * 0.05));
				}

				const returnForce = new THREE.Vector3().subVectors(p.basePosition, p.position).multiplyScalar(0.005);
				p.velocity.add(returnForce);

				p.velocity.multiplyScalar(0.95);

				p.position.add(p.velocity);

				positionAttribute.setXYZ(i, p.position.x, p.position.y, p.position.z);
			}

			positionAttribute.needsUpdate = true;

			pointsRef.current.rotation.y += 0.0005;
			pointsRef.current.rotation.x += 0.0002;
		}
	});

	return (
		<points ref={pointsRef}>
			<bufferGeometry>
				<bufferAttribute
					attach="attributes-position"
					args={[positions, 3]}
					count={positions.length / 3}
					array={positions}
					itemSize={3}
				/>
				<bufferAttribute
					attach="attributes-color"
					args={[colors, 3]}
					count={colors.length / 3}
					array={colors}
					itemSize={3}
				/>
			</bufferGeometry>
			<pointsMaterial
				size={0.05}
				vertexColors
				blending={THREE.AdditiveBlending}
				transparent
				opacity={0.8}
				depthWrite={false}
			/>
		</points>
	);
}

export function CreativeHero() {
	return (
		<motion.div
			className="relative flex h-[400px] w-full items-center justify-center md:h-[500px]"
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 1, ease: "easeOut" }}
		>
			{/* Background glow effect - Giữ nguyên */}
			<div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-3xl"></div>

			{/* Octagonal container */}
			<div className="relative" style={{ width: "400px", height: "400px" }}>
				{/* Canvas container with clip-path */}
				<div
					className="absolute inset-0"
					style={{
						clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
					}}
				>
					<Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
						<pointLight position={[0, 0, 1]} intensity={50} color="#eab308" />
						<ambientLight intensity={0.5} />

						<ParticleOctagon />

						<OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
					</Canvas>
				</div>

				<div
					className="pointer-events-none absolute inset-0 border-2 border-purple-500/30"
					style={{
						clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
					}}
				/>
				<div
					className="pointer-events-none absolute inset-2 bg-gradient-to-br from-purple-400/5 via-pink-400/5 to-purple-400/5 blur-sm"
					style={{
						clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
					}}
				/>

				<motion.div
					className="absolute -bottom-8 left-1/2 -translate-x-1/2 transform text-center text-xs text-zinc-500"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 2, duration: 1 }}
				>
					Move your cursor to interact
				</motion.div>
			</div>
		</motion.div>
	);
}
