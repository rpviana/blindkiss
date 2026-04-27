import { useState, useEffect, useRef } from "react";
import logoUrl from "@assets/image_1777245733624.png";

export function EyeLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Max movement radius for the pupil
      const maxRadius = 15; 

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY) * 0.05, maxRadius);

      setPupilPos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative inline-block overflow-hidden w-40 h-40 md:w-[200px] md:h-[200px] animate-soft-pulse md:animate-none"
    >
      <img 
        src={logoUrl} 
        alt="Blindkiss Logo" 
        className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
      />
      
      {/* The moving pupil - hidden on mobile */}
      <div 
        className="hidden md:block absolute rounded-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.8)] w-5 h-5 md:w-6 md:h-6"
        style={{
          top: "43%", // Approximate position of the eye center in the image
          left: "50%",
          transform: `translate3d(calc(-50% + ${pupilPos.x}px), calc(-50% + ${pupilPos.y}px), 0)`,
          transition: "transform 0.1s ease-out",
          willChange: "transform",
        }}
      />
    </div>
  );
}
