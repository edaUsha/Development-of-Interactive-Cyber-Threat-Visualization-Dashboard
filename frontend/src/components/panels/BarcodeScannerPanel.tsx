import { useState } from "react";
import { QrCode, Upload, Camera, Shield, AlertTriangle } from "lucide-react";

const BarcodeScannerPanel = () => {
  const [scanned, setScanned] = useState(false);
  const [decodedData, setDecodedData] = useState('');

  const handleScan = () => {
    setScanned(false);
    setTimeout(() => {
      setDecodedData('https://example.com/safe-link');
      setScanned(true);
    }, 1500);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <QrCode className="w-4 h-4 text-primary" />
        Barcode Threat Scanner
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleScan}
          className="cyber-btn text-xs justify-center flex-col py-4"
        >
          <Camera className="w-5 h-5 mb-1" />
          Camera Scan
        </button>
        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = () => handleScan();
            input.click();
          }}
          className="cyber-btn text-xs justify-center flex-col py-4"
        >
          <Upload className="w-5 h-5 mb-1" />
          Upload Image
        </button>
      </div>

      {!scanned && decodedData === '' && null}

      {!scanned && decodedData !== '' && (
        <div className="flex items-center gap-2 text-xs text-primary">
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Scanning barcode...
        </div>
      )}

      {scanned && (
        <div className="space-y-2 text-xs">
          <div className="cyber-card p-3 space-y-2">
            <div>
              <span className="text-muted-foreground text-[10px] uppercase tracking-wider">Decoded Data</span>
              <p className="font-mono text-primary mt-0.5 break-all">{decodedData}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Threat Risk</span>
              <span className="severity-low font-bold flex items-center gap-1">
                <Shield className="w-3 h-3" /> SAFE
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Malicious URL</span>
              <span className="text-cyber-green">Not Detected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Geo Data</span>
              <span className="text-muted-foreground">N/A</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScannerPanel;
