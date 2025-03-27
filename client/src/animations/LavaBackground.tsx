import { useEffect, useRef } from "react";

export default function LavaBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const balls = Array.from({ length: 10 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 60 + Math.random() * 60,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
    }));

    function animate() {
        
        if (!ctx) return;
        
        ctx.clearRect(0, 0, width, height);
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#ff9966");
        gradient.addColorStop(1, "#ff5f6d");
        ctx.fillStyle = gradient;

        balls.forEach((b) => {
            b.x += b.dx;
            b.y += b.dy;

            if (b.x + b.r > width || b.x - b.r < 0) b.dx *= -1;
            if (b.y + b.r > height || b.y - b.r < 0) b.dy *= -1;

            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
        }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh",
        filter: "blur(60px) brightness(0.8)",
        opacity: 0.4,
      }}
    />
  );
}
