import { CMSHeader } from "@/components/cms/cms-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import type { Class, Enrollment, Student, Attendance } from "@shared/schema";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type AttendanceStatus = "present" | "absent" | "late" | "excused" | "half_day";

interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export default function AttendancePage() {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const { data: classes = [] } = useQuery<Class[]>({
    queryKey: ["/api/classes"],
  });

  const { data: enrollments = [] } = useQuery<(Enrollment & { student: Student })[]>({
    queryKey: ["/api/classes", selectedClassId, "enrollments"],
    enabled: !!selectedClassId,
  });

  const { data: existingAttendance = [] } = useQuery<(Attendance & { student: Student })[]>({
    queryKey: ["/api/attendance", { classId: selectedClassId, date: dateStr }],
    enabled: !!selectedClassId,
  });

  useEffect(() => {
    if (existingAttendance.length > 0) {
      const records: Record<string, AttendanceRecord> = {};
      existingAttendance.forEach((a) => {
        records[a.studentId] = {
          studentId: a.studentId,
          status: a.status as AttendanceStatus,
          remarks: a.remarks || undefined,
        };
      });
      setAttendanceRecords(records);
    } else if (enrollments.length > 0) {
      const records: Record<string, AttendanceRecord> = {};
      enrollments.forEach((e) => {
        records[e.studentId] = {
          studentId: e.studentId,
          status: "present",
        };
      });
      setAttendanceRecords(records);
    }
    setHasChanges(false);
  }, [existingAttendance, enrollments, selectedClassId, dateStr]);

  const saveMutation = useMutation({
    mutationFn: async (records: AttendanceRecord[]) => {
      const payload = records.map((r) => ({
        ...r,
        classId: selectedClassId,
        date: dateStr,
      }));
      return apiRequest("POST", "/api/attendance/bulk", { records: payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      setHasChanges(false);
      toast({ title: "Attendance saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save attendance", variant: "destructive" });
    },
  });

  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], studentId, status },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const records = Object.values(attendanceRecords);
    saveMutation.mutate(records);
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "absent":
        return "bg-red-500 hover:bg-red-600";
      case "late":
        return "bg-amber-500 hover:bg-amber-600";
      case "excused":
        return "bg-blue-500 hover:bg-blue-600";
      case "half_day":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-slate-500 hover:bg-slate-600";
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="h-4 w-4" />;
      case "absent":
        return <XCircle className="h-4 w-4" />;
      case "late":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const summary = {
    present: Object.values(attendanceRecords).filter((r) => r.status === "present").length,
    absent: Object.values(attendanceRecords).filter((r) => r.status === "absent").length,
    late: Object.values(attendanceRecords).filter((r) => r.status === "late").length,
    excused: Object.values(attendanceRecords).filter((r) => r.status === "excused").length,
    total: Object.values(attendanceRecords).length,
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <CMSHeader title="Attendance" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  Mark Attendance
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                    <SelectTrigger className="w-[200px]" data-testid="select-class">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} ({cls.grade}{cls.section ? `-${cls.section}` : ""})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                      data-testid="button-prev-date"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="px-3 py-2 text-sm font-medium min-w-[120px] text-center border rounded-md bg-muted/50">
                      {format(selectedDate, "MMM d, yyyy")}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                      disabled={selectedDate >= new Date()}
                      data-testid="button-next-date"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!selectedClassId ? (
                <div className="text-center py-12">
                  <CalendarCheck className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium">Select a class</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose a class to mark attendance
                  </p>
                </div>
              ) : enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarCheck className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium">No students enrolled</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add students to this class first
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 pb-4 border-b">
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      Present: {summary.present}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <XCircle className="h-3 w-3 text-red-500" />
                      Absent: {summary.absent}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3 text-amber-500" />
                      Late: {summary.late}
                    </Badge>
                    <Badge variant="secondary">
                      Total: {summary.total}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {enrollments.map((enrollment) => {
                      const record = attendanceRecords[enrollment.studentId];
                      const status = record?.status || "present";

                      return (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover-elevate"
                          data-testid={`row-attendance-${enrollment.studentId}`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {enrollment.student.firstName[0]}
                                {enrollment.student.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {enrollment.student.firstName} {enrollment.student.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {enrollment.rollNumber ? `Roll: ${enrollment.rollNumber}` : enrollment.student.studentId}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {(["present", "absent", "late", "excused"] as AttendanceStatus[]).map(
                              (statusOption) => (
                                <Button
                                  key={statusOption}
                                  variant={status === statusOption ? "default" : "outline"}
                                  size="sm"
                                  className={cn(
                                    "px-3 capitalize",
                                    status === statusOption && getStatusColor(statusOption)
                                  )}
                                  onClick={() => updateStatus(enrollment.studentId, statusOption)}
                                  data-testid={`button-${statusOption}-${enrollment.studentId}`}
                                >
                                  {statusOption === "present" && <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
                                  {statusOption === "absent" && <XCircle className="h-3.5 w-3.5 mr-1" />}
                                  {statusOption === "late" && <Clock className="h-3.5 w-3.5 mr-1" />}
                                  <span className="hidden sm:inline">{statusOption}</span>
                                </Button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={handleSave}
                      disabled={!hasChanges || saveMutation.isPending}
                      data-testid="button-save-attendance"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saveMutation.isPending ? "Saving..." : "Save Attendance"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
