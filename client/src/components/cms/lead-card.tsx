import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Lead } from "@shared/schema";
import { format } from "date-fns";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Eye,
  UserPlus,
  UserCheck,
  GraduationCap,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onViewDetails: (lead: Lead) => void;
  statusColors: Record<string, string>;
}

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  enrolled: "Enrolled",
  lost: "Lost",
};

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  new: UserPlus,
  contacted: UserCheck,
  qualified: GraduationCap,
  enrolled: GraduationCap,
  lost: UserX,
};

const sourceLabels: Record<string, string> = {
  website: "Website",
  phone: "Phone",
  referral: "Referral",
  event: "Event",
  social: "Social Media",
  other: "Other",
};

export function LeadCard({
  lead,
  onEdit,
  onDelete,
  onStatusChange,
  onViewDetails,
  statusColors,
}: LeadCardProps) {
  const StatusIcon = statusIcons[lead.status] || UserPlus;

  return (
    <Card
      className="group hover-elevate overflow-visible cursor-pointer"
      onClick={() => onViewDetails(lead)}
      data-testid={`card-lead-${lead.id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm",
                statusColors[lead.status] || "bg-gray-500"
              )}
            >
              {lead.firstName[0]}{lead.lastName[0]}
            </div>
            <div>
              <h3 className="font-semibold text-base">
                {lead.firstName} {lead.lastName}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusLabels[lead.status]}
                </Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-lead-menu-${lead.id}`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onViewDetails(lead)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(lead)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onStatusChange(lead.id, "new")}>
                Mark as New
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(lead.id, "contacted")}>
                Mark as Contacted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(lead.id, "qualified")}>
                Mark as Qualified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(lead.id, "enrolled")}>
                Mark as Enrolled
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(lead.id, "lost")}>
                Mark as Lost
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(lead.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          <span className="truncate">{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            <span>{lead.phone}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Badge variant="secondary" className="text-xs">
            {sourceLabels[lead.source] || lead.source}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(lead.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
