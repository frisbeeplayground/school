import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  GraduationCap,
  CalendarCheck,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface PortalData {
  student: {
    studentId: string;
    firstName: string;
    lastName: string;
    photo: string | null;
    status: string;
  };
  attendance: {
    records: any[];
    summary: {
      present: number;
      absent: number;
      late: number;
      total: number;
    };
  };
  grades: any[];
  enrollments: {
    class: string;
    grade: string;
    section: string;
    academicYear: string;
    rollNumber: string | null;
    status: string;
  }[];
}

export default function ParentPortal() {
  const params = useParams<{ token: string }>();

  const { data, isLoading, error } = useQuery<PortalData>({
    queryKey: ["/api/portal", params.token],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading student progress...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              This access link is invalid or has expired. Please contact the school for a new access link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { student, attendance, grades, enrollments } = data;
  const attendanceRate =
    attendance.summary.total > 0
      ? Math.round((attendance.summary.present / attendance.summary.total) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">Parent Portal</h1>
              <p className="text-xs text-muted-foreground">Student Progress Dashboard</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {student.firstName[0]}
                  {student.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-muted-foreground">Student ID: {student.studentId}</p>
                <Badge
                  variant="outline"
                  className={
                    student.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 mt-2"
                      : "mt-2"
                  }
                >
                  {student.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{attendance.summary.present}</p>
                  <p className="text-sm text-muted-foreground">Days Present</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{attendance.summary.absent}</p>
                  <p className="text-sm text-muted-foreground">Days Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{attendance.summary.late}</p>
                  <p className="text-sm text-muted-foreground">Days Late</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{attendanceRate}%</p>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {enrollments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Current Enrollment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {enrollments.map((enrollment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{enrollment.class}</p>
                      <p className="text-sm text-muted-foreground">
                        Grade {enrollment.grade}
                        {enrollment.section && ` - Section ${enrollment.section}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{enrollment.academicYear}</p>
                      {enrollment.rollNumber && (
                        <p className="text-xs text-muted-foreground">
                          Roll No: {enrollment.rollNumber}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {attendance.records.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Recent Attendance (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {attendance.records.slice(0, 30).map((record, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                      record.status === "present"
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : record.status === "absent"
                        ? "bg-red-500/20 text-red-600 dark:text-red-400"
                        : record.status === "late"
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-slate-500/20 text-slate-600 dark:text-slate-400"
                    }`}
                    title={`${format(new Date(record.date), "MMM d")} - ${record.status}`}
                  >
                    {format(new Date(record.date), "d")}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-emerald-500/20" />
                  Present
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-500/20" />
                  Absent
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-amber-500/20" />
                  Late
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {grades.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Academic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {grades.map((grade, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{grade.subject?.name || "Subject"}</p>
                      <p className="text-sm text-muted-foreground">
                        {grade.examType} - {grade.term}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {grade.score}/{grade.maxScore}
                      </p>
                      {grade.grade && (
                        <Badge variant="secondary">{grade.grade}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <footer className="text-center text-sm text-muted-foreground py-8">
          <p>This portal provides secure access to your child's academic progress.</p>
          <p className="mt-1">For questions, please contact the school administration.</p>
        </footer>
      </main>
    </div>
  );
}
