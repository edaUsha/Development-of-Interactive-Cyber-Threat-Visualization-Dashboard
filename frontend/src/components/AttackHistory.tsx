import { useState, useMemo } from "react";
import { History, Database, ChevronDown, Clock, Globe, Shield, MapPin } from "lucide-react";
import type { ThreatData } from "@/data/mockThreats";

interface AttackHistoryProps {
  threats: ThreatData[];
}

const DB_OPTIONS = [
  { value: "postgresql", label: "PostgreSQL", icon: "🐘" },
  { value: "mongodb", label: "MongoDB", icon: "🍃" },
  { value: "aws", label: "AWS DynamoDB", icon: "☁️" },
];

const AttackHistory = ({ threats }: AttackHistoryProps) => {
  const [selectedDb, setSelectedDb] = useState("postgresql");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentDb = DB_OPTIONS.find((db) => db.value === selectedDb)!;

  // Group threats by date for history view
  const historyGroups = useMemo(() => {
    const groups: Record<string, ThreatData[]> = {};
    threats.slice(0, 40).forEach((t) => {
      const date = new Date(t.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(t);
    });
    return Object.entries(groups);
  }, [threats]);

  const severityColor: Record<string, string> = {
    critical: "bg-destructive/20 text-destructive border-destructive/30",
    high: "bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30",
    medium: "bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30",
    low: "bg-cyber-green/10 text-cyber-green border-cyber-green/30",
  };

  return (
    <div className="cyber-card p-4">
      {/* Header with DB selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Attack History</h2>
        </div>

        {/* Database dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="cyber-btn text-xs px-3 py-1.5 flex items-center gap-2"
          >
            <Database className="w-3.5 h-3.5 text-primary" />
            <span>{currentDb.icon} {currentDb.label}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-border bg-popover shadow-xl">
              <div className="p-1">
                {DB_OPTIONS.map((db) => (
                  <button
                    key={db.value}
                    onClick={() => {
                      setSelectedDb(db.value);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors ${
                      selectedDb === db.value
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{db.icon}</span>
                    <span>{db.label}</span>
                    {selectedDb === db.value && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-border px-3 py-2">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <div className="pulse-dot online" style={{ width: 6, height: 6 }} />
                  <span>Connected to {currentDb.label}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connection status bar */}
      <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-lg bg-muted/50 border border-border text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="pulse-dot online" style={{ width: 6, height: 6 }} />
          <span className="text-cyber-green font-medium">Connected</span>
        </div>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">Source: <span className="text-foreground font-mono">{currentDb.label}</span></span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{threats.length} records</span>
      </div>

      {/* Timeline history */}
      <div className="space-y-4 max-h-[320px] overflow-y-auto scrollbar-cyber pr-1">
        {historyGroups.map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{date}</span>
              <span className="text-[10px] text-muted-foreground">({items.length} events)</span>
            </div>

            <div className="space-y-1.5 ml-1 border-l border-border/50 pl-3">
              {items.slice(0, 8).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/30 transition-colors group"
                >
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    t.severity === "critical" ? "bg-destructive" :
                    t.severity === "high" ? "bg-cyber-yellow" :
                    t.severity === "medium" ? "bg-cyber-yellow" : "bg-cyber-green"
                  }`} />

                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="text-[11px] font-medium text-foreground truncate">{t.attackType}</span>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${severityColor[t.severity]}`}>
                      {t.severity}
                    </span>
                  </div>

                  <div className="hidden group-hover:flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Globe className="w-3 h-3" />
                    <span>{t.country}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground shrink-0">
                    <span className="font-mono">{t.attackerIp.split(".").slice(0, 2).join(".")}.*</span>
                    <Shield className="w-3 h-3" />
                    <span className="font-mono">:{t.port}</span>
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${t.attackerCoords[0]},${t.attackerCoords[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden group-hover:inline-flex items-center gap-0.5 text-primary hover:text-primary/80 transition-colors shrink-0"
                    title="View on Google Maps"
                  >
                    <MapPin className="w-3 h-3" />
                  </a>

                  <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                    {new Date(t.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttackHistory;
