import type { School } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";

interface WebsiteFooterProps {
  school: School;
}

const quickLinks = [
  { label: "About Us", href: "#about" },
  { label: "Academics", href: "#academics" },
  { label: "Admissions", href: "#admissions" },
  { label: "Campus Life", href: "#campus" },
  { label: "News & Events", href: "#news" },
  { label: "Contact", href: "#contact" },
];

const resources = [
  { label: "Student Portal", href: "#" },
  { label: "Parent Portal", href: "#" },
  { label: "Academic Calendar", href: "#" },
  { label: "Fee Structure", href: "#" },
  { label: "Scholarship Info", href: "#" },
  { label: "Downloads", href: "#" },
];

export function WebsiteFooter({ school }: WebsiteFooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-md"
                style={{ backgroundColor: school.primaryColor }}
              >
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                {school.name}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Providing quality education since 1970. Nurturing minds, building
              character, and preparing students for a bright future.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  123 Education Lane, Springfield, ST 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-400">
                  info@{school.slug}.edu
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  Mon - Fri: 8:00 AM - 4:00 PM
                </span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-white mb-3">
                Newsletter
              </h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  data-testid="input-newsletter"
                />
                <Button
                  size="icon"
                  style={{ backgroundColor: school.primaryColor }}
                  className="shrink-0"
                  data-testid="button-newsletter"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {school.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-400">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-400">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-400">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
