import React from "react";

const FinanceDashboard: React.FC = () => {
  const revenueVsExpenses = [
    { month: "June", revenue: 50000, expenses: 30000 },
    { month: "July", revenue: 60000, expenses: 35000 }
  ];

  const outstandingInvoices = [
    { invoiceId: "INV001", customer: "Acme Corp", amount: 5000, dueDate: "2025-08-20" },
    { invoiceId: "INV002", customer: "Globex Inc", amount: 3200, dueDate: "2025-08-25" }
  ];

  const recentTransactions = [
    { transactionId: "TX101", description: "Software License", amount: -2000, category: "Expenses", date: "2025-08-01" },
    { transactionId: "TX102", description: "Client Payment", amount: 7000, category: "Revenue", date: "2025-08-05" }
  ];

  const taxSummary = [
    { taxType: "VAT", amount: 1500, dueDate: "2025-09-01" },
    { taxType: "Corporate Tax", amount: 5000, dueDate: "2025-10-15" }
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">💰 Finance Dashboard</h2>

      {/* Revenue vs Expenses */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Revenue vs Expenses</h3>
        <ul className="space-y-1 text-gray-700">
          {revenueVsExpenses.map((item, idx) => (
            <li key={idx} className="flex justify-between border-b pb-1">
              <span>{item.month}</span>
              <span className="text-green-600">Revenue: ${item.revenue}</span>
              <span className="text-red-600">Expenses: ${item.expenses}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Outstanding Invoices */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Outstanding Invoices</h3>
        {outstandingInvoices.map((inv, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{inv.invoiceId} - {inv.customer}</span>
            <span className="text-blue-600">${inv.amount}</span>
            <span className="text-gray-500">{inv.dueDate}</span>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
        {recentTransactions.map((tx, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{tx.description}</span>
            <span className={tx.amount > 0 ? "text-green-600" : "text-red-600"}>
              {tx.amount > 0 ? "+" : ""}${tx.amount}
            </span>
            <span className="text-gray-500">{tx.date}</span>
          </div>
        ))}
      </div>

      {/* Tax Summary */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Tax & Compliance</h3>
        {taxSummary.map((tax, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{tax.taxType}</span>
            <span className="text-purple-600">${tax.amount}</span>
            <span className="text-gray-500">{tax.dueDate}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanceDashboard;
