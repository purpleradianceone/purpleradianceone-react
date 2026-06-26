/* eslint-disable @typescript-eslint/no-explicit-any */
import { Briefcase, Edit, Save,  User, X } from "lucide-react";
import AccountType from "../../../../@types/settings/AccountType";
import React, { useState } from "react";
import {  VALIDATIONS } from "../../../../constants/AppConstants";
import toast from "react-hot-toast";
import POST_API from "../../../../constants/PostApi";
import axios from "axios";
import MESSAGE from "../../../../constants/Messages";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import FormInput from "../../../ui/FormInput";
import Button from "../../../ui/Button";
import FormHeader from "../../../ui/FormHeader";
import { createPortal } from "react-dom";
import { handleApiError } from "../../../../config/error/handleApiError";

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
  const handleAddAccountType = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userHasAccessToAddCompanyAccountType) {
      toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_TYPE_ACCESS.DENIED_ADD_ACCESS);
      addFunctionStatesCleanup();
      return;
    }
    if( newParentType==null||newParentType===0){
      toast.error("Please enter account type")
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
        // if (error.status === STATUS_CODE.UNATHORISED) {
        //   const refreshTokenResponse = await RefreshToken({
        //     callFunction: handleAddAccountType,
        //   });
        //   if (refreshTokenResponse) {
        //     handleAddAccountType();
        //   }
        // } else {
        //   toast.error(error.response.status + error.response.data);
        // }
        handleApiError(error)
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
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5 ">
      <div className="bg-white w-full max-w-xl rounded-lg border border-blue-200 shadow-lg p-2 relative">
        <FormHeader 
        icon={Edit}
        preText="Add company account type"
        onClose={onClose}
        description="Create a new company account type to categorize business accounts."
        />

        <form onSubmit={handleAddAccountType} className="space-y-3 p-2">
          <div>

            <FormInput
            autoFocus={true}
            logo={User}
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
            <label className="block input-label-custom ">
             <div className="flex items-center gap-1">
               <Briefcase size={14} className="text-blue-500"/>  Account type :<span className="text-red-600">*</span>
             </div>
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
                      className={`ml-2 px-2 py-1 text-sm input-label-custom rounded-xl ${getParentTypeColor(
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
            type="button"
              onClick={() => {
                setNewTypeName("");
                setNewParentType(0);
                onClose();
              }}
            >
              <div className="flex items-center ">
                <X size={16} />
              Cancel
              </div>
            </Button>
            <Button
              type="submit"
              // onClick={(e) => {
              //   e.preventDefault();
              //   ();
              // }}
              disabled={!newTypeName.trim() || newParentType === 0}
            >
              <div className="flex items-center  gap-1">
                <Save size={16} />
              Save
              </div>
            </Button>
           </div>
            
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
