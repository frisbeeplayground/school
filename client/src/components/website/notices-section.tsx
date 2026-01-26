import type { Notice, School } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Pin, FileDown, Calendar, ArrowRight, Megaphone } from "lucide-react";
import { format } from "date-fns";

interface NoticesSectionProps {
  notices: Notice[];
  school: School;
}

export function NoticesSection({ notices, school }: NoticesSectionProps) {
  const primaryColor = `var(--theme-primary, ${school.primaryColor})`;
  const accentColor = `var(--theme-accent, #f59e0b)`;
  const displayNotices = notices.slice(0, 4);
  const pinnedNotices = displayNotices.filter((n) => n.pinned);
  const regularNotices = displayNotices.filter((n) => !n.pinned);
  const sortedNotices = [...pinnedNotices, ...regularNotices];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" id="notices">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-yellow-100 to-transparent rounded-full blur-3xl opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div>
            <div 
              className="inline-flex items-center gap-2 text-white text-sm font-medium rounded-full px-4 py-1.5 mb-4"
              style={{ background: accentColor }}
            >
              <Megaphone className="w-4 h-4" />
              Latest Updates
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">
              Notice Board
            </h2>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 border-2 hover:bg-gray-50"
            data-testid="button-view-all-notices"
          >
            View All Notices
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {sortedNotices.length === 0 ? (
          <Card className="p-16 text-center bg-white/80 backdrop-blur-sm border-dashed">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Bell className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No notices available at this time.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for updates</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sortedNotices.map((notice) => (
              <Card
                key={notice.id}
                className={`group hover-elevate bg-white hover:shadow-xl transition-all duration-300 overflow-visible ${
                  notice.pinned ? "ring-2 ring-offset-2 ring-blue-500" : ""
                }`}
                data-testid={`card-website-notice-${notice.id}`}
              >
                {notice.pinned && (
                  <div 
                    className="h-1 w-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {notice.pinned && (
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 15%, transparent)` }}
                        >
                          <Pin
                            className="h-4 w-4 rotate-45"
                            style={{ color: primaryColor }}
                          />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {notice.title}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{format(new Date(notice.createdAt), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                    {notice.fileUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 hover:bg-blue-50 hover:text-blue-600"
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
                  <p className="text-gray-600 line-clamp-2 leading-relaxed">
                    {notice.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
