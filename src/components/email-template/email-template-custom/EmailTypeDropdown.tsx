import { TemplateType } from "../TemplatesPage";

export type TabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  templateTypes: TemplateType[];
};

export const EmailTypeDropdown: React.FC<TabsProps> = ({
  activeTab,
  onTabChange,
  templateTypes,
}) => (
  <div className="px-1 w-fit input-label-custom cursor-pointer ring-blue-400">
    <select
      value={activeTab}
      onChange={(e) => onTabChange(e.target.value)}
      className="w-fit p-1.5 border-2  rounded-lg ring-blue-400 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors hover:border-gray-400"
    >
      {/* <option value="">Select Template Type</option> */}
      {templateTypes.map((tab) => (
        <option className="input-label-custom" key={tab.id} value={tab.name}>
          {tab.name}
        </option>
      ))}
    </select>
  </div>
  // <div className="sticky top-0 mb-1 bg-white overflow-x-auto scrollbar-hide">
  //   <div className="flex flex-nowrap overflow-x-auto custom-height-scrollbar p-1">
  //     {templateTypes.map((tab) => (
  //       <button
  //         key={tab.id}
  //         onClick={() => onTabChange(tab.name)}
  //         className={`py-2 px-4 border-b-2 ${
  //           activeTab === tab.name
  //             ? "main-nav-custom active-header"
  //             : "border-transparent main-nav-custom"
  //         } transition-colors duration-200 min-w-fit `}
  //       >
  //         {tab.name}
  //       </button>
  //     ))}
  //   </div>
  // </div>
);