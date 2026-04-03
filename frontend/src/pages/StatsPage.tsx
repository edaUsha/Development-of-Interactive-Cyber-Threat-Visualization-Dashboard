import StatsPanel from "@/components/panels/StatsPanel";
import { useData } from "@/contexts/DataContext";

const StatsPage = () => {
  const { threats } = useData();

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-lg font-bold text-foreground mb-4">Statistics</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Overview of threat severity distribution and attack origins.
      </p>
      <div className="cyber-card p-6">
        <StatsPanel threats={threats} />
      </div>
    </div>
  );
};

export default StatsPage;
