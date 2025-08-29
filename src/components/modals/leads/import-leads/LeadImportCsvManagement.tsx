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
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Import Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6 transition-all duration-300 hover:shadow-xl">
          {/* Header */}
          <div className="border-b pb-1">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              📂 Import Leads
            </h1>
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-xs text-gray-600  ">
                Upload your{" "}
                <span className="font-semibold text-indigo-600">CSV file</span>{" "}
                and import leads in just a few easy steps.
              </p>
              <p className="text-xs text-gray-500 italic">
                Supported format: <span className="font-medium">.csv</span> •
                Ensure your file follows the required template.
              </p>
            </div>
          </div>

          {/* CSV Upload Component */}
          <div className="bg-gray-50 border-2 border-dashed border-indigo-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center hover:border-indigo-500 transition-all duration-200">
            <LeadImportCsv handleButtonClicked={handleButtonClicked} />
          </div>
        </div>

        {/* Imported Data Section */}
        {!isSelectCsvButtonClicked && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              📊 Imported Data
            </h2>
            <p className="text-sm text-gray-600 -mt-2 mb-2">
              View, manage and move leads associated with your import tags.
            </p>

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
