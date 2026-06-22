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
	TicketDetailsPage,
	ScholarDirectoryPage,
	ScholarProfilesPage,
	ScholarDetailPage,
	ScholarExchangePage,
	ScholarExchangeFormPage,
	ScholarActivityLogsPage,
	AllAnnouncementsPage,
	CreateAnnouncementPage,
	TaskTrackingPage,
	FaqArticlesPage,
	CreateFaqPage,
	KnowledgeCategoriesPage,
	TicketAnalyticsPage,
	SlaAnalyticsPage,
	NotificationSettingsPage,
	AllAccountsPage,
	HrOfficersPage,
	RolesAndPermissionsPage,
	CreateStudentAccountPage,
	CreateHrOfficerAccountPage,
	TicketCategoriesPage,
	GeneralSettingsPage,
	MyAccountPage,
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
						<Route path="/tickets/:ticketId" element={<TicketDetailsPage />} />
						<Route path="/scholars/directory" element={<ScholarDirectoryPage />} />
						<Route path="/scholars/profiles" element={<ScholarProfilesPage />} />
						<Route path="/scholars/profiles/:id" element={<ScholarDetailPage />} />
						<Route path="/scholars/exchange" element={<ScholarExchangePage />} />
						<Route
							path="/scholars/exchange/create"
							element={<ScholarExchangeFormPage />}
						/>
						<Route
							path="/scholars/exchange/:id/edit"
							element={<ScholarExchangeFormPage />}
						/>
						<Route path="/scholars/activity" element={<ScholarActivityLogsPage />} />
						<Route path="/announcements/all" element={<AllAnnouncementsPage />} />
						<Route path="/announcements/create" element={<CreateAnnouncementPage />} />
						<Route path="/announcements/:id" element={<AnnouncementDetailPage />} />
						<Route path="/announcements/:id/edit" element={<EditAnnouncementPage />} />
						<Route path="/announcements/tasks" element={<TaskTrackingPage />} />
						<Route path="/knowledge-base/faqs" element={<FaqArticlesPage />} />
						<Route path="/knowledge-base/faqs/create" element={<CreateFaqPage />} />
						<Route path="/knowledge-base/faqs/:id/edit" element={<CreateFaqPage />} />
						<Route
							path="/knowledge-base/categories"
							element={<KnowledgeCategoriesPage />}
						/>

						<Route path="/analytics/tickets" element={<TicketAnalyticsPage />} />
						<Route path="/analytics/sla" element={<SlaAnalyticsPage />} />
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
						<Route path="/settings/general" element={<GeneralSettingsPage />} />
						<Route path="/profile/account" element={<MyAccountPage />} />
						<Route path="/logout" element={<LogoutPage />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
