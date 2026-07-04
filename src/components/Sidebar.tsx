import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DisconnectLogo from "../assets/disconnect_logo_transparent.svg";

const expandableSections = [
	{
		label: "Tickets",
		items: [
			{ label: "All Tickets", path: "/tickets/all" },
			{ label: "Open Tickets", path: "/tickets/open" },
			{ label: "Archived / Closed Tickets", path: "/tickets/archived" },
		],
	},
	{
		label: "Scholars",
		items: [
			{ label: "Scholar Profiles", path: "/scholars/profiles" },
			{ label: "Exchange / Internship Tracking", path: "/scholars/exchange" },
			{ label: "Scholar Activity Logs", path: "/scholars/activity" },
		],
	},
	{
		label: "Announcements",
		items: [
			{ label: "All Announcements", path: "/announcements/all" },
			{ label: "Create Announcement", path: "/announcements/create" },
		],
	},
	{
		label: "Knowledge Base",
		items: [{ label: "FAQ Articles", path: "/knowledge-base/faqs" }],
	},
	{
		label: "Analytics",
		items: [
			{ label: "Ticket Analytics", path: "/analytics/tickets" },
			{ label: "SLA Analytics", path: "/analytics/sla" },
		],
	},
	{
		label: "Users & Roles",
		items: [
			{ label: "All Accounts", path: "/users/users" },
			{ label: "Create Student Account", path: "/users/create-student" },
			{ label: "Create HR Officer Account", path: "/users/create-hr-officer" },
			{ label: "Roles & Permissions", path: "/users/roles-and-permissions" },
		],
	},
];

export default function Sidebar() {
	const location = useLocation();
	const [expandedSection, setExpandedSection] = useState<string | null>(null);

	useEffect(() => {
		const matchedSection = expandableSections.find((section) =>
			section.items.some((item) => location.pathname === item.path)
		);
		if (matchedSection) {
			setExpandedSection(matchedSection.label);
		}
	}, [location.pathname]);

	return (
		<aside className="hidden w-full max-w-[280px] shrink-0 border-r border-wise-ink/10 dark:border-wise-canvasSoft/20 lg:flex lg:flex-col overflow-y-auto">
			{/* Logo */}
			<div className="border-b border-wise-ink/10 dark:border-wise-canvasSoft/20 px-4 py-2 flex items-center">
				<div className="flex h-14 w-14 items-center justify-center flex-shrink-0">
					<img src={DisconnectLogo} alt="Disconnect Logo" className="h-14 w-14" />
				</div>
				<span
					style={{ fontFamily: "'Poppins', sans-serif" }}
					className="ml-1 text-2xl font-semibold tracking-tight text-wise-ink dark:text-wise-canvas"
				>
					dis-connect
				</span>
			</div>

			<div className="flex-1 p-3 space-y-1.5">
				{expandableSections.map((section) => {
					const isOpen = expandedSection === section.label;
					const isSectionActive = section.items.some(
						(item) => location.pathname === item.path
					);

					return (
						<div key={section.label}>
							{/* Section header */}
							<button
								onClick={() => setExpandedSection(isOpen ? null : section.label)}
								className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
									isSectionActive
										? "font-semibold"
										: "font-medium text-wise-ink dark:text-wise-canvas hover:bg-wise-canvasSoft dark:hover:bg-[#151611]"
								}`}
							>
								<span className={isSectionActive ? "text-gradient" : ""}>
									{section.label}
								</span>
								<svg
									className={`h-4 w-4 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""} ${isSectionActive ? "text-dc-primary" : "text-wise-ink/40 dark:text-wise-canvasSoft/50"}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>

							{/* Expanded items */}
							{isOpen && (
								<div
									className={`mt-1 mb-1.5 space-y-1 pl-3 ml-2.5 border-l ${
										isSectionActive
											? "border-dc-primary/30 dark:border-dc-primary/20"
											: "border-wise-ink/10 dark:border-wise-canvasSoft/10"
									}`}
								>
									{section.items.map((item) => (
										<NavLink
											key={item.path}
											to={item.path}
											end={item.path === "/"}
											className={({ isActive }) =>
												"flex items-center rounded-xl px-3 py-2 text-sm transition " +
												(isActive
													? "btn-gradient text-white font-semibold shadow-sm"
													: "font-medium text-wise-ink/70 hover:text-wise-ink hover:bg-wise-canvasSoft dark:text-wise-canvasSoft/70 dark:hover:text-white dark:hover:bg-[#151611]")
											}
										>
											{item.label}
										</NavLink>
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</aside>
	);
}
