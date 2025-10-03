import { useRef, useState } from "react";
import AccountCsvMapper from "./AccountCsvMapper";
import AccountImportTagView from "./AccountImportTagView";

const AccountImportCsvManagement = () => {
  const [isImpoetedFile, setIsImportedFile] = useState(false);

  const handleButtonClicked = (status: boolean) => {
    setIsImportedFile(status);
  };

  const tagRef = useRef<HTMLDivElement | null>(null);
  function tagClicked() {
    if (tagRef.current) {
      tagRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "center",
      });
    }
  }

  const tagCloseRef = useRef<HTMLDivElement | null>(null);

  function tagClosed() {
    if (tagCloseRef.current) {
      tagCloseRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 p-6 "
      ref={tagCloseRef}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Import Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6 transition-all duration-300 hover:shadow-xl">
          {/* Header */}
          <div className="border-b pb-1">
            <h1 className="section-header-custom flex items-center gap-2">
              📂 Import Accounts
            </h1>
            <div className="flex flex-col gap-1 mt-2">
              <p className="table-header-custom">
                Upload your{" "}
                <span className="table-header-custom-blue">CSV file</span> and
                import accounts in just a few easy steps.
              </p>
              <p className="caption-custom">
                Supported format:{" "}
                <span className="caption-custom-blue">.csv</span> • Ensure your
                file follows the required template.
              </p>
            </div>
          </div>

          {/* CSV Upload Component */}
          <div className="bg-gray-50 border-2 border-dashed border-indigo-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center hover:border-indigo-500 transition-all duration-200">
            <AccountCsvMapper handleButtonClicked={handleButtonClicked} />
          </div>
        </div>

        {/* Imported Data Section */}
        {!isImpoetedFile && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4 transition-all duration-300 hover:shadow-xl">
            <h2 className="section-header-custom flex items-center gap-2">
              📊 Imported Data
            </h2>
            <p className="input-label-custom -mt-2 mb-2">
              View, manage and move accounts associated with your import tags.
            </p>

            <div
              className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 transition-colors duration-300 ease-in-out"
              ref={tagRef}
            >
              <AccountImportTagView
                tagClosed={tagClosed}
                isTagClick={tagClicked}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AccountImportCsvManagement;
