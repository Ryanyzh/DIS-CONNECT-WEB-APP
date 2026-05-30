import PageShell from "./PageShell";
import OverviewPage from "./Overview";
import { CreateStudentAccountPage } from "./users/CreateStudentAccount";
import { CreateHrOfficerAccountPage } from "./users/CreateHrOfficerAccount";
import { UsersPage } from "./users/Users";
import { OpenTicketsPage } from "./tickets/OpenTickets";

const createPage = (title: string, description: string) => {
	return function Page() {
		return <PageShell title={title} description={description} />;
	};
};

export {
	OverviewPage,
	CreateStudentAccountPage,
	CreateHrOfficerAccountPage,
	UsersPage,
	OpenTicketsPage,
};

export const AllTicketsPage = createPage(
	"All Tickets",
	"View every ticket in the system and filter by status, category, or owner."
);
export const AssignedTicketsPage = createPage(
	"Assigned to Me",
	"Review all tickets currently assigned to your account."
);
export const EscalatedTicketsPage = createPage(
	"Escalated Tickets",
	"Monitor tickets that have been escalated for priority handling."
);
export const SlaMonitoringPage = createPage(
	"SLA Monitoring",
	"Keep SLA compliance visible and catch upcoming or breached deadlines."
);
export const ArchivedTicketsPage = createPage(
	"Archived / Closed Tickets",
	"Browse tickets that have been resolved, archived, or closed."
);

export const ScholarDirectoryPage = createPage(
	"Scholar Directory",
	"Search and browse scholar records in the directory."
);
export const ScholarProfilesPage = createPage(
	"Scholar Profiles",
	"View detailed scholar profiles and background information."
);
export const ScholarExchangePage = createPage(
	"Exchange / Internship Tracking",
	"Track scholar exchange placements and internship status."
);
export const ScholarActivityLogsPage = createPage(
	"Scholar Activity Logs",
	"Audit scholar activities, attendance, and engagement events."
);

export const AllAnnouncementsPage = createPage(
	"All Announcements",
	"Manage announcements, view recent notices, and publish updates."
);
export const CreateAnnouncementPage = createPage(
	"Create Announcement",
	"Draft new announcements and share them with scholars or staff."
);
export const TaskTrackingPage = createPage(
	"Task Tracking",
	"Track announcement-related tasks and progress across initiatives."
);
export const ReminderManagementPage = createPage(
	"Reminder Management",
	"Manage reminder schedules and automated notification workflows."
);

export const FaqArticlesPage = createPage(
	"FAQ Articles",
	"Organize frequently asked questions and knowledge content."
);
export const KnowledgeCategoriesPage = createPage(
	"Categories",
	"Manage knowledge base categories and content taxonomy."
);
export const SuggestedArticlesPage = createPage(
	"Suggested Articles",
	"Review suggested knowledge articles for scholar support."
);
export const SearchAnalyticsPage = createPage(
	"Search Analytics",
	"Analyze knowledge base search behavior and trending topics."
);

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
	"Monitor HR workload distribution and capacity planning."
);
export const ResponseTimeMetricsPage = createPage(
	"Response Time Metrics",
	"Track average response times and service speed."
);
export const ReportsExportPage = createPage(
	"Reports & Export",
	"Export analytics and operational reports for stakeholder review."
);

export const InboxPage = createPage(
	"Inbox",
	"Review system notifications, messages, and recent updates."
);
export const AlertsPage = createPage(
	"Alerts",
	"View active alerts and incident notices in one place."
);
export const NotificationSettingsPage = createPage(
	"Notification Settings",
	"Configure notification preferences and delivery channels."
);

export const HrOfficersPage = createPage(
	"HR Officers",
	"View and manage HR officer profiles and assignments."
);
export const RolesAndPermissionsPage = createPage(
	"Roles & Permissions",
	"Create and assign roles across the dashboard"
);

export const TicketCategoriesPage = createPage(
	"Ticket Categories",
	"Manage ticket categories used by the system."
);
export const PrioritiesPage = createPage(
	"Priorities",
	"Define priority levels for incoming tickets."
);
export const SlaPoliciesPage = createPage(
	"SLA Policies",
	"Configure SLA policies and escalation triggers."
);
export const EscalationRulesPage = createPage(
	"Escalation Rules",
	"Define how tickets escalate through support workflows."
);
export const EmailTemplatesPage = createPage(
	"Email Templates",
	"Manage email templates used for automated messages."
);
export const GeneralSettingsPage = createPage(
	"General Settings",
	"Configure global dashboard and system settings."
);

export const MyAccountPage = createPage(
	"My Account",
	"Update your profile, contact information, and preferences."
);
export const SecurityPage = createPage(
	"Security",
	"Manage login security, passwords, and session controls."
);
export const LogoutPage = createPage(
	"Logout",
	"Sign out of the dashboard and secure your session."
);
