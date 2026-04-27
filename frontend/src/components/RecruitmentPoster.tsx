import { useGetSiteSettings } from "@/api-client";

export function RecruitmentPoster() {
  const { data: settings } = useGetSiteSettings();

  if (!settings) return null;

  return (
    <div className="max-w-2xl mx-auto bg-[#eaddce] border-[12px] border-[#222] p-8 md:p-12 relative shadow-2xl overflow-hidden before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] before:opacity-50 before:pointer-events-none">
      
      {/* Grunge Texture Overlay (Simplified) */}
      <div className="absolute inset-0 opacity-[0.05] bg-black/10 mix-blend-multiply pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Title */}
        <h2 className="font-display text-7xl md:text-8xl tracking-tighter text-[#111] leading-none mb-2">
          {settings.recruitmentTitle || "WANTED"}
        </h2>
        
        <div className="w-full h-2 bg-[#111] mb-6"></div>
        
        <h3 className="font-display text-3xl md:text-4xl text-[#910802] mb-10 tracking-widest uppercase">
          {settings.recruitmentSubtitle || "JOIN THE RIOT"}
        </h3>

        {/* Roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
          <div className="border-4 border-[#111] p-6 bg-white/50 backdrop-blur-sm relative rotate-[-2deg]">
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#910802] rounded-full border-2 border-[#111]"></div>
            <h4 className="font-display text-2xl text-[#111] mb-2 uppercase">BAIXISTA</h4>
            <p className="font-mono text-sm text-[#333] font-bold">
              {settings.recruitmentBassist || "GRAVE / DISTORÇÃO / ATITUDE"}
            </p>
          </div>

          <div className="border-4 border-[#111] p-6 bg-white/50 backdrop-blur-sm relative rotate-[1deg]">
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#910802] rounded-full border-2 border-[#111]"></div>
            <h4 className="font-display text-2xl text-[#111] mb-2 uppercase">BATERISTA</h4>
            <p className="font-mono text-sm text-[#333] font-bold">
              {settings.recruitmentDrummer || "PANCADA / RITMO / CAOS"}
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="border-t-4 border-b-4 border-dashed border-[#111] py-6 w-full relative">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#eaddce] px-4 font-mono font-bold text-sm">
            [ CONTACTO ]
          </span>
          <p className="font-mono text-xl md:text-2xl font-bold text-[#910802]">
            {settings.recruitmentContact || "DM @BLINDKISSBAND"}
          </p>
        </div>

        {/* Stamp */}
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 opacity-80 rotate-[-15deg] pointer-events-none">
          <div className="border-4 border-[#910802] text-[#910802] px-4 py-2 font-display text-2xl tracking-widest mix-blend-multiply">
            URGENTE
          </div>
        </div>
      </div>
    </div>
  );
}
