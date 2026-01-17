import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { CMSLayout } from "@/pages/cms/cms-layout";
import CMSDashboard from "@/pages/cms/dashboard";
import CMSSections from "@/pages/cms/sections";
import CMSNotices from "@/pages/cms/notices";
import CMSApprovals from "@/pages/cms/approvals";
import CMSSettings from "@/pages/cms/settings";
import SchoolWebsite from "@/pages/website/school-website";

function CMSRoutes() {
  return (
    <CMSLayout>
      <Switch>
        <Route path="/cms" component={CMSDashboard} />
        <Route path="/cms/sections" component={CMSSections} />
        <Route path="/cms/notices" component={CMSNotices} />
        <Route path="/cms/approvals" component={CMSApprovals} />
        <Route path="/cms/settings" component={CMSSettings} />
        <Route component={CMSDashboard} />
      </Switch>
    </CMSLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cms" component={CMSRoutes} />
      <Route path="/cms/:rest*" component={CMSRoutes} />
      <Route path="/site/:slug" component={SchoolWebsite} />
      <Route path="/preview/:slug?" component={SchoolWebsite} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
