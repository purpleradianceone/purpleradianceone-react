import React from "react";

type Tab = {
  key: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
};

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex gap-2 border-b my-1 font-roboto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-1  text-sm font-medium rounded-t-md transition-all
            ${
              activeTab === tab.key
                ? "bg-blue-700 border  border-slate-200 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
