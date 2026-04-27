import { useState } from "react";
import { useGetSiteSettings, useSubmitRecruitmentApplication } from "@/api-client";
import { toast } from "sonner";

export function RecruitmentPoster() {
  const { data: settings } = useGetSiteSettings();
  const submitAudition = useSubmitRecruitmentApplication();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    instrument: "",
    mediaUrl: "",
    message: "",
  });

  const normalizeMediaUrl = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return trimmed;
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  if (!settings || !settings.showRecruitment) return null;

  return (
    <>
      <div className="max-w-2xl mx-auto bg-[#eaddce] border-[12px] border-[#222] p-8 md:p-12 pb-24 md:pb-12 relative shadow-2xl overflow-hidden before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] before:opacity-50 before:pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05] bg-black/10 mix-blend-multiply pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="font-display text-7xl md:text-8xl tracking-tighter text-[#111] leading-none mb-2">
            {settings.recruitmentTitle || "PROCURA-SE"}
          </h2>

          <div className="w-full h-2 bg-[#111] mb-6"></div>

          <h3 className="font-display text-3xl md:text-4xl text-[#910802] mb-10 tracking-widest uppercase">
            {settings.recruitmentSubtitle || "JUNTA-TE AO DISTÚRBIO"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
            {settings.showRecruitmentBassist && (
              <div className="border-4 border-[#111] p-6 bg-white/50 backdrop-blur-sm relative rotate-[-2deg]">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#910802] rounded-full border-2 border-[#111]"></div>
                <h4 className="font-display text-2xl text-[#111] mb-2 uppercase">BAIXISTA</h4>
                <p className="font-mono text-sm text-[#333] font-bold">
                  {settings.recruitmentBassist || "GRAVE / DISTORÇÃO / ATITUDE"}
                </p>
              </div>
            )}

            {settings.showRecruitmentDrummer && (
              <div className="border-4 border-[#111] p-6 bg-white/50 backdrop-blur-sm relative rotate-[1deg]">
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#910802] rounded-full border-2 border-[#111]"></div>
                <h4 className="font-display text-2xl text-[#111] mb-2 uppercase">BATERISTA</h4>
                <p className="font-mono text-sm text-[#333] font-bold">
                  {settings.recruitmentDrummer || "PANCADA / RITMO / CAOS"}
                </p>
              </div>
            )}
          </div>

          <div className="border-t-4 border-b-4 border-dashed border-[#111] py-6 w-full relative">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#eaddce] px-4 font-mono font-bold text-sm">
              [ CONTACTO ]
            </span>
            <p className="font-mono text-xl md:text-2xl font-bold text-[#910802]">
              {settings.recruitmentContact || "DM @BLINDKISSBAND"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-8 px-8 py-4 bg-[#111] text-[#eaddce] font-display text-xl tracking-widest uppercase border-4 border-[#111] hover:bg-[#910802] hover:border-[#910802] transition-colors"
          >
            Submeter Audição
          </button>

          {settings.showRecruitmentUrgent && (
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 opacity-80 rotate-[-15deg] pointer-events-none">
              <div className="border-4 border-[#910802] text-[#910802] px-4 py-2 font-display text-2xl tracking-widest mix-blend-multiply">
                {settings.recruitmentUrgentText || "URGENTE"}
              </div>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/70 p-4 flex items-center justify-center">
          <div className="w-full max-w-xl border-4 border-border bg-card p-6 md:p-8 relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 font-mono text-xs border-2 border-border px-2 py-1 hover:bg-muted"
            >
              FECHAR
            </button>
            <h3 className="font-display text-3xl uppercase mb-6 text-primary">Submeter Audição</h3>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                submitAudition.mutate(
                  {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    instrument: form.instrument || null,
                    mediaUrl: normalizeMediaUrl(form.mediaUrl),
                    message: form.message || null,
                  },
                  {
                    onSuccess: () => {
                      toast.success("Audição submetida com sucesso.");
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        instrument: "",
                        mediaUrl: "",
                        message: "",
                      });
                      setIsOpen(false);
                    },
                    onError: () => toast.error("Não foi possível submeter a audição."),
                  },
                );
              }}
            >
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome"
                className="w-full border-2 border-border bg-background p-3 font-mono"
              />
              <input
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full border-2 border-border bg-background p-3 font-mono"
              />
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Telefone"
                className="w-full border-2 border-border bg-background p-3 font-mono"
              />
              <input
                value={form.instrument}
                onChange={(e) => setForm({ ...form, instrument: e.target.value })}
                placeholder="Instrumento (ex: Baixo/Bateria)"
                className="w-full border-2 border-border bg-background p-3 font-mono"
              />
              <input
                required
                type="url"
                value={form.mediaUrl}
                onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                placeholder="Link YouTube/Drive da audição"
                className="w-full border-2 border-border bg-background p-3 font-mono"
              />
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Mensagem curta (opcional)"
                className="w-full border-2 border-border bg-background p-3 font-mono h-24"
              />
              <button
                type="submit"
                disabled={submitAudition.isPending}
                className="w-full py-3 bg-primary text-primary-foreground font-display uppercase tracking-widest hover:bg-foreground disabled:opacity-50"
              >
                {submitAudition.isPending ? "A ENVIAR..." : "ENVIAR AUDIÇÃO"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
