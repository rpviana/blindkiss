import { useState, useRef } from "react";
import { useCreateBkidMember, useGetBkidStats, getGetBkidStatsQueryKey } from "@workspace/api-client-react";
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
      <div className="pt-24 pb-12 px-4 md:px-8 text-center border-b-8 border-border">
        <h1 className="font-display text-5xl md:text-7xl tracking-tighter uppercase mb-6">
          [ BK-ID REGISTRY ]
        </h1>
        <p className="font-mono text-lg md:text-xl font-bold max-w-2xl mx-auto mb-8">
          OFFICIAL SUPPORTER IDENTIFICATION PROGRAM.
        </p>
        
        {stats && (
          <div className="inline-flex items-center gap-2 border-4 border-primary px-6 py-2 bg-primary/10">
            <ShieldCheck className="text-primary w-6 h-6" />
            <span className="font-mono font-bold">
              TOTAL OPERATIVES: <span className="text-primary text-xl">{stats.total}</span>
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
                // ENLIST NOW
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">
                    Operative Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    className="w-full bg-background border-4 border-border p-3 font-mono uppercase focus:border-primary focus:outline-none transition-colors"
                    placeholder="ENTER DESIGNATION"
                  />
                </div>

                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">
                    Contact Channel (Optional)
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
                    Biometric Scan (Photo)
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
                        {photoUrl ? "SCAN ACQUIRED. CLICK TO REPLACE." : "CLICK TO UPLOAD SCAN"}
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
                    {createMember.isPending ? "GENERATING..." : "GENERATE ID"}
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Info */}
            <div className="flex flex-col gap-6">
              <div className="bg-yellow-500/20 border-4 border-yellow-500 p-6 text-yellow-800 dark:text-yellow-500 flex gap-4">
                <AlertTriangle className="shrink-0 w-8 h-8" />
                <div className="font-mono text-sm leading-relaxed font-bold uppercase">
                  WARNING: THIS IS A PERMANENT REGISTRY. YOUR DATA WILL BE SECURELY HASHED. THE GENERATED ID CARD CAN BE DOWNLOADED AND USED FOR FUTURE OFFLINE RIOTS.
                </div>
              </div>
              
              <div className="border-4 border-border p-6 bg-muted/30">
                <h3 className="font-display text-xl mb-4">PREVIEW</h3>
                <div className="opacity-50 pointer-events-none scale-75 origin-top-left">
                  <IdCard name={name || "SUBJECT_NAME"} serial="BK-XXXXX" photoUrl={photoUrl} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="mb-12 text-center">
              <h2 className="font-display text-4xl text-primary mb-4">REGISTRY CONFIRMED</h2>
              <p className="font-mono font-bold text-xl uppercase">
                Welcome to the riot, operative {generatedCard.name}.
              </p>
            </div>
            
            <div className="shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-border p-2 bg-card mb-12">
               <IdCard 
                 ref={cardRef}
                 name={generatedCard.name} 
                 serial={generatedCard.serial} 
                 photoUrl={generatedCard.photoUrl} 
               />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleDownload}
                className="py-3 px-8 bg-primary text-primary-foreground font-display text-xl tracking-widest uppercase hover:bg-foreground transition-colors flex items-center gap-2 border-4 border-primary hover:border-foreground"
              >
                <Download className="w-5 h-5" />
                DOWNLOAD ID CARD
              </button>
              
              <button
                onClick={() => {
                  setGeneratedCard(null);
                  setName("");
                  setEmail("");
                  setPhotoUrl(null);
                }}
                className="py-3 px-8 bg-card text-foreground font-display text-xl tracking-widest uppercase hover:bg-muted transition-colors border-4 border-border"
              >
                BACK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
