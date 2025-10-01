import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Download, Upload, Search, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Feed {
  url: string;
  title: string;
  added: number;
}

interface FeedItem {
  title: string;
  link: string;
  content: string;
  pubDate: string;
  feedTitle: string;
}

export default function RSSReader() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null);
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [useProxy, setUseProxy] = useState(false);

  useEffect(() => {
    const savedFeeds = localStorage.getItem("rss_feeds");
    const savedCache = localStorage.getItem("rss_cache");
    if (savedFeeds) setFeeds(JSON.parse(savedFeeds));
    if (savedCache) setItems(JSON.parse(savedCache));
  }, []);

  useEffect(() => {
    localStorage.setItem("rss_feeds", JSON.stringify(feeds));
  }, [feeds]);

  useEffect(() => {
    localStorage.setItem("rss_cache", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    let filtered = selectedFeed
      ? items.filter(item => item.feedTitle === selectedFeed)
      : items;
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(filtered);
  }, [selectedFeed, searchTerm, items]);

  const addFeed = async () => {
    if (!newFeedUrl.trim()) return;
    
    try {
      const url = useProxy 
        ? `https://api.allorigins.win/raw?url=${encodeURIComponent(newFeedUrl)}`
        : newFeedUrl;
      
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/xml");
      
      const title = doc.querySelector("channel > title")?.textContent || newFeedUrl;
      const feedItems = Array.from(doc.querySelectorAll("item")).map(item => ({
        title: item.querySelector("title")?.textContent || "Untitled",
        link: item.querySelector("link")?.textContent || "",
        content: item.querySelector("description")?.textContent || "",
        pubDate: item.querySelector("pubDate")?.textContent || "",
        feedTitle: title
      }));

      setFeeds([...feeds, { url: newFeedUrl, title, added: Date.now() }]);
      setItems([...items, ...feedItems]);
      setNewFeedUrl("");
      toast.success(`Added ${title}`);
    } catch (error) {
      toast.error("Failed to fetch feed");
    }
  };

  const removeFeed = (url: string) => {
    setFeeds(feeds.filter(f => f.url !== url));
    setItems(items.filter(item => {
      const feed = feeds.find(f => f.url === url);
      return item.feedTitle !== feed?.title;
    }));
  };

  const exportOPML = () => {
    const opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head><title>Subscriptions</title></head>
  <body>
${feeds.map(f => `    <outline text="${f.title}" type="rss" xmlUrl="${f.url}"/>`).join("\n")}
  </body>
</opml>`;
    
    const blob = new Blob([opml], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscriptions.opml";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full grid grid-cols-[320px_1fr] gap-4 p-4">
      <Card className="flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-sm flex items-center justify-between">
            Feeds
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={exportOPML}>
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Feed URL..."
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFeed()}
            />
            <Button size="sm" onClick={addFeed}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useProxy}
              onChange={(e) => setUseProxy(e.target.checked)}
            />
            Use CORS proxy
          </label>
          <div className="space-y-1 overflow-auto max-h-[calc(100vh-300px)]">
            {feeds.map(feed => (
              <div
                key={feed.url}
                className={`p-2 rounded-lg cursor-pointer border transition-colors ${
                  selectedFeed === feed.title ? "bg-primary/10 border-primary" : "border-transparent hover:bg-muted"
                }`}
                onClick={() => setSelectedFeed(selectedFeed === feed.title ? null : feed.title)}
              >
                <div className="font-medium text-sm">{feed.title}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground truncate">{feed.url}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => { e.stopPropagation(); removeFeed(feed.url); }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">{selectedFeed || "All Items"}</CardTitle>
            <div className="flex-1" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Button size="sm" variant="ghost">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {filteredItems.map((item, idx) => (
              <div key={idx} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <div className="text-sm text-muted-foreground mb-2">
                  {item.feedTitle} • {new Date(item.pubDate).toLocaleDateString()}
                </div>
                <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.content.substring(0, 200) + "..." }} />
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary mt-2 inline-block">
                    Read more →
                  </a>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
