import { useState } from "react";
import { CMSHeader } from "@/components/cms/cms-header";
import { SectionCard } from "@/components/cms/section-card";
import { SectionDialog } from "@/components/cms/section-dialog";
import { EmptyState } from "@/components/cms/empty-state";
import { Button } from "@/components/ui/button";
import { useCMS } from "@/lib/cms-context";
import { useToast } from "@/hooks/use-toast";
import type { PageSection } from "@shared/schema";
import {
  Plus,
  FileText,
  Clock,
  Send,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function CMSSections() {
  const { environment, currentSchool } = useCMS();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);

  const { data: sections = [], isLoading } = useQuery<PageSection[]>({
    queryKey: ["/api/sections", { schoolId: currentSchool?.id, environment }],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<PageSection>) => {
      return apiRequest("POST", "/api/sections", {
        ...data,
        schoolId: currentSchool?.id,
        pageSlug: "home",
        environment,
        status: "draft",
        position: sections.length + 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      toast({
        title: "Section created",
        description: "Your new section has been added.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<PageSection>) => {
      return apiRequest("PATCH", `/api/sections/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      toast({
        title: "Section updated",
        description: "Your changes have been saved.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/sections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      toast({
        title: "Section deleted",
        description: "The section has been removed.",
      });
    },
  });

  const submitForApprovalMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/sections/${id}/submit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      toast({
        title: "Submitted for approval",
        description: "An admin will review your changes.",
      });
    },
  });

  const handleSave = (data: Partial<PageSection>) => {
    if (data.id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (section: PageSection) => {
    setEditingSection(section);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleToggleVisibility = (id: string, enabled: boolean) => {
    updateMutation.mutate({ id, enabled });
  };

  const handleAddNew = () => {
    setEditingSection(null);
    setDialogOpen(true);
  };

  const draftSections = sections.filter((s) => s.status === "draft");
  const pendingSections = sections.filter((s) => s.status === "pending_approval");

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <CMSHeader title="Page Sections" />

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
              <h2 className="text-xl font-semibold">Website Sections</h2>
              <p className="text-sm text-muted-foreground">
                Manage the sections that appear on your school website
              </p>
            </div>
            <div className="flex gap-2">
              {draftSections.length > 0 && (
                <Button
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => {
                    draftSections.forEach((s) =>
                      submitForApprovalMutation.mutate(s.id)
                    );
                  }}
                  disabled={submitForApprovalMutation.isPending}
                  data-testid="button-submit-all"
                >
                  <Send className="h-4 w-4" />
                  Submit All for Approval
                </Button>
              )}
              <Button className="gap-1.5" onClick={handleAddNew} data-testid="button-add-section">
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : sections.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No sections yet"
              description="Get started by adding your first section to the website."
              actionLabel="Add First Section"
              onAction={handleAddNew}
            />
          ) : (
            <div className="space-y-4">
              {pendingSections.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pending Approval ({pendingSections.length})
                  </h3>
                  <div className="space-y-3">
                    {pendingSections.map((section) => (
                      <SectionCard
                        key={section.id}
                        section={section}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleVisibility={handleToggleVisibility}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  All Sections ({sections.length})
                </h3>
                <div className="space-y-3">
                  {sections
                    .sort((a, b) => a.position - b.position)
                    .map((section) => (
                      <SectionCard
                        key={section.id}
                        section={section}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleVisibility={handleToggleVisibility}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <SectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        section={editingSection}
        onSave={handleSave}
      />
    </div>
  );
}
