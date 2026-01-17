import { Badge } from "@/components/ui/badge";
import { useCMS } from "@/lib/cms-context";
import { FlaskConical, Globe } from "lucide-react";

export function EnvironmentBadge() {
  const { environment } = useCMS();

  if (environment === "sandbox") {
    return (
      <Badge
        variant="outline"
        className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1.5"
        data-testid="badge-environment-sandbox"
      >
        <FlaskConical className="h-3 w-3" />
        Sandbox
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1.5"
      data-testid="badge-environment-live"
    >
      <Globe className="h-3 w-3" />
      Live
    </Badge>
  );
}
