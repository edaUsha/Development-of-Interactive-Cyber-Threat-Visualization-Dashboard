import ImageScannerPanel from "@/components/panels/ImageScannerPanel";

const ImageScanPage = () => (
  <div className="max-w-xl mx-auto">
    <h2 className="text-lg font-bold text-foreground mb-4">Image Threat Scanner</h2>
    <p className="text-sm text-muted-foreground mb-6">
      Upload images to scan for embedded threats, phishing QR codes, and suspicious metadata.
    </p>
    <div className="cyber-card p-6">
      <ImageScannerPanel />
    </div>
  </div>
);

export default ImageScanPage;
