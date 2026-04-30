import { useMemo, useState } from "react";
import { useListTeamMembers, type TeamMember } from "@/api-client";
import type { LocalizedText } from "@/api-client/generated/api.schemas";
import { useLanguage } from "@/lib/i18n";

const teamUi = {
  pt: {
    loading: "A CARREGAR EQUIPA...",
    kicker: "operativos / blindkiss",
    title: "[ A EQUIPA ]",
    intro:
      "Os rostos vivem primeiro em interferência. Passa o rato para focar a imagem e revelar cada operativo em alto contraste.",
    scanPending: "SCAN PENDENTE",
    addPhotoHint: "adiciona a fotografia no backoffice",
    bioFallback: "Sinal em linha, pronto a entrar em foco.",
    bioMissing: "Sem biografia disponível.",
    ageSuffix: "anos",
    bandShort: "banda",
    contributorsShort: "contribuidores",
    sectionVocals: "[ BANDA ]",
    sectionVocalsLine:
      "A linha de frente da Blindkiss em palco e em ruído.",
    sectionContributors: "[ CONTRIBUIDORES ]",
    sectionContributorsLine:
      "Quem sustenta o sistema por detrás do ruído.",
    chipVocal: "VOZ",
    chipContributor: "OP",
    structureBand: "ESTRUTURA",
  },
  en: {
    loading: "LOADING TEAM...",
    kicker: "operatives / blindkiss",
    title: "[ THE TEAM ]",
    intro:
      "Faces live first in interference. Hover to focus the image and reveal each operative in high contrast.",
    scanPending: "SCAN PENDING",
    addPhotoHint: "add the photo in the back office",
    bioFallback: "Signal online, ready to come into focus.",
    bioMissing: "No biography available.",
    ageSuffix: "years",
    bandShort: "band",
    contributorsShort: "contributors",
    sectionVocals: "[ BAND ]",
    sectionVocalsLine:
      "The Blindkiss front line on stage and in the noise.",
    sectionContributors: "[ CONTRIBUTORS ]",
    sectionContributorsLine:
      "The ones holding the system behind the noise.",
    chipVocal: "SING",
    chipContributor: "OPS",
    structureBand: "STRUCTURE",
  },
} as const;

type TeamUi = (typeof teamUi)[keyof typeof teamUi];

type TranslateFn = (text: LocalizedText | string | null | undefined) => string;

function TeamPickButton({
  member,
  selected,
  onPick,
  u,
  t,
}: {
  member: TeamMember;
  selected: boolean;
  onPick: () => void;
  u: TeamUi;
  t: TranslateFn;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onPick}
      onFocus={onPick}
      onClick={onPick}
      className={`text-left border-2 px-4 py-3 transition-all duration-300 ${
        selected
          ? "border-primary bg-primary/10 shadow-[4px_4px_0px_0px_rgba(145,8,2,0.35)]"
          : "border-border bg-background hover:bg-muted"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">{member.codename}</p>
      <p className="font-display text-xl uppercase mt-1">{member.name}</p>
      <p className="font-mono text-xs mt-1 text-foreground/70">{t(member.role)}</p>
    </button>
  );
}

function TeamMemberGridCard({
  member,
  isActive,
  onActivate,
  u,
  t,
  badge,
}: {
  member: TeamMember;
  isActive: boolean;
  onActivate: () => void;
  u: TeamUi;
  t: TranslateFn;
  badge: string;
}) {
  return (
    <article
      className="group relative border-4 border-border bg-card overflow-hidden min-h-[420px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
    >
      <div className="absolute top-3 left-3 z-20 font-mono text-[10px] uppercase tracking-widest border-2 border-primary bg-background/90 text-primary px-2 py-1">
        {badge}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(145,8,2,0.22),transparent_45%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.06))]" />
      <div
        className="absolute inset-0 opacity-35 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 6px)",
        }}
      />

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
              <p className="font-display text-4xl uppercase text-white/70">{u.scanPending}</p>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/40 mt-3">{u.addPhotoHint}</p>
            </div>
          </div>
        )}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "opacity-25" : "opacity-70"}`}
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(145,8,2,0.18), rgba(255,255,255,0.02))",
          }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0 1px, transparent 1px 3px)",
          }}
        />
      </div>

      <div className="relative p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">{member.codename}</p>
            <h3 className="font-display text-2xl uppercase leading-none mt-1">{member.name}</h3>
          </div>
          <div className="font-mono text-xs uppercase border-2 border-border px-2 py-1">{member.age}</div>
        </div>
        <div className="font-mono text-sm uppercase tracking-wide text-foreground/70">{t(member.role)}</div>
        <p className="font-mono text-xs leading-relaxed text-foreground/75">
          {t(member.bio) || u.bioMissing}
        </p>
      </div>
    </article>
  );
}

export default function Team() {
  const { data: members = [], isLoading } = useListTeamMembers();
  const { t, language } = useLanguage();
  const u = teamUi[language];
  const [activeId, setActiveId] = useState<number | null>(null);

  const { bandMembers, contributors, orderedMembers } = useMemo(() => {
    const band = members.filter((m) => m.memberGroup === "band").sort((a, b) => a.id - b.id);
    const contrib = members.filter((m) => m.memberGroup === "contributor").sort((a, b) => a.id - b.id);
    return {
      bandMembers: band,
      contributors: contrib,
      orderedMembers: [...band, ...contrib],
    };
  }, [members]);

  const selected = useMemo(
    () => orderedMembers.find((member) => member.id === activeId) ?? orderedMembers[0] ?? null,
    [activeId, orderedMembers],
  );

  const selectedIsBand = selected?.memberGroup === "band";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono">{u.loading}</div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="relative border-b-8 border-border px-4 py-16 md:py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(145,8,2,0.18), transparent 25%), radial-gradient(circle at 80% 30%, rgba(145,8,2,0.12), transparent 22%), linear-gradient(180deg, rgba(0,0,0,0.03), transparent)",
          }}
        />
        <p className="relative font-mono text-xs md:text-sm uppercase tracking-[0.4em] text-primary mb-4">{u.kicker}</p>
        <h1 className="relative font-display text-5xl md:text-8xl uppercase tracking-tight text-foreground">{u.title}</h1>
        <p className="relative mx-auto mt-6 max-w-2xl font-mono text-sm md:text-base leading-relaxed text-foreground/80">{u.intro}</p>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-10 md:py-16 space-y-10">
        {selected && (
          <section className="border-4 border-border bg-card p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(145,8,2,0.08) 50%, transparent 100%)" }}
            />
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
                      <p className="font-display text-4xl uppercase text-white/70">{u.scanPending}</p>
                      <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/40 mt-3">{u.addPhotoHint}</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.45))]" />
                <div
                  className="absolute inset-0 opacity-60 mix-blend-screen"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 50% 50%, rgba(255,145,0,0.32) 0%, rgba(255,145,0,0.12) 28%, rgba(145,8,2,0.10) 60%, transparent 78%)",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(180deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 4px)",
                  }}
                />
                <div className="absolute inset-0 rounded-none border-[10px] border-transparent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]" />
              </div>

              <div className="relative space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.35em] border-2 px-2 py-1 ${
                        selectedIsBand
                          ? "border-primary text-primary bg-primary/10"
                          : "border-border text-foreground/70"
                      }`}
                    >
                      {selectedIsBand ? u.chipVocal : u.chipContributor}
                    </span>
                    <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
                      codename // {selected.codename}
                    </p>
                  </div>
                  <h2 className="font-display text-4xl md:text-6xl uppercase mt-2 leading-none">{selected.name}</h2>
                  <p className="mt-3 font-mono text-sm md:text-base uppercase tracking-wide text-foreground/70">
                    {t(selected.role)} / {selected.age} {u.ageSuffix}
                  </p>
                </div>

                <p className="font-mono text-sm md:text-base leading-relaxed max-w-3xl text-foreground/80">
                  {t(selected.bio) || u.bioFallback}
                </p>

                <div className="space-y-8">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/45 mb-3">{u.bandShort}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {bandMembers.map((member) => (
                        <TeamPickButton
                          key={member.id}
                          member={member}
                          selected={selected.id === member.id}
                          onPick={() => setActiveId(member.id)}
                          u={u}
                          t={t}
                        />
                      ))}
                    </div>
                  </div>

                  <div
                    className="relative flex items-center gap-4 py-2"
                    aria-hidden
                  >
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-border" />
                    <span className="font-display text-lg text-primary/80 tracking-[0.6em] shrink-0">//</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-border" />
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/45 mb-3">{u.contributorsShort}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {contributors.map((member) => (
                        <TeamPickButton
                          key={member.id}
                          member={member}
                          selected={selected.id === member.id}
                          onPick={() => setActiveId(member.id)}
                          u={u}
                          t={t}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Secção vozes — destaque em duas colunas */}
        <section className="space-y-6">
          <div className="text-center md:text-left border-l-4 border-primary pl-4 md:pl-6">
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight text-foreground">{u.sectionVocals}</h2>
            <p className="font-mono text-sm text-foreground/60 mt-2 max-w-xl">{u.sectionVocalsLine}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {bandMembers.map((member) => (
              <TeamMemberGridCard
                key={member.id}
                member={member}
                isActive={selected?.id === member.id}
                onActivate={() => setActiveId(member.id)}
                u={u}
                t={t}
                badge={u.chipVocal}
              />
            ))}
          </div>
        </section>

        {/* Separador criativo entre blocos */}
        <div className="relative py-6 md:py-10">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-border" />
          <div className="relative flex justify-center">
            <div className="bg-background border-4 border-border px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-display text-xl md:text-2xl uppercase tracking-[0.35em] text-primary">
                {u.structureBand}
              </span>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="text-center md:text-left border-l-4 border-foreground pl-4 md:pl-6">
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight text-foreground">{u.sectionContributors}</h2>
            <p className="font-mono text-sm text-foreground/60 mt-2 max-w-xl">{u.sectionContributorsLine}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {contributors.map((member) => (
              <TeamMemberGridCard
                key={member.id}
                member={member}
                isActive={selected?.id === member.id}
                onActivate={() => setActiveId(member.id)}
                u={u}
                t={t}
                badge={u.chipContributor}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
