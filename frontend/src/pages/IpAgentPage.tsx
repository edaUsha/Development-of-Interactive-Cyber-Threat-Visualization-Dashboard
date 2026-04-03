import IpAgentPanel from "@/components/panels/IpAgentPanel";

const IpAgentPage = () => (
  <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)]">
    <h2 className="text-lg font-bold text-foreground mb-4">Cyber Security Agent</h2>
    <p className="text-sm text-muted-foreground mb-4">
      Ask about IP threats, get security advice, generate action plans, or request analytics.
    </p>
    <div className="cyber-card p-4 h-[calc(100%-5rem)]">
      <IpAgentPanel />
    </div>
  </div>
);

export default IpAgentPage;
