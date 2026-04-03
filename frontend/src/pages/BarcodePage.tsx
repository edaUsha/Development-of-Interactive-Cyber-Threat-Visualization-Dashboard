import BarcodeScannerPanel from "@/components/panels/BarcodeScannerPanel";

const BarcodePage = () => (
  <div className="max-w-xl mx-auto">
    <h2 className="text-lg font-bold text-foreground mb-4">Barcode Threat Scanner</h2>
    <p className="text-sm text-muted-foreground mb-6">
      Scan barcodes and QR codes for malicious URLs and embedded threats.
    </p>
    <div className="cyber-card p-6">
      <BarcodeScannerPanel />
    </div>
  </div>
);

export default BarcodePage;
