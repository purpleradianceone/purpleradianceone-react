import React from "react";

const SupportDashboard: React.FC = () => {
  const ticketOverview = { open: 15, inProgress: 8, resolved: 42 };

  const recentTickets = [
    { ticketId: "TCK001", subject: "Login issue", customer: "Alice", priority: "High", status: "Open" },
    { ticketId: "TCK002", subject: "Payment failed", customer: "Bob", priority: "Medium", status: "In Progress" },
    { ticketId: "TCK003", subject: "Feature request", customer: "Charlie", priority: "Low", status: "Resolved" }
  ];

  const agentPerformance = [
    { agentName: "Sarah", ticketsHandled: 20, avgResponseTime: "1h 20m" },
    { agentName: "Mike", ticketsHandled: 18, avgResponseTime: "1h 45m" }
  ];

  const customerSatisfaction = [
    { rating: "Excellent", count: 30 },
    { rating: "Good", count: 12 },
    { rating: "Poor", count: 3 }
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🎧 Support Dashboard</h2>

      {/* Ticket Overview */}
      <div className="bg-white rounded-2xl shadow p-4 grid grid-cols-3 text-center">
        <div>
          <p className="text-lg font-semibold text-red-600">{ticketOverview.open}</p>
          <p className="text-gray-500">Open</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-yellow-600">{ticketOverview.inProgress}</p>
          <p className="text-gray-500">In Progress</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-green-600">{ticketOverview.resolved}</p>
          <p className="text-gray-500">Resolved</p>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Recent Tickets</h3>
        {recentTickets.map((ticket, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{ticket.ticketId} - {ticket.subject}</span>
            <span className={ticket.priority === "High" ? "text-red-600" : ticket.priority === "Medium" ? "text-yellow-600" : "text-gray-500"}>
              {ticket.priority}
            </span>
            <span className={ticket.status === "Resolved" ? "text-green-600" : ticket.status === "In Progress" ? "text-yellow-600" : "text-red-600"}>
              {ticket.status}
            </span>
          </div>
        ))}
      </div>

      {/* Agent Performance */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Agent Performance</h3>
        {agentPerformance.map((agent, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{agent.agentName}</span>
            <span>{agent.ticketsHandled} tickets</span>
            <span className="text-blue-600">{agent.avgResponseTime}</span>
          </div>
        ))}
      </div>

      {/* Customer Satisfaction */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Customer Satisfaction</h3>
        {customerSatisfaction.map((csat, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{csat.rating}</span>
            <span className={csat.rating === "Excellent" ? "text-green-600" : csat.rating === "Good" ? "text-yellow-600" : "text-red-600"}>
              {csat.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportDashboard;
