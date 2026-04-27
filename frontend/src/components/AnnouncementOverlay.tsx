import { useState, useEffect } from "react";
import { useListAnnouncements, Announcement } from "@/api-client";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { AlertTriangle, Info, X, Zap } from "lucide-react";

interface SpawnedBit {
  id: string;
  announcementId: number;
  x: number;
  y: number;
  rotation: number;
}

export function AnnouncementOverlay() {
  const { data: announcements = [] } = useListAnnouncements();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);
  const [bits, setBits] = useState<SpawnedBit[]>([]);

  // Filter valid announcements
  const activeAnnouncements = announcements.filter(a => !dismissedIds.includes(a.id));

  // Spawn bits logic
  useEffect(() => {
    if (activeAnnouncements.length === 0) {
      setBits([]);
      return;
    }

    // Faster spawning for a more "invasive" feel
    const interval = setInterval(() => {
      setBits(prev => {
        if (prev.length > 50) return prev; // More bits allowed for density

        const randomAnnouncement = activeAnnouncements[Math.floor(Math.random() * activeAnnouncements.length)];
        const newBit: SpawnedBit = {
          id: Math.random().toString(36).substr(2, 9),
          announcementId: randomAnnouncement.id,
          x: Math.random() * 92 + 4, 
          y: Math.random() * 92 + 4,
          rotation: (Math.random() - 0.5) * 20, // Subtle rotation
        };
        return [...prev, newBit];
      });
    }, 2000); 

    return () => clearInterval(interval);
  }, [activeAnnouncements.length]);

  const handleExpand = (id: number) => {
    setExpandedId(id);
  };

  const handleDismiss = (id: number) => {
    setDismissedIds([...dismissedIds, id]);
    setExpandedId(null);
    setBits(prev => prev.filter(b => b.announcementId !== id));
  };

  const expandedAnnouncement = announcements.find(a => a.id === expandedId);

  return (
    <LayoutGroup>
      <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
        {/* Subtle Glitch Bits (Custom Images) */}
        <AnimatePresence>
          {bits.map((bit) => {
            const announcement = announcements.find(a => a.id === bit.announcementId);
            if (!announcement) return null;

            return (
              <motion.button
                key={bit.id}
                layoutId={`announcement-${bit.announcementId}-${bit.id}`} // Unique layoutId per bit for individual animation
                initial={{ scale: 0, opacity: 0, rotate: bit.rotation }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => handleExpand(bit.announcementId)}
                className="pointer-events-auto absolute w-10 h-10 md:w-16 md:h-16 border-4 border-border bg-card shadow-lg overflow-hidden group active:scale-90 transition-transform"
                style={{ left: `${bit.x}%`, top: `${bit.y}%` }}
              >
                {announcement.imageUrl ? (
                  <img 
                    src={announcement.imageUrl} 
                    alt="" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <Zap size={20} className="text-primary" />
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Expanded View */}
        <AnimatePresence>
          {expandedAnnouncement && (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] pointer-events-auto">
              <motion.div
                layoutId={`announcement-modal-${expandedAnnouncement.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-lg w-full border-8 border-border bg-card text-foreground p-8 shadow-[24px_24px_0px_0px_rgba(0,0,0,0.2)] flex flex-col items-center text-center"
              >
                <button 
                  onClick={() => setExpandedId(null)}
                  className="absolute top-4 right-4 hover:rotate-90 transition-transform text-foreground/40 hover:text-primary"
                >
                  <X size={32} />
                </button>

                <div className="mb-8 w-24 h-24 border-4 border-primary bg-background overflow-hidden shadow-inner">
                  {expandedAnnouncement.imageUrl ? (
                    <img src={expandedAnnouncement.imageUrl} alt="" className="w-full h-full object-cover grayscale" />
                  ) : (
                    <Zap size={64} className="m-auto mt-2 text-primary" />
                  )}
                </div>

                <h2 className="font-display text-4xl mb-6 uppercase tracking-tighter text-primary">
                  {expandedAnnouncement.title}
                </h2>
                
                <p className="font-mono text-lg font-bold leading-tight whitespace-pre-wrap mb-10 border-l-4 border-primary pl-4 py-2 bg-muted/30">
                  {expandedAnnouncement.content}
                </p>

                <button
                  onClick={() => handleDismiss(expandedAnnouncement.id)}
                  className="py-4 px-12 font-display text-2xl uppercase tracking-widest border-4 border-primary bg-primary text-primary-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all active:scale-95"
                >
                  ACKNOWLEDGE
                </button>
                
                {/* Decorative bits */}
                <div className="absolute -top-4 -left-4 w-12 h-12 border-t-8 border-l-8 border-primary/40" />
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-8 border-r-8 border-primary/40" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
