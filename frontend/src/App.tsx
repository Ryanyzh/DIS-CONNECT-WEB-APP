import Ticket from "./components/Ticket";
import type { TicketProps } from "./components/Ticket";

function App() {
  const testTicket: TicketProps = {
    id: "REB-2024-0012",
    title: "Hostel Reimbursement Year 1 Semester 1",
    tag: "Reimbursement",
    description: "Requesting reimbursement for hostel fees for Year 1 Semester 1",
    priority: 3,
    status: "In Review",
    deadline: new Date(),
    lastUpdated: new Date(new Date().getTime() - 2 * 60000), // 2 minutes ago
    officer: {
      id: "0",
      name: "Eileen T.",
      email: "eileen.t@example.com",
      department: "HR"
    }
  };

  return (
    <div>
      <div>
        <Ticket ticket={testTicket} />
      </div>
    </div>
  );
}

export default App;