import PageShell from "./PageShell";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

function StatCard({ icon, label, value, change, isPositive }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className={`mt-2 text-sm font-medium ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {isPositive ? "↑" : "↓"} {change}
          </p>
        </div>
        <div className="text-slate-400 dark:text-slate-500">{icon}</div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <PageShell
      title="Overview / Home"
      description="A high-level summary of ticket activity, scholar metrics, notifications, and system health."
    >
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2h2v-2a11 11 0 00-20 0v2h2v-2z" />
              </svg>
            }
            label="Total Scholars"
            value="3,782"
            change="11.01%"
            isPositive={true}
          />
          <StatCard
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            label="Open Tickets"
            value="5,359"
            change="9.05%"
            isPositive={false}
          />
          <StatCard
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            label="SLA Compliance"
            value="75.55%"
            change="10%"
            isPositive={true}
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Sales Chart */}
          <div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">Monthly Sales</p>
              </div>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
            </div>
            <div className="h-64 flex items-end justify-around gap-2">
              {[150, 350, 200, 280, 150, 240, 200, 120, 300, 280, 240, 120].map((height, index) => (
                <div
                  key={index}
                  className="w-full rounded-t bg-blue-500 dark:bg-blue-600"
                  style={{ height: `${(height / 350) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-slate-600 dark:text-slate-400">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>

          {/* Target Progress */}
          <div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">Monthly Target</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Target you've set for each month</p>
              </div>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-40 w-40">
                <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${3.4 * 75.55} ${3.4 * 100}`}
                    className="text-blue-500 dark:text-blue-600"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">75.55%</p>
                  <p className="text-xs text-green-600 dark:text-green-400">+10%</p>
                </div>
              </div>
              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                You earn $3287 today, its higher than last month. Keep up your good work!
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
          <div className="mb-6">
            <p className="text-lg font-bold text-slate-900 dark:text-white">Statistics</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Target you've set for each month</p>
          </div>
          <div className="h-64 flex items-end justify-around gap-2">
            {[180, 200, 190, 210, 195, 215, 200, 220, 205, 225, 210, 230].map((height, index) => (
              <div
                key={index}
                className="relative flex-1"
              >
                <div
                  className="relative mx-auto w-3/4 rounded-t bg-blue-200 dark:bg-blue-500/30"
                  style={{ height: `${(height / 230) * 100}%` }}
                >
                  <div
                    className="w-full rounded-t bg-blue-500 dark:bg-blue-600"
                    style={{ height: "60%" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-xs text-slate-600 dark:text-slate-400">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
          <div className="mt-6 flex justify-around border-t border-slate-200/80 pt-6 dark:border-slate-700/80">
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">Target</p>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">$20K</p>
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">↓ 5%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">Revenue</p>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">$16K</p>
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">↑ 8%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">Today</p>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">$20K</p>
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">↑ 12%</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
