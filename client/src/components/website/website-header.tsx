import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GraduationCap, Menu, X } from "lucide-react";
import type { School } from "@shared/schema";
import { cn } from "@/lib/utils";

interface WebsiteHeaderProps {
  school: School;
  isPreview?: boolean;
}

const navLinks = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Academics", href: "#academics" },
  { label: "Admissions", href: "#admissions" },
  { label: "Contact", href: "#contact" },
];

export function WebsiteHeader({ school, isPreview }: WebsiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {isPreview && (
        <div className="bg-amber-500 text-white text-center py-2 text-sm font-medium">
          Preview Mode - This is a sandbox preview of the website
        </div>
      )}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-md"
                style={{ backgroundColor: school.primaryColor }}
              >
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">
                {school.name}
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                data-testid="button-portal"
              >
                Student Portal
              </Button>
              <Button
                size="sm"
                style={{ backgroundColor: school.primaryColor }}
                className="text-white hover:opacity-90"
                data-testid="button-apply"
              >
                Apply Now
              </Button>
            </div>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 mt-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium text-gray-900 hover:text-gray-600"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="flex flex-col gap-3 mt-4">
                    <Button variant="outline">Student Portal</Button>
                    <Button
                      style={{ backgroundColor: school.primaryColor }}
                      className="text-white"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
