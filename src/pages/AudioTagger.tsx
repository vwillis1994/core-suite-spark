import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Download, Save } from "lucide-react";
import { toast } from "sonner";

interface AudioFile {
  name: string;
  url: string;
  tags: {
    title: string;
    artist: string;
    album: string;
    year: string;
    genre: string;
  };
}

export default function AudioTagger() {
  const [files, setFiles] = useState<AudioFile[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    
    uploadedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setFiles(prev => [...prev, {
        name: file.name,
        url,
        tags: {
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "",
          album: "",
          year: "",
          genre: ""
        }
      }]);
    });
    
    toast.success(`Loaded ${uploadedFiles.length} file(s)`);
  };

  const updateTags = (index: number, field: string, value: string) => {
    setFiles(files.map((file, idx) => 
      idx === index ? { ...file, tags: { ...file.tags, [field]: value } } : file
    ));
  };

  const saveTags = (index: number) => {
    toast.success("Tags saved (note: actual file modification requires backend)");
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Audio Tag Editor</h1>
        <Button onClick={() => document.getElementById('audio-upload')?.click()}>
          <Upload className="h-4 w-4" /> Choose Files
        </Button>
        <input
          id="audio-upload"
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {files.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No files loaded. Click "Choose Files" to get started.</p>
          <p className="text-sm text-muted-foreground mt-2">Supported: MP3, FLAC, and other audio formats</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, idx) => (
            <Card key={idx} className="p-4">
              <div className="font-semibold mb-2 truncate" title={file.name}>{file.name}</div>
              <audio controls className="w-full mb-4" src={file.url} />
              
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={file.tags.title}
                    onChange={(e) => updateTags(idx, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Artist</label>
                  <Input
                    value={file.tags.artist}
                    onChange={(e) => updateTags(idx, "artist", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Album</label>
                  <Input
                    value={file.tags.album}
                    onChange={(e) => updateTags(idx, "album", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Year</label>
                    <Input
                      value={file.tags.year}
                      onChange={(e) => updateTags(idx, "year", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Genre</label>
                    <Input
                      value={file.tags.genre}
                      onChange={(e) => updateTags(idx, "genre", e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={() => saveTags(idx)} className="w-full">
                  <Save className="h-4 w-4" /> Save Tags
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
