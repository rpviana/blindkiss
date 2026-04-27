import logoUrl from "@assets/logo.png";

export function EyeLogo({ src }: { src?: string | null }) {
  const resolvedSrc = src || logoUrl;

  return (
    <div 
      className="relative inline-block overflow-hidden w-40 h-40 md:w-[200px] md:h-[200px] animate-soft-pulse md:animate-none"
    >
      <img 
        src={resolvedSrc} 
        alt="Blindkiss Logo" 
        className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
      />
    </div>
  );
}
