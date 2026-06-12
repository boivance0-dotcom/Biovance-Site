import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Results from "./pages/Results";
import ForestAI from "./pages/ForestAI";
import AIDashboard from "./pages/AIDashboard";
import Login from "./pages/Login";
import Test from "./pages/Test";
import Search from "./pages/Search";
import SearchResults from "./pages/SearchResults";
import Backend from "./pages/Backend";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const AppBody = () => {
  const location = useLocation();
  const hideGlobalNav = location.pathname.startsWith("/search") || location.pathname.startsWith("/backend");
  return (
    <AuthProvider>
      {!hideGlobalNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/test" element={<Test />} />
        <Route path="/results" element={<Results />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/results" element={<SearchResults />} />
        <Route path="/forest-ai" element={<ForestAI />} />
        <Route path="/ai/:slug" element={<AIDashboard />} />
        <Route path="/backend" element={<Backend />} />
        <Route path="/login" element={<Login />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppBody />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
