import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-6xl font-bold text-emerald-600 dark:text-emerald-400">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button onClick={() => navigate("/")}>
        Return to Dashboard
      </Button>
    </div>
  );
}