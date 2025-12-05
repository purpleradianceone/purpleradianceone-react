// import React from "react"
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Briefcase, Edit, Save,  User, X } from "lucide-react";
import { Edit, FileText, Save, User, X } from "lucide-react";
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
import SupportTicketCategoryType from "../../../../@types/support-ticket-category/SupportTicketCategoryType";
import { useFormChange } from "../../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../../config/hooks/useFormValidation";

function CreateSupportTicketCategory({
  onClose,
  getSupportTicketCategory,
}: {
  onClose: () => void;
  getSupportTicketCategory: () => void;
}) {
  const { userHasAccessToAddSupportTicket } = useUserAccessModules();

  const { loginStatus } = useLoggedInUserContext();

  const [intialSupportTicketCategoryData, setIntialSupportTicketCategoryData] =
    useState<SupportTicketCategoryType>({
      id: 0,
      companyId: 0,
      name: "",
      description: "",
      isActive: false,
      requestedBy: 0,
      createdById: 0,
      updatedById: 0,
    });

  const {
    handleChange: handleAddSupportTicketCategoryFormDataChange,
    formData: addSupportTicketCategoryFormData,
  } = useFormChange(intialSupportTicketCategoryData);

  const { errors, handleBlur } = useFormValidation(
    addSupportTicketCategoryFormData,
    "registration"
  );

  const handleAddSupportTicketCategory = async (e?: React.FormEvent) => {
    
    e?.preventDefault();
    if (!userHasAccessToAddSupportTicket) {
      toast.error(
        MESSAGE.MODULE_ACCESS.SUPPORT_TICKET_CATEGORY.DENIED_ADD_ACCESS
      );
      addFunctionStatesCleanup();
      return;
    }

    if (addSupportTicketCategoryFormData.name == "") {
      return;
    }

    const postDataToAddNewSupportTicketCategory = {
      company_id: loginStatus.companyId,
      name: addSupportTicketCategoryFormData.name,
      description: addSupportTicketCategoryFormData.description,
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
    setIntialSupportTicketCategoryData({
      id: 0,
      companyId: 0,
      name: "",
      description: "",
      isActive: false,
      requestedBy: 0,
      createdById: 0,
      updatedById: 0,
    });
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

        <form onSubmit={handleAddSupportTicketCategory}>
          <div className="space-y-3 p-2">
            <FormInput
              label="Name :"
              logo={User}
              maxLength={70}
              type="text"
              name="name"
              placeholder="Name: "
              required={true}
              value={addSupportTicketCategoryFormData.name}
              onChange={handleAddSupportTicketCategoryFormDataChange}
              onBlur={handleBlur}
              error={errors.name}
            />

            <FormInput
              label="Description: "
              logo={FileText}
              maxLength={300}
              type="text"
              name="description"
              placeholder="Description: "
              value={addSupportTicketCategoryFormData.description}
              onChange={handleAddSupportTicketCategoryFormDataChange}
              onBlur={handleBlur}
              // required={true}
              // error={errors.description}
            />

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

                <Button type="submit">
                  <div className="flex items-center  gap-1">
                    <Save size={16} />
                    Save
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default CreateSupportTicketCategory;
