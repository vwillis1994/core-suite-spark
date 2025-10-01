import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Play, Square, Upload, Download } from "lucide-react";

export default function Presentations() {
  const [markdown, setMarkdown] = useState("# Welcome\n\nYour first slide\n\n---\n\n# Slide 2\n\n- Point 1\n- Point 2\n- Point 3");
  const [slides, setSlides] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [presenting, setPresenting] = useState(false);

  useEffect(() => {
    const slideTexts = markdown.split(/\n---\n/);
    setSlides(slideTexts.filter(s => s.trim()));
  }, [markdown]);

  const parseMarkdown = (md: string) => {
    let html = md;
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    return html;
  };

  const nextSlide = () => setCurrentSlide(Math.min(currentSlide + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide(Math.max(currentSlide - 1, 0));

  const saveMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "slides.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadMarkdown = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setMarkdown(event.target?.result as string);
    reader.readAsText(file);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (presenting) {
        if (e.key === "ArrowRight" || e.key === " ") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "Escape") setPresenting(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [presenting, currentSlide]);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-card/50 px-4 py-3 flex items-center gap-2">
        <Button size="sm" variant={presenting ? "default" : "outline"} onClick={() => setPresenting(!presenting)}>
          {presenting ? <><Square className="h-4 w-4" /> Exit</> : <><Play className="h-4 w-4" /> Present</>}
        </Button>
        <Button size="sm" variant="outline" onClick={prevSlide} disabled={currentSlide === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">{currentSlide + 1} / {slides.length}</span>
        <Button size="sm" variant="outline" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button size="sm" variant="outline" onClick={() => document.getElementById('md-upload')?.click()}>
          <Upload className="h-4 w-4" /> Open
        </Button>
        <input id="md-upload" type="file" accept=".md,.markdown" className="hidden" onChange={loadMarkdown} />
        <Button size="sm" variant="outline" onClick={saveMarkdown}>
          <Download className="h-4 w-4" /> Save
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        {!presenting && (
          <Card className="flex flex-col">
            <div className="px-4 py-2 border-b bg-muted/30">
              <span className="text-sm font-semibold">MARKDOWN EDITOR</span>
              <p className="text-xs text-muted-foreground">Separate slides with ---</p>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 border-0 resize-none font-mono text-sm"
            />
          </Card>
        )}

        <Card className={`flex flex-col ${presenting ? 'col-span-2' : ''}`}>
          <div className="px-4 py-2 border-b bg-muted/30">
            <span className="text-sm font-semibold">PREVIEW</span>
          </div>
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-8">
            <div className="w-full max-w-4xl aspect-video bg-card border shadow-2xl rounded-lg p-12 overflow-auto">
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(slides[currentSlide] || "") }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
