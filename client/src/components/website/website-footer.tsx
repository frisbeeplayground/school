import type { School } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Heart,
} from "lucide-react";
import { SiFacebook, SiX, SiInstagram, SiYoutube, SiLinkedin } from "react-icons/si";

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
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${school.primaryColor} 0%, ${school.secondaryColor} 100%)` 
                }}
              >
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white block">
                  {school.name}
                </span>
                <span className="text-xs text-gray-500">{school.tagline || "Excellence in Education"}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {school.description || "Providing quality education. Nurturing minds, building character, and preparing students for a bright future."}
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all"
              >
                <SiFacebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all"
              >
                <SiX className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 rounded-xl transition-all"
              >
                <SiInstagram className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-400 hover:text-white hover:bg-red-600 rounded-xl transition-all"
              >
                <SiYoutube className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-400 hover:text-white hover:bg-blue-700 rounded-xl transition-all"
              >
                <SiLinkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-6 text-lg">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-6 text-lg">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">
                  {school.address || "123 Education Lane, Springfield, ST 12345"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">{school.phone || "+1 (555) 123-4567"}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">
                  {school.email || `info@${school.slug}.edu`}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">
                  {school.operatingHours || "Mon - Fri: 8:00 AM - 4:00 PM"}
                </span>
              </li>
            </ul>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-white mb-3">
                Subscribe to Newsletter
              </h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl"
                  data-testid="input-newsletter"
                />
                <Button
                  size="icon"
                  className="shrink-0 rounded-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${school.primaryColor} 0%, ${school.secondaryColor} 100%)` 
                  }}
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
            <p className="text-sm text-gray-500 flex items-center gap-1">
              © {new Date().getFullYear()} {school.name}. Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for education.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
