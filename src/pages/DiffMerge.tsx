import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, Download, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

export default function DiffMerge() {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [mergedText, setMergedText] = useState("");
  const [diffLines, setDiffLines] = useState<Array<{type: string, left: string, right: string}>>([]);

  const computeDiff = () => {
    const leftLines = leftText.split("\n");
    const rightLines = rightText.split("\n");
    const diff: Array<{type: string, left: string, right: string}> = [];
    
    const maxLen = Math.max(leftLines.length, rightLines.length);
    for (let i = 0; i < maxLen; i++) {
      const l = leftLines[i] || "";
      const r = rightLines[i] || "";
      
      if (l === r) {
        diff.push({ type: "eq", left: l, right: r });
      } else if (!l) {
        diff.push({ type: "add", left: "", right: r });
      } else if (!r) {
        diff.push({ type: "del", left: l, right: "" });
      } else {
        diff.push({ type: "chg", left: l, right: r });
      }
    }
    
    setDiffLines(diff);
  };

  const autoMerge = () => {
    const merged = diffLines.map(line => {
      if (line.type === "add") return line.right;
      if (line.type === "del") return line.left;
      if (line.type === "chg") return line.right; // prefer right on conflict
      return line.left;
    }).join("\n");
    
    setMergedText(merged);
    toast.success("Auto-merged successfully");
  };

  const acceptLeft = () => {
    setMergedText(leftText);
    toast.success("Accepted left version");
  };

  const acceptRight = () => {
    setMergedText(rightText);
    toast.success("Accepted right version");
  };

  const swap = () => {
    const temp = leftText;
    setLeftText(rightText);
    setRightText(temp);
  };

  const loadFile = (side: "left" | "right", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (side === "left") setLeftText(text);
      else setRightText(text);
    };
    reader.readAsText(file);
  };

  const exportMerged = () => {
    const blob = new Blob([mergedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    computeDiff();
  }, [leftText, rightText]);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-card/50 px-4 py-3 flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => document.getElementById('left-file-input')?.click()}>
          <Upload className="h-4 w-4" />
          Open Left
        </Button>
        <input id="left-file-input" type="file" className="hidden" onChange={(e) => loadFile("left", e)} />
        
        <Button variant="outline" size="sm" onClick={() => document.getElementById('right-file-input')?.click()}>
          <Upload className="h-4 w-4" />
          Open Right
        </Button>
        <input id="right-file-input" type="file" className="hidden" onChange={(e) => loadFile("right", e)} />
        <Button variant="outline" size="sm" onClick={swap}>
          <ArrowLeftRight className="h-4 w-4" />
          Swap
        </Button>
        <Button size="sm" onClick={computeDiff}>Compute Diff</Button>
        <Button size="sm" onClick={autoMerge}>Auto-merge</Button>
        <Button size="sm" variant="outline" onClick={acceptLeft}>Accept Left</Button>
        <Button size="sm" variant="outline" onClick={acceptRight}>Accept Right</Button>
        <Button size="sm" variant="outline" onClick={exportMerged}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
        <Card className="flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b bg-muted/30">
            <span className="text-sm font-semibold">LEFT</span>
          </div>
          <Textarea
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            className="flex-1 border-0 resize-none font-mono text-sm"
            placeholder="Paste left text..."
          />
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b bg-muted/30">
            <span className="text-sm font-semibold">RIGHT</span>
          </div>
          <Textarea
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            className="flex-1 border-0 resize-none font-mono text-sm"
            placeholder="Paste right text..."
          />
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b bg-muted/30">
            <span className="text-sm font-semibold">MERGED</span>
          </div>
          <Textarea
            value={mergedText}
            onChange={(e) => setMergedText(e.target.value)}
            className="flex-1 border-0 resize-none font-mono text-sm"
            placeholder="Merged result..."
          />
        </Card>

        <Card className="col-span-3 overflow-auto">
          <div className="px-4 py-2 border-b bg-muted/30">
            <span className="text-sm font-semibold">DIFF</span>
          </div>
          <div className="p-4 font-mono text-sm">
            {diffLines.map((line, idx) => (
              <div
                key={idx}
                className={`py-1 px-2 ${
                  line.type === "add" ? "bg-green-500/20" :
                  line.type === "del" ? "bg-red-500/20" :
                  line.type === "chg" ? "bg-yellow-500/20" : ""
                }`}
              >
                {line.type === "add" && <span className="text-green-500">+ {line.right}</span>}
                {line.type === "del" && <span className="text-red-500">- {line.left}</span>}
                {line.type === "chg" && (
                  <>
                    <span className="text-yellow-500">± {line.left} → {line.right}</span>
                  </>
                )}
                {line.type === "eq" && <span className="text-muted-foreground">  {line.left}</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
