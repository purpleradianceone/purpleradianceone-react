import { CheckCircle, X, LucideArrowBigRight } from "lucide-react";
import { useState, } from "react";
import toast from "react-hot-toast";
import { SIZE, } from "../../../constants/AppConstants";
import Button from "../../ui/Button";
import FormHeader from "../../ui/FormHeader";
import { TemplateType } from "../TemplatesPage";

export type TemplateTypeModalProps = {
  onClose: () => void;
  onCreate: (typeId: string) => void;
  templateTypes: TemplateType[];
};

export const TemplateTypeModal: React.FC<TemplateTypeModalProps> = ({
  onClose,
  onCreate,
  templateTypes,
}) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string>(""); // Initial state is an empty string
  const loading = false;

  const handleSubmit = () => {
    if (selectedTypeId) {
      // This check ensures selectedTypeId is not an empty string
      onCreate(selectedTypeId); // Pass the ID string directly
    } else {
      toast.error("Select template type first!");
    }
  };

  return loading ? (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  ) : (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-5 z-50">
      <div className="bg-white rounded-lg shadow-lg w-fit p-4">
        {/* <h2 className="table-header-custom mb-4">Select Template Type</h2> */}
        <FormHeader
          icon={CheckCircle}
          preText="Select Template Type"
          description="Please choose a template type for creating email-template."
          onClose={onClose}
        />
        <select
          value={selectedTypeId} // Value will be '' initially or the selected ID string
          onChange={(e) => setSelectedTypeId(e.target.value)}
          className="w-full mb-3 border px-3 py-2 rounded input-label-custom"
        >
          <option value="">Select template type</option>{" "}
          {/* Value is empty string for no selection */}
          {templateTypes
            .filter((t) => t.isactive)
            .map((type) => (
              <option key={type.id} value={JSON.stringify(type)}>
                {type.name}
              </option>
            ))}
        </select>
        <div className="flex items-center justify-end gap-3 mt-4">
          <div className="rounded">
            <Button
            type="button"
              // className="text-sm text-gray-600 hover:underline"
              onClick={onClose}
            >
              <div className="flex items-center justify-center gap-0.5">
                <X size={SIZE.SIXTEEN} />
                Cancel
              </div>{" "}
            </Button>
          </div>
          <div className="rounded">
            <Button type="submit" disabled={selectedTypeId === ""} onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
              <div className="flex items-center justify-center gap-0.5">
                <LucideArrowBigRight size={SIZE.SIXTEEN} />
                Continue
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};