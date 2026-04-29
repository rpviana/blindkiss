import { useGetSiteSettings } from "@/api-client";
import { Link } from "wouter";

export function SiteFooter() {
  const { data: settings } = useGetSiteSettings();

  return (
    <footer className="border-t-2 border-dashed border-border py-8 mt-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center gap-4 text-center">
        <div className="font-mono text-sm text-foreground/80 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
          <span>[{settings?.footerCity || "PORTO"}]</span>
          <span className="hidden sm:inline text-primary">//</span>
          <span>{settings?.footerCoords || "41.1579° N, 8.6291° W"}</span>
        </div>
        
        <div className="font-display text-2xl tracking-widest text-primary mt-4">
          // BLINDKISS MMXXVI //
        </div>

        <Link href="/vault" className="font-mono text-xs text-primary/80 hover:text-primary uppercase tracking-wider">
          [ vault_access ]
        </Link>

        <Link
          href="/admin"
          className="font-mono text-xs text-foreground/35 hover:text-foreground/70 uppercase tracking-wider"
        >
          [ admin ]
        </Link>
        
        <div className="text-xs font-mono text-foreground/50 uppercase mt-8">
          RUÍDO COM BEIJOS. TODOS OS DIREITOS RESERVADOS.
        </div>
      </div>
    </footer>
  );
}
