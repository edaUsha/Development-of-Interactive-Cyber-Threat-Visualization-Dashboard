import { useParams } from "react-router-dom";
import SecurityToolPanel from "@/components/panels/SecurityToolPanel";
import { getToolById } from "@/data/securityTools";
import { Shield } from "lucide-react";

const SecurityToolPage = () => {
  const { toolId } = useParams();
  const tool = toolId ? getToolById(toolId) : undefined;

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Shield className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">Tool not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="cyber-card p-6">
        <SecurityToolPanel tool={tool} />
      </div>
    </div>
  );
};

export default SecurityToolPage;
