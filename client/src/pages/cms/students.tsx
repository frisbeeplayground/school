import { CMSHeader } from "@/components/cms/cms-header";
import { StatsCard } from "@/components/cms/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  GraduationCap,
  UserPlus,
  Users,
  CalendarCheck,
  BookOpen,
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  QrCode,
  CreditCard,
  Link as LinkIcon,
  Copy,
  Check,
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Student } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { StudentIdCard } from "@/components/student-id-card";
import { QRCode } from "@/components/qr-code";

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  newAdmissionsThisMonth: number;
  attendanceRate: number;
  classCount: number;
}

interface ProgressToken {
  id: string;
  studentId: string;
  token: string;
  expiresAt: string | null;
  isRevoked: boolean;
}

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [showIdCard, setShowIdCard] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { toast } = useToast();

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/students/dashboard-stats"],
  });

  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ["/api/students", statusFilter !== "all" ? statusFilter : undefined],
  });

  const generateTokenMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const response = await apiRequest("POST", "/api/progress-tokens", {
        studentId,
        expiresAt: null,
      });
      return response.json() as Promise<ProgressToken>;
    },
    onSuccess: (token) => {
      setCurrentToken(token.token);
      queryClient.invalidateQueries({ queryKey: ["/api/students", selectedStudent?.id, "progress-tokens"] });
    },
    onError: () => {
      toast({ title: "Failed to generate access token", variant: "destructive" });
    },
  });

  const fetchOrGenerateToken = async (student: Student) => {
    try {
      const response = await fetch(`/api/students/${student.id}/progress-tokens`);
      const tokens: ProgressToken[] = await response.json();
      const activeToken = tokens.find((t) => !t.isRevoked && (!t.expiresAt || new Date(t.expiresAt) > new Date()));
      
      if (activeToken) {
        setCurrentToken(activeToken.token);
      } else {
        generateTokenMutation.mutate(student.id);
      }
    } catch (error) {
      generateTokenMutation.mutate(student.id);
    }
  };

  const generatePortalLink = (token: string) => {
    return `${window.location.origin}/portal/${token}`;
  };

  const copyPortalLink = async () => {
    if (!currentToken) return;
    const link = generatePortalLink(currentToken);
    await navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast({ title: "Portal link copied to clipboard!" });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openQRDialog = async (student: Student) => {
    setSelectedStudent(student);
    setCurrentToken(null);
    setShowQRDialog(true);
    await fetchOrGenerateToken(student);
  };

  const openIdCard = async (student: Student) => {
    setSelectedStudent(student);
    setCurrentToken(null);
    setShowIdCard(true);
    await fetchOrGenerateToken(student);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      !searchQuery ||
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "inactive":
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30";
      case "graduated":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "transferred":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <CMSHeader title="Students" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatsCard
              title="Total Students"
              value={stats?.totalStudents || 0}
              description="All enrolled"
              icon={GraduationCap}
            />
            <StatsCard
              title="Active Students"
              value={stats?.activeStudents || 0}
              description="Currently active"
              icon={Users}
              trend="up"
            />
            <StatsCard
              title="New Admissions"
              value={stats?.newAdmissionsThisMonth || 0}
              description="This month"
              icon={UserPlus}
              trend="up"
            />
            <StatsCard
              title="Attendance Rate"
              value={`${stats?.attendanceRate || 0}%`}
              description="Today's attendance"
              icon={CalendarCheck}
              trend={stats?.attendanceRate && stats.attendanceRate >= 80 ? "up" : "down"}
            />
            <StatsCard
              title="Classes"
              value={stats?.classCount || 0}
              description="Active classes"
              icon={BookOpen}
            />
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
              <CardTitle className="text-base font-semibold">
                Student Directory
              </CardTitle>
              <Button asChild data-testid="button-add-student">
                <Link href="/cms/students/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or student ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-students"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading students...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium">No students found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Add your first student to get started"}
                  </p>
                  {!searchQuery && (
                    <Button asChild className="mt-4" data-testid="button-add-first-student">
                      <Link href="/cms/students/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Student
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium">Student</th>
                        <th className="text-left px-4 py-3 text-sm font-medium hidden md:table-cell">Student ID</th>
                        <th className="text-left px-4 py-3 text-sm font-medium hidden lg:table-cell">Date of Birth</th>
                        <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                        <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredStudents.map((student) => (
                        <tr
                          key={student.id}
                          className="hover-elevate"
                          data-testid={`row-student-${student.id}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                  {student.firstName[0]}
                                  {student.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {student.firstName} {student.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground md:hidden">
                                  {student.studentId}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <code className="text-xs bg-muted px-2 py-0.5 rounded">
                              {student.studentId}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                            {student.dateOfBirth
                              ? format(new Date(student.dateOfBirth), "MMM d, yyyy")
                              : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={getStatusColor(student.status)}
                            >
                              {student.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  data-testid={`button-actions-${student.id}`}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/cms/students/${student.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/cms/students/${student.id}/edit`}>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openIdCard(student)}>
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  View ID Card
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openQRDialog(student)}>
                                  <QrCode className="h-4 w-4 mr-2" />
                                  Portal QR Code
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-wrap gap-2">
                <Button asChild data-testid="button-quick-add-student">
                  <Link href="/cms/students/new">Add New Student</Link>
                </Button>
                <Button variant="outline" asChild data-testid="button-quick-admissions">
                  <Link href="/cms/admissions">View Admissions</Link>
                </Button>
                <Button variant="outline" asChild data-testid="button-quick-classes">
                  <Link href="/cms/classes">Manage Classes</Link>
                </Button>
                <Button variant="outline" asChild data-testid="button-quick-attendance">
                  <Link href="/cms/attendance">Mark Attendance</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showIdCard} onOpenChange={setShowIdCard}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Student ID Card
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="flex flex-col items-center gap-4">
              <StudentIdCard
                student={selectedStudent}
                portalUrl={currentToken ? generatePortalLink(currentToken) : undefined}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.print()}>
                  Print ID Card
                </Button>
                <Button
                  variant="outline"
                  onClick={copyPortalLink}
                  disabled={!currentToken}
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Parent Portal Access
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="flex flex-col items-center gap-4 py-4">
              {currentToken ? (
                <>
                  <div className="p-4 bg-white rounded-lg border">
                    <QRCode
                      value={generatePortalLink(currentToken)}
                      size={200}
                      level="H"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.studentId}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Parents can scan this QR code to access the student's progress portal.
                  </p>
                  <Button
                    variant="outline"
                    onClick={copyPortalLink}
                    className="w-full"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Portal Link
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Generating access token...</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
