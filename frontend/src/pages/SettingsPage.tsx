import SettingsPanel from "@/components/panels/SettingsPanel";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const SettingsPage = () => {
  const { alertsEnabled, setAlertsEnabled, setDataLoaded, setThreats } = useData();
  const { signOut } = useAuth();

  const handleReset = () => {
    setDataLoaded(false);
    setThreats([]);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Settings & Configuration</h2>

      <div className="cyber-card p-6">
        <SettingsPanel alertsEnabled={alertsEnabled} onAlertsEnabledChange={setAlertsEnabled} />
      </div>

      <div className="cyber-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Data Management</h3>
        <button onClick={handleReset} className="cyber-btn text-xs w-full justify-center">
          Reset Data & Return to Setup
        </button>
      </div>

      <div className="cyber-card p-4">
        <button
          onClick={signOut}
          className="cyber-btn text-xs w-full justify-center text-destructive border-destructive/30 hover:bg-destructive/10"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
