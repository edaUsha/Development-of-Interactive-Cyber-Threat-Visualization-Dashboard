import { useState } from "react";
import { Globe, Send, Plus, Trash2 } from "lucide-react";

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;

const RestApiPanel = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<(typeof METHODS)[number]>("GET");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
  const removeHeader = (i: number) => setHeaders(headers.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: "key" | "value", val: string) => {
    const updated = [...headers];
    updated[i][field] = val;
    setHeaders(updated);
  };

  const sendRequest = async () => {
    if (!url) return;
    setLoading(true);
    setResponse(null);
    try {
      const hdrs: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key) hdrs[h.key] = h.value;
      });
      const opts: RequestInit = { method, headers: hdrs };
      if (method !== "GET" && body) opts.body = body;
      const res = await fetch(url, opts);
      const text = await res.text();
      setResponse(`${res.status} ${res.statusText}\n\n${text.slice(0, 1000)}`);
    } catch (err: any) {
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const methodColor: Record<string, string> = {
    GET: "text-cyber-green",
    POST: "text-cyber-yellow",
    PUT: "text-primary",
    DELETE: "text-destructive",
    PATCH: "text-secondary",
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Globe className="w-4 h-4 text-secondary" />
        REST API Tester
      </h3>

      {/* Method + URL */}
      <div className="flex gap-1.5">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as any)}
          className={`px-2 py-2 text-[10px] font-bold bg-muted border border-border rounded-lg focus:outline-none focus:border-primary/40 ${methodColor[method]}`}
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          type="url"
          placeholder="https://api.example.com/data"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-2 py-2 text-xs bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 font-mono"
        />
      </div>

      {/* Headers */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Headers</label>
          <button onClick={addHeader} className="text-primary hover:text-primary/80 transition-colors">
            <Plus className="w-3 h-3" />
          </button>
        </div>
        {headers.map((h, i) => (
          <div key={i} className="flex gap-1 items-center">
            <input
              placeholder="Key"
              value={h.key}
              onChange={(e) => updateHeader(i, "key", e.target.value)}
              className="flex-1 px-2 py-1.5 text-[10px] bg-muted border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 font-mono"
            />
            <input
              placeholder="Value"
              value={h.value}
              onChange={(e) => updateHeader(i, "value", e.target.value)}
              className="flex-1 px-2 py-1.5 text-[10px] bg-muted border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 font-mono"
            />
            <button onClick={() => removeHeader(i)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Body */}
      {method !== "GET" && (
        <div className="space-y-1.5">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Request Body</label>
          <textarea
            placeholder='{"key": "value"}'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-2 py-2 text-[10px] bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 font-mono h-20 resize-none"
          />
        </div>
      )}

      {/* Send */}
      <button
        onClick={sendRequest}
        disabled={loading || !url}
        className="cyber-btn text-xs w-full justify-center"
      >
        <Send className="w-3.5 h-3.5" />
        {loading ? "Sending..." : "Send Request"}
      </button>

      {/* Response */}
      {response && (
        <div className="space-y-1.5">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Response</label>
          <pre className="w-full px-2 py-2 text-[10px] bg-muted border border-border rounded-lg text-foreground font-mono h-32 overflow-auto scrollbar-cyber whitespace-pre-wrap">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RestApiPanel;
