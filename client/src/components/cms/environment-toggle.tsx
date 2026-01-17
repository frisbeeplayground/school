import { useCMS } from "@/lib/cms-context";
import { Button } from "@/components/ui/button";
import { FlaskConical, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function EnvironmentToggle() {
  const { environment, setEnvironment } = useCMS();

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-1.5 h-7 px-2.5",
          environment === "sandbox" &&
            "bg-amber-500/15 text-amber-700 dark:text-amber-400"
        )}
        onClick={() => setEnvironment("sandbox")}
        data-testid="button-env-sandbox"
      >
        <FlaskConical className="h-3.5 w-3.5" />
        Sandbox
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-1.5 h-7 px-2.5",
          environment === "live" &&
            "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
        )}
        onClick={() => setEnvironment("live")}
        data-testid="button-env-live"
      >
        <Globe className="h-3.5 w-3.5" />
        Live
      </Button>
    </div>
  );
}
