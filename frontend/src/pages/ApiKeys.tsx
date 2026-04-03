import { useState, useEffect } from "react";
import { Key, Plus, Trash2, Eye, EyeOff, Power, PowerOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key_value: string;
  service: string;
  is_active: boolean;
  created_at: string;
}

const SERVICES = ["VirusTotal", "AbuseIPDB", "Shodan", "AlienVault OTX", "IBM X-Force", "Custom"];

const ApiKeys = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [service, setService] = useState("Custom");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const fetchKeys = async () => {
    const { data, error } = await supabase.from("api_keys").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load API keys"); return; }
    setKeys(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchKeys(); }, []);

  const addKey = async () => {
    if (!name || !keyValue) { toast.error("Name and key are required"); return; }
    const { error } = await supabase.from("api_keys").insert({ name, key_value: keyValue, service });
    if (error) { toast.error("Failed to add key"); return; }
    toast.success("API key added");
    setName(""); setKeyValue(""); setService("Custom"); setShowForm(false);
    fetchKeys();
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("api_keys").update({ is_active: !current }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    fetchKeys();
  };

  const deleteKey = async (id: string) => {
    const { error } = await supabase.from("api_keys").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("API key deleted");
    fetchKeys();
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const maskKey = (key: string) => key.slice(0, 8) + "•".repeat(Math.max(0, key.length - 12)) + key.slice(-4);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            API Key <span className="text-primary">Management</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage API keys for threat intelligence feeds and integrations.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="cyber-btn text-xs px-4 py-2">
          <Plus className="w-4 h-4" /> Add Key
        </button>
      </div>

      {showForm && (
        <div className="cyber-card p-4 space-y-3 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="My API Key"
                className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Service</label>
              <select value={service} onChange={e => setService(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/40">
                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">API Key</label>
              <input value={keyValue} onChange={e => setKeyValue(e.target.value)} placeholder="sk-..." type="password"
                className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 font-mono" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="cyber-btn text-xs px-3 py-1.5">Cancel</button>
            <button onClick={addKey} className="cyber-btn active text-xs px-4 py-1.5">Save Key</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center text-muted-foreground text-sm py-12">Loading...</div>
      ) : keys.length === 0 ? (
        <div className="cyber-card p-12 text-center">
          <Key className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No API keys configured yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {keys.map(k => (
            <div key={k.id} className="cyber-card p-4 flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${k.is_active ? "bg-cyber-green" : "bg-destructive"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{k.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{k.service}</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  {visibleKeys.has(k.id) ? k.key_value : maskKey(k.key_value)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleVisibility(k.id)} className="cyber-btn text-xs p-2" title="Toggle visibility">
                  {visibleKeys.has(k.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => toggleActive(k.id, k.is_active)} className="cyber-btn text-xs p-2" title="Toggle active">
                  {k.is_active ? <Power className="w-3.5 h-3.5 text-cyber-green" /> : <PowerOff className="w-3.5 h-3.5 text-destructive" />}
                </button>
                <button onClick={() => deleteKey(k.id)} className="cyber-btn text-xs p-2" title="Delete">
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiKeys;
