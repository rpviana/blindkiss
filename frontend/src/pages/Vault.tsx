import { useMemo, useState } from "react";
import { useVaultAccess } from "@/api-client";
import { toast } from "sonner";

export default function Vault() {
  const [serial, setSerial] = useState("");
  const access = useVaultAccess();

  const grouped = useMemo(() => {
    const assets = access.data?.assets ?? [];
    return {
      setlists: assets.filter((item) => item.assetType === "setlist_pdf"),
      backstage: assets.filter((item) => item.assetType === "backstage_photo"),
      wallpapers: assets.filter((item) => item.assetType === "wallpaper"),
    };
  }, [access.data?.assets]);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-10 px-4 border-b-8 border-border text-center">
        <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight text-primary">[ VAULT ]</h1>
        <p className="font-mono mt-4 text-sm md:text-base">EXCLUSIVO PARA MEMBROS BK-ID</p>
      </div>

      <div className="container mx-auto max-w-5xl p-4 md:p-8 space-y-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            access.mutate(serial, {
              onError: () => toast.error("BK-ID inválido ou sem acesso."),
            });
          }}
          className="border-4 border-border bg-card p-6 space-y-4"
        >
          <label className="block font-mono text-sm uppercase">Inserir número BK-ID</label>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              required
              value={serial}
              onChange={(e) => setSerial(e.target.value.toUpperCase())}
              placeholder="BK-2026-001"
              className="flex-1 border-2 border-border bg-background p-3 font-mono uppercase"
            />
            <button
              type="submit"
              disabled={access.isPending}
              className="px-6 py-3 bg-primary text-primary-foreground font-display uppercase tracking-widest hover:bg-foreground disabled:opacity-50"
            >
              {access.isPending ? "A VALIDAR..." : "ABRIR VAULT"}
            </button>
          </div>
          {access.data?.member && (
            <p className="font-mono text-xs text-foreground/70">
              Acesso autorizado para {access.data.member.name} ({access.data.member.serial})
            </p>
          )}
        </form>

        {access.data?.ok && (
          <div className="space-y-8">
            <section className="border-4 border-border bg-card p-6">
              <h2 className="font-display text-3xl uppercase mb-4">Setlists em PDF</h2>
              <div className="space-y-3">
                {grouped.setlists.map((item) => (
                  <a
                    key={item.id}
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block border-2 border-border p-3 font-mono hover:bg-muted"
                  >
                    {item.title}
                  </a>
                ))}
                {grouped.setlists.length === 0 && <p className="font-mono text-sm text-foreground/60">Sem setlists.</p>}
              </div>
            </section>

            <section className="border-4 border-border bg-card p-6">
              <h2 className="font-display text-3xl uppercase mb-4">Fotos de Bastidores</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {grouped.backstage.map((item) => (
                  <a key={item.id} href={item.fileUrl} target="_blank" rel="noreferrer" className="block border-2 border-border p-2">
                    <img src={item.previewUrl || item.fileUrl} alt={item.title} className="w-full h-48 object-cover" />
                    <p className="font-mono text-xs mt-2">{item.title}</p>
                  </a>
                ))}
                {grouped.backstage.length === 0 && <p className="font-mono text-sm text-foreground/60">Sem fotos.</p>}
              </div>
            </section>

            <section className="border-4 border-border bg-card p-6">
              <h2 className="font-display text-3xl uppercase mb-4">Wallpapers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {grouped.wallpapers.map((item) => (
                  <a key={item.id} href={item.fileUrl} target="_blank" rel="noreferrer" className="block border-2 border-border p-2">
                    <img src={item.previewUrl || item.fileUrl} alt={item.title} className="w-full h-48 object-cover" />
                    <p className="font-mono text-xs mt-2">{item.title}</p>
                  </a>
                ))}
                {grouped.wallpapers.length === 0 && <p className="font-mono text-sm text-foreground/60">Sem wallpapers.</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
