import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Bell,
  Settings,
  Eye,
  CheckSquare,
  GraduationCap,
} from "lucide-react";
import { EnvironmentBadge } from "./environment-badge";
import { useCMS } from "@/lib/cms-context";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/cms",
    icon: LayoutDashboard,
  },
  {
    title: "Page Sections",
    url: "/cms/sections",
    icon: FileText,
  },
  {
    title: "Notices",
    url: "/cms/notices",
    icon: Bell,
  },
  {
    title: "Approval Queue",
    url: "/cms/approvals",
    icon: CheckSquare,
  },
];

const bottomItems = [
  {
    title: "Preview Website",
    url: "/preview",
    icon: Eye,
  },
  {
    title: "Settings",
    url: "/cms/settings",
    icon: Settings,
  },
];

export function CMSSidebar() {
  const [location] = useLocation();
  const { environment, currentSchool } = useCMS();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-md",
              environment === "sandbox"
                ? "bg-amber-500/15"
                : "bg-emerald-500/15"
            )}
          >
            <GraduationCap
              className={cn(
                "h-5 w-5",
                environment === "sandbox"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              )}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm truncate">
              {currentSchool?.name || "School CMS"}
            </span>
            <EnvironmentBadge />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
