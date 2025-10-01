import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import MarkdownEditor from "./pages/MarkdownEditor";
import ExpenseSplitter from "./pages/ExpenseSplitter";
import ComingSoon from "./pages/ComingSoon";
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
            <Route path="/rss" element={<ComingSoon title="RSS Reader" description="Aggregate and read your favorite RSS & Atom feeds" />} />
            <Route path="/diff" element={<ComingSoon title="Diff & Merge" description="Compare and merge text files with visual diff highlighting" />} />
            <Route path="/calendar" element={<ComingSoon title="Calendar" description="Manage events and tame your time effectively" />} />
            <Route path="/presentations" element={<ComingSoon title="Presentations" description="Create beautiful slides from Markdown with live preview" />} />
            <Route path="/podcasts" element={<ComingSoon title="Podcast Player" description="Listen to and manage your podcast library" />} />
            <Route path="/budget" element={<ComingSoon title="Budget Tracker" description="Track finances and manage your personal budget" />} />
            <Route path="/audio" element={<ComingSoon title="Audio Tagger" description="Edit metadata tags for your audio files offline" />} />
            <Route path="/email" element={<ComingSoon title="Email Reader" description="Browse and search MBOX email archives locally" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
