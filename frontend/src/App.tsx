import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import AppLayout from "@/components/AppLayout";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import ApiKeys from "./pages/ApiKeys";
import AiThreatSummary from "./pages/AiThreatSummary";
import AiRecommendations from "./pages/AiRecommendations";
import UploadPage from "./pages/UploadPage";
import LiveApiPage from "./pages/LiveApiPage";
import RestApiPage from "./pages/RestApiPage";
import ImageScanPage from "./pages/ImageScanPage";
import BarcodePage from "./pages/BarcodePage";
import NmapPage from "./pages/NmapPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import IpAgentPage from "./pages/IpAgentPage";
import SecurityToolPage from "./pages/SecurityToolPage";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/api-keys" element={<ApiKeys />} />
                <Route path="/ai-summary" element={<AiThreatSummary />} />
                <Route path="/ai-recommendations" element={<AiRecommendations />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/live-api" element={<LiveApiPage />} />
                <Route path="/rest-api" element={<RestApiPage />} />
                <Route path="/image-scan" element={<ImageScanPage />} />
                <Route path="/barcode" element={<BarcodePage />} />
                <Route path="/nmap" element={<NmapPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/ip-agent" element={<IpAgentPage />} />
                <Route path="/tool/:toolId" element={<SecurityToolPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
