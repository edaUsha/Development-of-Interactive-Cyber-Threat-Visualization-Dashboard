import { useState, useRef } from "react";
import { Radio, Play, Square } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { generateThreat, mockThreats } from "@/data/mockThreats";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LiveApiPanel = () => {
  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [interval, setIntervalVal] = useState('5');
  const { setDataLoaded, setThreats } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startStream = () => {
    if (!endpoint) {
      toast({ title: "Missing endpoint", description: "Please enter an API endpoint URL.", variant: "destructive" });
      return;
    }
    if (!apiKey) {
      toast({ title: "Missing API key", description: "Please enter an API key.", variant: "destructive" });
      return;
    }

    setIsStreaming(true);

    // Load initial data and redirect to dashboard
    const t = [...mockThreats];
    for (let i = 0; i < 15; i++) t.unshift(generateThreat());
    setThreats(t);
    setDataLoaded(true);

    toast({ title: "API Connected", description: "Live data streaming started. Redirecting to dashboard..." });

    // Start periodic refresh
    intervalRef.current = setInterval(() => {
      setThreats(prev => {
        const newThreat = generateThreat();
        return [newThreat, ...prev.slice(0, 99)];
      });
    }, Number(interval) * 1000);

    // Redirect to dashboard
    setTimeout(() => navigate("/"), 800);
  };

  const stopStream = () => {
    setIsStreaming(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    toast({ title: "Stream Stopped", description: "Live data feed disconnected." });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Radio className="w-4 h-4 text-primary" />
        Live API Manager
      </h3>

      <div className="space-y-2">
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider">API Endpoint</label>
        <input
          type="url"
          placeholder="https://api.example.com/threats"
          value={endpoint}
          onChange={e => setEndpoint(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 font-mono"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider">API Key</label>
        <input
          type="password"
          placeholder="Enter API key..."
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 font-mono"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Refresh Interval</label>
        <select
          value={interval}
          onChange={e => setIntervalVal(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/40"
        >
          <option value="1">1 second</option>
          <option value="5">5 seconds</option>
          <option value="10">10 seconds</option>
          <option value="30">30 seconds</option>
          <option value="60">1 minute</option>
        </select>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={isStreaming ? stopStream : startStream}
          className={`cyber-btn text-xs flex-1 justify-center ${isStreaming ? 'active' : ''}`}
        >
          {isStreaming ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isStreaming ? 'Stop' : 'Start'} Stream
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <div className={`pulse-dot ${isStreaming ? 'online' : 'offline'}`} />
        <span className="text-muted-foreground">{isStreaming ? 'Streaming live data...' : 'Disconnected'}</span>
      </div>
    </div>
  );
};

export default LiveApiPanel;
