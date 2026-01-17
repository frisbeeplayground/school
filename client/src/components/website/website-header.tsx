import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GraduationCap, Menu, Phone, Mail } from "lucide-react";
import type { School } from "@shared/schema";

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
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2 text-sm font-medium">
          Preview Mode - This is a sandbox preview of the website
        </div>
      )}
      
      <div className="hidden md:block bg-gray-900 text-gray-300 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-6">
              <a href="tel:+15551234567" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="h-3.5 w-3.5" />
                +1 (555) 123-4567
              </a>
              <a href={`mailto:info@${school.slug}.edu`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="h-3.5 w-3.5" />
                info@{school.slug}.edu
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">Student Portal</a>
              <span className="text-gray-600">|</span>
              <a href="#" className="hover:text-white transition-colors">Parent Portal</a>
            </div>
          </div>
        </div>
      </div>
      
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${school.primaryColor} 0%, ${school.secondaryColor} 100%)` 
                }}
              >
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900 block leading-tight">
                  {school.name}
                </span>
                <span className="text-xs text-gray-500">Excellence in Education</span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                className="border-2 font-medium"
                data-testid="button-portal"
              >
                Student Portal
              </Button>
              <Button
                className="font-medium shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${school.primaryColor} 0%, ${school.secondaryColor} 100%)` 
                }}
                data-testid="button-apply"
              >
                Apply Now
              </Button>
            </div>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-3 pb-6 border-b">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: school.primaryColor }}
                    >
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-lg">{school.name}</span>
                  </div>
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium text-gray-900 hover:text-gray-600 py-2"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="flex flex-col gap-3 mt-4 pt-6 border-t">
                    <Button variant="outline" className="w-full">Student Portal</Button>
                    <Button
                      className="w-full"
                      style={{ 
                        background: `linear-gradient(135deg, ${school.primaryColor} 0%, ${school.secondaryColor} 100%)` 
                      }}
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
