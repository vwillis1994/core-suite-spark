import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Download, Upload, Eye, Code } from "lucide-react";

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("# Welcome to Markdown Editor\n\nStart writing your document here...\n\n## Features\n- Live preview\n- Math support (coming soon)\n- Export to HTML\n\n**Bold text** and *italic text*\n\n```javascript\nconst hello = 'world';\n```");
  const [showPreview, setShowPreview] = useState(true);

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMarkdown(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card/50 px-4 py-3 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => document.getElementById('upload')?.click()}>
          <Upload className="h-4 w-4" />
          Load
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Save
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPreview ? 'Editor Only' : 'Split View'}
        </Button>
        <input type="file" id="upload" className="hidden" accept=".md,.txt" onChange={handleUpload} />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
        <Card className={`flex flex-col ${!showPreview ? 'md:col-span-2' : ''}`}>
          <div className="px-4 py-2 border-b border-border bg-muted/30">
            <span className="text-sm font-semibold text-muted-foreground">EDITOR</span>
          </div>
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 border-0 resize-none focus-visible:ring-0 font-mono text-sm"
            placeholder="Start typing..."
          />
        </Card>

        {showPreview && (
          <Card className="flex flex-col overflow-hidden">
            <div className="px-4 py-2 border-b border-border bg-muted/30">
              <span className="text-sm font-semibold text-muted-foreground">PREVIEW</span>
            </div>
            <div className="flex-1 p-6 overflow-auto prose prose-invert prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(markdown) }} />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// Simple markdown to HTML converter (basic implementation)
function convertMarkdownToHTML(md: string): string {
  let html = md;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  return html;
}
