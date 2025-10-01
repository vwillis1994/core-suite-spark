import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Download, Search } from "lucide-react";
import { toast } from "sonner";

interface Podcast {
  title: string;
  url: string;
  episodes: Episode[];
}

interface Episode {
  title: string;
  url: string;
  description: string;
  pubDate: string;
}

export default function PodcastPlayer() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [newFeedUrl, setNewFeedUrl] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("podcasts");
    if (saved) setPodcasts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("podcasts", JSON.stringify(podcasts));
  }, [podcasts]);

  const addPodcast = async () => {
    if (!newFeedUrl.trim()) return;

    try {
      const response = await fetch(newFeedUrl);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/xml");

      const title = doc.querySelector("channel > title")?.textContent || "Untitled";
      const items = Array.from(doc.querySelectorAll("item")).map(item => ({
        title: item.querySelector("title")?.textContent || "Untitled",
        url: item.querySelector("enclosure")?.getAttribute("url") || "",
        description: item.querySelector("description")?.textContent || "",
        pubDate: item.querySelector("pubDate")?.textContent || ""
      })).filter(ep => ep.url);

      setPodcasts([...podcasts, { title, url: newFeedUrl, episodes: items }]);
      setNewFeedUrl("");
      toast.success(`Added ${title}`);
    } catch (error) {
      toast.error("Failed to add podcast");
    }
  };

  const exportOPML = () => {
    const opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head><title>Podcast Subscriptions</title></head>
  <body>
${podcasts.map(p => `    <outline text="${p.title}" type="rss" xmlUrl="${p.url}"/>`).join("\n")}
  </body>
</opml>`;

    const blob = new Blob([opml], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "podcasts.opml";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full grid grid-cols-[260px_360px_1fr] gap-4 p-4">
      <Card className="flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm mb-2">My Podcasts</h3>
          <div className="flex gap-2">
            <Input
              placeholder="RSS URL..."
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPodcast()}
            />
            <Button size="sm" onClick={addPodcast}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-2 space-y-1">
          {podcasts.map((podcast, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg cursor-pointer ${selectedPodcast?.url === podcast.url ? "bg-primary/10 border border-primary" : "hover:bg-muted"}`}
              onClick={() => setSelectedPodcast(podcast)}
            >
              <div className="font-medium text-sm">{podcast.title}</div>
              <div className="text-xs text-muted-foreground">{podcast.episodes.length} episodes</div>
            </div>
          ))}
        </div>
        <div className="p-2 border-t">
          <Button size="sm" variant="outline" className="w-full" onClick={exportOPML}>
            <Download className="h-4 w-4" /> Export OPML
          </Button>
        </div>
      </Card>

      <Card className="flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Episodes</h3>
        </div>
        <div className="flex-1 overflow-auto p-2 space-y-1">
          {selectedPodcast?.episodes.map((episode, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg cursor-pointer ${currentEpisode?.url === episode.url ? "bg-secondary/10 border border-secondary" : "hover:bg-muted"}`}
              onClick={() => setCurrentEpisode(episode)}
            >
              <div className="font-medium text-sm">{episode.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(episode.pubDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Now Playing</h3>
          <p className="text-xs text-muted-foreground">{selectedPodcast?.title || "—"}</p>
        </div>
        <div className="flex-1 p-4">
          {currentEpisode ? (
            <div>
              <h4 className="font-semibold mb-2">{currentEpisode.title}</h4>
              <audio controls className="w-full mb-4" src={currentEpisode.url} />
              <div className="text-sm text-muted-foreground prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentEpisode.description }} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select an episode to play</p>
          )}
        </div>
      </Card>
    </div>
  );
}
