import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import type { Event } from "@/api-client";
import defaultPoster from "@assets/image_1777245740977.png";
import { ExternalLink, MapPin, Ticket } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { t, language } = useLanguage();
  const isPast = event.isPast || event.forcePast;
  const date = parseISO(event.eventDate);

  return (
    <div 
      className={`group relative flex flex-col border-4 border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(145,8,2,0.5)] ${
        isPast ? "opacity-75 grayscale-[0.8] hover:grayscale-0" : ""
      }`}
    >
      {/* Date Banner */}
      <div className="absolute top-4 -left-4 z-20 flex flex-col bg-primary text-primary-foreground border-2 border-border py-2 px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
        <span className="font-display text-3xl leading-none">
          {format(date, "dd")}
        </span>
        <span className="font-mono text-xs font-bold uppercase">
          {format(date, "MMM yyyy", { locale: pt })}
        </span>
      </div>

      {/* Poster Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden border-b-4 border-border bg-muted">
        <img
          src={event.posterUrl || defaultPoster}
          alt={t(event.title)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{
            filter: "contrast(1.2) sepia(0.2) saturate(1.5) hue-rotate(-10deg) grain(0.5)",
          }}
        />
        {/* Halftone overlay */}
        <div className="absolute inset-0 mix-blend-overlay opacity-40 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[size:4px_4px]" />
        
        {isPast && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
             <div className="border-4 border-foreground text-foreground px-6 py-2 font-display text-4xl rotate-12 tracking-widest opacity-80 mix-blend-difference">
               {language === 'en' ? 'PAST' : 'PASSADO'}
             </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-display text-2xl uppercase mb-2 line-clamp-2">
          {t(event.title)}
        </h3>
        
        <div className="font-mono text-sm space-y-2 mb-6 flex-1 text-foreground/80">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <span className="font-bold text-foreground">{t(event.venue)}</span>
              <br />
              {t(event.city)} — {event.address}
            </span>
          </div>
          
          {event.price && (
            <div className="flex items-center gap-2 font-bold text-primary mt-4">
              <span>[ {language === 'en' ? 'ENTRY' : 'ENTRADA'}: {event.price} ]</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t-2 border-dashed border-border">
          {event.ticketUrl && !isPast && (
            <a 
              href={event.ticketUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground font-display tracking-widest uppercase hover:bg-foreground transition-colors"
            >
              <Ticket className="w-5 h-5" />
              {language === 'en' ? 'BUY TICKET' : 'COMPRAR BILHETE'}
            </a>
          )}
          
          {event.mapsUrl && (
            <a 
              href={event.mapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 border-2 border-border font-mono text-xs font-bold hover:bg-muted transition-colors uppercase"
            >
              <ExternalLink className="w-4 h-4" />
              {language === 'en' ? 'VIEW ON MAP' : 'VER NO MAPA'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
