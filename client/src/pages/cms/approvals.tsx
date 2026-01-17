import { CMSHeader } from "@/components/cms/cms-header";
import { ApprovalCard } from "@/components/cms/approval-card";
import { EmptyState } from "@/components/cms/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCMS } from "@/lib/cms-context";
import { useToast } from "@/hooks/use-toast";
import {
  CheckSquare,
  FileText,
  Bell,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PageSection, Notice } from "@shared/schema";

interface ApprovalItem {
  id: string;
  type: "section" | "notice";
  title: string;
  submittedBy: string;
  submittedAt: string | Date;
  changes?: string;
}

export default function CMSApprovals() {
  const { currentSchool } = useCMS();
  const { toast } = useToast();

  const { data: sections = [] } = useQuery<PageSection[]>({
    queryKey: ["/api/sections", { schoolId: currentSchool?.id }],
  });

  const { data: notices = [] } = useQuery<Notice[]>({
    queryKey: ["/api/notices", { schoolId: currentSchool?.id }],
  });

  const pendingSections = sections.filter((s) => s.status === "pending_approval");
  const pendingNotices = notices.filter((n) => n.status === "pending_approval");

  const sectionApprovals: ApprovalItem[] = pendingSections.map((s) => ({
    id: s.id,
    type: "section" as const,
    title: (s.props as { title?: string; heading?: string }).title || 
           (s.props as { title?: string; heading?: string }).heading || 
           `${s.type} Section`,
    submittedBy: s.updatedBy || "Editor",
    submittedAt: String(s.updatedAt),
    changes: `Updated ${s.type} section content`,
  }));

  const noticeApprovals: ApprovalItem[] = pendingNotices.map((n) => ({
    id: n.id,
    type: "notice" as const,
    title: n.title,
    submittedBy: n.updatedBy || "Editor",
    submittedAt: String(n.createdAt),
    changes: n.description.slice(0, 100) + (n.description.length > 100 ? "..." : ""),
  }));

  const allApprovals = [...sectionApprovals, ...noticeApprovals];

  const approveSectionMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/sections/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      toast({
        title: "Section approved",
        description: "The section has been published to the live site.",
      });
    },
  });

  const approveNoticeMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/notices/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      toast({
        title: "Notice approved",
        description: "The notice has been published to the live site.",
      });
    },
  });

  const rejectSectionMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/sections/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      toast({
        title: "Section rejected",
        description: "The section has been returned to draft.",
      });
    },
  });

  const rejectNoticeMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/notices/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      toast({
        title: "Notice rejected",
        description: "The notice has been returned to draft.",
      });
    },
  });

  const handleApprove = (item: ApprovalItem) => {
    if (item.type === "section") {
      approveSectionMutation.mutate(item.id);
    } else {
      approveNoticeMutation.mutate(item.id);
    }
  };

  const handleReject = (item: ApprovalItem) => {
    if (item.type === "section") {
      rejectSectionMutation.mutate(item.id);
    } else {
      rejectNoticeMutation.mutate(item.id);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <CMSHeader title="Approval Queue" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Pending Approvals</h2>
            <p className="text-sm text-muted-foreground">
              Review and approve content changes before they go live
            </p>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all">
                All ({allApprovals.length})
              </TabsTrigger>
              <TabsTrigger value="sections" data-testid="tab-sections">
                <FileText className="h-4 w-4 mr-1.5" />
                Sections ({sectionApprovals.length})
              </TabsTrigger>
              <TabsTrigger value="notices" data-testid="tab-notices">
                <Bell className="h-4 w-4 mr-1.5" />
                Notices ({noticeApprovals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {allApprovals.length === 0 ? (
                <EmptyState
                  icon={CheckSquare}
                  title="All caught up!"
                  description="There are no pending approvals at this time."
                />
              ) : (
                <div className="space-y-4">
                  {allApprovals.map((item) => (
                    <ApprovalCard
                      key={`${item.type}-${item.id}`}
                      item={item}
                      onApprove={() => handleApprove(item)}
                      onReject={() => handleReject(item)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sections" className="space-y-4">
              {sectionApprovals.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No pending sections"
                  description="All section changes have been reviewed."
                />
              ) : (
                <div className="space-y-4">
                  {sectionApprovals.map((item) => (
                    <ApprovalCard
                      key={item.id}
                      item={item}
                      onApprove={() => handleApprove(item)}
                      onReject={() => handleReject(item)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="notices" className="space-y-4">
              {noticeApprovals.length === 0 ? (
                <EmptyState
                  icon={Bell}
                  title="No pending notices"
                  description="All notice changes have been reviewed."
                />
              ) : (
                <div className="space-y-4">
                  {noticeApprovals.map((item) => (
                    <ApprovalCard
                      key={item.id}
                      item={item}
                      onApprove={() => handleApprove(item)}
                      onReject={() => handleReject(item)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
