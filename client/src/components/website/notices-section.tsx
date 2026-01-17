import type { Notice, School } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Pin, FileDown, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface NoticesSectionProps {
  notices: Notice[];
  school: School;
}

export function NoticesSection({ notices, school }: NoticesSectionProps) {
  const displayNotices = notices.slice(0, 4);
  const pinnedNotices = displayNotices.filter((n) => n.pinned);
  const regularNotices = displayNotices.filter((n) => !n.pinned);
  const sortedNotices = [...pinnedNotices, ...regularNotices];

  return (
    <section className="py-20 bg-gray-50" id="notices">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span
              className="inline-block text-sm font-semibold mb-2 px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${school.primaryColor}15`,
                color: school.primaryColor,
              }}
            >
              Latest Updates
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">
              Notice Board
            </h2>
          </div>
          <Button variant="outline" className="gap-1.5" data-testid="button-view-all-notices">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {sortedNotices.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notices available at this time.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedNotices.map((notice) => (
              <Card
                key={notice.id}
                className={`hover-elevate ${notice.pinned ? "border-l-4" : ""}`}
                style={{
                  borderLeftColor: notice.pinned ? school.primaryColor : undefined,
                }}
                data-testid={`card-website-notice-${notice.id}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {notice.pinned && (
                        <Pin
                          className="h-4 w-4 rotate-45"
                          style={{ color: school.primaryColor }}
                        />
                      )}
                      <CardTitle className="text-base font-semibold text-gray-900">
                        {notice.title}
                      </CardTitle>
                    </div>
                    {notice.fileUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        asChild
                      >
                        <a href={notice.fileUrl} download>
                          <FileDown className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {notice.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(new Date(notice.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
