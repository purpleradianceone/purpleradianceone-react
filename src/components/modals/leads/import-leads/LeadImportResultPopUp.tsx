import LeadImportResponse from "../../../../@types/lead-management/LeadImportResponse";

const LeadImportResultPopUp = ({
  data,
  onClose,
}: {
  data: LeadImportResponse;
  onClose: () => void;
}) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-80 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-lg font-semibold mb-4">Import Summary</h2>

        <div className="text-sm space-y-2">
          <div>
            <strong>Message:</strong> {data.message}
          </div>
          {/* <div>
            <strong>Total Proceeded:</strong> {data.totalProceeded}
          </div>
          <div>
            <strong>Imported Count:</strong> {data.importedCount}
          </div>
          <div>
            <strong>Failed Count:</strong> {data.failedCount}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LeadImportResultPopUp;
