import { Badge } from "@/components/ui/badge";
import type { ContentStatus } from "@shared/schema";
import { FileEdit, Clock, CheckCircle2 } from "lucide-react";

interface StatusBadgeProps {
  status: ContentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "draft":
      return (
        <Badge
          variant="secondary"
          className="gap-1"
          data-testid="badge-status-draft"
        >
          <FileEdit className="h-3 w-3" />
          Draft
        </Badge>
      );
    case "pending_approval":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1"
          data-testid="badge-status-pending"
        >
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "published":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1"
          data-testid="badge-status-published"
        >
          <CheckCircle2 className="h-3 w-3" />
          Published
        </Badge>
      );
  }
}
