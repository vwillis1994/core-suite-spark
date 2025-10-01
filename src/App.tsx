import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import MarkdownEditor from "./pages/MarkdownEditor";
import ExpenseSplitter from "./pages/ExpenseSplitter";
import RSSReader from "./pages/RSSReader";
import DiffMerge from "./pages/DiffMerge";
import Calendar from "./pages/Calendar";
import Presentations from "./pages/Presentations";
import PodcastPlayer from "./pages/PodcastPlayer";
import BudgetTracker from "./pages/BudgetTracker";
import AudioTagger from "./pages/AudioTagger";
import EmailReader from "./pages/EmailReader";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/markdown" element={<MarkdownEditor />} />
            <Route path="/expenses" element={<ExpenseSplitter />} />
            <Route path="/rss" element={<RSSReader />} />
            <Route path="/diff" element={<DiffMerge />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/presentations" element={<Presentations />} />
            <Route path="/podcasts" element={<PodcastPlayer />} />
            <Route path="/budget" element={<BudgetTracker />} />
            <Route path="/audio" element={<AudioTagger />} />
            <Route path="/email" element={<EmailReader />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
