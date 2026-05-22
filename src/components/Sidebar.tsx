import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const expandableSections = [
  {
    label: "Tickets",
    items: [
      { label: "All Tickets", path: "/tickets/all" },
      { label: "Open Tickets", path: "/tickets/open" },
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
      { label: "Create Student Account", path: "/users/create-student" },
      { label: "Create HR Officer Account", path: "/users/create-hr-officer" },
      { label: "HR Officers", path: "/users/hr-officers" },
      { label: "Roles", path: "/users/roles" },
      { label: "Permissions", path: "/users/permissions" },
    ],
  },
  {
    label: "System Settings",
    items: [
      { label: "Ticket Categories", path: "/settings/categories" },
      { label: "SLA Policies", path: "/settings/sla" },
      { label: "General Settings", path: "/settings/general" },
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
    <aside className="hidden w-full max-w-[280px] shrink-0 border-r border-wise-ink/10 text-wise-ink dark:border-wise-canvasSoft/20 dark:text-wise-canvas lg:flex lg:flex-col overflow-y-auto">
      {/* Logo Section */}
      <div className="border-b border-wise-ink/10 p-4 flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-wiseXl bg-wise-green text-wise-ink flex-shrink-0">
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
                  className="flex w-full items-center justify-between gap-3 rounded-wiseXl px-3 py-2.5 text-sm font-medium text-wise-ink transition hover:bg-wise-canvasSoft dark:text-wise-canvas dark:hover:bg-[#151611]"
                >
                  <span>{section.label}</span>
                  <svg
                    className={`h-4 w-4 text-wise-ink dark:text-wise-canvasSoft transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="space-y-1 border-l border-wise-ink/20 pl-3 ml-3 dark:border-wise-canvasSoft/20">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/"}
                        className={({ isActive }) =>
                          "flex items-center gap-3 rounded-wiseXl px-3 py-2 text-sm font-medium transition " +
                          (isActive
                            ? "text-wise-green dark:text-wise-active"
                            : "text-wise-ink hover:text-wise-inkDeep dark:text-wise-canvasSoft dark:hover:text-white")
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
