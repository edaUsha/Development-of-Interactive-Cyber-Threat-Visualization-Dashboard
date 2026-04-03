import LiveApiPanel from "@/components/panels/LiveApiPanel";

const LiveApiPage = () => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-lg font-bold text-foreground mb-4">Live API Manager</h2>
    <p className="text-sm text-muted-foreground mb-6">
      Connect to live threat intelligence API feeds for real-time data streaming.
    </p>
    <div className="cyber-card p-6">
      <LiveApiPanel />
    </div>
  </div>
);

export default LiveApiPage;
