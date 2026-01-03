import React from "react";

const HRMSDashboard: React.FC = () => {
  const attendanceSummary = { present: 45, absent: 3, late: 2 };

  const leaveRequests = [
    { employeeName: "John Doe", leaveType: "Annual Leave", startDate: "2025-08-15", endDate: "2025-08-20", status: "Pending" },
    { employeeName: "Jane Smith", leaveType: "Sick Leave", startDate: "2025-08-10", endDate: "2025-08-12", status: "Approved" }
  ];

  const upcomingEvents = [
    { employeeName: "Alice", eventType: "Birthday", date: "2025-08-14" },
    { employeeName: "Bob", eventType: "Work Anniversary", date: "2025-08-18" }
  ];

  const recruitmentPipeline = [
    { stage: "Applied", candidateCount: 25 },
    { stage: "Interview", candidateCount: 8 },
    { stage: "Offer", candidateCount: 3 },
    { stage: "Hired", candidateCount: 2 }
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">👥 HRMS Dashboard</h2>

      {/* Attendance Summary */}
      <div className="bg-white rounded-2xl shadow p-4 grid grid-cols-3 text-center">
        <div>
          <p className="text-lg font-semibold text-green-600">{attendanceSummary.present}</p>
          <p className="text-gray-500">Present</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-red-600">{attendanceSummary.absent}</p>
          <p className="text-gray-500">Absent</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-yellow-600">{attendanceSummary.late}</p>
          <p className="text-gray-500">Late</p>
        </div>
      </div>

      {/* Leave Requests */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Leave Requests</h3>
        {leaveRequests.map((leave, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{leave.employeeName} ({leave.leaveType})</span>
            <span className={`font-medium ${leave.status === "Approved" ? "text-green-600" : "text-yellow-600"}`}>
              {leave.status}
            </span>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Upcoming Birthdays & Anniversaries</h3>
        {upcomingEvents.map((event, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{event.employeeName}</span>
            <span>{event.eventType}</span>
            <span className="text-gray-500">{event.date}</span>
          </div>
        ))}
      </div>

      {/* Recruitment Pipeline */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Recruitment Pipeline</h3>
        {recruitmentPipeline.map((stage, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{stage.stage}</span>
            <span className="text-blue-600">{stage.candidateCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HRMSDashboard;
