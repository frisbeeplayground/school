import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { EnvironmentToggle } from "./environment-toggle";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";
import { useCMS } from "@/lib/cms-context";
import type { ReactNode } from "react";

interface CMSHeaderProps {
  title: string;
  children?: ReactNode;
}

export function CMSHeader({ title, children }: CMSHeaderProps) {
  const { currentSchool } = useCMS();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {children}
        <EnvironmentToggle />
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          asChild
        >
          <a
            href={`/site/${currentSchool?.slug || "demo"}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-view-live"
          >
            <Eye className="h-3.5 w-3.5" />
            View Site
            <ExternalLink className="h-3 w-3 ml-0.5" />
          </a>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
