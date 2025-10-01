import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <Card className="p-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Construction className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-3">{title}</h1>
        <p className="text-muted-foreground mb-8 text-lg">{description}</p>
        <div className="p-4 rounded-lg bg-muted/30 mb-8">
          <p className="text-sm">
            This tool is being migrated from the original single-file HTML implementation to React. 
            Core functionality will be available soon with an enhanced UI and better integration.
          </p>
        </div>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Card>
    </div>
  );
}
