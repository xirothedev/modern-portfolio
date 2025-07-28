"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

export function CreativeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let devicePixelRatio: number;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      devicePixelRatio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;

      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Mouse position
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    });

    // Function to check if point is inside octagon
    const isInsideOctagon = (
      x: number,
      y: number,
      centerX: number,
      centerY: number,
      size: number
    ) => {
      const dx = Math.abs(x - centerX);
      const dy = Math.abs(y - centerY);

      // Octagon bounds check
      const cornerCut = size * 0.3; // How much to cut the corners

      if (dx <= size - cornerCut && dy <= size - cornerCut) return true;
      if (dx <= size && dy <= size) {
        return dx - (size - cornerCut) + (dy - (size - cornerCut)) <= cornerCut;
      }
      return false;
    };

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;
      distance: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 5 + 2;
        this.density = Math.random() * 30 + 1;
        this.distance = 0;

        // Create a gradient from purple to pink
        const hue = Math.random() * 60 + 270; // 270-330 range for purples and pinks
        this.color = `hsl(${hue}, 70%, 60%)`;
      }

      update() {
        // Calculate distance between mouse and particle
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);

        const forceDirectionX = dx / this.distance;
        const forceDirectionY = dy / this.distance;

        const maxDistance = 100;
        const force = (maxDistance - this.distance) / maxDistance;

        if (this.distance < maxDistance) {
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;

          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Create particle grid within octagon
    const particlesArray: Particle[] = [];
    const gridSize = 25;

    function init() {
      particlesArray.length = 0;

      if (!canvas) return;

      const canvasWidth = canvas.width / devicePixelRatio;
      const canvasHeight = canvas.height / devicePixelRatio;
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      const octagonSize = Math.min(canvasWidth, canvasHeight) * 0.35;

      const numX = Math.floor(canvasWidth / gridSize);
      const numY = Math.floor(canvasHeight / gridSize);

      for (let y = 0; y < numY; y++) {
        for (let x = 0; x < numX; x++) {
          const posX = x * gridSize + gridSize / 2;
          const posY = y * gridSize + gridSize / 2;

          // Only create particles inside the octagon
          if (isInsideOctagon(posX, posY, centerX, centerY, octagonSize)) {
            particlesArray.push(new Particle(posX, posY));
          }
        }
      }
    }

    init();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse following
      mouseX += (targetX - mouseX) * 0.1;
      mouseY += (targetY - mouseY) * 0.1;

      // Draw connections
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // Draw connections
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 30) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(180, 120, 255, ${0.2 - distance / 150})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    window.addEventListener("resize", init);

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <motion.div
      className="w-full h-[400px] md:h-[500px] relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

      {/* Octagonal container */}
      <div className="relative">
        {/* Octagonal border decoration */}
        <div
          className="absolute inset-0 bg-linear-to-br from-purple-500/20 via-pink-500/20 to-purple-500/20 border-2 border-purple-500/30"
          style={{
            clipPath:
              "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            width: "100%",
            height: "100%",
          }}
        />

        {/* Inner octagonal glow */}
        <div
          className="absolute inset-2 bg-linear-to-br from-purple-400/10 via-pink-400/10 to-purple-400/10 blur-xs"
          style={{
            clipPath:
              "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          }}
        />

        {/* Canvas with octagonal clipping */}
        <div
          className="relative overflow-hidden"
          style={{
            clipPath:
              "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            width: "400px",
            height: "400px",
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: "block" }}
          />
        </div>

        {/* Decorative corner elements */}
        <motion.div
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-pink-400 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <motion.div
          className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-3 h-3 bg-purple-300 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        <motion.div
          className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-3 h-3 bg-pink-300 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />

        {/* Floating geometric elements */}
        <motion.div
          className="absolute top-8 left-8 w-2 h-2 bg-purple-400/60 transform rotate-45"
          animate={{
            rotate: [45, 225, 45],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-8 right-8 w-2 h-2 bg-pink-400/60 rounded-full"
          animate={{
            y: [-5, 5, -5],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Interactive hint */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-zinc-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          Move your cursor to interact
        </motion.div>
      </div>

      {/* Ambient floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${20 + i * 8}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
