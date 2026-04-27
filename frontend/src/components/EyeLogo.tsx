import logoUrl from "@assets/logo.png";

export function EyeLogo({ src }: { src?: string | null }) {
  const resolvedSrc = src || logoUrl;

  return (
    <div 
      className="relative inline-block"
      style={{
        width: "160px",
        height: "160px",
        perspective: "1000px"
      }}
    >
      {/* Glow effect background */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(145, 8, 2, 0.15) 0%, transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none"
        }}
      />
      
      <img 
        src={resolvedSrc} 
        alt="Blindkiss Logo" 
        className="relative w-full h-full object-contain pointer-events-none"
        style={{
          filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))"
        }}
      />
    </div>
  );
}
