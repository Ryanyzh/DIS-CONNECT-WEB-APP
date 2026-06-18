import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/Login";
import { AnnouncementDetailPage } from "./pages/announcements/AnnouncementDetail";
import { CreateAnnouncementPage as EditAnnouncementPage } from "./pages/announcements/CreateAnnouncement";
import {
	OverviewPage,
	AllTicketsPage,
	OpenTicketsPage,
	SlaMonitoringPage,
	ArchivedTicketsPage,
	ScholarDirectoryPage,
	ScholarProfilesPage,
	ScholarExchangePage,
	ScholarActivityLogsPage,
	AllAnnouncementsPage,
	CreateAnnouncementPage,
	TaskTrackingPage,
	ReminderManagementPage,
	FaqArticlesPage,
	CreateFaqPage,
	KnowledgeCategoriesPage,
	SuggestedArticlesPage,
	SearchAnalyticsPage,
	TicketAnalyticsPage,
	SlaAnalyticsPage,
	HrWorkloadPage,
	ResponseTimeMetricsPage,
	ReportsExportPage,
	InboxPage,
	AlertsPage,
	NotificationSettingsPage,
	AllAccountsPage,
	HrOfficersPage,
	RolesAndPermissionsPage,
	CreateStudentAccountPage,
	CreateHrOfficerAccountPage,
	TicketCategoriesPage,
	PrioritiesPage,
	SlaPoliciesPage,
	EscalationRulesPage,
	EmailTemplatesPage,
	GeneralSettingsPage,
	MyAccountPage,
	SecurityPage,
	LogoutPage,
} from "./pages/pages";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route element={<ProtectedRoute />}>
					<Route element={<Layout />}>
						<Route path="/" element={<OverviewPage />} />
						<Route path="/tickets/all" element={<AllTicketsPage />} />
						<Route path="/tickets/open" element={<OpenTicketsPage />} />
						<Route path="/tickets/sla" element={<SlaMonitoringPage />} />
						<Route path="/tickets/archived" element={<ArchivedTicketsPage />} />
						<Route path="/scholars/directory" element={<ScholarDirectoryPage />} />
						<Route path="/scholars/profiles" element={<ScholarProfilesPage />} />
						<Route path="/scholars/exchange" element={<ScholarExchangePage />} />
						<Route path="/scholars/activity" element={<ScholarActivityLogsPage />} />
						<Route path="/announcements/all" element={<AllAnnouncementsPage />} />
						<Route path="/announcements/create" element={<CreateAnnouncementPage />} />
						<Route path="/announcements/:id" element={<AnnouncementDetailPage />} />
						<Route path="/announcements/:id/edit" element={<EditAnnouncementPage />} />
						<Route path="/announcements/tasks" element={<TaskTrackingPage />} />
						<Route
							path="/announcements/reminders"
							element={<ReminderManagementPage />}
						/>
						<Route path="/knowledge-base/faqs" element={<FaqArticlesPage />} />
						<Route path="/knowledge-base/faqs/create" element={<CreateFaqPage />} />
						<Route path="/knowledge-base/faqs/:id/edit" element={<CreateFaqPage />} />
						<Route
							path="/knowledge-base/categories"
							element={<KnowledgeCategoriesPage />}
						/>
						<Route
							path="/knowledge-base/suggested"
							element={<SuggestedArticlesPage />}
						/>
						<Route path="/knowledge-base/analytics" element={<SearchAnalyticsPage />} />
						<Route path="/analytics/tickets" element={<TicketAnalyticsPage />} />
						<Route path="/analytics/sla" element={<SlaAnalyticsPage />} />
						<Route path="/analytics/workload" element={<HrWorkloadPage />} />
						<Route
							path="/analytics/response-time"
							element={<ResponseTimeMetricsPage />}
						/>
						<Route path="/analytics/reports" element={<ReportsExportPage />} />
						<Route path="/notifications/inbox" element={<InboxPage />} />
						<Route path="/notifications/alerts" element={<AlertsPage />} />
						<Route
							path="/notifications/settings"
							element={<NotificationSettingsPage />}
						/>
						<Route path="/users/users" element={<AllAccountsPage />} />
						<Route
							path="/users/create-student"
							element={<CreateStudentAccountPage />}
						/>
						<Route
							path="/users/create-hr-officer"
							element={<CreateHrOfficerAccountPage />}
						/>
						<Route path="/users/hr-officers" element={<HrOfficersPage />} />
						<Route
							path="/users/roles-and-permissions"
							element={<RolesAndPermissionsPage />}
						/>
						<Route path="/settings/categories" element={<TicketCategoriesPage />} />
						<Route path="/settings/priorities" element={<PrioritiesPage />} />
						<Route path="/settings/sla" element={<SlaPoliciesPage />} />
						<Route path="/settings/escalation" element={<EscalationRulesPage />} />
						<Route path="/settings/email-templates" element={<EmailTemplatesPage />} />
						<Route path="/settings/general" element={<GeneralSettingsPage />} />
						<Route path="/profile/account" element={<MyAccountPage />} />
						<Route path="/profile/security" element={<SecurityPage />} />
						<Route path="/logout" element={<LogoutPage />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
