import RestApiPanel from "@/components/panels/RestApiPanel";

const RestApiPage = () => (
  <div className="max-w-3xl mx-auto">
    <h2 className="text-lg font-bold text-foreground mb-4">REST API Tester</h2>
    <p className="text-sm text-muted-foreground mb-6">
      Send HTTP requests to APIs and inspect responses.
    </p>
    <div className="cyber-card p-6">
      <RestApiPanel />
    </div>
  </div>
);

export default RestApiPage;
