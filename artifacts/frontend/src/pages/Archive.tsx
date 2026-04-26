import { useState } from "react";
import { useListEvents, getListEventsQueryKey } from "@workspace/api-client-react";
import { EventCard } from "@/components/EventCard";
import { MarqueeStrip } from "@/components/MarqueeStrip";
import { motion } from "framer-motion";

export default function Archive() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const { data: events = [], isLoading } = useListEvents(
    { status: tab },
    { query: { queryKey: getListEventsQueryKey({ status: tab }) } }
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="pt-24 pb-12 px-4 md:px-8 text-center border-b-8 border-border">
        <h1 className="font-display text-5xl md:text-7xl tracking-tighter uppercase mb-6 text-primary">
          [ GIG ARCHIVE ]
        </h1>
        <p className="font-mono text-lg md:text-xl font-bold max-w-2xl mx-auto">
          RUÍDO AO VIVO. TESTEMUNHO DO CAOS.
        </p>
      </div>

      <MarqueeStrip />

      <div className="container mx-auto px-4 md:px-8 py-12 flex-1">
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <button
            onClick={() => setTab("upcoming")}
            className={`font-display text-2xl tracking-widest uppercase py-3 px-8 border-4 border-border transition-all ${
              tab === "upcoming"
                ? "bg-primary text-primary-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px] translate-x-[-2px]"
                : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            UPCOMING RIOTS
          </button>
          <button
            onClick={() => setTab("past")}
            className={`font-display text-2xl tracking-widest uppercase py-3 px-8 border-4 border-border transition-all ${
              tab === "past"
                ? "bg-foreground text-background shadow-[6px_6px_0px_0px_rgba(145,8,2,1)] translate-y-[-2px] translate-x-[-2px]"
                : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            PAST ECHOES
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="font-mono text-xl text-center py-20 animate-pulse">
            LOADING DATA...
          </div>
        ) : events.length === 0 ? (
          <div className="border-4 border-dashed border-border py-32 text-center bg-muted/20">
            <p className="font-mono text-2xl font-bold uppercase">
              {tab === "upcoming" ? "// NO UPCOMING RIOTS SCHEDULED //" : "// NO PAST ECHOES RECORDED //"}
            </p>
            <p className="font-mono text-sm mt-4 text-foreground/60">
              {tab === "upcoming" ? "STAY TUNED FOR CAOS." : "HISTORY IS EMPTY."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
