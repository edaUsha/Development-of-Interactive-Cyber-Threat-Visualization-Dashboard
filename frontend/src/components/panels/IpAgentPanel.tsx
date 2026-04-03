import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, BarChart3, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface Message {
  role: "user" | "assistant";
  content: string;
  chart?: ChartData | null;
}

interface ChartData {
  type: "bar" | "pie" | "line";
  title: string;
  data: { name: string; value: number }[];
}

const CHART_COLORS = [
  "hsl(185 100% 50%)",
  "hsl(217 91% 60%)",
  "hsl(0 72% 55%)",
  "hsl(142 70% 45%)",
  "hsl(45 93% 58%)",
  "hsl(280 70% 55%)",
];

const STREAM_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ip-agent`;

const IpAgentPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const resp = await fetch(STREAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${err.error || "Error occurred"}` }]);
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nlIdx: number;
        while ((nlIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nlIdx);
          buffer = buffer.slice(nlIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }

            // Check for tool calls (chart data)
            const toolCalls = parsed.choices?.[0]?.delta?.tool_calls;
            if (toolCalls) {
              for (const tc of toolCalls) {
                if (tc.function?.arguments) {
                  try {
                    const chartData = JSON.parse(tc.function.arguments) as ChartData;
                    setMessages((prev) => {
                      const newMsgs = [...prev];
                      const lastIdx = newMsgs.length - 1;
                      if (newMsgs[lastIdx]?.role === "assistant") {
                        newMsgs[lastIdx] = { ...newMsgs[lastIdx], chart: chartData };
                      }
                      return newMsgs;
                    });
                  } catch { /* partial args */ }
                }
              }
            }
          } catch { /* partial json */ }
        }
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Failed to connect to agent." }]);
    }

    setIsLoading(false);
  };

  const renderChart = (chart: ChartData) => {
    const { type, title, data } = chart;

    return (
      <div className="mt-2 p-2 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-1.5 mb-2">
          <BarChart3 className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-medium text-foreground">{title}</span>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart data={data}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{ background: "hsl(222 40% 10%)", border: "1px solid hsl(222 30% 20%)", borderRadius: 8, fontSize: 10 }}
                  labelStyle={{ color: "hsl(200 20% 90%)" }}
                />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            ) : type === "pie" ? (
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} innerRadius={25} strokeWidth={0}>
                  {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(222 40% 10%)", border: "1px solid hsl(222 30% 20%)", borderRadius: 8, fontSize: 10 }}
                />
              </PieChart>
            ) : (
              <LineChart data={data}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{ background: "hsl(222 40% 10%)", border: "1px solid hsl(222 30% 20%)", borderRadius: 8, fontSize: 10 }}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(185 100% 50%)" strokeWidth={2} dot={{ r: 2, fill: "hsl(185 100% 50%)" }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Cyber Security Agent</span>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="text-muted-foreground hover:text-foreground">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground mb-3">
        Ask about IP threats, get security advice, generate action plans, or request analytics with charts.
      </p>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-cyber space-y-2 mb-3 min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-6 space-y-2">
            <Bot className="w-8 h-8 text-primary/30 mx-auto" />
            <p className="text-[10px] text-muted-foreground">Try asking:</p>
            <div className="space-y-1">
              {[
                "What attacks came from 192.168.1.1?",
                "How do I respond to a ransomware incident?",
                "Generate a server hardening checklist",
                "What firewall rules should I set up?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="block w-full text-[10px] text-left px-2 py-1.5 rounded bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[95%] rounded-lg px-2.5 py-1.5 text-[11px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "bg-muted/60 text-foreground border border-border"
              }`}
            >
              {msg.role === "assistant" ? (
                <>
                  <div className="prose prose-invert prose-xs max-w-none [&_p]:my-0.5 [&_h1]:text-xs [&_h2]:text-xs [&_h3]:text-[11px] [&_li]:text-[11px] [&_ul]:my-0.5 [&_ol]:my-0.5">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.chart && renderChart(msg.chart)}
                </>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="bg-muted/60 border border-border rounded-lg px-3 py-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask anything about cybersecurity…"
          className="flex-1 bg-muted/50 border border-border rounded-md text-xs py-2 px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={isLoading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          className="px-2.5 py-2 rounded-md bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 disabled:opacity-40 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default IpAgentPanel;
