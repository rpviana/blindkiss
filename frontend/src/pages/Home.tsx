import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGetSiteSettings, useListContentBlocks } from "@/api-client";
import { useLanguage } from "@/lib/i18n";
import { EyeLogo } from "@/components/EyeLogo";
import { MarqueeStrip } from "@/components/MarqueeStrip";
import { RecruitmentPoster } from "@/components/RecruitmentPoster";
import { CassettePlayer } from "@/components/CassettePlayer";

export default function Home() {
  const { data: settings } = useGetSiteSettings();
  const { data: blocks } = useListContentBlocks();
  const { t } = useLanguage();

  const bioBlock = Array.isArray(blocks) ? blocks.find((b) => b.key === "bio") : undefined;
  const manifestoBlock = Array.isArray(blocks) ? blocks.find((b) => b.key === "manifesto") : undefined;

  const { scrollYProgress } = useScroll();
  const logoScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const logoY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 overflow-hidden border-b-8 border-border">
        <motion.div 
          style={{ scale: logoScale, y: logoY }}
          className="z-10 mb-12"
        >
          <EyeLogo src={settings?.homeLogoUrl} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="z-10 text-center max-w-4xl"
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter uppercase mb-6 drop-shadow-md">
            {t(settings?.heroTagline) || "BLINDKISS // PORTO"}
          </h1>
        </motion.div>

        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,var(--ring)_0%,transparent_50%)]" />
      </section>

      <MarqueeStrip />

      {/* Bio Section */}
      {bioBlock && (
        <section className="py-24 px-4 md:px-8 border-b-4 border-dashed border-border bg-background will-change-transform">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="border-l-8 border-primary pl-8"
            >
              <h2 className="font-display text-4xl md:text-6xl mb-8">
                {t(bioBlock.title)}
              </h2>
              <div className="font-mono text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-foreground/90">
                {t(bioBlock.body)}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Recruitment Section */}
      <section className="py-24 px-4 border-b-4 border-dashed border-border bg-muted/30 will-change-transform">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <RecruitmentPoster />
        </motion.div>
      </section>

      {/* Manifesto Section */}
      {manifestoBlock && (
        <section className="py-24 px-4 md:px-8 border-b-8 border-border bg-background relative overflow-hidden will-change-transform">
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <h2 className="font-display text-5xl md:text-7xl mb-8 text-primary uppercase">
                {t(manifestoBlock.title) || "[ MANIFESTO ]"}
              </h2>
              <div className="font-mono text-xl md:text-2xl font-bold leading-relaxed whitespace-pre-wrap border-y-4 border-border py-12">
                {t(manifestoBlock.body)}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Audio Section */}
      <section className="py-24 px-4 bg-muted/30 will-change-transform">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <CassettePlayer />
        </motion.div>
      </section>

    </div>
  );
}
