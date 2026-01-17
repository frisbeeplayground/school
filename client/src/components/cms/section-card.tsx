import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./status-badge";
import type { PageSection, SectionType } from "@shared/schema";
import {
  GripVertical,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image,
  LayoutGrid,
  Info,
  BarChart3,
  MessageSquare,
  Phone,
  Sparkles,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sectionIcons: Record<SectionType, React.ComponentType<{ className?: string }>> = {
  hero: Image,
  features: LayoutGrid,
  about: Info,
  gallery: Image,
  contact: Phone,
  testimonials: MessageSquare,
  cta: Megaphone,
  stats: BarChart3,
};

const sectionLabels: Record<SectionType, string> = {
  hero: "Hero Section",
  features: "Features Grid",
  about: "About Section",
  gallery: "Image Gallery",
  contact: "Contact Form",
  testimonials: "Testimonials",
  cta: "Call to Action",
  stats: "Statistics",
};

interface SectionCardProps {
  section: PageSection;
  onEdit: (section: PageSection) => void;
  onDelete: (sectionId: string) => void;
  onToggleVisibility: (sectionId: string, enabled: boolean) => void;
}

export function SectionCard({
  section,
  onEdit,
  onDelete,
  onToggleVisibility,
}: SectionCardProps) {
  const Icon = sectionIcons[section.type] || Sparkles;

  return (
    <Card
      className={cn(
        "hover-elevate transition-all group",
        !section.enabled && "opacity-60"
      )}
      data-testid={`card-section-${section.id}`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4 p-4 pb-0">
        <div className="flex items-center gap-3">
          <div className="cursor-grab opacity-40 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{sectionLabels[section.type]}</span>
              <Badge variant="outline" className="text-xs">
                #{section.position}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={section.status} />
              {!section.enabled && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <EyeOff className="h-3 w-3" />
                  Hidden
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleVisibility(section.id, !section.enabled)}
            data-testid={`button-toggle-section-${section.id}`}
          >
            {section.enabled ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(section)}
            data-testid={`button-edit-section-${section.id}`}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(section.id)}
            data-testid={`button-delete-section-${section.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {getSectionPreview(section)}
        </p>
      </CardContent>
    </Card>
  );
}

function getSectionPreview(section: PageSection): string {
  const props = section.props as Record<string, unknown>;
  if ("title" in props) return props.title as string;
  if ("heading" in props) return props.heading as string;
  if ("content" in props) return props.content as string;
  return "Click to edit section content";
}
