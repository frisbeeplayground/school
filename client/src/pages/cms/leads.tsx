import { useState } from "react";
import { CMSHeader } from "@/components/cms/cms-header";
import { LeadCard } from "@/components/cms/lead-card";
import { LeadDialog } from "@/components/cms/lead-dialog";
import { LeadDetailsDialog } from "@/components/cms/lead-details-dialog";
import { EmptyState } from "@/components/cms/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCMS } from "@/lib/cms-context";
import { useToast } from "@/hooks/use-toast";
import type { Lead } from "@shared/schema";
import {
  Plus,
  Users,
  Search,
  UserPlus,
  UserCheck,
  GraduationCap,
  UserX,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

const statusFilters = [
  { value: "all", label: "All Leads", icon: Users },
  { value: "new", label: "New", icon: UserPlus },
  { value: "contacted", label: "Contacted", icon: UserCheck },
  { value: "qualified", label: "Qualified", icon: GraduationCap },
  { value: "enrolled", label: "Enrolled", icon: GraduationCap },
  { value: "lost", label: "Lost", icon: UserX },
];

const statusColors: Record<string, string> = {
  new: "bg-blue-500",
  contacted: "bg-amber-500",
  qualified: "bg-purple-500",
  enrolled: "bg-green-500",
  lost: "bg-gray-400",
};

export default function CMSLeads() {
  const { currentSchool } = useCMS();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads", { schoolId: currentSchool?.id }],
  });

  const { data: stats = [] } = useQuery<{ status: string; count: number }[]>({
    queryKey: ["/api/leads/stats", { schoolId: currentSchool?.id }],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      return apiRequest("POST", "/api/leads", {
        ...data,
        schoolId: currentSchool?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Lead created",
        description: "New lead has been added successfully.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      return apiRequest("PATCH", `/api/leads/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Lead updated",
        description: "Lead information has been updated.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Lead deleted",
        description: "The lead has been removed.",
      });
    },
  });

  const handleSave = (data: Partial<Lead>) => {
    if (data.id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setDialogOpen(true);
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleStatusChange = (id: string, status: string) => {
    updateMutation.mutate({ id, status });
  };

  const handleAddNew = () => {
    setEditingLead(null);
    setDialogOpen(true);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalLeads = leads.length;
  const getStatCount = (status: string) => 
    stats.find((s) => s.status === status)?.count || 0;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <CMSHeader title="Leads" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{getStatCount("new")}</div>
                    <div className="text-xs text-white/80">New Leads</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{getStatCount("contacted")}</div>
                    <div className="text-xs text-white/80">Contacted</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{getStatCount("qualified")}</div>
                    <div className="text-xs text-white/80">Qualified</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{getStatCount("enrolled")}</div>
                    <div className="text-xs text-white/80">Enrolled</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalLeads}</div>
                    <div className="text-xs text-muted-foreground">Total Leads</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {statusFilters.map((filter) => (
                <Badge
                  key={filter.value}
                  variant={statusFilter === filter.value ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5"
                  onClick={() => setStatusFilter(filter.value)}
                  data-testid={`badge-filter-${filter.value}`}
                >
                  <filter.icon className="w-3.5 h-3.5 mr-1.5" />
                  {filter.label}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-leads"
                />
              </div>
              <Button className="gap-1.5" onClick={handleAddNew} data-testid="button-add-lead">
                <Plus className="h-4 w-4" />
                Add Lead
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <EmptyState
              icon={Users}
              title={searchQuery || statusFilter !== "all" ? "No leads found" : "No leads yet"}
              description={
                searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters or search query."
                  : "Start tracking prospective students and inquiries here."
              }
              actionLabel={searchQuery || statusFilter !== "all" ? undefined : "Add First Lead"}
              onAction={searchQuery || statusFilter !== "all" ? undefined : handleAddNew}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleViewDetails}
                  statusColors={statusColors}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <LeadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        lead={editingLead}
        onSave={handleSave}
      />

      <LeadDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        lead={selectedLead}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
