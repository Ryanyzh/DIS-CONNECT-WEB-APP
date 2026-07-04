import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "./PageShell";
import { signOut } from "../lib/authRepository";

const createPage = (description: string) => {
	return function Page() {
		return <PageShell description={description} />;
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

// Tickets
export { AllTicketsPage } from "./tickets/AllTickets";
export { OpenTicketsPage } from "./tickets/OpenTickets";
export { ArchivedTicketsPage } from "./tickets/ArchivedTickets";
export { TicketDetailsPage } from "./tickets/TicketDetails";
export const SlaMonitoringPage = createPage(
	"Keep SLA compliance visible and catch upcoming or breached deadlines."
);

// Scholars
export { ScholarProfilesPage } from "./scholars/ScholarProfiles";
export { ScholarDetailPage } from "./scholars/ScholarDetail";
export { ScholarExchangePage } from "./scholars/ScholarExchange";
export { ScholarExchangeFormPage } from "./scholars/ScholarExchangeForm";
export { ScholarActivityLogsPage } from "./scholars/ScholarActivityLogs";

// Announcements
export { AllAnnouncementsPage } from "./announcements/AllAnnouncements";
export { CreateAnnouncementPage } from "./announcements/CreateAnnouncement";

// Knowledge Base
export { AllFaqsPage as FaqArticlesPage } from "./faq/AllFaqs";
export { CreateFaqPage } from "./faq/CreateFaq";

// Analytics
export { TicketAnalyticsPage } from "./analytics/TicketAnalytics";
export const SlaAnalyticsPage = createPage(
	"Review SLA metrics for service performance and compliance."
);

// Notifications
export const InboxPage = createPage("View all incoming notifications and messages.");
export const AlertsPage = createPage("Manage system alerts and escalation notifications.");
export const NotificationSettingsPage = createPage(
	"Configure notification preferences and delivery channels."
);

// Users
export { AllAccountsPage } from "./users/AllAccounts";
export { CreateStudentAccountPage } from "./users/CreateStudentAccount";
export { CreateHrOfficerAccountPage } from "./users/CreateHrOfficerAccount";
export { RolesAndPermissionsPage } from "./users/RolesAndPermissions";

// Profile
export { MyAccountPage } from "./profile/MyAccount";
export const SecurityPage = createPage("Manage your password and account security settings.");
