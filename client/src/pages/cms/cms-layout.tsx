import { SidebarProvider } from "@/components/ui/sidebar";
import { CMSSidebar } from "@/components/cms/cms-sidebar";
import { CMSProvider } from "@/lib/cms-context";

interface CMSLayoutProps {
  children: React.ReactNode;
}

export function CMSLayout({ children }: CMSLayoutProps) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <CMSProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <CMSSidebar />
          {children}
        </div>
      </SidebarProvider>
    </CMSProvider>
  );
}
