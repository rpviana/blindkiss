import { useGetSiteSettings } from "@/api-client";

export function SiteFooter() {
  const { data: settings } = useGetSiteSettings();

  return (
    <footer className="border-t-2 border-dashed border-border py-8 mt-16 bg-background">
      <div className="container px-4 md:px-6 flex flex-col items-center justify-center gap-4 text-center">
        <div className="font-mono text-sm text-foreground/80 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
          <span>[{settings?.footerCity || "PORTO"}]</span>
          <span className="hidden sm:inline text-primary">//</span>
          <span>{settings?.footerCoords || "41.1579° N, 8.6291° W"}</span>
        </div>
        
        <div className="font-display text-2xl tracking-widest text-primary mt-4">
          // BLINDKISS MMXXVI //
        </div>
        
        <div className="text-xs font-mono text-foreground/50 uppercase mt-8">
          RUÍDO COM BEIJOS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
