import React from "react";

const InventoryDashboard: React.FC = () => {
  const stockLevels = [
    { itemName: "Laptop", quantity: 25, threshold: 10 },
    { itemName: "Mouse", quantity: 120, threshold: 30 },
    { itemName: "Keyboard", quantity: 40, threshold: 15 }
  ];

  const recentShipments = [
    { shipmentId: "SHIP001", supplier: "Tech Supplies Ltd", itemsReceived: 50, date: "2025-08-01" },
    { shipmentId: "SHIP002", supplier: "Office Gear Co", itemsReceived: 200, date: "2025-08-03" }
  ];

  const pendingOrders = [
    { orderId: "ORD001", customer: "Alice", item: "Laptop", quantity: 5, status: "Pending" },
    { orderId: "ORD002", customer: "Bob", item: "Mouse", quantity: 10, status: "Shipped" }
  ];

  const supplierPerformance = [
    { supplierName: "Tech Supplies Ltd", onTimeDeliveries: 95, qualityRating: "Excellent" },
    { supplierName: "Office Gear Co", onTimeDeliveries: 88, qualityRating: "Good" }
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📦 Inventory Dashboard</h2>

      {/* Stock Levels */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Stock Levels</h3>
        {stockLevels.map((item, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{item.itemName}</span>
            <span className={item.quantity <= item.threshold ? "text-red-600" : "text-green-600"}>
              {item.quantity}
            </span>
            <span className="text-gray-500">Threshold: {item.threshold}</span>
          </div>
        ))}
      </div>

      {/* Recent Shipments */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Recent Shipments</h3>
        {recentShipments.map((ship, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{ship.shipmentId} - {ship.supplier}</span>
            <span className="text-blue-600">{ship.itemsReceived} items</span>
            <span className="text-gray-500">{ship.date}</span>
          </div>
        ))}
      </div>

      {/* Pending Orders */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Pending Orders</h3>
        {pendingOrders.map((order, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{order.orderId} - {order.customer}</span>
            <span>{order.item} ({order.quantity})</span>
            <span className={order.status === "Shipped" ? "text-green-600" : "text-yellow-600"}>
              {order.status}
            </span>
          </div>
        ))}
      </div>

      {/* Supplier Performance */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Supplier Performance</h3>
        {supplierPerformance.map((supplier, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{supplier.supplierName}</span>
            <span className="text-green-600">{supplier.onTimeDeliveries}% On-time</span>
            <span className={supplier.qualityRating === "Excellent" ? "text-green-600" : "text-yellow-600"}>
              {supplier.qualityRating}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryDashboard;
