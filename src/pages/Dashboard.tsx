import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Receipt, 
  Rss, 
  GitCompare, 
  Calendar, 
  Presentation, 
  Podcast, 
  Wallet, 
  Music, 
  Mail,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  { 
    title: "Markdown Editor", 
    url: "/markdown", 
    icon: FileText,
    description: "Write documents with math support and live preview",
    color: "from-blue-500 to-cyan-500"
  },
  { 
    title: "Expense Splitter", 
    url: "/expenses", 
    icon: Receipt,
    description: "Split bills and track group expenses easily",
    color: "from-green-500 to-emerald-500"
  },
  { 
    title: "RSS Reader", 
    url: "/rss", 
    icon: Rss,
    description: "Aggregate and read your favorite RSS & Atom feeds",
    color: "from-orange-500 to-amber-500"
  },
  { 
    title: "Diff & Merge", 
    url: "/diff", 
    icon: GitCompare,
    description: "Compare and merge text files with visual diff",
    color: "from-purple-500 to-pink-500"
  },
  { 
    title: "Calendar", 
    url: "/calendar", 
    icon: Calendar,
    description: "Manage events and tame your time effectively",
    color: "from-red-500 to-rose-500"
  },
  { 
    title: "Presentations", 
    url: "/presentations", 
    icon: Presentation,
    description: "Create beautiful slides from Markdown",
    color: "from-indigo-500 to-blue-500"
  },
  { 
    title: "Podcast Player", 
    url: "/podcasts", 
    icon: Podcast,
    description: "Listen to and manage your podcast library",
    color: "from-violet-500 to-purple-500"
  },
  { 
    title: "Budget Tracker", 
    url: "/budget", 
    icon: Wallet,
    description: "Track finances and manage your budget",
    color: "from-teal-500 to-cyan-500"
  },
  { 
    title: "Audio Tagger", 
    url: "/audio", 
    icon: Music,
    description: "Edit metadata tags for your audio files",
    color: "from-pink-500 to-rose-500"
  },
  { 
    title: "Email Reader", 
    url: "/email", 
    icon: Mail,
    description: "Browse and search MBOX email archives",
    color: "from-cyan-500 to-blue-500"
  },
];

export default function Dashboard() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to Your Productivity Suite
        </h1>
        <p className="text-muted-foreground text-lg">
          A unified collection of powerful tools for your daily workflow. All data stays local—no servers, complete privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.url} to={tool.url} className="group">
            <Card className="h-full border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {tool.title}
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-16 p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-2xl font-bold mb-3">Offline-First Architecture</h2>
        <p className="text-muted-foreground mb-4">
          This suite runs entirely in your browser. No data is sent to external servers. 
          Your files, settings, and personal information remain on your device.
        </p>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span>100% Local Storage</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>No External Dependencies</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span>Works Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
