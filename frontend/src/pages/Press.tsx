import { useGetPressKit } from "@/api-client";
import { useLanguage } from "@/lib/i18n";

export default function Press() {
  const { t } = useLanguage();
  const { data, isLoading } = useGetPressKit();

  if (isLoading || !data) {
    return <div className="min-h-screen flex items-center justify-center font-mono">A CARREGAR PRESS KIT...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-10 px-4 border-b-8 border-border text-center">
        <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight text-primary">[ PRESS KIT ]</h1>
        <p className="font-mono mt-4 text-sm md:text-base">MATERIAL PARA CONTRATANTES E PRODUÇÃO</p>
      </div>

      <div className="container mx-auto max-w-5xl p-4 md:p-8 space-y-8">
        <section className="border-4 border-border bg-card p-6">
          <h2 className="font-display text-3xl uppercase mb-4">Bio Curta</h2>
          <p className="font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap">{t(data.bioShort)}</p>
        </section>

        <section className="border-4 border-border bg-card p-6">
          <h2 className="font-display text-3xl uppercase mb-4">Technical Rider</h2>
          <pre className="font-mono text-xs md:text-sm whitespace-pre-wrap">{t(data.technicalRider)}</pre>
        </section>

        <section className="border-4 border-border bg-card p-6">
          <h2 className="font-display text-3xl uppercase mb-4">Fotos em Alta Resolução</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.photoUrls.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="border-2 border-border p-2 block">
                <img src={url} alt="Press kit Blindkiss" className="w-full h-60 object-cover" />
              </a>
            ))}
            {data.photoUrls.length === 0 && <p className="font-mono text-sm text-foreground/60">Sem fotos configuradas.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
