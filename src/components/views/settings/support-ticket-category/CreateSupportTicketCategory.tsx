// import React from "react"
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Briefcase, Edit, Save,  User, X } from "lucide-react";
import { Edit, Save, X } from "lucide-react";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { STATUS_CODE } from "../../../../constants/AppConstants";
// import { STATUS_CODE, VALIDATIONS } from "../../../../constants/AppConstants";
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
import { useState } from "react";

function CreateSupportTicketCategory({
  onClose,
  getSupportTicketCategory,
}: {
  onClose: () => void;
  getSupportTicketCategory: () => void;
}) {
  const [supportTicketCategoryName, setSupportTicketCategoryName] =
    useState<string>("");
  const [
    supportTicketCategoryDescription,
    setSupportTicketCategoryDescription,
  ] = useState<string>("");

  const { userHasAccessToAddSettingGeneral } = useUserAccessModules();

  const { loginStatus } = useLoggedInUserContext();

  const handleAddSupportTicketCategory = async () => {
    if (!userHasAccessToAddSettingGeneral) {
      toast.error(
        MESSAGE.MODULE_ACCESS.SUPPORT_TICKET_CATEGORY.DENIED_ADD_ACCESS
      );
      addFunctionStatesCleanup();
      return;
    }

    const postDataToAddNewSupportTicketCategory = {
      company_id: loginStatus.companyId,
      name: supportTicketCategoryName,
      description: supportTicketCategoryDescription,
      createdby_id: loginStatus.id,
    };

    axios
      .post(
        POST_API.CREATE_SUPPORT_TICKET_CATEGORY,
        postDataToAddNewSupportTicketCategory,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          onClose();
          getSupportTicketCategory();
          addFunctionStatesCleanup();
        } else {
          toast.error(response.data.message);
        }
        //  getComapnyAccountType();
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: handleAddSupportTicketCategory,
          });
          if (refreshTokenResponse) {
            handleAddSupportTicketCategory();
          }
        } else {
          toast.error(error.response.status + error.response.data);
        }
      });
  };

  function addFunctionStatesCleanup() {
    setSupportTicketCategoryName("");
    setSupportTicketCategoryDescription("");
  }
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5 ">
      <div className="bg-white w-full max-w-xl rounded-lg border border-blue-200 shadow-lg p-2 relative">
        <FormHeader
          icon={Edit}
          preText="Create Support Ticket Category"
          onClose={() => {
            onClose();
            addFunctionStatesCleanup();
          }}
          description="Create Support Ticket Category for user"
        />

        <div className="space-y-3 p-2">
          <FormInput
            label="Name: "
            type="text"
            value={supportTicketCategoryName}
            onChange={(e) => {
              setSupportTicketCategoryName(e.target.value);
            }}
            placeholder="Enter Support Ticket Category Name: "
          ></FormInput>

          <FormInput
            label="Description: "
            type="text"
            value={supportTicketCategoryDescription}
            onChange={(e) => {
              setSupportTicketCategoryDescription(e.target.value);
            }}
            placeholder="Enter Support Ticket Category Description: "
          ></FormInput>

          <div className="flex items-center  justify-end gap-3 ">
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => {
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
                onClick={(e) => {
                  e.preventDefault();
                  handleAddSupportTicketCategory();
                }}
                //   disabled={!newTypeName.trim() || newParentType === 0}
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
    </div>,
    document.body
  );
}

export default CreateSupportTicketCategory;
