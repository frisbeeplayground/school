import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Lead } from "@shared/schema";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  Calendar,
  Pencil,
  User,
  MessageSquare,
  FileText,
  GraduationCap,
  Globe,
  UserPlus,
  UserCheck,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onEdit: (lead: Lead) => void;
  onStatusChange: (id: string, status: string) => void;
}

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  enrolled: "Enrolled",
  lost: "Lost",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500 text-white",
  contacted: "bg-amber-500 text-white",
  qualified: "bg-purple-500 text-white",
  enrolled: "bg-green-500 text-white",
  lost: "bg-gray-400 text-white",
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

export function LeadDetailsDialog({
  open,
  onOpenChange,
  lead,
  onEdit,
  onStatusChange,
}: LeadDetailsDialogProps) {
  if (!lead) return null;

  const StatusIcon = statusIcons[lead.status] || UserPlus;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg",
                  statusColors[lead.status]?.replace("text-white", "") || "bg-gray-500"
                )}
              >
                {lead.firstName[0]}{lead.lastName[0]}
              </div>
              <div>
                <DialogTitle className="text-xl mb-1">
                  {lead.firstName} {lead.lastName}
                </DialogTitle>
                <Badge className={cn("gap-1", statusColors[lead.status])}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusLabels[lead.status]}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                onOpenChange(false);
                onEdit(lead);
              }}
              data-testid="button-edit-lead-details"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <a href={`mailto:${lead.email}`} className="text-sm font-medium text-primary hover:underline">
                  {lead.email}
                </a>
              </div>
            </div>
            
            {lead.phone && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Phone</div>
                  <a href={`tel:${lead.phone}`} className="text-sm font-medium text-primary hover:underline">
                    {lead.phone}
                  </a>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Source</div>
                  <div className="text-sm font-medium">{sourceLabels[lead.source] || lead.source}</div>
                </div>
              </div>
              {lead.gradeInterest && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Interest</div>
                    <div className="text-sm font-medium">{lead.gradeInterest}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Created</div>
                  <div className="text-sm font-medium">
                    {format(new Date(lead.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Last Updated</div>
                  <div className="text-sm font-medium">
                    {format(new Date(lead.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {lead.message && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <MessageSquare className="h-4 w-4" />
                  Inquiry Message
                </div>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {lead.message}
                </p>
              </div>
            </>
          )}

          {lead.notes && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FileText className="h-4 w-4" />
                  Internal Notes
                </div>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                  {lead.notes}
                </p>
              </div>
            </>
          )}

          <Separator />

          <div>
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <User className="h-4 w-4" />
              Update Status
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusLabels).map(([value, label]) => (
                <Button
                  key={value}
                  variant={lead.status === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange(lead.id, value)}
                  data-testid={`button-status-${value}`}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
