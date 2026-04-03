import { useState, useRef, useEffect } from "react";
import { Radar, Play, Square, Trash2 } from "lucide-react";

interface ScanResult {
  port: number;
  state: "open" | "closed" | "filtered";
  service: string;
  version?: string;
}

interface HostResult {
  host: string;
  status: "up" | "down";
  latency: string;
  ports: ScanResult[];
  os?: string;
  timestamp: string;
}

const COMMON_SERVICES: Record<number, { service: string; version: string }> = {
  21: { service: "ftp", version: "vsftpd 3.0.5" },
  22: { service: "ssh", version: "OpenSSH 8.9p1" },
  23: { service: "telnet", version: "" },
  25: { service: "smtp", version: "Postfix smtpd" },
  53: { service: "dns", version: "BIND 9.18.1" },
  80: { service: "http", version: "Apache/2.4.52" },
  110: { service: "pop3", version: "Dovecot" },
  143: { service: "imap", version: "Dovecot" },
  443: { service: "https", version: "nginx/1.22.0" },
  445: { service: "microsoft-ds", version: "Samba 4.15" },
  993: { service: "imaps", version: "Dovecot" },
  995: { service: "pop3s", version: "Dovecot" },
  1433: { service: "ms-sql-s", version: "SQL Server 2019" },
  3306: { service: "mysql", version: "MySQL 8.0.32" },
  3389: { service: "ms-wbt-server", version: "RDP" },
  5432: { service: "postgresql", version: "PostgreSQL 15.2" },
  5900: { service: "vnc", version: "VNC 5.0" },
  6379: { service: "redis", version: "Redis 7.0.8" },
  8080: { service: "http-proxy", version: "Jetty 11.0" },
  8443: { service: "https-alt", version: "Tomcat/10.1" },
  27017: { service: "mongodb", version: "MongoDB 6.0.4" },
};

const SCAN_TYPES = [
  { id: "quick", label: "Quick Scan", desc: "Top 100 ports" },
  { id: "full", label: "Full Scan", desc: "All 65535 ports" },
  { id: "stealth", label: "SYN Stealth", desc: "Half-open scan" },
  { id: "service", label: "Service Detect", desc: "Version detection" },
];

const OS_GUESSES = [
  "Linux 5.15 (Ubuntu 22.04)",
  "Windows Server 2022",
  "FreeBSD 13.1",
  "macOS 13 Ventura",
  "Debian 11 (bullseye)",
  "CentOS Stream 9",
];

function simulateScan(): ScanResult[] {
  const ports = Object.keys(COMMON_SERVICES).map(Number);
  const selected = ports.filter(() => Math.random() > 0.5);
  return selected.map((port) => {
    const states: ScanResult["state"][] = ["open", "open", "open", "filtered", "closed"];
    const state = states[Math.floor(Math.random() * states.length)];
    const info = COMMON_SERVICES[port];
    return {
      port,
      state,
      service: info.service,
      version: state === "open" ? info.version : undefined,
    };
  });
}

const NmapScannerPanel = () => {
  const [target, setTarget] = useState("192.168.1.0/24");
  const [scanType, setScanType] = useState("quick");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<HostResult[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const appendLog = (msg: string) => setLog((prev) => [...prev, msg]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  const startScan = () => {
    if (!target.trim()) return;
    setScanning(true);
    setProgress(0);
    setResults([]);
    setLog([]);

    const scanLabel = SCAN_TYPES.find((s) => s.id === scanType)?.label ?? scanType;
    appendLog(`Starting Nmap scan: ${scanLabel}`);
    appendLog(`Target: ${target}`);
    appendLog(`Scan initiated at ${new Date().toISOString()}`);
    appendLog("Discovering hosts...");

    let p = 0;
    const totalSteps = 20;
    let step = 0;

    intervalRef.current = setInterval(() => {
      step++;
      p = Math.min(Math.round((step / totalSteps) * 100), 100);
      setProgress(p);

      if (step === 4) appendLog("Host discovery complete. Scanning ports...");
      if (step === 8) appendLog("SYN scan in progress...");
      if (step === 12) appendLog("Service version detection...");
      if (step === 16) appendLog("OS fingerprinting...");

      if (step >= totalSteps) {
        clearInterval(intervalRef.current!);
        // Generate results
        const hostCount = Math.floor(Math.random() * 4) + 2;
        const hosts: HostResult[] = [];
        for (let i = 0; i < hostCount; i++) {
          const ip = target.includes("/")
            ? target.replace(/\/\d+$/, "").replace(/\d+$/, String(Math.floor(Math.random() * 254) + 1))
            : target;
          const ports = simulateScan();
          const isUp = Math.random() > 0.15;
          hosts.push({
            host: ip,
            status: isUp ? "up" : "down",
            latency: `${(Math.random() * 50 + 1).toFixed(1)}ms`,
            ports: isUp ? ports : [],
            os: isUp ? OS_GUESSES[Math.floor(Math.random() * OS_GUESSES.length)] : undefined,
            timestamp: new Date().toISOString(),
          });
          appendLog(`Host ${ip}: ${isUp ? "UP" : "DOWN"} — ${ports.filter((p) => p.state === "open").length} open ports`);
        }
        setResults(hosts);
        appendLog(`Scan complete. ${hosts.filter((h) => h.status === "up").length} hosts up out of ${hosts.length} scanned.`);
        setScanning(false);
      }
    }, 300);
  };

  const stopScan = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setScanning(false);
    appendLog("Scan aborted by user.");
  };

  const stateColor = (state: ScanResult["state"]) => {
    if (state === "open") return "text-cyber-green";
    if (state === "filtered") return "text-cyber-yellow";
    return "text-destructive";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Radar className="w-4 h-4 text-primary" />
        Nmap Scanner
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed">
        Network discovery & security auditing. Discovers hosts, services, and vulnerabilities.
      </p>

      {/* Target input */}
      <div>
        <label className="text-[10px] text-muted-foreground mb-1 block">Target (IP / CIDR / hostname)</label>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="192.168.1.0/24"
          disabled={scanning}
          className="w-full bg-muted border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 font-mono"
        />
      </div>

      {/* Scan type */}
      <div>
        <label className="text-[10px] text-muted-foreground mb-1 block">Scan Type</label>
        <div className="grid grid-cols-2 gap-1">
          {SCAN_TYPES.map((s) => (
            <button
              key={s.id}
              onClick={() => setScanType(s.id)}
              disabled={scanning}
              className={`text-left px-2 py-1.5 rounded-md border text-[10px] transition-colors ${
                scanType === s.id
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground hover:border-primary/30"
              }`}
            >
              <div className="font-medium">{s.label}</div>
              <div className="opacity-70">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {!scanning ? (
          <button onClick={startScan} className="cyber-btn text-xs px-3 py-1.5 flex-1">
            <Play className="w-3.5 h-3.5" /> Start Scan
          </button>
        ) : (
          <button onClick={stopScan} className="cyber-btn text-xs px-3 py-1.5 flex-1 border-destructive/50 text-destructive">
            <Square className="w-3.5 h-3.5" /> Stop
          </button>
        )}
        {results.length > 0 && !scanning && (
          <button onClick={() => { setResults([]); setLog([]); setProgress(0); }} className="cyber-btn text-xs px-2 py-1.5">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Progress */}
      {(scanning || progress > 0) && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{scanning ? "Scanning..." : "Complete"}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Console log */}
      {log.length > 0 && (
        <div
          ref={logRef}
          className="bg-background/80 border border-border rounded-md p-2 max-h-28 overflow-y-auto scrollbar-cyber"
        >
          {log.map((line, i) => (
            <div key={i} className="text-[10px] font-mono text-muted-foreground leading-relaxed">
              <span className="text-primary/60">›</span> {line}
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-semibold text-foreground">
            Discovered Hosts ({results.filter((h) => h.status === "up").length} up)
          </div>
          {results.map((host, i) => (
            <div key={i} className="border border-border rounded-md bg-muted/50 p-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold text-foreground">{host.host}</span>
                <span className={`text-[10px] font-bold uppercase ${host.status === "up" ? "text-cyber-green" : "text-destructive"}`}>
                  {host.status}
                </span>
              </div>
              {host.status === "up" && (
                <>
                  <div className="flex gap-3 text-[10px] text-muted-foreground">
                    <span>Latency: {host.latency}</span>
                    {host.os && <span>OS: {host.os}</span>}
                  </div>
                  {host.ports.length > 0 && (
                    <div className="border-t border-border pt-1.5">
                      <div className="grid grid-cols-[50px_52px_1fr] gap-x-2 text-[9px] font-semibold text-muted-foreground mb-0.5">
                        <span>PORT</span>
                        <span>STATE</span>
                        <span>SERVICE</span>
                      </div>
                      {host.ports.map((p, j) => (
                        <div key={j} className="grid grid-cols-[50px_52px_1fr] gap-x-2 text-[10px] font-mono">
                          <span className="text-foreground">{p.port}/tcp</span>
                          <span className={stateColor(p.state)}>{p.state}</span>
                          <span className="text-muted-foreground truncate">
                            {p.service}{p.version ? ` ${p.version}` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NmapScannerPanel;