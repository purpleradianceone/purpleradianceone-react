/* eslint-disable @typescript-eslint/no-explicit-any */
import { Save, X } from "lucide-react";
import AccountType from "../../../../@types/settings/AccountType";
import { useState } from "react";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { STATUS_CODE, VALIDATIONS } from "../../../../constants/AppConstants";
import toast from "react-hot-toast";
import POST_API from "../../../../constants/PostApi";
import axios from "axios";
import MESSAGE from "../../../../constants/Messages";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import FormInput from "../../../ui/FormInput";
import Button from "../../../ui/Button";

export default function CreateAccountType({
  onClose,
  accountType,
  getComapnyAccountType,
}: {
  onClose: () => void;
  accountType: AccountType[];
  getComapnyAccountType: () => void;
}) {
  const { userHasAccessToAddCompanyAccountType } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  const [newTypeName, setNewTypeName] = useState<string>("");

  const [newParentType, setNewParentType] = useState<number>(0);

  // --- Add Functions ---
  const handleAddAccountType = async () => {
    if (!userHasAccessToAddCompanyAccountType) {
      toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_TYPE_ACCESS.DENIED_ADD_ACCESS);
      addFunctionStatesCleanup();
      return;
    }

    const postDataToAddNewCompanyAccountType = {
      company_id: loginStatus.companyId,
      account_type_id: newParentType,
      company_account_type_name: newTypeName,
      createdby_id: loginStatus.id,
    };

    axios
      .post(
        POST_API.CREATE_COMPANY_ACCOUNT_TYPE,
        postDataToAddNewCompanyAccountType,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          onClose();
        } else {
          toast.error(response.data.message);
        }
        getComapnyAccountType();
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: handleAddAccountType,
          });
          if (refreshTokenResponse) {
            handleAddAccountType();
          }
        } else {
          toast.error(error.response.status + error.response.data);
        }
      })
      .finally(() => {
        addFunctionStatesCleanup();
      });
  };

  function addFunctionStatesCleanup() {
    setNewTypeName("");
    setNewParentType(0);
  }

  // --- Helpers ---
  const getParentTypeColor = (parentType: string) => {
    switch (parentType) {
      case "Reseller":
        return "bg-green-100 text-green-800";
      case "Customer":
        return "bg-red-100 text-red-800";
      case "Equity":
        return "bg-blue-100 text-blue-800";
      case "Partner":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5 ">
      <div className="bg-white w-full max-w-xl rounded-lg border border-blue-200 shadow-lg p-2 relative">
        {/* Close button */}
        <h3 className="border-b text-xl p-1 font-semibold">Add company account type</h3>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="space-y-3 p-2">
          <div>

            <FormInput
              label="Name : "
              type="text"
              value={newTypeName}
              maxLength={VALIDATIONS.MAX_NAME_LENGTH}
              minLength={VALIDATIONS.MIN_NAME_LENGTH}
              required
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Enter company account type name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 ">
              Account type :<span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {accountType.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center p-2 border border-gray-200 bg-white rounded-lg cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-sm transition-colors"
                >
                  <input
                    type="radio"
                    name="parentType"
                    value={type.id!}
                    checked={newParentType === type.id}
                    onChange={(e) => setNewParentType(parseInt(e.target.value))}
                    className={`mr-3  focus:ring-blue-5 `}
                  />
                  <div>
                    <span
                      className={`ml-2 px-2 py-1 text-sm font-semibold rounded-xl ${getParentTypeColor(
                        type.name!
                      )}`}
                    >
                      {type.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center  justify-end gap-3 ">
           <div className="flex gap-2">
             <Button
            type="submit"
              onClick={() => {
                setNewTypeName("");
                setNewParentType(0);
                onClose();
              }}
              // className="flex items-center gap-1 bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center ">
                <X size={16} />
              Cancel
              </div>
            </Button>
            <Button

              onClick={handleAddAccountType}
              disabled={!newTypeName.trim() || newParentType === 0}
              // className="flex items-center  gap-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 disabled:bg-blue-200  disabled:cursor-not-allowed transition-colors"
            >
              <div className="flex items-center  gap-1">
                <Save size={16} />
              Save
              </div>
            </Button>
           </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
