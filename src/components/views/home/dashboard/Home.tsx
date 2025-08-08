import React, { useState } from "react";
import Dashboard from "./Dashboard";

// ======= Dashboard Components =======
const CRM: React.FC = () => <Dashboard/>;
const Support: React.FC = () => <div className="p-4">Support Dashboard Content</div>;
const Inventory: React.FC = () => <div className="p-4">Inventory Dashboard Content</div>;
const Finance: React.FC = () => <div className="p-4">Finance Dashboard Content</div>;
const HRMS: React.FC = () => <div className="p-4">HRMS Dashboard Content</div>;

// ======= Types =======
type Module = {
  id: number;
  company_user_id: number;
  dashboard_id: number; // replaced "order"
  dashboard_name: string;
  isactive: boolean;
};

// ======= Data =======
const modules: Module[] = [
  { id: 86, company_user_id: 6, dashboard_id: 1, dashboard_name: "CRM", isactive: true },
  { id: 87, company_user_id: 6, dashboard_id: 2, dashboard_name: "Support", isactive: true },
  { id: 88, company_user_id: 6, dashboard_id: 3, dashboard_name: "Inventory", isactive: true },
  { id: 89, company_user_id: 6, dashboard_id: 4, dashboard_name: "Finance", isactive: true },
  { id: 90, company_user_id: 6, dashboard_id: 5, dashboard_name: "HRMS", isactive: true },
];

const Home: React.FC = () => {
  const activeModules = modules.filter((m) => m.isactive);
  const [activeTab, setActiveTab] = useState(activeModules[0]?.dashboard_id ?? 0);

  const renderContent = () => {
    switch (activeTab) {
      case 1:
        return <CRM />;
      case 2:
        return <Support />;
      case 3:
        return <Inventory />;
      case 4:
        return <Finance />;
      case 5:
        return <HRMS />;
      default:
        return <div>No content available for this dashboard.</div>;
    }
  };

  if (activeModules.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 text-gray-500">
        No modules available
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {/* Horizontal Tabs */}
      <div className="bg-white border-b border-gray-300">
        <div className="flex justify-start">
          {activeModules.map((module) => (
            <button
              key={module.dashboard_id}
              onClick={() => setActiveTab(module.dashboard_id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === module.dashboard_id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-700 hover:text-blue-500"
                }`}
            >
              {module.dashboard_name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">{renderContent()}</div>
    </div>
  );
};

export default Home;
