import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useGetSiteSettings } from "@/api-client";
import { useLanguage } from "@/lib/i18n";
import logoUrl from "@assets/logo.png";
import logoTextUrl from "@assets/logo-text.png";

export function SiteHeader() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { data: settings } = useGetSiteSettings();
  const headerLogoSrc = settings?.logoUrl || logoUrl;

  const { language, setLanguage } = useLanguage();

  const mainLinks = [
    { href: "/", label: language === "pt" ? "INÍCIO" : "HOME" },
    { href: "/archive", label: language === "pt" ? "ARQUIVO" : "ARCHIVE" },
    { href: "/bk-id", label: "BK-ID" },
    { href: "/team", label: language === "pt" ? "EQUIPA" : "TEAM" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <img src={headerLogoSrc} alt="Blindkiss Logo" className="h-8 w-auto object-contain" />
          <img src={logoTextUrl} alt="Blindkiss" className="h-6 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 ml-auto">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-mono transition-colors hover:text-primary ${
                location === link.href ? "text-primary border-b-2 border-primary" : "text-foreground"
              }`}
            >
              [{link.label}]
            </Link>
          ))}
          <button
            onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
            className="flex items-center gap-1 text-sm font-mono text-foreground hover:text-primary transition-colors ml-4 uppercase"
            title="Mudar Idioma / Change Language"
          >
            <Globe size={16} />
            {language}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground hover:text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-b-2 border-border bg-background">
          <nav className="flex flex-col items-center py-4 gap-4">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-mono transition-colors hover:text-primary ${
                  location === link.href ? "text-primary border-b-2 border-primary" : "text-foreground"
                }`}
              >
                [{link.label}]
              </Link>
            ))}
            <button
              onClick={() => {
                setLanguage(language === "pt" ? "en" : "pt");
                setIsOpen(false);
              }}
              className="flex items-center gap-2 text-lg font-mono text-foreground hover:text-primary transition-colors uppercase mt-4"
            >
              <Globe size={20} />
              {language === "pt" ? "ENGLISH" : "PORTUGUÊS"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
