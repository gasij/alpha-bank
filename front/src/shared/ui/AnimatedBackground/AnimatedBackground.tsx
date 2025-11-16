import { useEffect, useRef } from "react";

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Detect mobile device
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Create particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
    }> = [];

    // Reduce particle count on mobile for better performance
    const particleCount = isMobile ? 30 : isTablet ? 50 : 60;
    const connectionDistance = isMobile ? 100 : 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        hue: 355 + Math.random() * 10, // Красный оттенок
      });
    }

    let animationId: number;
    let startTime = Date.now();
    const cycleDuration = 120000;
    const drawingPhase = 60000;
    const erasingPhase = 60000;

    const animate = () => {
      if (!ctx) return;
      
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) % cycleDuration;
      
      const isDrawingPhase = elapsed < drawingPhase;
      const phaseProgress = isDrawingPhase 
        ? elapsed / drawingPhase
        : (elapsed - drawingPhase) / erasingPhase;
      
      if (isDrawingPhase) {
        const fadeIntensity = 0.01 + (phaseProgress * 0.015);
        ctx.fillStyle = `rgba(255, 255, 255, ${fadeIntensity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        const eraseIntensity = 0.2 - (phaseProgress * 0.12);
        ctx.fillStyle = `rgba(255, 255, 255, ${eraseIntensity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Connect nearby particles
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            ctx.globalCompositeOperation = "multiply";
            const gradient = ctx.createLinearGradient(
              particle.x,
              particle.y,
              otherParticle.x,
              otherParticle.y
            );
            gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 50%, ${opacity * 0.03})`);
            gradient.addColorStop(0.5, `hsla(${Math.floor((particle.hue + otherParticle.hue) / 2)}, 70%, 48%, ${opacity * 0.04})`);
            gradient.addColorStop(1, `hsla(${otherParticle.hue}, 70%, 50%, ${opacity * 0.03})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.forEach((particle) => {
        if (particle.x > canvas.width) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = canvas.height;
      });
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        style={{ filter: "blur(0.5px)", opacity: 0.4 }}
      />
      
      {/* Subtle gradient orbs - Hidden on mobile for performance */}
      <div className="hidden md:block fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-primary/2 rounded-full blur-3xl animate-float" style={{ animationDuration: "15s" }}>
          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-transparent rounded-full animate-rotate" style={{ animationDuration: "20s" }}></div>
        </div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDuration: "12s", animationDelay: "2s" }}>
          <div className="w-full h-full bg-gradient-to-bl from-primary/4 to-transparent rounded-full animate-rotate" style={{ animationDuration: "25s", animationDirection: "reverse" }}></div>
        </div>
      </div>

      {/* Subtle grid pattern - Hidden on mobile */}
      <div className="hidden md:block fixed inset-0 pointer-events-none z-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(227, 6, 19, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(227, 6, 19, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px"
          }}
        />
      </div>
    </>
  );
};

