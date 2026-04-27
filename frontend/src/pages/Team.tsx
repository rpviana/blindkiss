import { useMemo, useState } from "react";
import { useListTeamMembers } from "@/api-client";

export default function Team() {
  const { data: members = [], isLoading } = useListTeamMembers();
  const [activeId, setActiveId] = useState<number | null>(null);

  const selected = useMemo(
    () => members.find((member) => member.id === activeId) ?? members[0] ?? null,
    [activeId, members],
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-mono">A CARREGAR EQUIPA...</div>;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="relative border-b-8 border-border px-4 py-16 md:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(145,8,2,0.18), transparent 25%), radial-gradient(circle at 80% 30%, rgba(145,8,2,0.12), transparent 22%), linear-gradient(180deg, rgba(0,0,0,0.03), transparent)" }} />
        <p className="relative font-mono text-xs md:text-sm uppercase tracking-[0.4em] text-primary mb-4">operativos / blindkiss</p>
        <h1 className="relative font-display text-5xl md:text-8xl uppercase tracking-tight text-foreground">[ A EQUIPA ]</h1>
        <p className="relative mx-auto mt-6 max-w-2xl font-mono text-sm md:text-base leading-relaxed text-foreground/80">
          Os rostos vivem primeiro em interferência. Passa o rato para focar a imagem e revelar cada operativo em alto contraste.
        </p>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-10 md:py-16 space-y-10">
        {selected && (
          <section className="border-4 border-border bg-card p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(145,8,2,0.08) 50%, transparent 100%)" }} />
            <div className="relative grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-center">
              <div className="relative mx-auto w-full max-w-[320px] aspect-[4/5] border-4 border-border overflow-hidden bg-[#121212]">
                  {selected.photoUrl ? (
                    <img
                      src={selected.photoUrl}
                      alt={selected.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{
                        filter: "contrast(1.1) brightness(0.95)",
                        opacity: 0.95,
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                      <div>
                        <p className="font-display text-4xl uppercase text-white/70">SCAN PENDENTE</p>
                        <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/40 mt-3">adiciona a fotografia no backoffice</p>
                      </div>
                    </div>
                  )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.45))]" />
                <div className="absolute inset-0 opacity-60 mix-blend-screen" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,145,0,0.32) 0%, rgba(255,145,0,0.12) 28%, rgba(145,8,2,0.10) 60%, transparent 78%)" }} />
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 4px)" }} />
                <div className="absolute inset-0 rounded-none border-[10px] border-transparent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]" />
              </div>

              <div className="relative space-y-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">codename // {selected.codename}</p>
                  <h2 className="font-display text-4xl md:text-6xl uppercase mt-2 leading-none">{selected.name}</h2>
                  <p className="mt-3 font-mono text-sm md:text-base uppercase tracking-wide text-foreground/70">
                    {selected.role} / {selected.age} anos
                  </p>
                </div>

                <p className="font-mono text-sm md:text-base leading-relaxed max-w-3xl text-foreground/80">
                  {selected.bio || "Sinal em linha, pronto a entrar em foco."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {members.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onMouseEnter={() => setActiveId(member.id)}
                      onFocus={() => setActiveId(member.id)}
                      onClick={() => setActiveId(member.id)}
                      className={`text-left border-2 px-4 py-3 transition-all duration-300 ${
                        selected.id === member.id
                          ? "border-primary bg-primary/10 shadow-[4px_4px_0px_0px_rgba(145,8,2,0.35)]"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">{member.codename}</p>
                      <p className="font-display text-xl uppercase mt-1">{member.name}</p>
                      <p className="font-mono text-xs mt-1 text-foreground/70">{member.role}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {members.map((member) => {
            const isActive = selected?.id === member.id;
            return (
              <article
                key={member.id}
                className="group relative border-4 border-border bg-card overflow-hidden min-h-[420px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                onMouseEnter={() => setActiveId(member.id)}
                onFocus={() => setActiveId(member.id)}
                onClick={() => setActiveId(member.id)}
                tabIndex={0}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(145,8,2,0.22),transparent_45%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.06))]" />
                <div className="absolute inset-0 opacity-35 mix-blend-multiply pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 6px)" }} />

                <div className="relative h-[260px] overflow-hidden border-b-4 border-border bg-zinc-900">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                      style={{
                        filter: isActive ? "contrast(1.06) brightness(1.02)" : "contrast(1.12) brightness(0.92)",
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-center px-8">
                      <div>
                        <p className="font-display text-4xl uppercase text-white/70">SCAN PENDENTE</p>
                        <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/40 mt-3">adiciona a fotografia no backoffice</p>
                      </div>
                    </div>
                  )}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "opacity-25" : "opacity-70"}`} style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(145,8,2,0.18), rgba(255,255,255,0.02))" }} />
                  <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0 1px, transparent 1px 3px)" }} />
                </div>

                <div className="relative p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">{member.codename}</p>
                      <h3 className="font-display text-2xl uppercase leading-none mt-1">{member.name}</h3>
                    </div>
                    <div className="font-mono text-xs uppercase border-2 border-border px-2 py-1">{member.age}</div>
                  </div>
                  <div className="font-mono text-sm uppercase tracking-wide text-foreground/70">{member.role}</div>
                  <p className="font-mono text-xs leading-relaxed text-foreground/75">
                    {member.bio || "Sem biografia disponível."}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}