import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "./PageShell";
import { signOut } from "../lib/authRepository";

const createPage = (title: string, description: string) => {
    return function Page() {
        return <PageShell title={title} description={description} />;
    };
};

export function LogoutPage() {
    const navigate = useNavigate();
    useEffect(() => {
        signOut().finally(() => navigate("/login", { replace: true }));
    }, [navigate]);
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <span className="text-zinc-400 text-sm">Signing out...</span>
        </div>
    );
}

// Overview
export { default as OverviewPage } from "./Overview";

// Tickets
export { AllTicketsPage } from "./tickets/AllTickets";
export { OpenTicketsPage } from "./tickets/OpenTickets";
export { ArchivedTicketsPage } from "./tickets/ArchivedTickets";
export { TicketDetailsPage } from "./tickets/TicketDetails";
export const SlaMonitoringPage = createPage(
    "SLA Monitoring",
    "Keep SLA compliance visible and catch upcoming or breached deadlines."
);

// Scholars
export const ScholarDirectoryPage = createPage(
    "Scholar Directory",
    "Search and browse scholar records in the directory."
);
export { ScholarProfilesPage } from "./scholars/ScholarProfiles";
export { ScholarDetailPage } from "./scholars/ScholarDetail";
export { ScholarExchangePage } from "./scholars/ScholarExchange";
export { ScholarExchangeFormPage } from "./scholars/ScholarExchangeForm";
export { ScholarActivityLogsPage } from "./scholars/ScholarActivityLogs";

// Announcements
export { AllAnnouncementsPage } from "./announcements/AllAnnouncements";
export { CreateAnnouncementPage } from "./announcements/CreateAnnouncement";
export const TaskTrackingPage = createPage(
    "Task Tracking",
    "Track announcement-related tasks and progress across initiatives."
);
export const ReminderManagementPage = createPage(
    "Reminder Management",
    "Set and manage reminders tied to announcements and deadlines."
);

// Knowledge Base
export { AllFaqsPage as FaqArticlesPage } from "./faq/AllFaqs";
export { CreateFaqPage } from "./faq/CreateFaq";
export const KnowledgeCategoriesPage = createPage(
    "Categories",
    "Manage knowledge base categories and content taxonomy."
);
export const SuggestedArticlesPage = createPage(
    "Suggested Articles",
    "Review and curate articles suggested by the system."
);
export const SearchAnalyticsPage = createPage(
    "Search Analytics",
    "Analyse knowledge base search queries and gaps."
);

// Analytics
export const TicketAnalyticsPage = createPage(
    "Ticket Analytics",
    "Explore ticket volume, resolution patterns, and team performance."
);
export const SlaAnalyticsPage = createPage(
    "SLA Analytics",
    "Review SLA metrics for service performance and compliance."
);
export const HrWorkloadPage = createPage(
    "HR Workload",
    "Monitor HR officer workload and ticket distribution."
);
export const ResponseTimeMetricsPage = createPage(
    "Response Time Metrics",
    "Track average response and resolution times across the team."
);
export const ReportsExportPage = createPage(
    "Reports & Export",
    "Generate and export reports for stakeholders."
);

// Notifications
export const InboxPage = createPage(
    "Inbox",
    "View all incoming notifications and messages."
);
export const AlertsPage = createPage(
    "Alerts",
    "Manage system alerts and escalation notifications."
);
export const NotificationSettingsPage = createPage(
    "Notification Settings",
    "Configure notification preferences and delivery channels."
);

// Users
export { AllAccountsPage } from "./users/AllAccounts";
export { CreateStudentAccountPage } from "./users/CreateStudentAccount";
export { CreateHrOfficerAccountPage } from "./users/CreateHrOfficerAccount";
export const HrOfficersPage = createPage(
    "HR Officers",
    "View and manage HR officer profiles and assignments."
);
export { RolesAndPermissionsPage } from "./users/RolesAndPermissions";

// Settings
export const TicketCategoriesPage = createPage(
    "Ticket Categories",
    "Manage ticket categories used by the system."
);
export const PrioritiesPage = createPage(
    "Priorities",
    "Configure ticket priority levels and thresholds."
);
export const SlaPoliciesPage = createPage(
    "SLA Policies",
    "Define SLA response and resolution time policies."
);
export const EscalationRulesPage = createPage(
    "Escalation Rules",
    "Set up rules for automatic ticket escalation."
);
export const EmailTemplatesPage = createPage(
    "Email Templates",
    "Manage email templates for automated notifications."
);
export const GeneralSettingsPage = createPage(
    "General Settings",
    "Configure global dashboard and system settings."
);

// Profile
export const MyAccountPage = createPage(
    "My Account",
    "Update your profile, contact information, and preferences."
);
export const SecurityPage = createPage(
    "Security",
    "Manage your password and account security settings."
);
