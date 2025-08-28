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
    <div className="w-full h-screen p-1 pl-5 bg-gray-50">
      <div className="max-w-full mx-auto bg-white rounded-2xl shadow-lg p-2 space-y-2 transition-all duration-300">
        <div className="border-b pb-1">
          <h2 className="text-base font-semibold text-gray-800"> Import and manage imported leads.</h2>
          <p className="text-sm text-gray-500 mt-1">
            upload your CSV file here and imports the leads easily with few easy steps.
          </p>
        </div>

        <div>
          <LeadImportCsv handleButtonClicked={handleButtonClicked} />
        </div>

        {!isSelectCsvButtonClicked && (
          <div className="pt-4 border-t">
            <LeadImportTagView />
          </div>
        )}
      </div>
    </div>
  );
};
export default LeadImportCsvManagement;
