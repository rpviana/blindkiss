import { useState, useRef } from "react";
import { useCreateBkidMember, useGetBkidStats, getGetBkidStatsQueryKey } from "@/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { IdCard } from "@/components/IdCard";
import { toPng } from "html-to-image";
import { Download, Upload, AlertTriangle, ShieldCheck } from "lucide-react";

export default function Bkid() {
  const qc = useQueryClient();
  const { data: stats } = useGetBkidStats();
  const createMember = useCreateBkidMember();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  
  const [generatedCard, setGeneratedCard] = useState<{name: string, serial: string, photoUrl: string | null} | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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
        setGeneratedCard({ name: data.name, serial: data.serial, photoUrl: data.photoUrl || null });
        qc.invalidateQueries({ queryKey: getGetBkidStatsQueryKey() });
      }
    });
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `bkid-${generatedCard?.serial}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
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
        
        {stats && (
          <div className="inline-flex items-center gap-2 border-4 border-primary px-6 py-2 bg-primary/10">
            <ShieldCheck className="text-primary w-6 h-6" />
            <span className="font-mono font-bold">
              TOTAL DE OPERATIVOS: <span className="text-primary text-xl">{stats.total}</span>
            </span>
          </div>
        )}
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
                    Canal de Contacto (Opcional)
                  </label>
                  <input
                    type="email"
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
                    disabled={!name.trim() || createMember.isPending}
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
                    <IdCard name={name || "SUBJECT_NAME"} serial="BK-XXXXX" photoUrl={photoUrl} />
                  </div>
                </div>
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
            </div>
            
            <div className="shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-border p-1 md:p-2 bg-card mb-12 max-w-full overflow-hidden">
               <div className="scale-[0.65] sm:scale-[0.85] md:scale-100 origin-center py-20 md:py-0 md:static">
                 <IdCard 
                   ref={cardRef}
                   name={generatedCard.name} 
                   serial={generatedCard.serial} 
                   photoUrl={generatedCard.photoUrl} 
                 />
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
              <button
                onClick={handleDownload}
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
    </div>
  );
}
