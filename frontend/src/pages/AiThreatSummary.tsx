import { useState, useEffect, useRef } from "react";
import { Brain, RefreshCw } from "lucide-react";
import { streamAI } from "@/lib/streamAI";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useData } from "@/contexts/DataContext";

const AiThreatSummary = () => {
  const { threats } = useData();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const lastAnalyzedCount = useRef(0);

  const analyze = async () => {
    setLoading(true);
    setSummary("");
    let accumulated = "";

    try {
      await streamAI({
        threats,
        type: "summary",
        onDelta: (chunk) => {
          accumulated += chunk;
          setSummary(accumulated);
        },
        onDone: () => setLoading(false),
        onError: (err) => {
          toast.error(err);
          setLoading(false);
        },
      });
    } catch {
      toast.error("Failed to connect to AI service");
      setLoading(false);
    }
  };

  // Auto-analyze on mount and re-analyze every 30s if threats changed
  useEffect(() => {
    if (threats.length === 0) return;
    if (lastAnalyzedCount.current === 0) {
      lastAnalyzedCount.current = threats.length;
      analyze();
    }
    const interval = setInterval(() => {
      if (threats.length !== lastAnalyzedCount.current && !loading) {
        lastAnalyzedCount.current = threats.length;
        analyze();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [threats.length, loading]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Threat <span className="text-primary">Summary</span>
        </h1>
        <button onClick={analyze} disabled={loading} className="cyber-btn text-xs px-3 py-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> {loading ? "Analyzing..." : "Re-analyze"}
        </button>
      </div>

      <div className="cyber-card p-6">
        {!summary && loading && (
          <div className="flex items-center gap-3 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm">AI is analyzing {threats.length} threats...</span>
          </div>
        )}
        {summary && (
          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:text-foreground prose-headings:border-b prose-headings:border-border prose-headings:pb-2 prose-headings:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-primary
            prose-li:text-muted-foreground
            prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-ul:space-y-1 prose-ol:space-y-1">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        )}
        {!summary && !loading && (
          <p className="text-muted-foreground text-sm text-center py-12">Click "Re-analyze" to generate a threat summary.</p>
        )}
      </div>
    </div>
  );
};

export default AiThreatSummary;
