import { Shield, Activity, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Analytics", path: "/analytics" },
  { label: "AI Summary", path: "/ai-summary" },
  { label: "AI Recs", path: "/ai-recommendations" },
];

const TopNav = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="h-14 flex items-center px-4 gap-4 sticky top-0 z-50" style={{ background: 'rgba(15, 10, 30, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #4c1d9540' }}>
      <div className="flex items-center gap-2 mr-6 cursor-pointer" onClick={() => navigate("/")}>
        <Shield className="w-6 h-6 text-primary cyber-glow-text" />
        <h1 className="text-base font-bold tracking-tight" style={{ color: '#f5f3ff' }}>
          Cyber Threat <span className="text-primary">Intelligence</span>
        </h1>
      </div>

      <nav className="flex items-center gap-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`cyber-btn text-xs px-3 py-1.5 ${location.pathname === item.path ? "active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: '#4c1d9540', borderColor: '#4c1d9540' }}>
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span style={{ color: '#c4b5fd' }}>Cloud</span>
          <span className="text-cyber-green font-medium">Connected</span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors hover:text-destructive"
          style={{ background: '#4c1d9540', borderColor: '#4c1d9540', color: '#c4b5fd' }}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
