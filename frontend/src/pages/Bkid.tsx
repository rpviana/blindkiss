import { useState, useRef, type RefObject } from "react";
import { useCreateBkidMember, useRecoverBkidMember } from "@/api-client";
import { IdCard } from "@/components/IdCard";
import { toPng } from "html-to-image";
import { Download, Upload, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

type CardData = {
  name: string;
  serial: string;
  supporterNumber: number | null;
  photoUrl: string | null;
};

export default function Bkid() {
  const createMember = useCreateBkidMember();
  const recoverMember = useRecoverBkidMember();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isRecoverOpen, setIsRecoverOpen] = useState(false);
  const [recoverForm, setRecoverForm] = useState({ name: "", email: "" });
  
  const [generatedCard, setGeneratedCard] = useState<CardData | null>(null);
  const [recoveredCard, setRecoveredCard] = useState<CardData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const recoveredCardRef = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createMember.mutate({
      data: { name, email: email || null, photoUrl }
    }, {
      onSuccess: (data) => {
        setGeneratedCard({
          name: data.name,
          serial: data.serial,
          supporterNumber: data.supporterNumber ?? null,
          photoUrl: data.photoUrl || null,
        });
      },
      onError: (error) => {
        const status = (error as { status?: number })?.status;
        if (status === 409) {
          toast.error("Este email já está registado no BK-ID.");
          return;
        }
        toast.error("Não foi possível criar o BK-ID.");
      }
    });
  };

  const handleDownloadCard = async (
    targetRef: RefObject<HTMLDivElement | null>,
    serial: string,
  ) => {
    if (!targetRef.current) return;
    try {
      const dataUrl = await toPng(targetRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `bkid-${serial}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
      toast.error("Falha ao gerar imagem do cartão.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="pt-20 md:pt-24 pb-8 md:pb-12 px-4 md:px-8 text-center border-b-8 border-border">
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl tracking-tighter uppercase mb-4 md:mb-6">
          [ REGISTO BK-ID ]
        </h1>
        <p className="font-mono text-sm sm:text-base md:text-xl font-bold max-w-2xl mx-auto mb-6 md:mb-8">
          PROGRAMA OFICIAL DE IDENTIFICAÇÃO DE APOIANTES.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 flex-1 max-w-5xl">
        {!generatedCard ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className="border-4 border-border bg-card p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-display text-3xl mb-8 uppercase border-b-4 border-border pb-4">
                // ALISTA-TE AGORA
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">
                    Nome do Operativo *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    className="w-full bg-background border-4 border-border p-3 font-mono uppercase focus:border-primary focus:outline-none transition-colors"
                    placeholder="INTRODUZ A TUA DESIGNAÇÃO"
                  />
                </div>

                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">
                    Canal de Contacto (Email) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border-4 border-border p-3 font-mono focus:border-primary focus:outline-none transition-colors"
                    placeholder="EMAIL@SYSTEM.COM"
                  />
                </div>

                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">
                    Scan Biométrico (Foto)
                  </label>
                  <div className="border-4 border-dashed border-border p-6 text-center relative hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                      <Upload className="w-8 h-8 text-foreground/50" />
                      <span className="font-mono text-sm">
                        {photoUrl ? "SCAN ADQUIRIDO. CLICA PARA SUBSTITUIR." : "CLICA PARA FAZER UPLOAD DO SCAN"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t-4 border-border border-dashed">
                  <button
                    type="submit"
                    disabled={!name.trim() || !email.trim() || createMember.isPending}
                    className="w-full py-4 bg-primary text-primary-foreground font-display text-2xl tracking-widest uppercase hover:bg-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {createMember.isPending ? "A GERAR..." : "GERAR ID"}
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Info */}
            <div className="flex flex-col gap-6">
              <div className="bg-yellow-500/20 border-4 border-yellow-500 p-6 text-yellow-800 dark:text-yellow-500 flex gap-4">
                <AlertTriangle className="shrink-0 w-8 h-8" />
                <div className="font-mono text-sm leading-relaxed font-bold uppercase">
                  AVISO: ESTE É UM REGISTO PERMANENTE. OS TEUS DADOS SERÃO ENCRIPTADOS. O CARTÃO ID GERADO PODE SER DESCARREGADO E USADO EM FUTUROS DISTÚRBIOS OFFLINE.
                </div>
              </div>
              
              <div className="border-4 border-border p-4 md:p-6 bg-muted/30 overflow-hidden flex justify-center">
                <div className="flex flex-col items-center">
                  <h3 className="font-display text-xl mb-4 w-full text-center md:text-left">PRÉ-VISUALIZAÇÃO</h3>
                  <div className="scale-[0.5] sm:scale-[0.7] md:scale-75 lg:scale-90 origin-center py-24 sm:py-32 md:py-0 md:static">
                    <IdCard name={name || "SUBJECT_NAME"} serial="BK-2026-XXXXXX" photoUrl={photoUrl} />
                  </div>
                </div>
              </div>

              <div className="border-4 border-border bg-card p-4 md:p-6">
                <h4 className="font-display text-2xl uppercase mb-3">Recuperar BK-ID</h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoverOpen(true);
                    setRecoveredCard(null);
                    setRecoverForm({ name: "", email: "" });
                  }}
                  className="w-full py-3 bg-foreground text-background font-display uppercase tracking-widest hover:bg-primary transition-colors"
                >
                  RECUPERAR CARTÃO
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
             <div className="mb-8 md:mb-12 text-center">
               <h2 className="font-display text-3xl md:text-4xl text-primary mb-2 md:mb-4">REGISTO CONFIRMADO</h2>
               <p className="font-mono font-bold text-base md:text-xl uppercase px-4">
                 Bem-vindo ao distúrbio, operativo {generatedCard.name}.
               </p>
               <Link
                 href="/vault"
                 className="inline-block mt-4 font-mono text-sm md:text-base uppercase text-primary underline hover:text-foreground transition-colors"
               >
                 ACEDER AO VAULT
               </Link>
             </div>
            
            <div className="shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-border p-1 md:p-2 bg-card mb-12 max-w-full overflow-hidden">
               <div className="scale-[0.65] sm:scale-[0.85] md:scale-100 origin-center py-20 md:py-0 md:static">
                  <IdCard 
                    ref={cardRef}
                    name={generatedCard.name} 
                    serial={generatedCard.serial} 
                    supporterNumber={generatedCard.supporterNumber}
                    photoUrl={generatedCard.photoUrl} 
                  />
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
              <button
                onClick={() => {
                  if (!generatedCard) return;
                  void handleDownloadCard(cardRef, generatedCard.serial);
                }}
                className="py-4 md:py-3 px-8 bg-primary text-primary-foreground font-display text-xl tracking-widest uppercase hover:bg-foreground transition-colors flex items-center justify-center gap-2 border-4 border-primary hover:border-foreground w-full sm:w-auto"
              >
                <Download className="w-5 h-5" />
                DESCARREGAR CARTÃO ID
              </button>
              
              <button
                onClick={() => {
                  setGeneratedCard(null);
                  setName("");
                  setEmail("");
                  setPhotoUrl(null);
                }}
                className="py-4 md:py-3 px-8 bg-card text-foreground font-display text-xl tracking-widest uppercase hover:bg-muted transition-colors border-4 border-border w-full sm:w-auto text-center"
              >
                VOLTAR
              </button>
            </div>
          </div>
        )}
      </div>

      {isRecoverOpen && (
        <div className="fixed inset-0 z-[60] bg-black/70 p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl border-4 border-border bg-card p-6 md:p-8 relative">
            <button
              type="button"
              onClick={() => setIsRecoverOpen(false)}
              className="absolute top-3 right-3 font-mono text-xs border-2 border-border px-2 py-1 hover:bg-muted"
            >
              FECHAR
            </button>
            <h3 className="font-display text-3xl uppercase mb-2 text-primary">Recuperar BK-ID</h3>
            <p className="font-mono text-xs md:text-sm uppercase mb-6 text-foreground/70">
              Trapalhão, só não te esqueces da cabeça porque está agarrada.
            </p>

            {!recoveredCard ? (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  recoverMember.mutate(
                    {
                      name: recoverForm.name,
                      email: recoverForm.email,
                    },
                    {
                      onSuccess: (data) => {
                        setRecoveredCard({
                          name: data.name,
                          serial: data.serial,
                          supporterNumber: data.supporterNumber ?? null,
                          photoUrl: data.photoUrl || null,
                        });
                      },
                      onError: (error) => {
                        const status = (error as { status?: number })?.status;
                        if (status === 404) {
                          toast.error("Não encontramos BK-ID com esse nome + email.");
                          return;
                        }
                        toast.error("Falha ao recuperar BK-ID.");
                      },
                    },
                  );
                }}
              >
                <input
                  required
                  value={recoverForm.name}
                  onChange={(e) =>
                    setRecoverForm({ ...recoverForm, name: e.target.value.toUpperCase() })
                  }
                  placeholder="Nome usado no registo"
                  className="w-full border-2 border-border bg-background p-3 font-mono uppercase"
                />
                <input
                  required
                  type="email"
                  value={recoverForm.email}
                  onChange={(e) => setRecoverForm({ ...recoverForm, email: e.target.value })}
                  placeholder="Email usado no registo"
                  className="w-full border-2 border-border bg-background p-3 font-mono"
                />
                <button
                  type="submit"
                  disabled={recoverMember.isPending}
                  className="w-full py-3 bg-primary text-primary-foreground font-display uppercase tracking-widest hover:bg-foreground disabled:opacity-50"
                >
                  {recoverMember.isPending ? "A PROCURAR..." : "RECUPERAR"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="font-mono text-sm uppercase text-primary font-bold">
                  Encontrámos o teu cartão, {recoveredCard.name}.
                </p>
                <div className="border-4 border-border p-1 md:p-2 bg-background overflow-x-auto">
                  <div className="w-fit mx-auto">
                    <IdCard
                      ref={recoveredCardRef}
                      name={recoveredCard.name}
                      serial={recoveredCard.serial}
                      supporterNumber={recoveredCard.supporterNumber}
                      photoUrl={recoveredCard.photoUrl}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => void handleDownloadCard(recoveredCardRef, recoveredCard.serial)}
                    className="flex-1 py-3 bg-primary text-primary-foreground font-display uppercase tracking-widest hover:bg-foreground"
                  >
                    DESCARREGAR CARTÃO
                  </button>
                  <Link
                    href="/vault"
                    className="flex-1 py-3 text-center border-2 border-border font-display uppercase tracking-widest hover:bg-muted"
                  >
                    IR PARA O VAULT
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
