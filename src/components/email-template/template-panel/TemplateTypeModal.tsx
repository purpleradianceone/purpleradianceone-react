/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { CheckCircle, X, LucideArrowBigRight } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import { STATUS_CODE } from "../../../constants/AppConstants";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import Button from "../../ui/Button";
import FormHeader from "../../ui/FormHeader";
import { TemplateType } from "../TemplatesPage";

export type TemplateTypeModalProps = {
  onClose: () => void;
  onCreate: (typeId: string) => void;
};

export const TemplateTypeModal: React.FC<TemplateTypeModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string>(""); // Initial state is an empty string
  const { loginStatus } = useLoggedInUserContext();
  const [templateTypes, setTemplateTypes] = useState<TemplateType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTypes();
  }, [loginStatus.companyId, loginStatus.id]);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      await axios
        .post(
          POST_API.GET_EMAIL_TYPE,
          {
            company_id: loginStatus.companyId,
            requestedby: loginStatus.id,
            is_host_email: false,
          },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            const activeTypes = response.data.filter(
              (type: TemplateType) => type.isactive
            );
            setTemplateTypes(activeTypes);
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunction: fetchTypes,
            });
            if (refreshTokenResponse) {
              fetchTypes();
            }
          }
        });
    } catch (error: ApiError | any) {
      console.error("Error fetching template types for modal:", error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithParamsNotEvent: fetchTypes,
        });
        if (refreshTokenStatus) {
          fetchTypes();
        }
      }
    } finally {
      setLoading(false);
    }
  };
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
              // className="text-sm text-gray-600 hover:underline"
              onClick={onClose}
            >
              <div className="flex items-center justify-center gap-0.5">
                <X size={16} />
                Cancel
              </div>{" "}
            </Button>
          </div>
          <div className="rounded">
            <Button disabled={selectedTypeId === ""} onClick={handleSubmit}>
              <div className="flex items-center justify-center gap-0.5">
                <LucideArrowBigRight size={16} />
                Continue
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};