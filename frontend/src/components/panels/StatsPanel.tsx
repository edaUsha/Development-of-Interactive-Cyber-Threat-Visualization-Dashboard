import { BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { ThreatData } from "@/data/mockThreats";

interface StatsPanelProps {
  threats: ThreatData[];
}

const COLORS = ['hsl(0,72%,55%)', 'hsl(20,80%,55%)', 'hsl(45,93%,58%)', 'hsl(142,70%,45%)'];

const StatsPanel = ({ threats }: StatsPanelProps) => {
  const severityData = [
    { name: 'Critical', value: threats.filter(t => t.severity === 'critical').length },
    { name: 'High', value: threats.filter(t => t.severity === 'high').length },
    { name: 'Medium', value: threats.filter(t => t.severity === 'medium').length },
    { name: 'Low', value: threats.filter(t => t.severity === 'low').length },
  ];

  const topCountries = Object.entries(
    threats.reduce((acc, t) => { acc[t.country] = (acc[t.country] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-primary" />
        Quick Stats
      </h3>

      <div className="cyber-card p-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Severity Distribution</p>
        <ResponsiveContainer width="100%" height={100}>
          <PieChart>
            <Pie data={severityData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={3} dataKey="value">
              {severityData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-3 text-[10px]">
          {severityData.map((s, i) => (
            <span key={s.name} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              {s.name}: {s.value}
            </span>
          ))}
        </div>
      </div>

      <div className="cyber-card p-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Top Attack Origins</p>
        <div className="space-y-1.5">
          {topCountries.map(([country, count]) => (
            <div key={country} className="flex items-center justify-between text-xs">
              <span>{country}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(count / threats.length) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-muted-foreground w-6 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
