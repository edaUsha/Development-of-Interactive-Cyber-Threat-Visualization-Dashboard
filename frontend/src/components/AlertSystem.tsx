import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X, Shield, Volume2, VolumeX } from "lucide-react";
import type { ThreatData } from "@/data/mockThreats";
import { playAlertSound } from "@/lib/alertSound";

interface ThreatAlert {
  threat: ThreatData;
  id: string;
  dismissedAt?: number;
}

interface AlertSystemProps {
  threats: ThreatData[];
}

const severityConfig = {
  critical: { bg: 'bg-destructive/15', border: 'border-destructive/50', icon: AlertTriangle, label: 'CRITICAL ALERT', color: 'text-destructive', dotBg: 'bg-destructive/20' },
  high: { bg: 'bg-destructive/10', border: 'border-destructive/40', icon: Shield, label: 'HIGH RISK', color: 'text-destructive', dotBg: 'bg-destructive/15' },
  medium: { bg: 'bg-cyber-yellow/10', border: 'border-cyber-yellow/40', icon: Shield, label: 'MEDIUM RISK', color: 'text-cyber-yellow', dotBg: 'bg-cyber-yellow/15' },
  low: { bg: 'bg-cyber-green/10', border: 'border-cyber-green/40', icon: Shield, label: 'LOW RISK', color: 'text-cyber-green', dotBg: 'bg-cyber-green/15' },
};

const AlertSystem = ({ threats }: AlertSystemProps) => {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  // Watch for new critical/high threats
  useEffect(() => {
    if (threats.length === 0) return;
    const latest = threats[0];
    if (seenIds.has(latest.id)) return;
    if (!severityConfig[latest.severity as keyof typeof severityConfig]) {
      setSeenIds(prev => new Set(prev).add(latest.id));
      return;
    }

    setSeenIds(prev => new Set(prev).add(latest.id));
    setAlerts(prev => [{ threat: latest, id: latest.id }, ...prev].slice(0, 5));

    if (soundEnabled) {
      playAlertSound(latest.severity);
    }
  }, [threats, seenIds, soundEnabled]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (alerts.length === 0) return;
    const timer = setTimeout(() => {
      setAlerts(prev => prev.slice(0, -1));
    }, 8000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const dismiss = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  return (
    <>
      {/* Sound toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed top-[18px] right-4 z-[60] cyber-btn text-xs px-2 py-1.5"
        title={soundEnabled ? 'Mute alerts' : 'Enable alert sounds'}
      >
        {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-primary" /> : <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>

      {/* Alert popups */}
      <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 w-[340px]">
        <AnimatePresence>
          {alerts.map((alert) => {
            const config = severityConfig[alert.threat.severity as keyof typeof severityConfig];
            if (!config) return null;
            const Icon = config.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={`${config.bg} ${config.border} border rounded-xl p-3 backdrop-blur-lg shadow-2xl`}
              >
                <div className="flex items-start gap-2">
                  <div className={`p-1.5 rounded-lg ${config.dotBg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold tracking-wider uppercase ${config.color}`}>
                        {config.label}
                      </span>
                      <button onClick={() => dismiss(alert.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-foreground font-medium">{alert.threat.attackType} detected</p>
                    <div className="mt-1.5 space-y-0.5 text-[10px] font-mono text-muted-foreground">
                      <div className="flex justify-between">
                        <span>From: <span className="text-destructive">{alert.threat.attackerIp}</span></span>
                        <span>{alert.threat.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>To: <span className="text-primary">{alert.threat.targetIp}</span></span>
                        <span>Port {alert.threat.port}</span>
                      </div>
                    </div>
                    {/* Countdown bar */}
                    <div className="mt-2 h-0.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 8, ease: 'linear' }}
                        className={`h-full rounded-full ${
                          alert.threat.severity === 'critical' || alert.threat.severity === 'high'
                            ? 'bg-destructive'
                            : alert.threat.severity === 'medium'
                            ? 'bg-cyber-yellow'
                            : 'bg-cyber-green'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AlertSystem;
