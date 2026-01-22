import { CMSHeader } from "@/components/cms/cms-header";
import { StatsCard } from "@/components/cms/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  UserPlus,
  Search,
  Plus,
  MoreVertical,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Admission } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const statusOrder = [
  "inquiry",
  "applied",
  "documents_pending",
  "under_review",
  "interview_scheduled",
  "accepted",
  "enrolled",
  "rejected",
  "withdrawn",
];

const statusLabels: Record<string, string> = {
  inquiry: "Inquiry",
  applied: "Applied",
  documents_pending: "Documents Pending",
  under_review: "Under Review",
  interview_scheduled: "Interview Scheduled",
  accepted: "Accepted",
  enrolled: "Enrolled",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export default function AdmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const { toast } = useToast();

  const { data: admissions = [], isLoading } = useQuery<Admission[]>({
    queryKey: ["/api/admissions", statusFilter !== "all" ? statusFilter : undefined],
  });

  const { data: stats = [] } = useQuery<{ status: string; count: number }[]>({
    queryKey: ["/api/admissions/stats"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/admissions/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admissions/stats"] });
      toast({ title: "Status updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/admissions/${id}/enroll`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      queryClient.invalidateQueries({ queryKey: ["/api/students/dashboard-stats"] });
      setEnrollDialogOpen(false);
      setSelectedAdmission(null);
      toast({ title: "Student enrolled successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to enroll student", variant: "destructive" });
    },
  });

  const filteredAdmissions = admissions.filter((admission) => {
    const matchesSearch =
      !searchQuery ||
      admission.studentFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admission.studentLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admission.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "inquiry":
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30";
      case "applied":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "documents_pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "under_review":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
      case "interview_scheduled":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
      case "accepted":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "enrolled":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30";
      case "withdrawn":
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30";
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex < 0 || currentIndex >= statusOrder.indexOf("accepted")) {
      return null;
    }
    return statusOrder[currentIndex + 1];
  };

  const totalApplications = stats.reduce((sum, s) => sum + s.count, 0);
  const pendingCount = stats.filter(s => 
    ["inquiry", "applied", "documents_pending", "under_review", "interview_scheduled"].includes(s.status)
  ).reduce((sum, s) => sum + s.count, 0);
  const acceptedCount = stats.find(s => s.status === "accepted")?.count || 0;
  const enrolledCount = stats.find(s => s.status === "enrolled")?.count || 0;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <CMSHeader title="Admissions" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Applications"
              value={totalApplications}
              description="All time"
              icon={FileText}
            />
            <StatsCard
              title="Pending Review"
              value={pendingCount}
              description="Awaiting decision"
              icon={Clock}
              trend="neutral"
            />
            <StatsCard
              title="Accepted"
              value={acceptedCount}
              description="Ready to enroll"
              icon={CheckCircle2}
              trend="up"
            />
            <StatsCard
              title="Enrolled"
              value={enrolledCount}
              description="Converted to students"
              icon={UserPlus}
              trend="up"
            />
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
              <CardTitle className="text-base font-semibold">
                Admission Applications
              </CardTitle>
              <Button asChild data-testid="button-new-admission">
                <Link href="/cms/admissions/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Application
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or application number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-admissions"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-admission-status">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOrder.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading applications...</p>
                </div>
              ) : filteredAdmissions.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium">No applications found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Create your first admission application"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAdmissions.map((admission) => (
                    <div
                      key={admission.id}
                      className="border rounded-lg p-4 hover-elevate"
                      data-testid={`card-admission-${admission.id}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">
                              {admission.studentFirstName} {admission.studentLastName}
                            </p>
                            <Badge
                              variant="outline"
                              className={getStatusColor(admission.status)}
                            >
                              {statusLabels[admission.status] || admission.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span>
                              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                                {admission.applicationNumber}
                              </code>
                            </span>
                            <span>Grade: {admission.gradeApplying}</span>
                            <span>Year: {admission.academicYear}</span>
                            <span>
                              Applied: {format(new Date(admission.createdAt), "MMM d, yyyy")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Guardian: {admission.guardianName} ({admission.guardianPhone})
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {admission.status === "accepted" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedAdmission(admission);
                                setEnrollDialogOpen(true);
                              }}
                              data-testid={`button-enroll-${admission.id}`}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Enroll
                            </Button>
                          )}
                          {getNextStatus(admission.status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: admission.id,
                                  status: getNextStatus(admission.status)!,
                                })
                              }
                              disabled={updateStatusMutation.isPending}
                              data-testid={`button-advance-${admission.id}`}
                            >
                              <ArrowRight className="h-4 w-4 mr-1" />
                              {statusLabels[getNextStatus(admission.status)!]}
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                data-testid={`button-more-${admission.id}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/cms/admissions/${admission.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Add Note
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {admission.status !== "rejected" &&
                                admission.status !== "enrolled" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateStatusMutation.mutate({
                                        id: admission.id,
                                        status: "rejected",
                                      })
                                    }
                                    className="text-destructive"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Enrollment</DialogTitle>
          </DialogHeader>
          {selectedAdmission && (
            <div className="space-y-4">
              <p>
                Are you sure you want to enroll{" "}
                <strong>
                  {selectedAdmission.studentFirstName} {selectedAdmission.studentLastName}
                </strong>{" "}
                as a student?
              </p>
              <div className="bg-muted/50 rounded-md p-3 text-sm">
                <p>This will:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Create a new student record with auto-generated student ID</li>
                  <li>Create a guardian record from the application data</li>
                  <li>Link the guardian to the student</li>
                  <li>Mark this application as "Enrolled"</li>
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEnrollDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedAdmission && enrollMutation.mutate(selectedAdmission.id)}
              disabled={enrollMutation.isPending}
              data-testid="button-confirm-enroll"
            >
              {enrollMutation.isPending ? "Enrolling..." : "Confirm Enrollment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
