import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoUrl from "@assets/image_1777245733624.png";

export function SiteHeader() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "INÍCIO" },
    { href: "/archive", label: "ARQUIVO" },
    { href: "/bk-id", label: "BK-ID" },
    { href: "/admin", label: "ADMIN" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <img src={logoUrl} alt="Blindkiss Logo" className="h-8 w-auto object-contain" />
          <span className="font-display text-xl tracking-widest text-primary hidden sm:inline-block">
            BLINDKISS
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
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
            {links.map((link) => (
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
          </nav>
        </div>
      )}
    </header>
  );
}
