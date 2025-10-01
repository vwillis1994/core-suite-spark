import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Email {
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
}

export default function EmailReader() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const parseMbox = (text: string): Email[] => {
    const messages = text.split(/\n(?=From )/);
    
    return messages.map(message => {
      const lines = message.split("\n");
      const headers: Record<string, string> = {};
      let bodyStart = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === "") {
          bodyStart = i + 1;
          break;
        }
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          headers[match[1].toLowerCase()] = match[2];
        }
      }

      return {
        subject: headers["subject"] || "(no subject)",
        from: headers["from"] || "",
        to: headers["to"] || "",
        date: headers["date"] || "",
        body: lines.slice(bodyStart).join("\n")
      };
    }).filter(email => email.from);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseMbox(text);
      setEmails(parsed);
      toast.success(`Loaded ${parsed.length} emails`);
    };
    reader.readAsText(file);
  };

  const filteredEmails = searchTerm
    ? emails.filter(email =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.body.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : emails;

  return (
    <div className="h-full grid grid-cols-[360px_1fr] gap-4 p-4">
      <Card className="flex flex-col">
        <div className="p-4 border-b space-y-2">
          <Button className="w-full" onClick={() => document.getElementById('mbox-upload')?.click()}>
            <Upload className="h-4 w-4" /> Open MBOX
          </Button>
          <input
            id="mbox-upload"
            type="file"
            accept=".mbox,*/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Input
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filteredEmails.length} messages</span>
            <Button size="sm" variant="ghost" onClick={() => { setEmails([]); setSelectedEmail(null); }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2 space-y-1">
          {filteredEmails.map((email, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg cursor-pointer ${selectedEmail === email ? "bg-primary/10 border border-primary" : "hover:bg-muted"}`}
              onClick={() => setSelectedEmail(email)}
            >
              <div className="font-semibold text-sm truncate">{email.subject}</div>
              <div className="text-xs text-muted-foreground truncate">{email.from}</div>
              <div className="text-xs text-muted-foreground">{email.date}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col">
        {selectedEmail ? (
          <>
            <div className="p-4 border-b space-y-2">
              <h2 className="text-xl font-bold">{selectedEmail.subject}</h2>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">From:</span> {selectedEmail.from}</div>
                <div><span className="font-medium">To:</span> {selectedEmail.to}</div>
                <div><span className="font-medium">Date:</span> {selectedEmail.date}</div>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm">{selectedEmail.body}</pre>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">
              {emails.length === 0 ? "Load an MBOX file to get started" : "Select a message to view"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
