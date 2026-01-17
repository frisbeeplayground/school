import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Settings, Eye, ArrowRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">School CMS</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Enterprise CMS Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            School Website CMS
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A professional content management system with sandbox environments, approval workflows, and beautiful school websites.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
          <Card className="hover-elevate relative overflow-hidden group">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2 group-hover:scale-105 transition-transform">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>CMS Admin</CardTitle>
              <CardDescription>
                Manage your school website content with sandbox editing, approval workflows, and live publishing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="gap-2 w-full" asChild>
                <Link href="/cms">
                  Open CMS
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate relative overflow-hidden group">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 mb-2 group-hover:scale-105 transition-transform">
                <Eye className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle>View Website</CardTitle>
              <CardDescription>
                Preview the live public-facing school website that visitors will see.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="gap-2 w-full" asChild>
                <Link href="/site/springfield">
                  View Live Site
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Platform Features</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  Sandbox & Live environments
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  Content approval workflow
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  Page section management
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  Notices & announcements
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  Multi-school support
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  Custom branding
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
