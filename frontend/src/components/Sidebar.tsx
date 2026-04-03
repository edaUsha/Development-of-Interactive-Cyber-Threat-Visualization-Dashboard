import { useState } from "react";
import {
  Upload, Radio, Globe, ScanLine, QrCode, BarChart3, Settings,
  Key, Brain, ShieldCheck, Radar, ChevronRight, Search,
  Shield, Bug, Globe2, MonitorCheck, HardDrive, Bot,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toolCategories } from "@/data/securityTools";

const panelItems = [
  { id: "upload", label: "Static Data", icon: Upload, path: "/upload" },
  { id: "api", label: "Live API", icon: Radio, path: "/live-api" },
  { id: "rest-api", label: "REST API", icon: Globe, path: "/rest-api" },
  { id: "image-scan", label: "Image Scan", icon: ScanLine, path: "/image-scan" },
  { id: "barcode", label: "Barcode", icon: QrCode, path: "/barcode" },
  { id: "nmap", label: "Nmap", icon: Radar, path: "/nmap" },
  { id: "stats", label: "Statistics", icon: BarChart3, path: "/stats" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

const pageItems = [
  { label: "API Keys", icon: Key, path: "/api-keys" },
  { label: "AI Summary", icon: Brain, path: "/ai-summary" },
  { label: "AI Recs", icon: ShieldCheck, path: "/ai-recommendations" },
];

const categoryIcons: Record<string, React.ElementType> = {
  "vuln-assessment": Shield,
  "pentest": Bug,
  "web-security": Globe2,
  "siem": MonitorCheck,
  "forensics": HardDrive,
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCategories = searchQuery.trim()
    ? toolCategories
        .map((cat) => ({
          ...cat,
          tools: cat.tools.filter(
            (t) =>
              t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.description.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((cat) => cat.tools.length > 0)
    : toolCategories;

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-[200px] flex flex-col py-2 overflow-y-auto overflow-x-hidden scrollbar-cyber shrink-0" style={{ background: 'rgba(26, 15, 60, 0.9)', backdropFilter: 'blur(16px)', borderRight: '1px solid #4c1d9530' }}>
      {/* Search */}
      <div className="px-3 mb-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#c4b5fd' }} />
          <input
            type="text"
            placeholder="Search tools…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md text-xs py-1.5 pl-7 pr-2 focus:outline-none focus:ring-1"
            style={{ background: '#2d1b6930', border: '1px solid #4c1d9540', color: '#f5f3ff' }}
          />
        </div>
      </div>

      {/* IP Agent button */}
      <div className="px-2 mb-1">
        <button
          onClick={() => navigate("/ip-agent")}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all"
          style={isActive("/ip-agent")
            ? { background: '#7c3aed25', borderLeft: '3px solid #a78bfa', color: '#f5f3ff' }
            : { color: '#e9d5ff' }
          }
          onMouseEnter={(e) => { if (!isActive("/ip-agent")) e.currentTarget.style.background = '#2d1b6930'; }}
          onMouseLeave={(e) => { if (!isActive("/ip-agent")) e.currentTarget.style.background = ''; }}
        >
          <Bot className="w-4 h-4 shrink-0" />
          <span>IP Agent</span>
          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: '#4c1d9540', color: '#e9d5ff' }}>AI</span>
        </button>
      </div>

      <div className="h-px mx-3 my-1" style={{ background: '#4c1d9540' }} />

      {/* Section label */}
      <div className="px-3 py-1">
        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: '#a78bfa' }}>Core Tools</span>
      </div>

      {/* Core tools */}
      {panelItems.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className="mx-2 flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-all"
          style={isActive(item.path)
            ? { background: '#7c3aed25', borderLeft: '3px solid #a78bfa', color: '#f5f3ff' }
            : { color: '#e9d5ff' }
          }
          onMouseEnter={(e) => { if (!isActive(item.path)) e.currentTarget.style.background = '#2d1b6930'; }}
          onMouseLeave={(e) => { if (!isActive(item.path)) e.currentTarget.style.background = ''; }}
        >
          <item.icon className="w-3.5 h-3.5 shrink-0" />
          <span>{item.label}</span>
        </button>
      ))}

      <div className="h-px mx-3 my-1" style={{ background: '#4c1d9540' }} />

      {/* Section label */}
      <div className="px-3 py-1">
        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: '#a78bfa' }}>Pages</span>
      </div>

      {/* Page navigation */}
      {pageItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="mx-2 flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-all"
          style={isActive(item.path)
            ? { background: '#7c3aed25', borderLeft: '3px solid #a78bfa', color: '#f5f3ff' }
            : { color: '#e9d5ff' }
          }
          onMouseEnter={(e) => { if (!isActive(item.path)) e.currentTarget.style.background = '#2d1b6930'; }}
          onMouseLeave={(e) => { if (!isActive(item.path)) e.currentTarget.style.background = ''; }}
        >
          <item.icon className="w-3.5 h-3.5 shrink-0" />
          <span>{item.label}</span>
        </button>
      ))}

      <div className="h-px mx-3 my-1" style={{ background: '#4c1d9540' }} />

      {/* Section label */}
      <div className="px-3 py-1">
        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: '#a78bfa' }}>Security Tools</span>
      </div>

      {/* Security tool categories */}
      {filteredCategories.map((cat) => {
        const CatIcon = categoryIcons[cat.id] || Shield;
        const isExpanded = expandedCategories[cat.id] || !!searchQuery.trim();

        return (
          <div key={cat.id}>
            <button
              onClick={() => toggleCategory(cat.id)}
              className="mx-2 flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs w-[calc(100%-16px)] transition-all"
              style={{ color: '#e9d5ff' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#2d1b6930'; e.currentTarget.style.color = '#f5f3ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#e9d5ff'; }}
            >
              <CatIcon className="w-3.5 h-3.5 shrink-0 text-primary/70" />
              <span className="flex-1 text-left">{cat.label}</span>
              <ChevronRight
                className={`w-3 h-3 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
              />
            </button>

            {isExpanded && (
              <div className="flex flex-col gap-0.5 ml-4 mr-2 mb-1">
                {cat.tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => navigate(`/tool/${tool.id}`)}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-[11px] rounded-md transition-colors"
                    style={isActive(`/tool/${tool.id}`)
                      ? { background: '#7c3aed25', color: '#f5f3ff' }
                      : { color: '#e9d5ff' }
                    }
                    onMouseEnter={(e) => { if (!isActive(`/tool/${tool.id}`)) { e.currentTarget.style.background = '#2d1b6930'; e.currentTarget.style.color = '#f5f3ff'; } }}
                    onMouseLeave={(e) => { if (!isActive(`/tool/${tool.id}`)) { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#e9d5ff'; } }}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        tool.status === "ready" ? "bg-cyber-green" : "bg-muted-foreground/40"
                      }`}
                    />
                    <span>{tool.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
};

export default Sidebar;
