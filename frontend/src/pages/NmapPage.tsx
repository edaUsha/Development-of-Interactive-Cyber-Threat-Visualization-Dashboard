import NmapScannerPanel from "@/components/panels/NmapScannerPanel";

const NmapPage = () => (
  <div className="max-w-3xl mx-auto">
    <h2 className="text-lg font-bold text-foreground mb-4">Nmap Network Scanner</h2>
    <p className="text-sm text-muted-foreground mb-6">
      Discover hosts, open ports, running services, and potential vulnerabilities on your network.
    </p>
    <div className="cyber-card p-6">
      <NmapScannerPanel />
    </div>
  </div>
);

export default NmapPage;
