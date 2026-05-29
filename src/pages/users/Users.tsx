import { useState } from "react";
import PageShell from "../PageShell";

interface Student {
  id: string;
  fullName: string;
  email: string;
  studentId: string;
  faculty: string;
  program: string;
  yearOfStudy: string;
  phone: string;
  createdAt: string;
}

interface HrOfficer {
  id: string;
  fullName: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  phone: string;
  createdAt: string;
}

// Mock data
const mockStudents: Student[] = [
  {
    id: "1",
    fullName: "Alice Johnson",
    email: "alice@example.com",
    studentId: "S1234567",
    faculty: "Engineering",
    program: "Computer Science",
    yearOfStudy: "3",
    phone: "+1 555 123 4567",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    fullName: "Bob Smith",
    email: "bob@example.com",
    studentId: "S1234568",
    faculty: "Business",
    program: "Finance",
    yearOfStudy: "2",
    phone: "+1 555 234 5678",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    fullName: "Carol White",
    email: "carol@example.com",
    studentId: "S1234569",
    faculty: "Science",
    program: "Biology",
    yearOfStudy: "1",
    phone: "+1 555 345 6789",
    createdAt: "2024-02-01",
  },
];

const mockHrOfficers: HrOfficer[] = [
  {
    id: "1",
    fullName: "Sarah Williams",
    email: "sarah@example.com",
    employeeId: "HR-2048",
    department: "Human Resources",
    designation: "HR Officer",
    phone: "+1 555 456 7890",
    createdAt: "2023-06-10",
  },
  {
    id: "2",
    fullName: "Mark Johnson",
    email: "mark@example.com",
    employeeId: "HR-2049",
    department: "Human Resources",
    designation: "Senior HR Officer",
    phone: "+1 555 567 8901",
    createdAt: "2023-03-15",
  },
];

export function UsersPage() {
  const [activeTab, setActiveTab] = useState<"students" | "hr-officers">("students");

  return (
    <PageShell
      title="Users Management"
      description="Manage all students and HR officers in the system."
    >
      <div className="rounded-wiseLg border border-wise-ink/10 bg-wise-canvas shadow-sm dark:border-wise-canvasSoft/20 dark:bg-[#151611]">
        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("students")}
            className={`flex-1 px-6 py-4 text-center font-medium transition rounded-wiseLg ${
              activeTab === "students"
                ? "bg-wise-green/10 text-wise-green dark:bg-wise-green/20"
                : "text-wise-body hover:text-wise-ink dark:text-wise-canvasSoft dark:hover:text-wise-canvas"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("hr-officers")}
            className={`flex-1 px-6 py-4 text-center font-medium transition rounded-wiseLg ${
              activeTab === "hr-officers"
                ? "bg-wise-green/10 text-wise-green dark:bg-wise-green/20"
                : "text-wise-body hover:text-wise-ink dark:text-wise-canvasSoft dark:hover:text-wise-canvas"
            }`}
          >
            HR Officers
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-wiseLg border border-wise-ink/10 bg-wise-canvas shadow-sm dark:border-wise-canvasSoft/20 dark:bg-[#151611]">
        {/* Students Table */}
        {activeTab === "students" && (
          <div className="overflow-hidden rounded-wiseLg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-wise-ink/10 bg-wise-canvasSoft dark:border-wise-canvasSoft/20 dark:bg-wise-ink/20">
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Full Name
                    </th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Student ID
                    </th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Faculty
                    </th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Program
                    </th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Year
                    </th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className={`border-b border-wise-ink/5 transition hover:bg-wise-canvasSoft/50 dark:border-wise-canvasSoft/10 dark:hover:bg-wise-ink/20 ${
                        index % 2 === 0 ? "" : "bg-wise-canvasSoft/30 dark:bg-wise-ink/10"
                      }`}
                    >
                      <td className="px-6 py-4 text-body-md text-wise-ink dark:text-wise-canvas">
                        {student.fullName}
                      </td>
                      <td className="px-6 py-4 text-body-md text-wise-body dark:text-wise-canvasSoft">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 text-body-md text-wise-body dark:text-wise-canvasSoft">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 text-body-md text-wise-body dark:text-wise-canvasSoft">
                        {student.faculty}
                      </td>
                      <td className="px-6 py-4 text-body-md text-wise-body dark:text-wise-canvasSoft">
                        {student.program}
                      </td>
                      <td className="px-6 py-4 text-body-md text-wise-body dark:text-wise-canvasSoft">
                        {student.yearOfStudy}
                      </td>
                      <td className="px-6 py-4 text-body-md text-wise-body dark:text-wise-canvasSoft">
                        {student.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HR Officers Table */}
        {activeTab === "hr-officers" && (
          <div className="overflow-hidden rounded-wiseLg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-wise-ink/10 bg-wise-canvasSoft dark:border-wise-canvasSoft/20 dark:bg-wise-ink/20">
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Full Name
                    </th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Employee ID
                    </th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Designation
                    </th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-wise-ink dark:text-wise-canvas">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockHrOfficers.map((officer, index) => (
                    <tr
                      key={officer.id}
                      className={`border-b border-wise-ink/5 transition hover:bg-wise-canvasSoft/50 dark:border-wise-canvasSoft/10 dark:hover:bg-wise-ink/20 ${
                        index % 2 === 0 ? "" : "bg-wise-canvasSoft/30 dark:bg-wise-ink/10"
                      }`}
                    >
                      <td className="px-6 py-4 text-body-md text-wise-ink dark:text-wise-canvas">
                        {officer.fullName}
                      </td>
                      <td className="px-6 py-4 text-body-md text-wise-body dark:text-wise-canvasSoft">
                        {officer.email}
                      </td>
                      <td className="px-6 py-4 text-body-md text-wise-body dark:text-wise-canvasSoft">
                        {officer.employeeId}
                      </td>
                      <td className="px-6 py-4 text-body-md text-wise-body dark:text-wise-canvasSoft">
                        {officer.department}
                      </td>
                      <td className="px-6 py-4 text-body-md text-wise-body dark:text-wise-canvasSoft">
                        {officer.designation}
                      </td>
                      <td className="px-6 py-4 text-body-md text-wise-body dark:text-wise-canvasSoft">
                        {officer.phone}
                      </td>
                      <td className="px-6 py-4 text-body-md text-wise-body dark:text-wise-canvasSoft">
                        {officer.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
