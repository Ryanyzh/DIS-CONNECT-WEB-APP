import TicketCard from "./components/TicketCard";
import type { TicketProps } from "./components/TicketCard";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const testTicket: TicketProps = {
    id: "REB-2024-0012",
    title: "Hostel Reimbursement Year 1 Semester 1",
    tag: "Reimbursement",
    description:
      "Requesting reimbursement for hostel fees for Year 1 Semester 1",
    priority: 3,
    status: "In Review",
    deadline: new Date(new Date().getTime() - 1 * 60000), // 1 minute ago
    lastUpdated: new Date(new Date().getTime() - 2 * 60000), // 2 minutes ago
    officer: {
      id: "0",
      name: "Eileen T.",
      email: "eileen.t@example.com",
      department: "HR",
    },
  };

  return (
    <Dashboard />
    
    // <div className="min-h-screen w-screen bg-zinc-950 flex items-center justify-center">
    //   <div className="w-full max-w-sm">
    //     <TicketCard ticket={testTicket} />
    //   </div>
    // </div>
  );
}

export default App;
