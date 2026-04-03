import { useEffect, useMemo } from "react";
import GeoMap from "@/components/GeoMap";
import ThreatTable from "@/components/ThreatTable";
import AttackHistory from "@/components/AttackHistory";
import StatsBar from "@/components/StatsBar";
import AlertSystem from "@/components/AlertSystem";
import { mockThreats, generateThreat, COUNTRIES } from "@/data/mockThreats";
import { useData } from "@/contexts/DataContext";
import { useState } from "react";
import { ChevronDown, Globe, Upload, Radio, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { dataLoaded, setDataLoaded, threats, setThreats, alertsEnabled } = useData();
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Simulate live incoming threats when data is loaded
  useEffect(() => {
    if (!dataLoaded) return;
    if (threats.length === 0) {
      // Initialize with mock threats
      const t = [...mockThreats];
      for (let i = 0; i < 10; i++) t.unshift(generateThreat());
      setThreats(t);
    }

    const interval = setInterval(() => {
      setThreats(prev => {
        const newThreat = generateThreat();
        return [newThreat, ...prev.slice(0, 499)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [dataLoaded]);

  const filteredThreats = useMemo(() => {
    if (selectedCountry === "all") return threats;
    return threats.filter(t => t.country === selectedCountry || t.targetCountry === selectedCountry);
  }, [threats, selectedCountry]);

  // Data gate — show setup screen if no data loaded
  if (!dataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-8 max-w-lg mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20">
          <Shield className="w-10 h-10 text-primary cyber-glow-text" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Welcome to Cyber Threat Intelligence</h2>
          <p className="text-sm text-muted-foreground">
            To view the dashboard, you need to load threat data first. Upload a data file or connect a live API feed.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          <button
            onClick={() => navigate("/upload")}
            className="cyber-card p-6 flex flex-col items-center gap-3 hover:border-primary/40 transition-colors cursor-pointer group"
          >
            <Upload className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-foreground">Upload Data</span>
            <span className="text-[10px] text-muted-foreground">CSV or JSON files</span>
          </button>
          <button
            onClick={() => navigate("/live-api")}
            className="cyber-card p-6 flex flex-col items-center gap-3 hover:border-primary/40 transition-colors cursor-pointer group"
          >
            <Radio className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-foreground">Connect API</span>
            <span className="text-[10px] text-muted-foreground">Live threat feed</span>
          </button>
          <button
            onClick={() => {
              const t = [...mockThreats];
              for (let i = 0; i < 10; i++) t.unshift(generateThreat());
              setThreats(t);
              setDataLoaded(true);
            }}
            className="cyber-card p-6 flex flex-col items-center gap-3 hover:border-primary/40 transition-colors cursor-pointer group"
          >
            <Globe className="w-8 h-8 text-cyber-green group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-foreground">Demo Mode</span>
            <span className="text-[10px] text-muted-foreground">Use sample data</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <StatsBar threats={filteredThreats} />

      {/* Country Dropdown */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
            className="cyber-btn text-xs px-3 py-1.5 flex items-center gap-2"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>{selectedCountry === "all" ? "All Countries" : selectedCountry}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${countryDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {countryDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 z-50 w-52 rounded-lg border border-border bg-popover shadow-xl">
              <div className="p-1 max-h-64 overflow-y-auto scrollbar-cyber">
                <button
                  onClick={() => { setSelectedCountry("all"); setCountryDropdownOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors ${
                    selectedCountry === "all" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>All Countries</span>
                  {selectedCountry === "all" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
                {COUNTRIES.map((country) => {
                  const count = threats.filter(t => t.country === country || t.targetCountry === country).length;
                  return (
                    <button
                      key={country}
                      onClick={() => { setSelectedCountry(country); setCountryDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md transition-colors ${
                        selectedCountry === country ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <span>{country}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">{count}</span>
                        {selectedCountry === country && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {selectedCountry !== "all" && (
          <span className="text-[10px] text-muted-foreground">
            Showing {filteredThreats.length} of {threats.length} threats
          </span>
        )}
      </div>

      <GeoMap threats={filteredThreats} />
      <AttackHistory threats={filteredThreats} />
      <ThreatTable threats={filteredThreats} />

      {alertsEnabled && <AlertSystem threats={filteredThreats} />}
    </div>
  );
};

export default Index;
