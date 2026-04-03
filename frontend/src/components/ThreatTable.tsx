import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, MapPin } from "lucide-react";
import type { ThreatData } from "@/data/mockThreats";

interface ThreatTableProps {
  threats: ThreatData[];
}

const ThreatTable = ({ threats }: ThreatTableProps) => {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<'timestamp' | 'severity'>('timestamp');

  const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  const filtered = useMemo(() => {
    let result = threats;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.attackerIp.includes(q) || t.targetIp.includes(q) ||
        t.attackType.toLowerCase().includes(q) || t.country.toLowerCase().includes(q)
      );
    }
    if (severityFilter !== 'all') {
      result = result.filter(t => t.severity === severityFilter);
    }
    return [...result].sort((a, b) => {
      if (sortBy === 'severity') return severityOrder[a.severity] - severityOrder[b.severity];
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [threats, search, severityFilter, sortBy]);

  return (
    <div className="cyber-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Threat Intelligence Feed</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search threats..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 w-48"
            />
          </div>
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-2 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/40"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={() => setSortBy(sortBy === 'timestamp' ? 'severity' : 'timestamp')}
            className="cyber-btn text-xs px-2 py-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-cyber">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-2 px-2 font-medium">Attacker IP</th>
              <th className="text-left py-2 px-2 font-medium">Target IP</th>
              <th className="text-left py-2 px-2 font-medium">Port</th>
              <th className="text-left py-2 px-2 font-medium">Type</th>
              <th className="text-left py-2 px-2 font-medium">Device</th>
              <th className="text-left py-2 px-2 font-medium">Country</th>
              <th className="text-left py-2 px-2 font-medium">Location</th>
              <th className="text-left py-2 px-2 font-medium">Severity</th>
              <th className="text-left py-2 px-2 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 15).map((t) => (
              <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-2 px-2 font-mono text-destructive">{t.attackerIp}</td>
                <td className="py-2 px-2 font-mono text-primary">{t.targetIp}</td>
                <td className="py-2 px-2 font-mono">{t.port}</td>
                <td className="py-2 px-2">{t.attackType}</td>
                <td className="py-2 px-2 text-muted-foreground">{t.device}</td>
                <td className="py-2 px-2">{t.country}</td>
                <td className="py-2 px-2">
                  <a
                    href={`https://www.google.com/maps?q=${t.attackerCoords[0]},${t.attackerCoords[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                    title="View on Google Maps"
                  >
                    <MapPin className="w-3 h-3" />
                    <span className="font-mono text-[10px]">{t.attackerCoords[0].toFixed(1)}, {t.attackerCoords[1].toFixed(1)}</span>
                  </a>
                </td>
                <td className="py-2 px-2">
                  <span className={`severity-${t.severity} font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-muted`}>
                    {t.severity}
                  </span>
                </td>
                <td className="py-2 px-2 text-muted-foreground font-mono">{new Date(t.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground">
        Showing {Math.min(15, filtered.length)} of {filtered.length} threats
      </div>
    </div>
  );
};

export default ThreatTable;
