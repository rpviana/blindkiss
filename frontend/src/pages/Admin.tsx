import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useAdminMe, 
  useAdminLogin, 
  useAdminLogout,
  useGetSiteSettings,
  useUpdateSiteSettings,
  getGetSiteSettingsQueryKey,
  useListEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  getListEventsQueryKey,
  useListBkidMembers,
  useListTeamMembers,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
  useListContentBlocks,
  useUpdateContentBlock,
  getListContentBlocksQueryKey,
  useListTracks,
  useCreateTrack,
  useDeleteTrack,
  useUpdateTrackItem,
  getListTracksQueryKey,
  getAdminMeQueryKey,
  useAdminListAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  useUpdateBkidMember,
  useDeleteBkidMember,
  AnnouncementInput,
  Announcement,
  useAdminListRecruitmentApplications,
  useUpdateRecruitmentApplication,
  useDeleteRecruitmentApplication,
  useAdminListVaultAssets,
  useCreateVaultAsset,
  useUpdateVaultAsset,
  useDeleteVaultAsset,
  VaultAssetInput,
  useGetPressKit,
  useUpdatePressKit
} from "@/api-client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { LogOut, Plus, Trash2, Edit2, Check, X, Zap } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";

type AdminTab =
  | "settings"
  | "events"
  | "bkid"
  | "team"
  | "content"
  | "tracks"
  | "announcements"
  | "auditions"
  | "vault"
  | "presskit";

export default function Admin() {
  const qc = useQueryClient();
  const { language: editLang } = useLanguage();
  const { data: admin, isLoading: adminLoading } = useAdminMe();
  const login = useAdminLogin();
  const logout = useAdminLogout();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("settings");
  const tabs: Array<{ id: AdminTab; label: string }> = [
    { id: "settings", label: "definições" },
    { id: "events", label: "eventos" },
    { id: "bkid", label: "bk-id" },
    { id: "team", label: "equipa" },
    { id: "content", label: "conteúdo" },
    { id: "tracks", label: "faixas" },
    { id: "announcements", label: "anúncios" },
    { id: "auditions", label: "audições" },
    { id: "vault", label: "vault" },
    { id: "presskit", label: "press kit" },
  ];


  if (adminLoading) {
    return <div className="min-h-screen flex items-center justify-center font-mono">A CARREGAR ADMIN...</div>;
  }

  if (!admin?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md border-4 border-border bg-card p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="font-display text-4xl mb-6 uppercase text-center border-b-4 border-border pb-4">
            CONTROLO DO SISTEMA
          </h1>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              login.mutate({ data: { username, password } }, {
                onSuccess: () => {
                  qc.invalidateQueries({ queryKey: getAdminMeQueryKey() });
                  toast.success("Bem-vindo.");
                },
                onError: () => toast.error("Credenciais inválidas.")
              });
            }} 
            className="space-y-6"
          >
            <div>
              <label className="block font-mono text-sm font-bold uppercase mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border-4 border-border p-3 font-mono uppercase focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-sm font-bold uppercase mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border-4 border-border p-3 font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-4 bg-primary text-primary-foreground font-display text-xl tracking-widest uppercase hover:bg-foreground transition-colors"
            >
              {login.isPending ? "A AUTENTICAR..." : "ENTRAR"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background">
      {/* top-16: fica imediatamente abaixo do SiteHeader (h-16) para ambos ficarem sticky ao rolar a página */}
      <header className="sticky top-16 z-40 border-b-4 border-border bg-card px-4 md:px-6 py-4 flex justify-between items-center">
        <h1 className="font-display text-xl md:text-2xl tracking-widest text-primary truncate mr-4">CONSOLA DE ADMIN</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => logout.mutate(undefined, { 
              onSuccess: () => qc.invalidateQueries({ queryKey: getAdminMeQueryKey() }),
              onError: () => toast.error("Erro ao sair.")
            })}
            className="flex items-center gap-2 font-mono text-xs md:text-sm font-bold hover:text-primary transition-colors shrink-0"
          >
            <LogOut size={16} /> SAIR
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar / Navigation */}
        <aside className="w-full md:w-64 shrink-0 border-b-4 md:border-b-0 md:border-r-4 border-border bg-muted/20 flex md:flex-col p-2 md:p-4 gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left font-display tracking-widest text-base md:text-lg px-4 py-2 md:py-3 border-2 border-transparent transition-all uppercase whitespace-nowrap md:whitespace-normal ${
                activeTab === tab.id 
                  ? "bg-foreground text-background border-foreground md:translate-x-2 shadow-[4px_4px_0px_0px_rgba(145,8,2,1)]" 
                  : "hover:border-border hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Content — scroll na página inteira para o SiteHeader (sticky) acompanhar */}
        <main className="flex-1 p-4 md:p-8 bg-background min-w-0">
          <div className="max-w-5xl mx-auto">
            {activeTab === "settings" && <SettingsTab editLang={editLang} />}
            {activeTab === "events" && <EventsTab editLang={editLang} />}
            {activeTab === "bkid" && <BkidTab />}
            {activeTab === "team" && <TeamTab editLang={editLang} />}
            {activeTab === "content" && <ContentTab editLang={editLang} />}
              {activeTab === "tracks" && <TracksTab />}
              {activeTab === "announcements" && <AnnouncementsTab editLang={editLang} />}
              {activeTab === "auditions" && <AuditionsTab />}
              {activeTab === "vault" && <VaultTab editLang={editLang} />}
              {activeTab === "presskit" && <PressKitTab editLang={editLang} />}

          </div>
        </main>
      </div>
    </div>
  );
}

function SettingsTab({ editLang }: { editLang: "pt" | "en" }) {
  const qc = useQueryClient();
  const { data: settings } = useGetSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const [form, setForm] = useState(settings || {} as any);
 
  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  if (!settings) return <div className="p-8 font-mono text-foreground/50">A CARREGAR DEFINIÇÕES...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleLocalizedChange = (name: string, value: string) => {
    setForm((f: any) => ({
      ...f,
      [name]: {
        ...(f[name] || { pt: "", en: "" }),
        [editLang]: value
      }
    }));
  };

  const handleImageUpload = (field: "logoUrl" | "homeLogoUrl") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        setForm((currentForm: any) => ({ ...currentForm, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    };

  const clearImage = (field: "logoUrl" | "homeLogoUrl") => {
    setForm({ ...form, [field]: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({ data: form }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() });
        toast.success("Definições atualizadas!");
      },
      onError: () => toast.error("Erro ao atualizar definições.")
    });
  };

  return (
    <div className="border-4 border-border p-6 bg-card">
      <h2 className="font-display text-3xl mb-6 uppercase border-b-4 border-border pb-2">Definições Globais</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 border-2 border-dashed border-border p-4">
            <h3 className="font-mono font-bold uppercase text-primary">Cores</h3>
            
            <div className="flex items-center gap-4">
              <input type="color" name="colorBackground" value={form.colorBackground} onChange={handleChange} className="w-12 h-12" />
              <label className="font-mono text-sm">Background</label>
            </div>
            <div className="flex items-center gap-4">
              <input type="color" name="colorTitle" value={form.colorTitle} onChange={handleChange} className="w-12 h-12" />
              <label className="font-mono text-sm">Títulos / Primário</label>
            </div>
            <div className="flex items-center gap-4">
              <input type="color" name="colorText" value={form.colorText} onChange={handleChange} className="w-12 h-12" />
              <label className="font-mono text-sm">Texto / Principal</label>
            </div>
            <div className="flex items-center gap-4">
              <input type="color" name="colorAccent" value={form.colorAccent} onChange={handleChange} className="w-12 h-12" />
              <label className="font-mono text-sm">Destaque</label>
            </div>
          </div>

          <div className="space-y-4 border-2 border-dashed border-border p-4">
            <h3 className="font-mono font-bold uppercase text-primary">Efeitos</h3>
            <label className="flex items-center gap-4 cursor-pointer">
              <input type="checkbox" name="glitchMode" checked={form.glitchMode} onChange={handleChange} className="w-6 h-6 accent-primary" />
              <span className="font-mono font-bold">Ativar Modo Glitch</span>
            </label>
          </div>
        </div>

        <div className="space-y-4 border-2 border-dashed border-border p-4">
          <h3 className="font-mono font-bold uppercase text-primary">Conteúdo de Texto</h3>
          
          <div>
            <label className="block font-mono text-sm mb-1">Slogan Principal (Hero)</label>
            <input type="text" name="heroTagline" value={form.heroTagline?.[editLang] || ""} onChange={e => handleLocalizedChange("heroTagline", e.target.value)} className="w-full border-2 border-border p-2 font-mono bg-background" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-sm mb-1">Título de Recrutamento</label>
              <input type="text" name="recruitmentTitle" value={form.recruitmentTitle?.[editLang] || ""} onChange={e => handleLocalizedChange("recruitmentTitle", e.target.value)} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
            <div>
              <label className="block font-mono text-sm mb-1">Subtítulo de Recrutamento</label>
              <input type="text" name="recruitmentSubtitle" value={form.recruitmentSubtitle?.[editLang] || ""} onChange={e => handleLocalizedChange("recruitmentSubtitle", e.target.value)} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
            <div>
              <label className="block font-mono text-sm mb-1">Recrutamento: Baixista</label>
              <input type="text" name="recruitmentBassist" value={form.recruitmentBassist?.[editLang] || ""} onChange={e => handleLocalizedChange("recruitmentBassist", e.target.value)} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
            <div>
              <label className="block font-mono text-sm mb-1">Recrutamento: Baterista</label>
              <input type="text" name="recruitmentDrummer" value={form.recruitmentDrummer?.[editLang] || ""} onChange={e => handleLocalizedChange("recruitmentDrummer", e.target.value)} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-sm mb-1">Contacto de Recrutamento</label>
              <input type="text" name="recruitmentContact" value={form.recruitmentContact} onChange={handleChange} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-sm mb-1">Cidade (Rodapé)</label>
              <input type="text" name="footerCity" value={form.footerCity} onChange={handleChange} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
            <div>
              <label className="block font-mono text-sm mb-1">Coordenadas (Rodapé)</label>
              <input type="text" name="footerCoords" value={form.footerCoords} onChange={handleChange} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-4 border-primary/20 p-6 bg-primary/5">
          <h3 className="font-display text-2xl uppercase text-primary border-b-2 border-primary/20 pb-2 mb-4">Barra Móvel (Marquee)</h3>
          
          <div>
            <label className="block font-mono text-sm font-bold mb-2">Texto da Barra (use // para separadores)</label>
            <input 
              type="text" 
              name="marqueeText" 
              value={form.marqueeText?.[editLang] || ""} 
              onChange={e => handleLocalizedChange("marqueeText", e.target.value)} 
              className="w-full border-2 border-border p-2 font-mono bg-background" 
              placeholder="BLIND KISS // DEIXA-TE IR // SENTE O CAOS // PORTO // "
            />
          </div>
        </div>

        <div className="space-y-4 border-4 border-primary/20 p-6 bg-primary/5">
          <h3 className="font-display text-2xl uppercase text-primary border-b-2 border-primary/20 pb-2 mb-4">Logo / Imagens</h3>
          
          <div className="space-y-3 border-2 border-dashed border-border p-4">
            <div className="flex items-center justify-between gap-4">
              <label className="block font-mono text-sm font-bold">Logo do Header</label>
              {form.logoUrl ? (
                <button type="button" onClick={() => clearImage("logoUrl")} className="font-mono text-xs uppercase text-primary hover:underline">
                  Limpar
                </button>
              ) : null}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              onChange={handleImageUpload("logoUrl")} 
              className="block w-full text-sm font-mono"
            />
            <p className="font-mono text-xs text-foreground/60">Escolhe um ficheiro local do pc ou telemóvel.</p>
            <input 
              type="text" 
              name="logoUrl" 
              value={form.logoUrl || ""} 
              onChange={handleChange} 
              className="w-full border-2 border-border p-2 font-mono bg-background" 
              placeholder="URL ou data:image/..."
            />
            {form.logoUrl ? <img src={form.logoUrl} alt="Pré-visualização header" className="max-h-24 object-contain border-2 border-border bg-background p-2" /> : null}
          </div>

          <div className="space-y-3 border-2 border-dashed border-border p-4">
            <div className="flex items-center justify-between gap-4">
              <label className="block font-mono text-sm font-bold">Logo da Home</label>
              {form.homeLogoUrl ? (
                <button type="button" onClick={() => clearImage("homeLogoUrl")} className="font-mono text-xs uppercase text-primary hover:underline">
                  Limpar
                </button>
              ) : null}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              onChange={handleImageUpload("homeLogoUrl")} 
              className="block w-full text-sm font-mono"
            />
            <p className="font-mono text-xs text-foreground/60">Escolhe um ficheiro local do pc ou telemóvel.</p>
            <input 
              type="text" 
              name="homeLogoUrl" 
              value={form.homeLogoUrl || ""} 
              onChange={handleChange} 
              className="w-full border-2 border-border p-2 font-mono bg-background" 
              placeholder="URL ou data:image/..."
            />
            {form.homeLogoUrl ? <img src={form.homeLogoUrl} alt="Pré-visualização home" className="max-h-32 object-contain border-2 border-border bg-background p-2" /> : null}
          </div>
        </div>

        <div className="space-y-4 border-4 border-primary/20 p-6 bg-primary/5">
          <h3 className="font-display text-2xl uppercase text-primary border-b-2 border-primary/20 pb-2 mb-4">Página de Arquivo (Gigs)</h3>
          
          <div>
            <label className="block font-mono text-sm font-bold mb-2">Título da Página</label>
            <input 
              type="text" 
              name="archiveTitle" 
              value={form.archiveTitle?.[editLang] || ""} 
              onChange={e => handleLocalizedChange("archiveTitle", e.target.value)} 
              className="w-full border-2 border-border p-2 font-mono bg-background" 
              placeholder="[ ARQUIVO DE GIGS ]"
            />
          </div>

          <div>
            <label className="block font-mono text-sm font-bold mb-2">Subtítulo da Página</label>
            <input 
              type="text" 
              name="archiveSubtitle" 
              value={form.archiveSubtitle?.[editLang] || ""} 
              onChange={e => handleLocalizedChange("archiveSubtitle", e.target.value)} 
              className="w-full border-2 border-border p-2 font-mono bg-background" 
              placeholder="RUÍDO AO VIVO. TESTEMUNHO DO CAOS."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-sm font-bold mb-2">Botão: Próximos</label>
              <input 
                type="text" 
                name="archiveUpcomingButton" 
                value={form.archiveUpcomingButton?.[editLang] || ""} 
                onChange={e => handleLocalizedChange("archiveUpcomingButton", e.target.value)} 
                className="w-full border-2 border-border p-2 font-mono bg-background" 
                placeholder="PRÓXIMOS DISTÚRBIOS"
              />
            </div>
            <div>
              <label className="block font-mono text-sm font-bold mb-2">Botão: Passados</label>
              <input 
                type="text" 
                name="archivePastButton" 
                value={form.archivePastButton?.[editLang] || ""} 
                onChange={e => handleLocalizedChange("archivePastButton", e.target.value)} 
                className="w-full border-2 border-border p-2 font-mono bg-background" 
                placeholder="ECOS PASSADOS"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-4 border-primary/20 p-6 bg-primary/5">
          <h3 className="font-display text-2xl uppercase text-primary border-b-2 border-primary/20 pb-2 mb-4">Poster de Recrutamento (Wanted)</h3>
          
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="showRecruitment" checked={form.showRecruitment} onChange={handleChange} className="w-6 h-6 accent-primary" />
              <span className="font-mono font-bold">Mostrar Poster na Home</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="showRecruitmentBassist" checked={form.showRecruitmentBassist} onChange={handleChange} className="w-6 h-6 accent-primary" />
              <span className="font-mono font-bold">Mostrar Baixista</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="showRecruitmentDrummer" checked={form.showRecruitmentDrummer} onChange={handleChange} className="w-6 h-6 accent-primary" />
              <span className="font-mono font-bold">Mostrar Baterista</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="showRecruitmentUrgent" checked={form.showRecruitmentUrgent} onChange={handleChange} className="w-6 h-6 accent-primary" />
              <span className="font-mono font-bold">Mostrar Selo Urgente</span>
            </label>
          </div>

          <div className="pt-4">
            <label className="block font-mono text-sm mb-1">Texto do Selo (ex: URGENTE)</label>
            <input type="text" name="recruitmentUrgentText" value={form.recruitmentUrgentText?.[editLang] || ""} onChange={e => handleLocalizedChange("recruitmentUrgentText", e.target.value)} className="w-full md:w-1/3 border-2 border-border p-2 font-mono bg-background" />
          </div>
        </div>

        <button type="submit" disabled={updateSettings.isPending} className="py-3 px-8 bg-primary text-primary-foreground font-display text-xl uppercase hover:bg-foreground transition-colors border-2 border-primary">
          {updateSettings.isPending ? "A GUARDAR..." : "GUARDAR DEFINIÇÕES"}
        </button>
      </form>
    </div>
  );
}

function EventsTab({ editLang }: { editLang: "pt" | "en" }) {
  const qc = useQueryClient();
  const { data: events = [] } = useListEvents({ status: "all" }, { query: { queryKey: getListEventsQueryKey({status:"all"}) }});
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const defaultForm = {
    title: { pt: "", en: "" } as any, 
    venue: { pt: "", en: "" } as any, 
    city: { pt: "", en: "" } as any, 
    address: "", mapsUrl: "", ticketUrl: "", price: "", eventDate: new Date().toISOString().slice(0, 16), posterUrl: "", 
    description: { pt: "", en: "" } as any, 
    forcePast: false
  };

  const [form, setForm] = useState(defaultForm);
  const resetForm = () => setForm({ ...defaultForm, eventDate: new Date().toISOString().slice(0, 16) });

  const handleLocalizedChange = (name: string, value: string) => {
    setForm((f: any) => ({
      ...f,
      [name]: {
        ...(f[name] || { pt: "", en: "" }),
        [editLang]: value
      }
    }));
  };

  const handleSave = () => {
    const payload = {
      ...form,
      mapsUrl: form.mapsUrl || null,
      ticketUrl: form.ticketUrl || null,
      price: form.price || null,
      posterUrl: form.posterUrl || null,
      description: form.description || null,
    };

    if (editingId) {
      updateEvent.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListEventsQueryKey() });
          setEditingId(null);
          resetForm();
          toast.success("Evento atualizado!");
        },
        onError: () => toast.error("Erro ao atualizar.")
      });
    } else {
      createEvent.mutate({ data: payload }, {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListEventsQueryKey() });
          setIsAdding(false);
          resetForm();
          toast.success("Evento criado!");
        },
        onError: () => toast.error("Erro ao criar.")
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-3xl uppercase">Gigs / Eventos</h2>
        {!isAdding && !editingId && (
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 font-mono font-bold border-2 border-primary hover:bg-background hover:text-primary transition-colors">
            <Plus size={16} /> ADICIONAR EVENTO
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="border-4 border-border bg-card p-4 md:p-6">
          <h3 className="font-display text-xl mb-4">{editingId ? "EDITAR EVENTO" : "NOVO EVENTO"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <input placeholder="Título *" value={form.title?.[editLang] || ""} onChange={e=>handleLocalizedChange("title", e.target.value)} className="border-2 border-border p-2 font-mono bg-background" />
             <input type="datetime-local" value={form.eventDate} onChange={e=>setForm({...form, eventDate: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <input placeholder="Local *" value={form.venue?.[editLang] || ""} onChange={e=>handleLocalizedChange("venue", e.target.value)} className="border-2 border-border p-2 font-mono bg-background" />
             <input placeholder="Cidade *" value={form.city?.[editLang] || ""} onChange={e=>handleLocalizedChange("city", e.target.value)} className="border-2 border-border p-2 font-mono bg-background" />
             <input placeholder="Morada *" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} className="border-2 border-border p-2 font-mono bg-background md:col-span-2" />
             <input placeholder="Preço (ex: 10€)" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <input placeholder="Poster URL" value={form.posterUrl} onChange={e=>setForm({...form, posterUrl: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <input placeholder="Ticket URL" value={form.ticketUrl} onChange={e=>setForm({...form, ticketUrl: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <input placeholder="Maps URL" value={form.mapsUrl} onChange={e=>setForm({...form, mapsUrl: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <label className="flex items-center gap-2 md:col-span-2">
               <input type="checkbox" checked={form.forcePast} onChange={e=>setForm({...form, forcePast: e.target.checked})} className="w-5 h-5 accent-primary" />
               <span className="font-mono text-sm font-bold">Forçar Estado Passado (Ocultar dos Próximos)</span>
             </label>
          </div>
          <div className="flex gap-4">
            <button onClick={handleSave} className="flex-1 md:flex-none bg-foreground text-background px-6 py-3 font-display uppercase tracking-widest hover:bg-primary transition-colors">GUARDAR</button>
            <button onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} className="flex-1 md:flex-none border-2 border-border px-6 py-3 font-display uppercase tracking-widest hover:bg-muted transition-colors">CANCELAR</button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block border-4 border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b-4 border-border font-mono text-sm">
              <th className="p-3">Data</th>
              <th className="p-3">Título</th>
              <th className="p-3">Local</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {events.map((e) => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="p-3">{format(new Date(e.eventDate), "dd MMM yyyy")}</td>
             <td className="p-3 font-bold">{e.title?.[editLang] || e.title?.pt}</td>
             <td className="p-3">{(e.venue as any)?.[editLang] || (e.venue as any)?.pt}, {(e.city as any)?.[editLang] || (e.city as any)?.pt}</td>
                <td className="p-3">
                  {e.isPast || e.forcePast ? <span className="text-foreground/50">PASSADO</span> : <span className="text-primary font-bold">PRÓXIMO</span>}
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => { 
                    setEditingId(e.id); 
                    setForm({ title: e.title as any, venue: e.venue as any, city: e.city as any, address: e.address, mapsUrl: e.mapsUrl || "", ticketUrl: e.ticketUrl || "", price: e.price || "", eventDate: e.eventDate.slice(0,16), posterUrl: e.posterUrl || "", description: e.description as any, forcePast: e.forcePast });
                  }} className="text-blue-600 hover:text-blue-800"><Edit2 size={18}/></button>
                  <button onClick={() => {
                    if (confirm("Delete this event?")) {
                      deleteEvent.mutate({ id: e.id }, { 
                        onSuccess: () => {
                          qc.invalidateQueries({ queryKey: getListEventsQueryKey() });
                          toast.success("Evento eliminado.");
                        },
                        onError: () => toast.error("Erro ao eliminar.")
                      });
                    }
                  }} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {events.map((e) => (
          <div key={e.id} className="border-4 border-border bg-card p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-mono text-xs text-foreground/50">{format(new Date(e.eventDate), "dd MMM yyyy")}</p>
                <h4 className="font-display text-xl uppercase text-primary">{(e.title as any)?.[editLang] || (e.title as any)?.pt}</h4>
              </div>
              <div className="font-mono text-[10px] font-bold border border-border px-2 py-0.5 uppercase">
                {e.isPast || e.forcePast ? "PAST" : "UPCOMING"}
              </div>
            </div>
            <p className="font-mono text-sm">{(e.venue as any)?.[editLang] || (e.venue as any)?.pt}, {(e.city as any)?.[editLang] || (e.city as any)?.pt}</p>
            <div className="flex gap-4 pt-2 border-t border-border/20">
              <button onClick={() => { 
                setEditingId(e.id); 
                setForm({ title: e.title as any, venue: e.venue as any, city: e.city as any, address: e.address, mapsUrl: e.mapsUrl || "", ticketUrl: e.ticketUrl || "", price: e.price || "", eventDate: e.eventDate.slice(0,16), posterUrl: e.posterUrl || "", description: e.description as any, forcePast: e.forcePast });
              }} className="flex items-center gap-1 font-mono text-xs font-bold text-blue-600"><Edit2 size={14}/> EDITAR</button>
              <button onClick={() => {
                if (confirm("Eliminar este evento?")) {
                  deleteEvent.mutate({ id: e.id }, { 
                    onSuccess: () => {
                      qc.invalidateQueries({ queryKey: getListEventsQueryKey() });
                      toast.success("Evento eliminado.");
                    },
                    onError: () => toast.error("Erro ao eliminar.")
                  });
                }
              }} className="flex items-center gap-1 font-mono text-xs font-bold text-red-600"><Trash2 size={14}/> ELIMINAR</button>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="p-12 text-center border-4 border-border border-dashed text-foreground/50 font-mono">NENHUM EVENTO REGISTADO</div>
      )}
    </div>
  );
}

function BkidTab() {
  const qc = useQueryClient();
  const { data: members = [] } = useListBkidMembers();
  const deleteMember = useDeleteBkidMember();
  const updateMember = useUpdateBkidMember();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });

  const handleSave = () => {
    if (!editingId) return;
    updateMember.mutate({ id: editingId, data: form }, {
      onSuccess: () => {
        setEditingId(null);
        toast.success("Membro atualizado.");
        qc.invalidateQueries({ queryKey: ["bkid-members"] });
      },
      onError: () => toast.error("Erro ao atualizar.")
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl uppercase">Membros BK-ID</h2>
      
      {editingId && (
        <div className="border-4 border-border bg-card p-6 mb-6">
          <h3 className="font-display text-xl mb-4 text-primary">EDIT MEMBER</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value.toUpperCase()})} className="border-2 border-border p-2 font-mono bg-background" />
            <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
          </div>
          <div className="flex gap-4">
            <button onClick={handleSave} className="bg-foreground text-background px-6 py-2 font-display uppercase tracking-widest hover:bg-primary transition-colors">GUARDAR</button>
            <button onClick={() => setEditingId(null)} className="border-2 border-border px-6 py-2 font-display uppercase tracking-widest hover:bg-muted transition-colors">CANCELAR</button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block border-4 border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b-4 border-border font-mono text-sm">
              <th className="p-3">Série</th>
              <th className="p-3">Nome</th>
              <th className="p-3">Email</th>
              <th className="p-3">Alistado</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {members.map((m) => (
              <tr key={m.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="p-3 font-bold text-primary">{m.serial}</td>
                <td className="p-3 font-bold">{m.name}</td>
                <td className="p-3">{m.email || "-"}</td>
                <td className="p-3">{format(new Date(m.createdAt), "dd/MM/yyyy HH:mm")}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => { setEditingId(m.id); setForm({ name: m.name, email: m.email || "" }); }} className="text-blue-600 hover:text-blue-800"><Edit2 size={18}/></button>
                  <button onClick={() => {
                    if (confirm(`Delete member ${m.name}?`)) deleteMember.mutate(m.id, {
                      onSuccess: () => {
                        toast.success("Membro eliminado.");
                        qc.invalidateQueries({ queryKey: ["bkid-members"] });
                      },
                      onError: () => toast.error("Erro ao eliminar.")
                    });
                  }} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {members.map((m) => (
          <div key={m.id} className="border-4 border-border bg-card p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-primary font-bold">{m.serial}</span>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(m.id); setForm({ name: m.name, email: m.email || "" }); }} className="text-blue-600"><Edit2 size={18}/></button>
                <button onClick={() => {
                  if (confirm(`Delete member ${m.name}?`)) deleteMember.mutate(m.id, {
                    onSuccess: () => {
                      toast.success("Membro eliminado.");
                      qc.invalidateQueries({ queryKey: ["bkid-members"] });
                    },
                    onError: () => toast.error("Erro ao eliminar.")
                  });
                }} className="text-red-600"><Trash2 size={18}/></button>
              </div>
            </div>
            <h4 className="font-display text-xl uppercase">{m.name}</h4>
            <p className="font-mono text-xs truncate">{m.email || "[NO EMAIL]"}</p>
            <p className="font-mono text-[10px] text-foreground/50">{format(new Date(m.createdAt), "dd/MM/yyyy HH:mm")}</p>
          </div>
        ))}
      </div>

      {members.length === 0 && <div className="p-12 text-center border-4 border-border border-dashed text-foreground/50 font-mono">NENHUM REGISTO</div>}
    </div>
  );
}

function ContentTab({ editLang }: { editLang: "pt" | "en" }) {
  const qc = useQueryClient();
  const { data: blocks = [] } = useListContentBlocks();
  const updateBlock = useUpdateContentBlock();

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form, setForm] = useState({ title: { pt: "", en: "" } as any, body: { pt: "", en: "" } as any, imageUrl: "" });

  const handleLocalizedChange = (name: string, value: string) => {
    setForm((f: any) => ({
      ...f,
      [name]: {
        ...(f[name] || { pt: "", en: "" }),
        [editLang]: value
      }
    }));
  };

  const handleSave = (key: string) => {
    updateBlock.mutate({ key, data: form }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListContentBlocksQueryKey() });
        setEditingKey(null);
        toast.success("Bloco atualizado.");
      },
      onError: () => toast.error("Erro ao atualizar bloco.")
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl uppercase">Blocos de Conteúdo</h2>
      
      <div className="space-y-6">
        {blocks.map((block) => (
          <div key={block.id} className="border-4 border-border bg-card p-6 relative">
            <div className="absolute top-0 right-0 bg-border text-background px-3 py-1 font-mono text-xs font-bold uppercase">
              CHAVE: {block.key}
            </div>
            
            {editingKey === block.key ? (
              <div className="space-y-4 mt-6">
                <input value={form.title?.[editLang] || ""} onChange={e=>handleLocalizedChange("title", e.target.value)} className="w-full border-2 border-border p-2 font-display text-2xl bg-background" placeholder="Título" />
                <textarea value={form.body?.[editLang] || ""} onChange={e=>handleLocalizedChange("body", e.target.value)} className="w-full border-2 border-border p-2 font-mono h-32 bg-background" placeholder="Conteúdo do corpo..." />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(block.key)} className="bg-primary text-primary-foreground px-4 py-2 font-mono font-bold hover:bg-foreground"><Check size={18}/></button>
                  <button onClick={() => setEditingKey(null)} className="border-2 border-border px-4 py-2 hover:bg-muted"><X size={18}/></button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <h3 className="font-display text-2xl mb-2">{(block.title as any)?.[editLang] || (block.title as any)?.pt || "[NO TITLE]"}</h3>
                <p className="font-mono text-foreground/80 whitespace-pre-wrap mb-4 line-clamp-3">{(block.body as any)?.[editLang] || (block.body as any)?.pt}</p>
                <button 
                  onClick={() => { setEditingKey(block.key); setForm({ title: block.title as any || { pt: "", en: "" }, body: block.body as any || { pt: "", en: "" }, imageUrl: block.imageUrl||"" }); }}
                  className="flex items-center gap-2 border-2 border-border px-4 py-2 font-mono text-sm hover:bg-muted"
                >
                  <Edit2 size={14}/> EDITAR
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TracksTab() {
  const qc = useQueryClient();
  const { data: tracks = [] } = useListTracks();
  const createTrack = useCreateTrack();
  const deleteTrack = useDeleteTrack();
  const updateTrack = useUpdateTrackItem();

  const [form, setForm] = useState({ title: "", artist: "BLINDKISS", url: "" });
  const [sourceMode, setSourceMode] = useState<"url" | "file">("url");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [editingTrackId, setEditingTrackId] = useState<number | null>(null);
  const isSaving = createTrack.isPending || updateTrack.isPending;

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl.startsWith("data:audio/")) {
        toast.error("Ficheiro inválido. Usa um ficheiro de áudio.");
        return;
      }
      setForm((prev) => ({ ...prev, url: dataUrl }));
      setSelectedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url) return;
    const payload = { ...form, durationSec: null };

    if (editingTrackId) {
      updateTrack.mutate(
        { id: editingTrackId, data: payload },
        {
          onSuccess: () => {
            qc.invalidateQueries({ queryKey: getListTracksQueryKey() });
            setForm({ title: "", artist: "BLINDKISS", url: "" });
            setSelectedFileName("");
            setSourceMode("url");
            setEditingTrackId(null);
            toast.success("Faixa atualizada.");
          },
          onError: () => toast.error("Erro ao atualizar faixa."),
        },
      );
      return;
    }

    createTrack.mutate({ data: payload }, {
      onSuccess: (created) => {
        qc.setQueryData(getListTracksQueryKey(), (prev: unknown) => {
          if (!Array.isArray(prev)) return [created];
          return [...prev, created];
        });
        setForm({ title: "", artist: "BLINDKISS", url: "" });
        setSelectedFileName("");
        setSourceMode("url");
        toast.success("Faixa adicionada.");
      },
      onError: () => {
        toast.error("Erro ao adicionar faixa.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl uppercase">Faixas de Cassete</h2>
      
      <form onSubmit={handleAdd} className="border-4 border-border bg-card p-4 md:p-6 flex flex-col md:flex-row gap-4 items-stretch md:items-end">
        <div className="flex-1">
          <label className="block font-mono text-xs uppercase mb-1">Título da Faixa</label>
          <input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full border-2 border-border p-2 font-mono bg-background" />
        </div>
        <div className="flex-1">
          <label className="block font-mono text-xs uppercase mb-1">Artista</label>
          <input value={form.artist} onChange={e=>setForm({...form, artist: e.target.value})} className="w-full border-2 border-border p-2 font-mono bg-background" />
        </div>
        <div className="md:flex-[2]">
          <label className="block font-mono text-xs uppercase mb-1">Fonte de Áudio</label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => {
                setSourceMode("url");
                setSelectedFileName("");
                setForm((prev) => ({ ...prev, url: "" }));
              }}
              className={`px-3 py-1 border-2 font-mono text-xs ${sourceMode === "url" ? "border-primary bg-primary/10" : "border-border"}`}
            >
              URL
            </button>
            <button
              type="button"
              onClick={() => {
                setSourceMode("file");
                setForm((prev) => ({ ...prev, url: "" }));
              }}
              className={`px-3 py-1 border-2 font-mono text-xs ${sourceMode === "file" ? "border-primary bg-primary/10" : "border-border"}`}
            >
              FICHEIRO DO PC
            </button>
          </div>
          {sourceMode === "url" ? (
            <input
              required
              value={form.url}
              onChange={e=>setForm({...form, url: e.target.value})}
              className="w-full border-2 border-border p-2 font-mono bg-background"
              placeholder="https://...mp3"
            />
          ) : (
            <div className="space-y-2">
              <input
                required={!form.url}
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="w-full border-2 border-border p-2 font-mono bg-background text-xs"
              />
              <p className="font-mono text-[10px] text-foreground/70">
                {selectedFileName
                  ? `Ficheiro carregado: ${selectedFileName}`
                  : "Seleciona um ficheiro de áudio para guardar na DB."}
              </p>
            </div>
          )}
        </div>
        <button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground px-6 py-3 border-2 border-primary font-display tracking-widest uppercase hover:bg-foreground disabled:opacity-50">
          {editingTrackId ? "ATUALIZAR" : "ADICIONAR"}
        </button>
        {editingTrackId && (
          <button
            type="button"
            onClick={() => {
              setEditingTrackId(null);
              setForm({ title: "", artist: "BLINDKISS", url: "" });
              setSelectedFileName("");
              setSourceMode("url");
            }}
            className="border-2 border-border px-6 py-3 font-display tracking-widest uppercase hover:bg-muted"
          >
            CANCELAR
          </button>
        )}
      </form>

      {/* Desktop Table */}
      <div className="hidden md:block border-4 border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b-4 border-border font-mono text-sm">
              <th className="p-3">Ordem</th>
              <th className="p-3">Título</th>
              <th className="p-3">Artista</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {tracks.map((t, idx) => (
              <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="p-3 text-foreground/50">{idx + 1}</td>
                <td className="p-3 font-bold">{t.title}</td>
                <td className="p-3">{t.artist}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTrackId(t.id);
                      setForm({ title: t.title, artist: t.artist || "BLINDKISS", url: t.url });
                      const isDataUrl = t.url.startsWith("data:audio/");
                      setSourceMode(isDataUrl ? "file" : "url");
                      setSelectedFileName(isDataUrl ? "Áudio guardado na DB" : "");
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18}/>
                  </button>
                  <button onClick={() => {
                    if(confirm("Eliminar esta faixa?")) {
                      deleteTrack.mutate({ id: t.id }, { 
                        onSuccess: () => {
                          toast.success("Faixa eliminada.");
                          qc.invalidateQueries({ queryKey: getListTracksQueryKey() });
                        },
                        onError: () => toast.error("Erro ao eliminar faixa.")
                      });
                    }
                  }} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {tracks.map((t, idx) => (
          <div key={t.id} className="border-4 border-border bg-card p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-mono text-foreground/30 text-2xl font-bold">{idx + 1}</span>
              <div>
                <h4 className="font-display text-lg uppercase leading-none mb-1">{t.title}</h4>
                <p className="font-mono text-xs text-foreground/60">{t.artist}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingTrackId(t.id);
                  setForm({ title: t.title, artist: t.artist || "BLINDKISS", url: t.url });
                  const isDataUrl = t.url.startsWith("data:audio/");
                  setSourceMode(isDataUrl ? "file" : "url");
                  setSelectedFileName(isDataUrl ? "Áudio guardado na DB" : "");
                }}
                className="text-blue-600 p-2"
              >
                <Edit2 size={20}/>
              </button>
              <button onClick={() => {
                if(confirm("Eliminar esta faixa?")) {
                  deleteTrack.mutate({ id: t.id }, { 
                    onSuccess: () => {
                      toast.success("Faixa eliminada.");
                      qc.invalidateQueries({ queryKey: getListTracksQueryKey() });
                    },
                    onError: () => toast.error("Erro ao eliminar faixa.")
                  });
                }
              }} className="text-red-600 p-2"><Trash2 size={20}/></button>
            </div>
          </div>
        ))}
      </div>

      {tracks.length === 0 && <div className="p-12 text-center border-4 border-border border-dashed text-foreground/50 font-mono">NENHUMA FAIXA CARREGADA</div>}
    </div>
  );
}

function AnnouncementsTab({ editLang }: { editLang: "pt" | "en" }) {
  const { data: announcements = [] } = useAdminListAnnouncements();
  const create = useCreateAnnouncement();
  const update = useUpdateAnnouncement();
  const remove = useDeleteAnnouncement();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const defaultForm = { title: { pt: "", en: "" } as any, content: { pt: "", en: "" } as any, imageUrl: "", isActive: true };
  const [form, setForm] = useState<any>(defaultForm);

  const handleLocalizedChange = (name: string, value: string) => {
    setForm((f: any) => ({
      ...f,
      [name]: {
        ...(f[name] || { pt: "", en: "" }),
        [editLang]: value
      }
    }));
  };

  const handleSave = () => {
    if (!form.title || !form.content) {
      toast.error("Título e conteúdo são obrigatórios.");
      return;
    }

    if (editingId) {
      update.mutate({ id: editingId, data: form }, {
        onSuccess: () => {
          toast.success("Anúncio atualizado!");
          setEditingId(null);
          setForm(defaultForm);
        },
        onError: () => toast.error("Erro ao atualizar anúncio.")
      });
    } else {
      create.mutate(form, {
        onSuccess: () => {
          toast.success("Anúncio criado!");
          setIsAdding(false);
          setForm(defaultForm);
        },
        onError: () => toast.error("Erro ao criar anúncio.")
      });
    }
  };

  const startEdit = (a: any) => {
    setEditingId(a.id);
    setForm({ title: a.title, content: a.content, imageUrl: a.imageUrl || "", isActive: a.isActive });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-3xl uppercase italic">Gestor de Anúncios</h2>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); setForm(defaultForm); }} 
          className="flex items-center gap-2 bg-primary text-black px-4 py-2 font-mono font-bold border-2 border-primary hover:bg-white hover:border-white transition-colors"
        >
          <Plus size={16} /> NOVO ANÚNCIO
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="border-4 border-border bg-card p-6 space-y-4">
          <h3 className="font-display text-xl uppercase italic text-primary">{editingId ? 'Editar' : 'Criar'} Anúncio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-xs uppercase opacity-60">Título</label>
              <input placeholder="ATUALIZAÇÃO DO SISTEMA" value={form.title?.[editLang] || ""} onChange={e=>handleLocalizedChange("title", e.target.value)} className="w-full border-2 border-border p-2 font-mono bg-background text-foreground focus:border-primary outline-none" />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs uppercase opacity-60">URL de Imagem Personalizada (Bits)</label>
              <input placeholder="https://..." value={form.imageUrl || ""} onChange={e=>setForm({...form, imageUrl: e.target.value})} className="w-full border-2 border-border p-2 font-mono bg-background text-foreground focus:border-primary outline-none" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="font-mono text-xs uppercase opacity-60">Conteúdo da Mensagem</label>
              <textarea placeholder="Introduz a mensagem aqui..." value={form.content?.[editLang] || ""} onChange={e=>handleLocalizedChange("content", e.target.value)} className="w-full border-2 border-border p-2 font-mono bg-background text-foreground focus:border-primary outline-none h-24" />
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form, isActive: e.target.checked})} className="w-5 h-5 accent-primary" />
              <span className="font-mono text-sm font-bold group-hover:text-primary transition-colors">Ativo (Mostrar no site)</span>
            </label>
          </div>
          <div className="flex gap-4">
            <button onClick={handleSave} className="bg-primary text-primary-foreground px-8 py-2 font-display uppercase tracking-widest hover:bg-foreground transition-colors">{editingId ? 'ATUALIZAR' : 'CRIAR'}</button>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="border-2 border-border px-8 py-2 font-display uppercase tracking-widest text-foreground hover:bg-muted transition-colors">CANCELAR</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className={`border-4 border-border p-4 bg-card flex flex-col md:flex-row md:justify-between md:items-center gap-3 transition-all overflow-hidden ${!a.isActive ? 'opacity-40 grayscale' : 'hover:border-primary'}`}>
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 border-2 border-border bg-muted overflow-hidden flex-shrink-0">
                {a.imageUrl ? (
                  <img src={a.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Zap size={20} className="m-auto mt-3 text-foreground/20" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-display text-lg uppercase leading-tight italic">{(a.title as any)?.[editLang] || (a.title as any)?.pt}</h4>
                <p className="font-mono text-[10px] opacity-60 truncate max-w-full md:max-w-md">{(a.content as any)?.[editLang] || (a.content as any)?.pt}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <button onClick={() => startEdit(a)} className="p-2 border-2 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => update.mutate({ id: a.id, data: { isActive: !a.isActive } }, {
                  onSuccess: () => toast.success(a.isActive ? "Anúncio desativado." : "Anúncio ativado."),
                  onError: () => toast.error("Erro ao alterar estado.")
                })}
                className={`px-3 py-1 font-mono text-[10px] font-bold border-2 transition-colors ${
                  a.isActive ? 'bg-green-600 text-white border-green-600' : 'bg-muted border-border text-foreground/50'
                }`}
              >
                {a.isActive ? 'ATIVO' : 'INATIVO'}
              </button>
              <button onClick={() => { 
                if(confirm('Excluir este anúncio permanentemente?')) {
                  remove.mutate(a.id, {
                    onSuccess: () => toast.success("Anúncio eliminado."),
                    onError: () => toast.error("Erro ao eliminar anúncio.")
                  });
                }
              }} className="p-2 text-red-600 hover:bg-red-600 hover:text-white border-2 border-transparent hover:border-red-600 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {announcements.length === 0 && <div className="p-12 text-center border-4 border-border border-dashed text-foreground/20 font-mono">NENHUM ANÚNCIO CRIADO</div>}
      </div>
    </div>
  );
}

function AuditionsTab() {
  const { data: applications = [] } = useAdminListRecruitmentApplications();
  const update = useUpdateRecruitmentApplication();
  const remove = useDeleteRecruitmentApplication();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl uppercase">Audições Recebidas</h2>
      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application.id} className="border-4 border-border bg-card p-4 md:p-6 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl uppercase">{application.name}</h3>
                <p className="font-mono text-xs text-foreground/60">
                  {application.instrument || "INSTRUMENTO NÃO INDICADO"} // {format(new Date(application.createdAt), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={application.status}
                  onChange={(e) => {
                    const nextStatus = e.target.value;
                    if (
                      nextStatus === "pending" ||
                      nextStatus === "reviewing" ||
                      nextStatus === "shortlisted" ||
                      nextStatus === "rejected"
                    ) {
                      update.mutate(
                        { id: application.id, status: nextStatus },
                        {
                          onSuccess: () => toast.success("Estado atualizado."),
                          onError: () => toast.error("Erro ao atualizar estado."),
                        },
                      );
                    }
                  }}
                  className="border-2 border-border bg-background p-2 font-mono text-xs uppercase"
                >
                  <option value="pending">PENDING</option>
                  <option value="reviewing">REVIEWING</option>
                  <option value="shortlisted">SHORTLISTED</option>
                  <option value="rejected">REJECTED</option>
                </select>
                <button
                  onClick={() =>
                    confirm("Eliminar candidatura?") &&
                    remove.mutate(application.id, {
                      onSuccess: () => toast.success("Candidatura eliminada."),
                      onError: () => toast.error("Erro ao eliminar candidatura."),
                    })
                  }
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className="font-mono text-sm">Email: {application.email}</p>
            <p className="font-mono text-sm">Telefone: {application.phone}</p>
            <a href={application.mediaUrl} target="_blank" rel="noreferrer" className="inline-block font-mono text-sm text-primary underline break-all">
              {application.mediaUrl}
            </a>
            {application.message && <p className="font-mono text-sm whitespace-pre-wrap">{application.message}</p>}
          </div>
        ))}
        {applications.length === 0 && <div className="p-12 text-center border-4 border-border border-dashed text-foreground/50 font-mono">NENHUMA AUDIÇÃO</div>}
      </div>
    </div>
  );
}

function VaultTab({ editLang }: { editLang: "pt" | "en" }) {
  const { data: assets = [] } = useAdminListVaultAssets();
  const create = useCreateVaultAsset();
  const update = useUpdateVaultAsset();
  const remove = useDeleteVaultAsset();
  const [editingId, setEditingId] = useState<number | null>(null);
  const emptyForm = {
    assetType: "setlist_pdf" as any,
    title: { pt: "", en: "" } as any,
    description: { pt: "", en: "" } as any,
    fileUrl: "",
    previewUrl: "",
    isActive: true,
    sortOrder: 0,
  };
  const [form, setForm] = useState<any>(emptyForm);

  const handleLocalizedChange = (name: string, value: string) => {
    setForm((f: any) => ({
      ...f,
      [name]: {
        ...(f[name] || { pt: "", en: "" }),
        [editLang]: value
      }
    }));
  };

  const resetForm = () => setForm(emptyForm);

  const save = () => {
    if (!form.title || !form.fileUrl) {
      toast.error("Título e URL são obrigatórios.");
      return;
    }
    if (editingId) {
      update.mutate(
        { id: editingId, data: form },
        {
          onSuccess: () => {
            toast.success("Asset atualizado.");
            setEditingId(null);
            resetForm();
          },
          onError: () => toast.error("Erro ao atualizar asset."),
        },
      );
      return;
    }
    create.mutate(form, {
      onSuccess: () => {
        toast.success("Asset criado.");
        resetForm();
      },
      onError: () => toast.error("Erro ao criar asset."),
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl uppercase">Vault Assets</h2>
      <div className="border-4 border-border bg-card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={form.assetType} onChange={(e) => setForm({ ...form, assetType: e.target.value as VaultAssetInput["assetType"] })} className="border-2 border-border bg-background p-2 font-mono">
            <option value="setlist_pdf">SETLIST PDF</option>
            <option value="backstage_photo">BACKSTAGE PHOTO</option>
            <option value="wallpaper">WALLPAPER</option>
          </select>
          <input value={form.title?.[editLang] || ""} onChange={(e) => handleLocalizedChange("title", e.target.value)} placeholder="Título" className="border-2 border-border bg-background p-2 font-mono" />
          <input value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="URL ficheiro" className="border-2 border-border bg-background p-2 font-mono md:col-span-2" />
          <input value={form.previewUrl || ""} onChange={(e) => setForm({ ...form, previewUrl: e.target.value })} placeholder="URL preview (opcional)" className="border-2 border-border bg-background p-2 font-mono md:col-span-2" />
          <textarea value={form.description?.[editLang] || ""} onChange={(e) => handleLocalizedChange("description", e.target.value)} placeholder="Descrição" className="border-2 border-border bg-background p-2 font-mono md:col-span-2 h-20" />
          <input type="number" value={form.sortOrder || 0} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="border-2 border-border bg-background p-2 font-mono" />
          <label className="flex items-center gap-2 font-mono text-sm">
            <input type="checkbox" checked={Boolean(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-5 h-5 accent-primary" />
            Ativo
          </label>
        </div>
        <div className="flex gap-3">
          <button onClick={save} className="bg-primary text-primary-foreground px-6 py-2 font-display uppercase tracking-widest hover:bg-foreground">
            {editingId ? "ATUALIZAR" : "CRIAR"}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); resetForm(); }} className="border-2 border-border px-6 py-2 font-display uppercase tracking-widest hover:bg-muted">
              CANCELAR
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {assets.map((asset) => (
          <div key={asset.id} className="border-4 border-border bg-card p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase text-foreground/60">{asset.assetType} // ordem {asset.sortOrder}</p>
              <h3 className="font-display text-xl uppercase">{(asset.title as any)?.[editLang] || (asset.title as any)?.pt}</h3>
              <a href={asset.fileUrl} target="_blank" rel="noreferrer" className="font-mono text-xs text-primary underline break-all">{asset.fileUrl}</a>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingId(asset.id);
                  setForm({
                    assetType: asset.assetType,
                    title: asset.title as any,
                    description: asset.description as any || { pt: "", en: "" },
                    fileUrl: asset.fileUrl,
                    previewUrl: asset.previewUrl || "",
                    isActive: asset.isActive,
                    sortOrder: asset.sortOrder,
                  });
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() =>
                  confirm("Eliminar asset do vault?") &&
                  remove.mutate(asset.id, {
                    onSuccess: () => toast.success("Asset removido."),
                    onError: () => toast.error("Erro ao remover asset."),
                  })
                }
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {assets.length === 0 && <div className="p-12 text-center border-4 border-border border-dashed text-foreground/50 font-mono">NENHUM ASSET</div>}
      </div>
    </div>
  );
}

function PressKitTab({ editLang }: { editLang: "pt" | "en" }) {
  const { data: pressKit } = useGetPressKit();
  const update = useUpdatePressKit();
  const [form, setForm] = useState<any>({
    bioShort: { pt: "", en: "" } as any,
    technicalRider: { pt: "", en: "" } as any,
    photoUrls: [""],
  });

  const handleLocalizedChange = (name: string, value: string) => {
    setForm((f: any) => ({
      ...f,
      [name]: {
        ...(f[name] || { pt: "", en: "" }),
        [editLang]: value
      }
    }));
  };

  useEffect(() => {
    if (!pressKit) return;
    setForm({
      bioShort: pressKit.bioShort,
      technicalRider: pressKit.technicalRider,
      photoUrls: pressKit.photoUrls.length > 0 ? pressKit.photoUrls : [""],
    });
  }, [pressKit]);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl uppercase">Press Kit</h2>
      <div className="border-4 border-border bg-card p-6 space-y-4">
        <div>
          <label className="block font-mono text-xs uppercase mb-1">Bio Curta</label>
          <textarea value={form.bioShort?.[editLang] || ""} onChange={(e) => handleLocalizedChange("bioShort", e.target.value)} className="w-full border-2 border-border bg-background p-2 font-mono h-24" />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase mb-1">Technical Rider</label>
          <textarea value={form.technicalRider?.[editLang] || ""} onChange={(e) => handleLocalizedChange("technicalRider", e.target.value)} className="w-full border-2 border-border bg-background p-2 font-mono h-48" />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase mb-2">Fotos (uma por campo)</label>
          <div className="space-y-2">
            {form.photoUrls.map((url: string, index: number) => (
              <div key={`photo-${index}`} className="flex gap-2">
                <input
                  value={url}
                  onChange={(e) => {
                    const next = [...form.photoUrls];
                    next[index] = e.target.value;
                    setForm({ ...form, photoUrls: next });
                  }}
                  placeholder={`URL da foto #${index + 1}`}
                  className="flex-1 border-2 border-border bg-background p-2 font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (form.photoUrls.length === 1) {
                      setForm({ ...form, photoUrls: [""] });
                      return;
                    }
                    setForm({
                      ...form,
                      photoUrls: form.photoUrls.filter((_: unknown, i: number) => i !== index),
                    });
                  }}
                  className="px-3 border-2 border-border font-mono text-xs hover:bg-muted"
                >
                  REMOVER
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm({ ...form, photoUrls: [...form.photoUrls, ""] })}
              className="border-2 border-border px-4 py-2 font-mono text-xs hover:bg-muted"
            >
              + ADICIONAR FOTO
            </button>
          </div>
        </div>
        <button
          onClick={() =>
            update.mutate(
              {
                bioShort: form.bioShort,
                technicalRider: form.technicalRider,
                photoUrls: form.photoUrls.map((line: string) => line.trim()).filter(Boolean),
              },
              {
                onSuccess: () => toast.success("Press kit atualizado."),
                onError: () => toast.error("Erro ao atualizar press kit."),
              },
            )
          }
          className="bg-primary text-primary-foreground px-6 py-2 font-display uppercase tracking-widest hover:bg-foreground"
        >
          GUARDAR PRESS KIT
        </button>
      </div>
    </div>
  );
}

function TeamTab({ editLang }: { editLang: "pt" | "en" }) {
  const { data: members = [] } = useListTeamMembers();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();

  const emptyForm = {
    name: "",
    role: { pt: "", en: "" } as any,
    codename: "",
    age: 17,
    bio: { pt: "", en: "" } as any,
    photoUrl: "",
    memberGroup: "contributor" as "band" | "contributor",
  };

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [sourceMode, setSourceMode] = useState<"url" | "file">("url");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSource, setCropSource] = useState("");
  const [cropFileName, setCropFileName] = useState("");
  const [cropScale, setCropScale] = useState(1);
  const [cropPan, setCropPan] = useState({ x: 0, y: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const cropFrameRef = useRef<HTMLDivElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
  const cropDragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSourceMode("url");
    setSelectedFileName("");
  };

  const handleLocalizedChange = (name: string, value: string) => {
    setForm((f: any) => ({
      ...f,
      [name]: {
        ...(f[name] || { pt: "", en: "" }),
        [editLang]: value
      }
    }));
  };

  const clampCropPan = (nextPan: { x: number; y: number }) => {
    const frame = cropFrameRef.current;
    const image = cropImageRef.current;

    if (!frame || !image || !image.naturalWidth || !image.naturalHeight) {
      return nextPan;
    }

    const frameRect = frame.getBoundingClientRect();
    const coverScale = Math.max(frameRect.width / image.naturalWidth, frameRect.height / image.naturalHeight);
    const drawWidth = image.naturalWidth * coverScale * cropScale;
    const drawHeight = image.naturalHeight * coverScale * cropScale;
    const maxPanX = Math.max(0, (drawWidth - frameRect.width) / 2);
    const maxPanY = Math.max(0, (drawHeight - frameRect.height) / 2);

    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, nextPan.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, nextPan.y)),
    };
  };

  const openCropper = (dataUrl: string, fileName: string) => {
    setCropSource(dataUrl);
    setCropFileName(fileName);
    setCropScale(1);
    setCropPan({ x: 0, y: 0 });
    setCropOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFileName(file.name);
      setSourceMode("file");
      openCropper(String(reader.result || ""), file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const exportCroppedImage = async () => {
    const frame = cropFrameRef.current;
    const image = cropImageRef.current;

    if (!frame || !image || !cropSource) {
      return;
    }

    const frameRect = frame.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1250;

    const context = canvas.getContext("2d");
    if (!context) {
      toast.error("Não foi possível preparar o corte da imagem.");
      return;
    }

    const coverScale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const drawWidth = image.naturalWidth * coverScale * cropScale;
    const drawHeight = image.naturalHeight * coverScale * cropScale;
    const scaleRatio = canvas.width / frameRect.width;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.filter = "grayscale(1) contrast(1.15) brightness(0.95)";
    context.drawImage(
      image,
      (canvas.width - drawWidth) / 2 + cropPan.x * scaleRatio,
      (canvas.height - drawHeight) / 2 + cropPan.y * scaleRatio,
      drawWidth,
      drawHeight,
    );

    return canvas.toDataURL("image/png", 0.95);
  };

  const confirmCrop = async () => {
    const cropped = await exportCroppedImage();
    if (!cropped) return;
    setForm((current) => ({ ...current, photoUrl: cropped }));
    setCropOpen(false);
  };

  const handleCropPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingCrop(true);
    cropDragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: cropPan.x,
      panY: cropPan.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCropPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingCrop) return;
    const deltaX = event.clientX - cropDragStartRef.current.x;
    const deltaY = event.clientY - cropDragStartRef.current.y;
    const nextPan = clampCropPan({
      x: cropDragStartRef.current.panX + deltaX,
      y: cropDragStartRef.current.panY + deltaY,
    });
    setCropPan(nextPan);
  };

  const handleCropPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingCrop) return;
    setIsDraggingCrop(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // noop
    }
  };

  const startEdit = (member: (typeof members)[number]) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      role: member.role as any,
      codename: member.codename,
      age: member.age,
      bio: member.bio as any || { pt: "", en: "" },
      photoUrl: member.photoUrl || "",
      memberGroup: member.memberGroup,
    });
    setSourceMode(member.photoUrl ? "url" : "file");
    setSelectedFileName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      role: form.role,
      codename: form.codename,
      age: form.age,
      bio: form.bio,
      photoUrl: form.photoUrl.trim() || null,
      memberGroup: form.memberGroup,
    };

    if (editingId) {
      updateMember.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            toast.success("Membro atualizado.");
            resetForm();
          },
          onError: () => toast.error("Erro ao atualizar membro."),
        },
      );
      return;
    }

    createMember.mutate(
      payload,
      {
        onSuccess: () => {
          toast.success("Membro criado.");
          resetForm();
        },
        onError: () => toast.error("Erro ao criar membro."),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl uppercase">Equipa Blindkiss</h2>
          <p className="font-mono text-sm text-foreground/70">Adicionar, editar e remover membros da página pública.</p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="border-2 border-border px-4 py-2 font-display uppercase tracking-widest hover:bg-muted"
        >
          NOVO MEMBRO
        </button>
      </div>

      <form onSubmit={handleSubmit} className="border-4 border-border bg-card p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs uppercase mb-1">Nome</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border-2 border-border bg-background p-2 font-mono"
              placeholder="Rodrigo Viana"
            />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase mb-1">Idade</label>
            <input
              required
              type="number"
              min={1}
              max={120}
              value={form.age}
              onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
              className="w-full border-2 border-border bg-background p-2 font-mono"
            />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase mb-1">Função</label>
            <input
              required
              value={form.role?.[editLang] || ""}
              onChange={(e) => handleLocalizedChange("role", e.target.value)}
              className="w-full border-2 border-border bg-background p-2 font-mono"
              placeholder="Programador"
            />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase mb-1">Codename</label>
            <input
              required
              value={form.codename}
              onChange={(e) => setForm({ ...form, codename: e.target.value })}
              className="w-full border-2 border-border bg-background p-2 font-mono"
              placeholder="The Architect"
            />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase mb-1">Lista</label>
            <select
              value={form.memberGroup}
              onChange={(e) =>
                setForm({ ...form, memberGroup: e.target.value as "band" | "contributor" })
              }
              className="w-full border-2 border-border bg-background p-2 font-mono uppercase"
            >
              <option value="band">Banda</option>
              <option value="contributor">Contribuidor</option>
            </select>
          </div>
          <div>
            <label className="block font-mono text-xs uppercase mb-1">Foto</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  setSourceMode("url");
                  setSelectedFileName("");
                }}
                className={`px-3 py-1 border-2 font-mono text-xs ${sourceMode === "url" ? "border-primary bg-primary/10" : "border-border"}`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setSourceMode("file")}
                className={`px-3 py-1 border-2 font-mono text-xs ${sourceMode === "file" ? "border-primary bg-primary/10" : "border-border"}`}
              >
                FICHEIRO
              </button>
            </div>
            {sourceMode === "url" ? (
              <input
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                className="w-full border-2 border-border bg-background p-2 font-mono"
                placeholder="https://... ou data:image/..."
              />
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="w-full border-2 border-border bg-background p-2 font-mono text-xs"
                />
                <p className="font-mono text-[10px] text-foreground/60">
                  {selectedFileName ? `Selecionado: ${selectedFileName}` : "Escolhe uma foto local para abrir o recorte."}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs uppercase mb-1">Bio curta</label>
          <textarea
            value={form.bio?.[editLang] || ""}
            onChange={(e) => handleLocalizedChange("bio", e.target.value)}
            className="w-full border-2 border-border bg-background p-2 font-mono h-24"
            placeholder="Descrição criativa do membro"
          />
        </div>

        {form.photoUrl && (
          <div className="border-2 border-dashed border-border p-3 bg-background/40 max-w-xs">
            <img src={form.photoUrl} alt="Pré-visualização membro" className="w-full h-48 object-cover" />
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createMember.isPending || updateMember.isPending}
            className="bg-primary text-primary-foreground px-6 py-3 font-display uppercase tracking-widest hover:bg-foreground disabled:opacity-50"
          >
            {editingId ? "ATUALIZAR" : "CRIAR"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border-2 border-border px-6 py-3 font-display uppercase tracking-widest hover:bg-muted"
            >
              CANCELAR
            </button>
          )}
        </div>
      </form>

      <Dialog open={cropOpen} onOpenChange={(open) => setCropOpen(open)}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl uppercase">Recortar fotografia</DialogTitle>
            <DialogDescription className="font-mono text-xs uppercase tracking-[0.2em]">
              Arrasta a imagem, usa o zoom e escolhe a área que vai aparecer na equipa.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-border bg-muted/20 p-3 font-mono text-xs uppercase text-foreground/70">
              <span>{cropFileName || "Imagem selecionada"}</span>
              <span>grade ativa 4:5</span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <div
                ref={cropFrameRef}
                className="relative aspect-[4/5] w-full overflow-hidden border-4 border-border bg-zinc-950 select-none touch-none"
                onPointerDown={handleCropPointerDown}
                onPointerMove={handleCropPointerMove}
                onPointerUp={handleCropPointerUp}
                onPointerLeave={handleCropPointerUp}
              >
                {cropSource && (
                  <img
                    ref={cropImageRef}
                    src={cropSource}
                    alt="Recorte da equipa"
                    onLoad={() => {
                      setCropPan((current) => clampCropPan(current));
                    }}
                    className="absolute left-1/2 top-1/2 h-full w-full max-w-none cursor-move object-cover"
                    style={{
                      transform: `translate(-50%, -50%) translate(${cropPan.x}px, ${cropPan.y}px) scale(${cropScale})`,
                      transformOrigin: "center center",
                      filter: "grayscale(1) contrast(1.35) brightness(0.92)",
                    }}
                    draggable={false}
                  />
                )}

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0,transparent_calc(33.333%-1px),rgba(255,255,255,0.18)_calc(33.333%-1px),rgba(255,255,255,0.18)_33.333%,transparent_33.333%,transparent_calc(66.666%-1px),rgba(255,255,255,0.18)_calc(66.666%-1px),rgba(255,255,255,0.18)_66.666%,transparent_66.666%,transparent_calc(100%-1px)),linear-gradient(180deg,transparent_0,transparent_calc(33.333%-1px),rgba(255,255,255,0.18)_calc(33.333%-1px),rgba(255,255,255,0.18)_33.333%,transparent_33.333%,transparent_calc(66.666%-1px),rgba(255,255,255,0.18)_calc(66.666%-1px),rgba(255,255,255,0.18)_66.666%,transparent_66.666%,transparent_calc(100%-1px))]" />
                <div className="pointer-events-none absolute inset-0 border border-white/10" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.18)_100%)]" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 border-2 border-white/70" />
              </div>

              <div className="space-y-4 border-2 border-border bg-card p-4">
                <div>
                  <label className="block font-mono text-xs uppercase mb-2">Zoom</label>
                  <input
                    type="range"
                    min="1"
                    max="2.4"
                    step="0.01"
                    value={cropScale}
                    onChange={(e) => {
                      const nextScale = Number(e.target.value);
                      setCropScale(nextScale);
                      setCropPan((current) => clampCropPan(current));
                    }}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 font-mono text-xs text-foreground/70 leading-relaxed">
                  <p>• Arrasta para reposicionar a foto.</p>
                  <p>• O recorte fica guardado na base de dados.</p>
                  <p>• A vista pública usa a imagem já cortada.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCropScale(1);
                    setCropPan({ x: 0, y: 0 });
                  }}
                  className="w-full border-2 border-border px-4 py-2 font-display uppercase tracking-widest hover:bg-muted"
                >
                  CENTRAR
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setCropOpen(false);
                setCropSource("");
              }}
              className="border-2 border-border px-6 py-3 font-display uppercase tracking-widest hover:bg-muted"
            >
              CANCELAR
            </button>
            <button
              type="button"
              onClick={confirmCrop}
              className="bg-primary text-primary-foreground px-6 py-3 font-display uppercase tracking-widest hover:bg-foreground"
            >
              USAR RECORTE
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {members.map((member) => (
          <article key={member.id} className="border-4 border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase text-primary tracking-[0.3em]">{member.codename}</p>
                <h3 className="font-display text-2xl uppercase">{member.name}</h3>
              </div>
              <div
                className={`font-mono text-[10px] uppercase border-2 px-2 py-1 tracking-wider ${
                  member.memberGroup === "band"
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-foreground/80"
                }`}
              >
                {member.memberGroup === "band" ? "banda" : "contrib."}
              </div>
            </div>
            <p className="font-mono text-sm uppercase text-foreground/70">{(member.role as any)?.[editLang] || (member.role as any)?.pt} / {member.age} anos</p>
            {member.photoUrl ? (
              <img src={member.photoUrl} alt={member.name} className="w-full h-56 object-cover border-2 border-border" />
            ) : (
              <div className="w-full h-56 border-2 border-dashed border-border flex items-center justify-center font-mono text-xs text-foreground/50 uppercase">
                Sem fotografia
              </div>
            )}
            <p className="font-mono text-xs leading-relaxed text-foreground/75">{(member.bio as any)?.[editLang] || (member.bio as any)?.pt || "Sem bio configurada."}</p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => startEdit(member)}
                className="flex-1 border-2 border-border px-3 py-2 font-mono text-xs uppercase hover:bg-muted"
              >
                EDITAR
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Eliminar ${member.name}?`)) {
                    deleteMember.mutate(member.id, {
                      onSuccess: () => toast.success("Membro eliminado."),
                      onError: () => toast.error("Erro ao eliminar membro."),
                    });
                  }
                }}
                className="flex-1 border-2 border-red-600 px-3 py-2 font-mono text-xs uppercase text-red-700 hover:bg-red-100"
              >
                REMOVER
              </button>
            </div>
          </article>
        ))}
      </div>

      {members.length === 0 && (
        <div className="p-12 text-center border-4 border-border border-dashed text-foreground/50 font-mono">
          NENHUM MEMBRO REGISTADO
        </div>
      )}
    </div>
  );
}

