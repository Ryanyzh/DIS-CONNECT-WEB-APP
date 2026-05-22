import { useState } from "react";
import type { FormEventHandler } from "react";
import PageShell from "../PageShell";

export function CreateHrOfficerAccountPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [designation, setDesignation] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setMessage(`HR officer account for ${fullName} has been queued for creation.`);
  };

  return (
    <PageShell
      title="Create HR Officer Account"
      description="Add a new HR officer account for user management, permissions, and authentication."
    >
      <div className="rounded-wiseXl border border-wise-ink/10 bg-wise-canvas p-xl shadow-sm dark:border-wise-canvasSoft/20 dark:bg-[#151611]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Full name</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter officer name"
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
              />
            </label>
            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="hr@example.com"
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
              />
            </label>
            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a secure password"
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
              />
            </label>
            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Phone number</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
              />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Employee ID</span>
              <input
                value={employeeId}
                onChange={(event) => setEmployeeId(event.target.value)}
                placeholder="e.g. HR-2048"
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
              />
            </label>
            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Department ID</span>
              <input
                value={departmentId}
                onChange={(event) => setDepartmentId(event.target.value)}
                placeholder="e.g. DPT-01"
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
              />
            </label>
            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Designation</span>
              <input
                value={designation}
                onChange={(event) => setDesignation(event.target.value)}
                placeholder="e.g. HR Officer"
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-wise-body dark:text-wise-canvasSoft">HR officers can manage scholar accounts and permission levels.</p>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-wisePill bg-wise-green px-6 py-3 text-body-md font-semibold text-wise-ink transition hover:bg-wise-active active:bg-wise-neutral"
            >
              Create HR officer account
            </button>
          </div>

          {message && <p className="rounded-wiseMd bg-wise-canvasSoft px-4 py-3 text-body-md text-wise-ink dark:bg-[#1b2612] dark:text-wise-canvas">{message}</p>}
        </form>
      </div>
    </PageShell>
  );
}