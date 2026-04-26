import { useState } from "react";
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
  useListContentBlocks,
  useUpdateContentBlock,
  getListContentBlocksQueryKey,
  useListTracks,
  useCreateTrack,
  useDeleteTrack,
  getListTracksQueryKey,
  getAdminMeQueryKey
} from "@workspace/api-client-react";
import { LogOut, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { format } from "date-fns";

export default function Admin() {
  const qc = useQueryClient();
  const { data: admin, isLoading: adminLoading } = useAdminMe();
  const login = useAdminLogin();
  const logout = useAdminLogout();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"settings" | "events" | "bkid" | "content" | "tracks">("settings");

  if (adminLoading) {
    return <div className="min-h-screen flex items-center justify-center font-mono">LOADING ADMIN...</div>;
  }

  if (!admin?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md border-4 border-border bg-card p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="font-display text-4xl mb-6 uppercase text-center border-b-4 border-border pb-4">
            SYSTEM OVERRIDE
          </h1>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              login.mutate({ data: { username, password } }, {
                onSuccess: () => qc.invalidateQueries({ queryKey: getAdminMeQueryKey() })
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
              {login.isPending ? "AUTHENTICATING..." : "LOGIN"}
            </button>
            <p className="text-center font-mono text-xs text-foreground/50 mt-4">
              [ HINT: admin / blindkiss ]
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b-4 border-border bg-card px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-display text-2xl tracking-widest text-primary">ADMIN CONSOLE</h1>
        <button 
          onClick={() => logout.mutate(undefined, { onSuccess: () => qc.invalidateQueries({ queryKey: getAdminMeQueryKey() }) })}
          className="flex items-center gap-2 font-mono text-sm font-bold hover:text-primary transition-colors"
        >
          <LogOut size={16} /> LOGOUT
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r-4 border-border bg-muted/20 flex flex-col p-4 gap-2">
          {["settings", "events", "bkid", "content", "tracks"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`text-left font-display tracking-widest text-lg px-4 py-3 border-2 border-transparent transition-all uppercase ${
                activeTab === tab 
                  ? "bg-foreground text-background border-foreground translate-x-2 shadow-[4px_4px_0px_0px_rgba(145,8,2,1)]" 
                  : "hover:border-border hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-8 bg-background">
          <div className="max-w-5xl mx-auto">
            {activeTab === "settings" && <SettingsTab />}
            {activeTab === "events" && <EventsTab />}
            {activeTab === "bkid" && <BkidTab />}
            {activeTab === "content" && <ContentTab />}
            {activeTab === "tracks" && <TracksTab />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SettingsTab() {
  const qc = useQueryClient();
  const { data: settings } = useGetSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const [form, setForm] = useState(settings || {} as any);

  if (!settings) return <div>Loading...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({ data: form }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() });
        alert("Settings updated!");
      }
    });
  };

  return (
    <div className="border-4 border-border p-6 bg-card">
      <h2 className="font-display text-3xl mb-6 uppercase border-b-4 border-border pb-2">Global Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 border-2 border-dashed border-border p-4">
            <h3 className="font-mono font-bold uppercase text-primary">Colors</h3>
            
            <div className="flex items-center gap-4">
              <input type="color" name="colorBackground" value={form.colorBackground} onChange={handleChange} className="w-12 h-12" />
              <label className="font-mono text-sm">Background</label>
            </div>
            <div className="flex items-center gap-4">
              <input type="color" name="colorTitle" value={form.colorTitle} onChange={handleChange} className="w-12 h-12" />
              <label className="font-mono text-sm">Titles / Primary</label>
            </div>
            <div className="flex items-center gap-4">
              <input type="color" name="colorText" value={form.colorText} onChange={handleChange} className="w-12 h-12" />
              <label className="font-mono text-sm">Text / Foreground</label>
            </div>
            <div className="flex items-center gap-4">
              <input type="color" name="colorAccent" value={form.colorAccent} onChange={handleChange} className="w-12 h-12" />
              <label className="font-mono text-sm">Accent</label>
            </div>
          </div>

          <div className="space-y-4 border-2 border-dashed border-border p-4">
            <h3 className="font-mono font-bold uppercase text-primary">Effects</h3>
            <label className="flex items-center gap-4 cursor-pointer">
              <input type="checkbox" name="glitchMode" checked={form.glitchMode} onChange={handleChange} className="w-6 h-6 accent-primary" />
              <span className="font-mono font-bold">Enable Glitch Mode</span>
            </label>
          </div>
        </div>

        <div className="space-y-4 border-2 border-dashed border-border p-4">
          <h3 className="font-mono font-bold uppercase text-primary">Text Content</h3>
          
          <div>
            <label className="block font-mono text-sm mb-1">Hero Tagline</label>
            <input type="text" name="heroTagline" value={form.heroTagline} onChange={handleChange} className="w-full border-2 border-border p-2 font-mono bg-background" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-sm mb-1">Recruitment Title</label>
              <input type="text" name="recruitmentTitle" value={form.recruitmentTitle} onChange={handleChange} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
            <div>
              <label className="block font-mono text-sm mb-1">Recruitment Subtitle</label>
              <input type="text" name="recruitmentSubtitle" value={form.recruitmentSubtitle} onChange={handleChange} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
            <div>
              <label className="block font-mono text-sm mb-1">Recruitment Bassist</label>
              <input type="text" name="recruitmentBassist" value={form.recruitmentBassist} onChange={handleChange} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
            <div>
              <label className="block font-mono text-sm mb-1">Recruitment Drummer</label>
              <input type="text" name="recruitmentDrummer" value={form.recruitmentDrummer} onChange={handleChange} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
            <div className="col-span-2">
              <label className="block font-mono text-sm mb-1">Recruitment Contact</label>
              <input type="text" name="recruitmentContact" value={form.recruitmentContact} onChange={handleChange} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-sm mb-1">Footer City</label>
              <input type="text" name="footerCity" value={form.footerCity} onChange={handleChange} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
            <div>
              <label className="block font-mono text-sm mb-1">Footer Coordinates</label>
              <input type="text" name="footerCoords" value={form.footerCoords} onChange={handleChange} className="w-full border-2 border-border p-2 font-mono bg-background" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={updateSettings.isPending} className="py-3 px-8 bg-primary text-primary-foreground font-display text-xl uppercase hover:bg-foreground transition-colors border-2 border-primary">
          {updateSettings.isPending ? "SAVING..." : "SAVE SETTINGS"}
        </button>
      </form>
    </div>
  );
}

function EventsTab() {
  const qc = useQueryClient();
  const { data: events = [] } = useListEvents({ status: "all" }, { query: { queryKey: getListEventsQueryKey({status:"all"}) }});
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [form, setForm] = useState({
    title: "", venue: "", city: "", address: "", mapsUrl: "", ticketUrl: "", price: "", eventDate: new Date().toISOString().slice(0, 16), posterUrl: "", description: "", forcePast: false
  });

  const resetForm = () => setForm({ title: "", venue: "", city: "", address: "", mapsUrl: "", ticketUrl: "", price: "", eventDate: new Date().toISOString().slice(0, 16), posterUrl: "", description: "", forcePast: false });

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
        }
      });
    } else {
      createEvent.mutate({ data: payload }, {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListEventsQueryKey() });
          setIsAdding(false);
          resetForm();
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-3xl uppercase">Gigs / Events</h2>
        {!isAdding && !editingId && (
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 font-mono font-bold border-2 border-primary hover:bg-background hover:text-primary transition-colors">
            <Plus size={16} /> ADD EVENT
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="border-4 border-border bg-card p-6">
          <h3 className="font-display text-xl mb-4">{editingId ? "EDIT EVENT" : "NEW EVENT"}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
             <input placeholder="Title *" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <input type="datetime-local" value={form.eventDate} onChange={e=>setForm({...form, eventDate: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <input placeholder="Venue *" value={form.venue} onChange={e=>setForm({...form, venue: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <input placeholder="City *" value={form.city} onChange={e=>setForm({...form, city: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <input placeholder="Address *" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} className="border-2 border-border p-2 font-mono bg-background col-span-2" />
             <input placeholder="Price (e.g. 10€)" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <input placeholder="Poster URL" value={form.posterUrl} onChange={e=>setForm({...form, posterUrl: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <input placeholder="Ticket URL" value={form.ticketUrl} onChange={e=>setForm({...form, ticketUrl: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <input placeholder="Maps URL" value={form.mapsUrl} onChange={e=>setForm({...form, mapsUrl: e.target.value})} className="border-2 border-border p-2 font-mono bg-background" />
             <label className="flex items-center gap-2 col-span-2">
               <input type="checkbox" checked={form.forcePast} onChange={e=>setForm({...form, forcePast: e.target.checked})} className="w-5 h-5 accent-primary" />
               <span className="font-mono text-sm font-bold">Force Past Status (Hide from Upcoming)</span>
             </label>
          </div>
          <div className="flex gap-4">
            <button onClick={handleSave} className="bg-foreground text-background px-6 py-2 font-display uppercase tracking-widest hover:bg-primary transition-colors">SAVE</button>
            <button onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} className="border-2 border-border px-6 py-2 font-display uppercase tracking-widest hover:bg-muted transition-colors">CANCEL</button>
          </div>
        </div>
      )}

      <div className="border-4 border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b-4 border-border font-mono text-sm">
              <th className="p-3">Date</th>
              <th className="p-3">Title</th>
              <th className="p-3">Venue</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {events.map((e) => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="p-3">{format(new Date(e.eventDate), "dd MMM yyyy")}</td>
                <td className="p-3 font-bold">{e.title}</td>
                <td className="p-3">{e.venue}, {e.city}</td>
                <td className="p-3">
                  {e.isPast || e.forcePast ? <span className="text-foreground/50">PAST</span> : <span className="text-primary font-bold">UPCOMING</span>}
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => { 
                    setEditingId(e.id); 
                    setForm({ title: e.title, venue: e.venue, city: e.city, address: e.address, mapsUrl: e.mapsUrl || "", ticketUrl: e.ticketUrl || "", price: e.price || "", eventDate: e.eventDate.slice(0,16), posterUrl: e.posterUrl || "", description: e.description || "", forcePast: e.forcePast });
                  }} className="text-blue-600 hover:text-blue-800"><Edit2 size={18}/></button>
                  <button onClick={() => {
                    if (confirm("Delete this event?")) {
                      deleteEvent.mutate({ id: e.id }, { onSuccess: () => qc.invalidateQueries({ queryKey: getListEventsQueryKey() }) });
                    }
                  }} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-foreground/50">NO EVENTS</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BkidTab() {
  const { data: members = [] } = useListBkidMembers();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl uppercase">BK-ID Members</h2>
      <div className="border-4 border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b-4 border-border font-mono text-sm">
              <th className="p-3">Serial</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Enlisted</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {members.map((m) => (
              <tr key={m.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="p-3 font-bold text-primary">{m.serial}</td>
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.email || "-"}</td>
                <td className="p-3">{format(new Date(m.createdAt), "dd/MM/yyyy HH:mm")}</td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-foreground/50">NO REGISTRIES</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContentTab() {
  const qc = useQueryClient();
  const { data: blocks = [] } = useListContentBlocks();
  const updateBlock = useUpdateContentBlock();

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", body: "", imageUrl: "" });

  const handleSave = (key: string) => {
    updateBlock.mutate({ key, data: form }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListContentBlocksQueryKey() });
        setEditingKey(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl uppercase">Content Blocks</h2>
      
      <div className="space-y-6">
        {blocks.map((block) => (
          <div key={block.id} className="border-4 border-border bg-card p-6 relative">
            <div className="absolute top-0 right-0 bg-border text-background px-3 py-1 font-mono text-xs font-bold uppercase">
              KEY: {block.key}
            </div>
            
            {editingKey === block.key ? (
              <div className="space-y-4 mt-6">
                <input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full border-2 border-border p-2 font-display text-2xl bg-background" placeholder="Title" />
                <textarea value={form.body} onChange={e=>setForm({...form, body: e.target.value})} className="w-full border-2 border-border p-2 font-mono h-32 bg-background" placeholder="Body content..." />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(block.key)} className="bg-primary text-primary-foreground px-4 py-2 font-mono font-bold hover:bg-foreground"><Check size={18}/></button>
                  <button onClick={() => setEditingKey(null)} className="border-2 border-border px-4 py-2 hover:bg-muted"><X size={18}/></button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <h3 className="font-display text-2xl mb-2">{block.title || "[NO TITLE]"}</h3>
                <p className="font-mono text-foreground/80 whitespace-pre-wrap mb-4 line-clamp-3">{block.body}</p>
                <button 
                  onClick={() => { setEditingKey(block.key); setForm({ title: block.title||"", body: block.body||"", imageUrl: block.imageUrl||"" }); }}
                  className="flex items-center gap-2 border-2 border-border px-4 py-2 font-mono text-sm hover:bg-muted"
                >
                  <Edit2 size={14}/> EDIT
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

  const [form, setForm] = useState({ title: "", artist: "BLINDKISS", url: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url) return;
    createTrack.mutate({ data: { ...form, durationSec: null } }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListTracksQueryKey() });
        setForm({ title: "", artist: "BLINDKISS", url: "" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl uppercase">Cassette Tracks</h2>
      
      <form onSubmit={handleAdd} className="border-4 border-border bg-card p-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block font-mono text-xs uppercase mb-1">Track Title</label>
          <input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full border-2 border-border p-2 font-mono bg-background" />
        </div>
        <div className="flex-1">
          <label className="block font-mono text-xs uppercase mb-1">Artist</label>
          <input value={form.artist} onChange={e=>setForm({...form, artist: e.target.value})} className="w-full border-2 border-border p-2 font-mono bg-background" />
        </div>
        <div className="flex-[2]">
          <label className="block font-mono text-xs uppercase mb-1">Audio URL (.mp3)</label>
          <input required value={form.url} onChange={e=>setForm({...form, url: e.target.value})} className="w-full border-2 border-border p-2 font-mono bg-background" />
        </div>
        <button type="submit" disabled={createTrack.isPending} className="bg-primary text-primary-foreground px-6 py-2.5 border-2 border-primary font-display tracking-widest hover:bg-foreground">
          ADD
        </button>
      </form>

      <div className="border-4 border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b-4 border-border font-mono text-sm">
              <th className="p-3">Order</th>
              <th className="p-3">Title</th>
              <th className="p-3">Artist</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {tracks.map((t, idx) => (
              <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="p-3 text-foreground/50">{idx + 1}</td>
                <td className="p-3 font-bold">{t.title}</td>
                <td className="p-3">{t.artist}</td>
                <td className="p-3">
                  <button onClick={() => {
                    if(confirm("Delete track?")) deleteTrack.mutate({ id: t.id }, { onSuccess: () => qc.invalidateQueries({ queryKey: getListTracksQueryKey() }) });
                  }} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {tracks.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-foreground/50">NO TRACKS LOADED</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
