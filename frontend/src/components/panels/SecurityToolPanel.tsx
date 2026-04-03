import { useState } from "react";
import type { SecurityTool } from "@/data/securityTools";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldOff, Play, BookOpen, Settings2, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SecurityToolPanelProps {
  tool: SecurityTool;
}

const toolDocs: Record<string, string> = {
  openvas: "https://greenbone.github.io/docs/latest/",
  nikto: "https://cirt.net/Nikto2",
  metasploit: "https://docs.metasploit.com/",
  sqlmap: "https://sqlmap.org/",
  john: "https://www.openwall.com/john/doc/",
  "owasp-zap": "https://www.zaproxy.org/docs/",
  wapiti: "https://wapiti-scanner.github.io/",
  wazuh: "https://documentation.wazuh.com/current/",
  snort: "https://www.snort.org/documents",
  autopsy: "https://sleuthkit.org/autopsy/docs/user-docs/",
  volatility: "https://volatility3.readthedocs.io/en/latest/",
};

const SecurityToolPanel = ({ tool }: SecurityToolPanelProps) => {
  const isReady = tool.status === "ready";
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [configOpen, setConfigOpen] = useState(false);

  const handleRunScan = async () => {
    if (!isReady) {
      toast({ title: "Tool Not Connected", description: `${tool.name} is not connected yet. Configure it first.`, variant: "destructive" });
      return;
    }
    setScanning(true);
    setScanResult(null);
    // Simulate scan
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 2000));
    const results = [
      `Scan complete — ${Math.floor(Math.random() * 12)} vulnerabilities found across ${Math.floor(Math.random() * 50) + 5} targets.`,
      `Analysis finished — No critical issues detected. ${Math.floor(Math.random() * 5)} informational findings.`,
      `Scan complete — ${Math.floor(Math.random() * 3) + 1} high-severity issues require immediate attention.`,
    ];
    const result = results[Math.floor(Math.random() * results.length)];
    setScanResult(result);
    setScanning(false);
    toast({ title: `${tool.name} Scan Complete`, description: result });
  };

  const handleViewDocs = () => {
    const url = toolDocs[tool.id] || `https://www.google.com/search?q=${encodeURIComponent(tool.name + " documentation")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleConfigure = () => {
    setConfigOpen((prev) => !prev);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">{tool.name}</h3>
        <Badge
          variant={isReady ? "default" : "outline"}
          className={`text-[10px] ${isReady ? "" : "border-destructive/50 text-destructive"}`}
        >
          {isReady ? (
            <><ShieldCheck className="w-3 h-3 mr-1" /> Ready</>
          ) : (
            <><ShieldOff className="w-3 h-3 mr-1" /> Not Connected</>
          )}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>

      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        Category: {tool.category}
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          Key Features
        </span>
        <ul className="space-y-1">
          {tool.features.map((f) => (
            <li key={f} className="text-xs text-foreground/80 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Scan result */}
      {scanResult && (
        <div className="flex items-start gap-2 p-2.5 rounded-md bg-primary/10 border border-primary/20 text-xs text-foreground">
          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <span>{scanResult}</span>
        </div>
      )}

      {/* Configure panel */}
      {configOpen && (
        <div className="p-3 rounded-md bg-muted/30 border border-border space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Configuration</p>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground block">
              Target Host / URL
              <input
                type="text"
                placeholder="e.g. 192.168.1.1 or https://example.com"
                className="mt-1 w-full bg-background border border-border rounded-md text-xs py-1.5 px-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </label>
            <label className="text-xs text-muted-foreground block">
              Scan Profile
              <select className="mt-1 w-full bg-background border border-border rounded-md text-xs py-1.5 px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Quick Scan</option>
                <option>Full Scan</option>
                <option>Stealth Scan</option>
              </select>
            </label>
          </div>
          {!isReady && (
            <div className="flex items-center gap-1.5 text-[11px] text-yellow-500">
              <AlertTriangle className="w-3 h-3" />
              <span>Connect this tool before running scans.</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1.5 pt-2">
        <button
          onClick={handleRunScan}
          disabled={scanning}
          className="cyber-btn text-[10px] px-3 py-1.5 flex items-center gap-1.5 w-full justify-center disabled:opacity-50"
        >
          {scanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
          {scanning ? "Scanning…" : "Run Scan"}
        </button>
        <button
          onClick={handleViewDocs}
          className="cyber-btn text-[10px] px-3 py-1.5 flex items-center gap-1.5 w-full justify-center"
        >
          <BookOpen className="w-3 h-3" /> View Docs
        </button>
        <button
          onClick={handleConfigure}
          className="cyber-btn text-[10px] px-3 py-1.5 flex items-center gap-1.5 w-full justify-center"
        >
          <Settings2 className="w-3 h-3" /> Configure
        </button>
      </div>
    </div>
  );
};

export default SecurityToolPanel;
