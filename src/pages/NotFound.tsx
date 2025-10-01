import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <Card className="p-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-destructive to-destructive/70 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-6xl font-bold mb-3">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;
