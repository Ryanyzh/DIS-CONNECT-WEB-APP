import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const mainNavItems = [
  {
    label: "Dashboard",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    path: "/",
    isExpandable: true,
    badge: null,
  },
  {
    label: "AI Assistant",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5.36 0a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
      </svg>
    ),
    path: "/ai-assistant",
    isExpandable: true,
    badge: "NEW",
  },
  {
    label: "E-commerce",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    path: "/ecommerce",
    isExpandable: true,
    badge: null,
  },
  {
    label: "Calendar",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    path: "/calendar",
    isExpandable: false,
    badge: null,
  },
  {
    label: "User Profile",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    path: "/profile/account",
    isExpandable: false,
    badge: null,
  },
];

const expandableSections = [
  {
    label: "Tickets",
    items: [
      { label: "All Tickets", path: "/tickets/all" },
      { label: "Assigned to Me", path: "/tickets/assigned" },
      { label: "Open Tickets", path: "/tickets/open" },
      { label: "Escalated Tickets", path: "/tickets/escalated" },
      { label: "SLA Monitoring", path: "/tickets/sla" },
      { label: "Archived / Closed Tickets", path: "/tickets/archived" },
    ],
  },
  {
    label: "Scholars",
    items: [
      { label: "Scholar Directory", path: "/scholars/directory" },
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
      { label: "Task Tracking", path: "/announcements/tasks" },
      { label: "Reminder Management", path: "/announcements/reminders" },
    ],
  },
  {
    label: "Knowledge Base",
    items: [
      { label: "FAQ Articles", path: "/knowledge-base/faqs" },
      { label: "Categories", path: "/knowledge-base/categories" },
      { label: "Suggested Articles", path: "/knowledge-base/suggested" },
      { label: "Search Analytics", path: "/knowledge-base/analytics" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Ticket Analytics", path: "/analytics/tickets" },
      { label: "SLA Analytics", path: "/analytics/sla" },
      { label: "HR Workload", path: "/analytics/workload" },
      { label: "Response Time Metrics", path: "/analytics/response-time" },
      { label: "Reports & Export", path: "/analytics/reports" },
    ],
  },
  {
    label: "Notifications",
    items: [
      { label: "Inbox", path: "/notifications/inbox" },
      { label: "Alerts", path: "/notifications/alerts" },
      { label: "Notification Settings", path: "/notifications/settings" },
    ],
  },
  {
    label: "Users & Roles",
    items: [
      { label: "Users", path: "/users/users" },
      { label: "HR Officers", path: "/users/hr-officers" },
      { label: "Roles", path: "/users/roles" },
      { label: "Permissions", path: "/users/permissions" },
    ],
  },
  {
    label: "System Settings",
    items: [
      { label: "Ticket Categories", path: "/settings/categories" },
      { label: "Priorities", path: "/settings/priorities" },
      { label: "SLA Policies", path: "/settings/sla" },
      { label: "Escalation Rules", path: "/settings/escalation" },
      { label: "Email Templates", path: "/settings/email-templates" },
      { label: "General Settings", path: "/settings/general" },
    ],
  },
];

function linkClass({ isActive }: { isActive: boolean }) {
  return (
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition " +
    (isActive
      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300"
      : "text-slate-900 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800")
  );
}

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
    <aside className="hidden w-full max-w-[280px] shrink-0 border-r border-slate-200/80 text-slate-900 dark:border-slate-800/90 dark:text-slate-50 lg:flex lg:flex-col overflow-y-auto">
      {/* Logo Section */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/90 p-4 flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex-shrink-0">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-lg font-bold">TailAdmin</span>
      </div>

      <div className="flex-1 space-y-6 p-4">
        {/* Main Navigation */}
        <div className="space-y-2">
          {expandableSections.map((section) => {
            const isOpen = expandedSection === section.label;
            return (
              <div key={section.label}>
                <button
                  onClick={() => setExpandedSection(isOpen ? null : section.label)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span>{section.label}</span>
                  <svg
                    className={`h-4 w-4 text-slate-900 dark:text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="space-y-1 border-l border-slate-200/80 dark:border-slate-700/80 pl-3 ml-3">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/"}
                        className={({ isActive }) =>
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition " +
                          (isActive
                            ? "text-blue-600 dark:text-blue-300"
                            : "text-slate-800 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100")
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
      </div>
    </aside>
  );
}
