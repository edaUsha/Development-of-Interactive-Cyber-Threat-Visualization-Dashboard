import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import type { ThreatData } from "@/data/mockThreats";

interface StaticUploadPanelProps {
  onDataLoaded: (data: ThreatData[]) => void;
}

const StaticUploadPanel = ({ onDataLoaded }: StaticUploadPanelProps) => {
  const [status, setStatus] = useState<'idle' | 'preview' | 'loaded' | 'error'>('idle');
  const [fileName, setFileName] = useState('');
  const [previewRows, setPreviewRows] = useState<string[][]>([]);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            setPreviewRows(data.slice(0, 5).map(row => Object.values(row).map(String)));
            setStatus('preview');
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = text.split('\n').filter(l => l.trim());
          setPreviewRows(lines.slice(0, 6).map(l => l.split(',')));
          setStatus('preview');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Upload className="w-4 h-4 text-primary" />
        Static Data Upload
      </h3>

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors cursor-pointer"
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.csv,.json';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) handleFile(file);
          };
          input.click();
        }}
      >
        <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Drop CSV or JSON files here</p>
        <p className="text-[10px] text-muted-foreground mt-1">or click to browse</p>
      </div>

      {status === 'preview' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-cyber-green">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{fileName} loaded successfully</span>
          </div>
          <div className="overflow-x-auto max-h-32 scrollbar-cyber">
            <table className="w-full text-[10px]">
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={i} className="border-b border-border/30">
                    {row.slice(0, 5).map((cell, j) => (
                      <td key={j} className="px-1.5 py-1 font-mono text-muted-foreground truncate max-w-[80px]">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => { setStatus('loaded'); onDataLoaded([]); }}
            className="cyber-btn active text-xs w-full justify-center"
          >
            Visualize on Map
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Invalid file format. Use CSV or JSON.</span>
        </div>
      )}
    </div>
  );
};

export default StaticUploadPanel;
