import { useState } from "react";
import { CMSHeader } from "@/components/cms/cms-header";
import { NoticeCard } from "@/components/cms/notice-card";
import { NoticeDialog } from "@/components/cms/notice-dialog";
import { EmptyState } from "@/components/cms/empty-state";
import { Button } from "@/components/ui/button";
import { useCMS } from "@/lib/cms-context";
import { useToast } from "@/hooks/use-toast";
import type { Notice } from "@shared/schema";
import {
  Plus,
  Bell,
  Clock,
  Send,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function CMSNotices() {
  const { environment, currentSchool } = useCMS();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  const { data: notices = [], isLoading } = useQuery<Notice[]>({
    queryKey: ["/api/notices", { schoolId: currentSchool?.id, environment }],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Notice>) => {
      return apiRequest("POST", "/api/notices", {
        ...data,
        schoolId: currentSchool?.id,
        environment,
        status: "draft",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      toast({
        title: "Notice created",
        description: "Your new notice has been added.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Notice>) => {
      return apiRequest("PATCH", `/api/notices/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      toast({
        title: "Notice updated",
        description: "Your changes have been saved.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/notices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      toast({
        title: "Notice deleted",
        description: "The notice has been removed.",
      });
    },
  });

  const submitForApprovalMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/notices/${id}/submit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      toast({
        title: "Submitted for approval",
        description: "An admin will review your changes.",
      });
    },
  });

  const handleSave = (data: Partial<Notice>) => {
    if (data.id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleTogglePin = (id: string, pinned: boolean) => {
    updateMutation.mutate({ id, pinned });
  };

  const handleAddNew = () => {
    setEditingNotice(null);
    setDialogOpen(true);
  };

  const draftNotices = notices.filter((n) => n.status === "draft");
  const pinnedNotices = notices.filter((n) => n.pinned);
  const unpinnedNotices = notices.filter((n) => !n.pinned);
  const sortedNotices = [...pinnedNotices, ...unpinnedNotices];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <CMSHeader title="Notices" />

      {environment === "sandbox" && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2">
          <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              Editing <strong>Sandbox</strong> - Changes require approval
            </span>
          </p>
        </div>
      )}

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">School Notices</h2>
              <p className="text-sm text-muted-foreground">
                Manage announcements and notices for your school
              </p>
            </div>
            <div className="flex gap-2">
              {draftNotices.length > 0 && (
                <Button
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => {
                    draftNotices.forEach((n) =>
                      submitForApprovalMutation.mutate(n.id)
                    );
                  }}
                  disabled={submitForApprovalMutation.isPending}
                  data-testid="button-submit-all-notices"
                >
                  <Send className="h-4 w-4" />
                  Submit All for Approval
                </Button>
              )}
              <Button className="gap-1.5" onClick={handleAddNew} data-testid="button-add-notice">
                <Plus className="h-4 w-4" />
                Create Notice
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : notices.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notices yet"
              description="Create your first notice to announce important updates to your school community."
              actionLabel="Create First Notice"
              onAction={handleAddNew}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sortedNotices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <NoticeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        notice={editingNotice}
        onSave={handleSave}
      />
    </div>
  );
}
