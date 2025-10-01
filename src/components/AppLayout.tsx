import { ReactNode } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
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
  Layers
} from "lucide-react";

const tools = [
  { title: "Dashboard", url: "/", icon: Layers },
  { title: "Markdown Editor", url: "/markdown", icon: FileText },
  { title: "Expense Splitter", url: "/expenses", icon: Receipt },
  { title: "RSS Reader", url: "/rss", icon: Rss },
  { title: "Diff & Merge", url: "/diff", icon: GitCompare },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Presentations", url: "/presentations", icon: Presentation },
  { title: "Podcast Player", url: "/podcasts", icon: Podcast },
  { title: "Budget Tracker", url: "/budget", icon: Wallet },
  { title: "Audio Tagger", url: "/audio", icon: Music },
  { title: "Email Reader", url: "/email", icon: Mail },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-bold tracking-wide">
            Productivity Suite
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((tool) => {
                const isActive = location.pathname === tool.url;
                return (
                  <SidebarMenuItem key={tool.url}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={tool.url} className="flex items-center gap-3">
                        <tool.icon className="h-4 w-4" />
                        <span>{tool.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="ml-4 font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Productivity Suite
            </div>
          </header>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
