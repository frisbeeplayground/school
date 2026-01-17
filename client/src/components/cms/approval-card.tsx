import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Bell,
  User,
} from "lucide-react";
import { format } from "date-fns";

interface ApprovalItem {
  id: string;
  type: "section" | "notice";
  title: string;
  submittedBy: string;
  submittedAt: string;
  changes?: string;
}

interface ApprovalCardProps {
  item: ApprovalItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApprovalCard({ item, onApprove, onReject }: ApprovalCardProps) {
  const TypeIcon = item.type === "section" ? FileText : Bell;

  return (
    <Card className="hover-elevate" data-testid={`card-approval-${item.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-4 pb-0">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-500/10">
            <TypeIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.title}</span>
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 text-xs"
              >
                <Clock className="h-3 w-3" />
                Pending
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="capitalize text-xs">
                {item.type}
              </Badge>
              <span>submitted {format(new Date(item.submittedAt), "MMM d, h:mm a")}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {item.submittedBy.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {item.submittedBy}
          </span>
        </div>
        {item.changes && (
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-2 mt-2">
            {item.changes}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={() => onReject(item.id)}
          data-testid={`button-reject-${item.id}`}
        >
          <XCircle className="h-4 w-4" />
          Reject
        </Button>
        <Button
          size="sm"
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => onApprove(item.id)}
          data-testid={`button-approve-${item.id}`}
        >
          <CheckCircle2 className="h-4 w-4" />
          Approve & Publish
        </Button>
      </CardFooter>
    </Card>
  );
}
