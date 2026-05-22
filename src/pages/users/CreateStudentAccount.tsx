import { useState } from "react";
import type { FormEventHandler } from "react";
import PageShell from "../PageShell";

export function CreateStudentAccountPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [program, setProgram] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [preferredContact, setPreferredContact] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const generatePassword = () => {
    const code = Math.floor(Math.random() * 90000000) + 10000000;
    setPassword(code.toString());
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setMessage(`Student account for ${fullName} has been queued for creation.`);
  };

  return (
    <PageShell
      title="Create Student Account"
      description="Add a new student account to the system for user management and authentication."
    >
      <div className="rounded-wiseXl border border-wise-ink/10 bg-wise-canvas p-xl shadow-sm dark:border-wise-canvasSoft/20 dark:bg-[#151611]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Full name</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter student name"
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
              />
            </label>
            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@example.com"
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
              />
            </label>
            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Password</span>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a secure password"
                    className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 pr-12 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-wise-ink/60 hover:text-wise-ink dark:text-wise-canvas/60 dark:hover:text-wise-canvas transition"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12c2.126 5.455 7.173 9 12.064 9 1.760 0 3.468-.188 5.168-.539M19.322 15.75A10.452 10.452 0 0023.186 12c-2.126-5.455-7.172-9-12.064-9-.759 0-1.504.055-2.236.172m13.581 2.573L15.75 12m0 0l4.575 4.575M12 9l-4.575 4.575"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="rounded-wiseMd border border-wise-ink/20 bg-wise-canvasSoft px-4 py-3 text-body-md font-medium text-wise-ink transition hover:bg-wise-ink/5 active:bg-wise-ink/10 dark:border-wise-mute dark:bg-wise-ink dark:text-wise-canvas dark:hover:bg-wise-ink/80"
                >
                  Generate
                </button>
              </div>
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
              <span className="font-medium">Student ID</span>
              <input
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                placeholder="e.g. S1234567"
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
              />
            </label>
            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Faculty</span>
              <input
                value={faculty}
                onChange={(event) => setFaculty(event.target.value)}
                placeholder="e.g. Engineering"
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
              />
            </label>

            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Program</span>
              <input
                value={program}
                onChange={(event) => setProgram(event.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-white"
              />
            </label>

            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Year of study</span>
              <select
                value={yearOfStudy}
                onChange={(event) => setYearOfStudy(event.target.value)}
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 pr-10 appearance-none text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-wise-white"
              >
                <option value="">Select year</option>
                <option value="1">1st year</option>
                <option value="2">2nd year</option>
                <option value="3">3rd year</option>
                <option value="4">4th year</option>
                <option value="5">5th year+</option>
              </select>
            </label>

            <label className="space-y-2 text-body-md text-wise-ink dark:text-wise-canvas">
              <span className="font-medium">Preferred contact method</span>
              <select
                value={preferredContact}
                onChange={(event) => setPreferredContact(event.target.value)}
                className="w-full rounded-wiseMd border border-wise-ink/20 bg-white px-4 py-3 pr-10 appearance-none text-body-md text-wise-ink outline-none transition focus:border-wise-green focus:ring-2 focus:ring-wise-green/20 dark:border-wise-mute dark:bg-wise-ink dark:text-wise-white"
              >
                <option value="">Select preferred contact</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="sms">SMS</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-wise-body dark:text-wise-canvasSoft">
              Student accounts can be managed by HR officers once created.
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-wisePill bg-wise-green px-6 py-3 text-body-md font-semibold text-wise-ink transition hover:bg-wise-active active:bg-wise-neutral"
            >
              Create student account
            </button>
          </div>

          {message && (
            <p className="rounded-wiseMd bg-wise-canvasSoft px-4 py-3 text-body-md text-wise-ink dark:bg-[#1b2612] dark:text-wise-canvas">
              {message}
            </p>
          )}
        </form>
      </div>
    </PageShell>
  );
}
