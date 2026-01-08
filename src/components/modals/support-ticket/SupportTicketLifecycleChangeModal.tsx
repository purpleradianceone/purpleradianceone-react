/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Headset,
  LucideText,
  Save,
  StickyNote,
  User,
  Wrench,
  X,
} from "lucide-react";
import FormHeader from "../../ui/FormHeader";
import FormLayout from "../../ui/FormLayout";
import { useState } from "react";
import Button from "../../ui/Button";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import TextAreaInput from "../../ui/TextAreaInput";
import CompanyUserSearchFieldInput from "../../ui/CompanyUserSearchFieldInput";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import MESSAGE from "../../../constants/Messages";

export type supportTicketLifecycleType = {
  queryDescription: string;
  publicNotes: string;
  resolutionApplied: string;
  resolvedBy: CompanyUser;
};

export function SupportTicketLIfecycleChangeModal({
  isLoading,
  selectedSupportTicketState,
  selectedSupportTicketLifecyclId,
  selectedSupportTicketLifecycleName,
  handleSubmit,
  onClose,
}: {
  isLoading: boolean;
  selectedSupportTicketState: any;
  selectedSupportTicketLifecyclId: number | undefined;
  selectedSupportTicketLifecycleName: string | undefined;
  handleSubmit: (supportTicketLifecycleFormData: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<supportTicketLifecycleType>({
    queryDescription: "",
    publicNotes: "",
    resolutionApplied: "",
    resolvedBy: {
      company_id: 0,
      id: selectedSupportTicketState.resolvedBy ? selectedSupportTicketState.resolvedBy : selectedSupportTicketState.assignedTo,
      fullname: selectedSupportTicketState.resolvedBy ? selectedSupportTicketState.resolvedByName : selectedSupportTicketState.assignedToName,
      email: "",
      mobilenumber: "",
      createdby: "",
      isactive: true,
      requestedby: "",
      generate_password: "",
      all_leads_visible: true,
    },
  });


  const { userHasAccessToUpdateSupportTicket } = useUserAccessModules();

  function handleFormChange(e: any) {
    const { name, value } = e.target;
    setFormData((previous) => {
      return { ...previous, [name]: value };
    });
  }

  return (
    <>
      <FormLayout width={4}>
        <FormHeader
          icon={Headset}
          onClose={onClose}
          preText={`Support ticket lifecycle updating to `}
          userName={selectedSupportTicketLifecycleName}
          description={`support ticket lifecycle is updating from ${selectedSupportTicketState.supportTicketLifecycleName} to ${selectedSupportTicketLifecycleName} .`}
        />
        <form
          className={`mt-2 ${isLoading ? "cursor-wait" : "cursor-default"}`}
        >
          <div className="gap-2">
            <TextAreaInput
              logo={LucideText}
              defaultValue={selectedSupportTicketState.queryDescription}
              label="Query Description"
              name="queryDescription"
              onChange={handleFormChange}
              autoFocus={true}
              rows={2}
              cols={0}
            />
            <TextAreaInput
              logo={Wrench}
              defaultValue={selectedSupportTicketState.resolutionApplied}
              label="Resolution Applied"
              name="resolutionApplied"
              onChange={handleFormChange}
              // autoFocus={true}
              rows={2}
              cols={0}
            />
            <TextAreaInput
              logo={StickyNote}
              defaultValue={selectedSupportTicketState?.publicNotes}
              label="Public Note"
              name="publicNotes"
              onChange={(e) => handleFormChange(e)}
              // autoFocus={true}
              rows={2}
              cols={0}
            />
            {selectedSupportTicketLifecyclId! >= 4 && (
              <div className="mt-2">
                <div className="grid grid-cols-1">
                  <CompanyUserSearchFieldInput
                    label="Resolved By:"
                    required
                    // placeholder={loginStatus.fullName}
                    defaultValue={
                      formData.resolvedBy.id
                      ? formData.resolvedBy.fullname
                      : selectedSupportTicketState.assignedToName
                    }
                    logo={User}
                    onUserSelected={(user) => {
                      if (user) {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            resolvedBy: user,
                          };
                        });
                      } else {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            resolvedBy: {
                              company_id: 0,
                              id: selectedSupportTicketState.resolvedBy ? selectedSupportTicketState.resolvedBy : selectedSupportTicketState.assignedTo,
                              fullname:
                                selectedSupportTicketState.resolvedBy ? selectedSupportTicketState.resolvedByName : selectedSupportTicketState.assignedToName,
                              email: "",
                              mobilenumber: "",
                              createdby: "",
                              isactive: true,
                              requestedby: "",
                              generate_password: "",
                              all_leads_visible: true,
                            },
                          };
                        });
                      }
                    }}
                    disabledMessage={
                      MESSAGE.MODULE_ACCESS.COMPANY_USER.DENIED_VIEW_ACCESS
                    }
                    // error={selectedCompanyUser.fullname===""?"Need to select assign to":""}
                  />
                </div>
                <span className="caption-custom">
                  <span className="">Note :</span> If “Resolved By” is not
                  selected or is removed, it will be set to the
                  <span className="table-header-custom active">
                    {" "}
                    ticket creator
                  </span>{" "}
                  by default.
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center  justify-end gap-3 mt-3">
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => {
                  setFormData({
                    queryDescription: "",
                    publicNotes: "",
                    resolutionApplied: "",
                    resolvedBy: {
                      company_id: 0,
                      id: 0,
                      fullname: "",
                      email: "",
                      mobilenumber: "",
                      createdby: "",
                      isactive: true,
                      requestedby: "",
                      generate_password: "",
                      all_leads_visible: true,
                    },
                  });
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
                  handleSubmit(formData);
                }}
                disabled={!userHasAccessToUpdateSupportTicket}
              >
                <div className="flex items-center  gap-1">
                  <Save size={16} />
                  Save
                </div>
              </Button>
            </div>
          </div>
        </form>
        {isLoading && <LoadingPopUpAnimation show={isLoading} />}
      </FormLayout>
    </>
  );
}
