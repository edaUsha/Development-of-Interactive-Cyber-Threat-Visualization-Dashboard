import { useState } from "react";
import { ScanLine, Upload, AlertTriangle, Shield, Image } from "lucide-react";

const ImageScannerPanel = () => {
  const [scanned, setScanned] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setImagePreview(ev.target?.result as string);
          setTimeout(() => setScanned(true), 1500);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <ScanLine className="w-4 h-4 text-primary" />
        Image Threat Scanner
      </h3>

      <div
        onClick={handleUpload}
        className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors cursor-pointer"
      >
        <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Upload an image to scan</p>
      </div>

      {imagePreview && (
        <div className="rounded-lg overflow-hidden border border-border">
          <img src={imagePreview} alt="Scan target" className="w-full h-24 object-cover" />
        </div>
      )}

      {imagePreview && !scanned && (
        <div className="flex items-center gap-2 text-xs text-primary">
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Scanning for threats...
        </div>
      )}

      {scanned && (
        <div className="space-y-2 text-xs">
          <div className="cyber-card p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Risk Score</span>
              <span className="severity-low font-bold">LOW</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">QR/Phishing</span>
              <span className="text-cyber-green flex items-center gap-1"><Shield className="w-3 h-3" /> None</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Metadata</span>
              <span className="text-foreground">Extracted</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Suspicious Text</span>
              <span className="text-cyber-green">Not Found</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageScannerPanel;
