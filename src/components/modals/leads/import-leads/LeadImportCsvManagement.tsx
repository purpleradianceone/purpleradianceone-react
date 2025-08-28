import { useState } from "react";
import LeadImportCsv from "./LeadImportCsv";
import LeadImportTagView from "./LeadImportTagView";

const LeadImportCsvManagement = () => {
  const [isSelectCsvButtonClicked, setIsSelectCsvButtonClicked] =
    useState<boolean>(false);

  const handleButtonClicked = (status: boolean) => {
    setIsSelectCsvButtonClicked(status);
  };

  return (
  <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white p-6">
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-4 space-y-6 transition-all duration-300 border border-gray-100">
      
      {/* Header */}
      <div className="border-b pb-4 flex flex-col gap-1">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          📂 Import Leads
        </h1>
        <p className="text-sm text-gray-600">
          Upload your <span className="font-semibold text-indigo-600">CSV file</span> here and import leads in just a few easy steps.
        </p>
      </div>

      {/* CSV Upload Component */}
      <div className="bg-gray-50 border-2 border-dashed border-indigo-300 rounded-xl p-6 hover:border-indigo-500 transition-all duration-200 ">
        <LeadImportCsv handleButtonClicked={handleButtonClicked} />
      </div>

      {/* Divider + Imported Tag Section */}
      {!isSelectCsvButtonClicked && (
        <div className="pt-6 border-t">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">📊 Imported Data</h2>
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100">
            <LeadImportTagView />
          </div>
        </div>
      )}
    </div>
  </div>
);

  //  return (
  //   <div className="w-full h-screen p-1 pl-5 bg-gray-50">
  //     <div className="max-w-full mx-auto bg-white rounded-2xl shadow-lg p-2 space-y-2 transition-all duration-300">
  //       <div className="border-b px-3  border shadow rounded-md ">
  //         <p className="text-base font-semibold text-gray-800"> Import and manage imported leads.</p>
  //         <p className="text-sm text-gray-500 pl-1">
  //           upload your <strong>CSV file </strong> here and imports the leads easily with few easy steps.
  //         </p>
  //       </div>

  //       <div>
  //         <LeadImportCsv handleButtonClicked={handleButtonClicked} />
  //       </div>

  //       {!isSelectCsvButtonClicked && (
  //         <div className="pt-4 border-t">
  //           <LeadImportTagView />
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
};
export default LeadImportCsvManagement;
