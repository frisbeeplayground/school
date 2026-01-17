import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./status-badge";
import type { Notice } from "@shared/schema";
import {
  Pin,
  Edit2,
  Trash2,
  FileDown,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface NoticeCardProps {
  notice: Notice;
  onEdit: (notice: Notice) => void;
  onDelete: (noticeId: string) => void;
  onTogglePin: (noticeId: string, pinned: boolean) => void;
}

export function NoticeCard({
  notice,
  onEdit,
  onDelete,
  onTogglePin,
}: NoticeCardProps) {
  return (
    <Card
      className={cn(
        "hover-elevate transition-all group",
        notice.pinned && "border-primary/30 bg-primary/5"
      )}
      data-testid={`card-notice-${notice.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-4 pb-0">
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {notice.pinned && (
              <Pin className="h-4 w-4 text-primary shrink-0 rotate-45" />
            )}
            <span className="font-medium truncate">{notice.title}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={notice.status} />
            {notice.fileUrl && (
              <Badge variant="outline" className="gap-1 text-xs">
                <FileDown className="h-3 w-3" />
                Attachment
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTogglePin(notice.id, !notice.pinned)}
            className={cn(notice.pinned && "text-primary")}
            data-testid={`button-pin-notice-${notice.id}`}
          >
            <Pin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(notice)}
            data-testid={`button-edit-notice-${notice.id}`}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(notice.id)}
            data-testid={`button-delete-notice-${notice.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {notice.description}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{format(new Date(notice.createdAt), "MMM d, yyyy")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
