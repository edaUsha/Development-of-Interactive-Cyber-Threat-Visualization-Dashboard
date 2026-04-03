import { motion } from "framer-motion";
import { AlertTriangle, Shield, Activity, Globe } from "lucide-react";
import type { ThreatData } from "@/data/mockThreats";

interface StatsBarProps {
  threats: ThreatData[];
}

const StatsBar = ({ threats }: StatsBarProps) => {
  const criticalCount = threats.filter(t => t.severity === 'critical').length;
  const highCount = threats.filter(t => t.severity === 'high').length;
  const uniqueCountries = new Set(threats.map(t => t.country)).size;
  const uniqueTypes = new Set(threats.map(t => t.attackType)).size;

  const stats = [
    { label: 'Total Threats', value: threats.length, icon: Activity, color: 'text-primary' },
    { label: 'Critical', value: criticalCount, icon: AlertTriangle, color: 'text-destructive' },
    { label: 'High Risk', value: highCount, icon: Shield, color: 'text-cyber-yellow' },
    { label: 'Countries', value: uniqueCountries, icon: Globe, color: 'text-secondary' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="cyber-card p-3 flex items-center gap-3"
        >
          <div className={`${stat.color} p-2 rounded-lg bg-muted`}>
            <stat.icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground font-mono">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
