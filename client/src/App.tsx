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
import CMSLeads from "@/pages/cms/leads";
import CMSStudents from "@/pages/cms/students";
import CMSStudentForm from "@/pages/cms/student-form";
import CMSAdmissions from "@/pages/cms/admissions";
import CMSClasses from "@/pages/cms/classes";
import CMSAttendance from "@/pages/cms/attendance";
import CMSThemeEditor from "@/pages/cms/theme-editor";
import SchoolWebsite from "@/pages/website/school-website";
import ParentPortal from "@/pages/portal/parent-portal";

function withCMSLayout(Component: React.ComponentType) {
  return function WrappedComponent() {
    return (
      <CMSLayout>
        <Component />
      </CMSLayout>
    );
  };
}

const CMSDashboardPage = withCMSLayout(CMSDashboard);
const CMSSectionsPage = withCMSLayout(CMSSections);
const CMSNoticesPage = withCMSLayout(CMSNotices);
const CMSLeadsPage = withCMSLayout(CMSLeads);
const CMSApprovalsPage = withCMSLayout(CMSApprovals);
const CMSSettingsPage = withCMSLayout(CMSSettings);
const CMSStudentsPage = withCMSLayout(CMSStudents);
const CMSStudentFormPage = withCMSLayout(CMSStudentForm);
const CMSAdmissionsPage = withCMSLayout(CMSAdmissions);
const CMSClassesPage = withCMSLayout(CMSClasses);
const CMSAttendancePage = withCMSLayout(CMSAttendance);
const CMSThemeEditorPage = withCMSLayout(CMSThemeEditor);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cms" component={CMSDashboardPage} />
      <Route path="/cms/sections" component={CMSSectionsPage} />
      <Route path="/cms/notices" component={CMSNoticesPage} />
      <Route path="/cms/leads" component={CMSLeadsPage} />
      <Route path="/cms/approvals" component={CMSApprovalsPage} />
      <Route path="/cms/settings" component={CMSSettingsPage} />
      <Route path="/cms/students/new" component={CMSStudentFormPage} />
      <Route path="/cms/students/:id/edit" component={CMSStudentFormPage} />
      <Route path="/cms/students/:id" component={CMSStudentFormPage} />
      <Route path="/cms/students" component={CMSStudentsPage} />
      <Route path="/cms/admissions" component={CMSAdmissionsPage} />
      <Route path="/cms/classes" component={CMSClassesPage} />
      <Route path="/cms/attendance" component={CMSAttendancePage} />
      <Route path="/cms/theme-editor" component={CMSThemeEditorPage} />
      <Route path="/site/:slug" component={SchoolWebsite} />
      <Route path="/preview/:slug?" component={SchoolWebsite} />
      <Route path="/portal/:token" component={ParentPortal} />
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
