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
export const TicketAnalyticsPage = createPage(
	"Ticket Analytics",
	"Explore ticket volume, resolution patterns, and team performance."
);
export const SlaAnalyticsPage = createPage(
	"SLA Analytics",
	"Review SLA metrics for service performance and compliance."
);

// Notifications
export const InboxPage = createPage("Inbox", "View all incoming notifications and messages.");
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
export { RolesAndPermissionsPage } from "./users/RolesAndPermissions";

// Profile
export const MyAccountPage = createPage(
	"My Account",
	"Update your profile, contact information, and preferences."
);
export const SecurityPage = createPage(
	"Security",
	"Manage your password and account security settings."
);
