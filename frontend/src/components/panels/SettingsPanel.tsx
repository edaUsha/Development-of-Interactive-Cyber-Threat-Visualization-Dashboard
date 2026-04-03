import { Settings, Bell, Shield, Database } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface SettingsPanelProps {
  alertsEnabled: boolean;
  onAlertsEnabledChange: (enabled: boolean) => void;
}

const SettingsPanel = ({ alertsEnabled, onAlertsEnabledChange }: SettingsPanelProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Settings className="w-4 h-4 text-primary" />
        Settings & Config
      </h3>

      <div className="space-y-2">
        <div className="cyber-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Bell className="w-4 h-4 text-primary" />
            <span>Alert Notifications</span>
          </div>
          <Switch checked={alertsEnabled} onCheckedChange={onAlertsEnabledChange} />
        </div>

        <div className="cyber-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Shield className="w-4 h-4 text-cyber-yellow" />
            <span>Auto-block Critical</span>
          </div>
          <Switch />
        </div>

        <div className="cyber-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Database className="w-4 h-4 text-secondary" />
            <span>Data Retention</span>
          </div>
          <span className="text-xs text-muted-foreground">30 days</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
