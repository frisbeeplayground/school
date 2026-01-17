import { CMSHeader } from "@/components/cms/cms-header";
import { StatsCard } from "@/components/cms/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCMS } from "@/lib/cms-context";
import {
  FileText,
  Bell,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

export default function CMSDashboard() {
  const { environment } = useCMS();

  const stats = {
    sections: 5,
    notices: 12,
    pendingApprovals: 3,
    publishedToday: 2,
  };

  const recentActivity = [
    {
      id: "1",
      action: "Section updated",
      target: "Hero Section",
      time: "5 min ago",
      user: "Admin",
    },
    {
      id: "2",
      action: "Notice created",
      target: "Annual Day Event",
      time: "1 hour ago",
      user: "Editor",
    },
    {
      id: "3",
      action: "Content published",
      target: "About Section",
      time: "2 hours ago",
      user: "Admin",
    },
    {
      id: "4",
      action: "Notice updated",
      target: "Holiday Schedule",
      time: "Yesterday",
      user: "Editor",
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <CMSHeader title="Dashboard" />

      {environment === "sandbox" && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2">
          <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              You are editing the <strong>Sandbox</strong> version. Changes need approval before going live.
            </span>
          </p>
        </div>
      )}

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Page Sections"
              value={stats.sections}
              description="Active sections"
              icon={FileText}
            />
            <StatsCard
              title="Notices"
              value={stats.notices}
              description="Total notices"
              icon={Bell}
            />
            <StatsCard
              title="Pending Approval"
              value={stats.pendingApprovals}
              description="Awaiting review"
              icon={Clock}
              trend="neutral"
            />
            <StatsCard
              title="Published Today"
              value={stats.publishedToday}
              description="+20% from yesterday"
              icon={TrendingUp}
              trend="up"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <CardTitle className="text-base font-semibold">
                  Recent Activity
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href="/cms/sections">
                    View All
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.target}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {activity.user}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <CardTitle className="text-base font-semibold">
                  Pending Approvals
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href="/cms/approvals">
                    Review All
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {stats.pendingApprovals > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Hero Section</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted by Editor
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      >
                        Pending
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Exam Schedule</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted by Admin
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      >
                        Pending
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3" />
                    <p className="text-sm font-medium">All caught up!</p>
                    <p className="text-xs text-muted-foreground">
                      No pending approvals
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/cms/sections">Manage Sections</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/cms/notices">Manage Notices</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/cms/approvals">Review Approvals</Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                >
                  <a
                    href="/site/springfield"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview Website
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
