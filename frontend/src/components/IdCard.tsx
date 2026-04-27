import React, { forwardRef } from "react";
import logoUrl from "@assets/image_1777245733624.png";
import defaultPhoto from "@assets/image_1777245746860.png";

export interface IdCardProps {
  name: string;
  serial: string;
  photoUrl?: string | null;
}

export const IdCard = forwardRef<HTMLDivElement, IdCardProps>(
  ({ name, serial, photoUrl }, ref) => {
    return (
      <div 
        ref={ref}
        className="w-[450px] h-[280px] bg-[#eaddce] relative overflow-hidden border-[8px] border-[#111] shadow-xl flex select-none"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E')"
        }}
      >
        {/* Left Side: Photo */}
        <div className="w-[180px] h-full border-r-[8px] border-[#111] bg-[#111] relative p-3">
          <div className="w-full h-full relative border-4 border-white/20 overflow-hidden bg-zinc-800">
            <img 
              src={photoUrl || defaultPhoto} 
              alt={name}
              className="w-full h-full object-cover grayscale contrast-125 brightness-90"
              style={{ filter: "grayscale(100%) contrast(150%) brightness(80%) sepia(20%)" }}
            />
            {/* Photo overlay texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4px_4px] mix-blend-overlay"></div>
            
            {/* Corner brackets on photo */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/50"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/50"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/50"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/50"></div>
          </div>
          
          {/* Vertical Text */}
          <div className="absolute bottom-4 -right-10 origin-bottom-left -rotate-90 font-display text-white/30 text-4xl tracking-widest whitespace-nowrap pointer-events-none mix-blend-overlay">
            AUTHORIZED
          </div>
        </div>

        {/* Right Side: Info */}
        <div className="flex-1 p-5 flex flex-col relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start border-b-4 border-[#111] pb-3 mb-4">
            <div>
              <h2 className="font-display text-3xl leading-none text-[#111] tracking-wider uppercase">BLINDKISS</h2>
              <div className="font-mono text-[10px] font-bold text-[#910802] uppercase tracking-widest mt-1">
                Official Supporter ID
              </div>
            </div>
            <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain mix-blend-multiply" />
          </div>

          {/* Details */}
          <div className="space-y-4 flex-1">
            <div>
              <div className="font-mono text-[9px] text-[#555] uppercase font-bold mb-0.5">MEMBER NAME</div>
              <div className="font-mono font-bold text-lg text-[#111] uppercase leading-tight truncate">
                {name || "UNKNOWN SUBJECT"}
              </div>
            </div>

            <div>
              <div className="font-mono text-[9px] text-[#555] uppercase font-bold mb-0.5">SERIAL NUMBER</div>
              <div className="font-display text-2xl text-[#910802] tracking-widest">
                {serial || "BK-00000"}
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="mt-auto border-t-2 border-dashed border-[#111] pt-2 flex justify-between items-end">
             <div className="font-mono text-[8px] text-[#111] uppercase font-bold">
               VALID NATIONWIDE<br/>
               DO NOT DUPLICATE
             </div>
             {/* Barcode mock */}
             <div className="h-8 w-32 flex gap-[2px] opacity-80 mix-blend-multiply items-end">
               {[...Array(20)].map((_, i) => (
                 <div key={i} className="bg-[#111]" style={{ 
                   width: Math.random() > 0.5 ? '2px' : '4px',
                   height: `${Math.random() * 40 + 60}%` 
                 }}></div>
               ))}
             </div>
          </div>
        </div>

        {/* Red Stamp Overlay */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 rotate-12 pointer-events-none opacity-40 mix-blend-multiply">
           <div className="border-4 border-[#910802] text-[#910802] p-2 font-display text-2xl tracking-widest">
             VERIFIED
           </div>
        </div>
      </div>
    );
  }
);

IdCard.displayName = "IdCard";
