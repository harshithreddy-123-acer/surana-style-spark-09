
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import StyleQuiz from "./components/StyleQuiz";
import ChatBot from "./components/ChatBot";
import DesignGenerator from "./components/DesignGenerator";
import MoodboardGenerator from "./components/MoodboardGenerator";
import Gallery from "./components/Gallery";
import BudgetPlanner from "./components/BudgetPlanner";
import VoiceImageGenerator from "./components/VoiceImageGenerator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/style-quiz" element={<StyleQuiz />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/design-generator" element={<DesignGenerator />} />
            <Route path="/moodboard" element={<MoodboardGenerator />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/budget-planner" element={<BudgetPlanner />} />
            <Route path="/voice-design" element={<VoiceImageGenerator />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
