import StaticUploadPanel from "@/components/panels/StaticUploadPanel";
import { useData } from "@/contexts/DataContext";
import { mockThreats, generateThreat } from "@/data/mockThreats";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const { setDataLoaded, setThreats } = useData();
  const navigate = useNavigate();

  const handleDataLoaded = () => {
    // Load mock threats to simulate uploaded data
    const t = [...mockThreats];
    for (let i = 0; i < 10; i++) t.unshift(generateThreat());
    setThreats(t);
    setDataLoaded(true);
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-lg font-bold text-foreground mb-4">Static Data Upload</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Upload CSV or JSON threat data files to visualize on the dashboard.
      </p>
      <StaticUploadPanel onDataLoaded={handleDataLoaded} />
    </div>
  );
};

export default UploadPage;
