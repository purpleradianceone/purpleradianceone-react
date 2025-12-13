/* eslint-disable @typescript-eslint/no-explicit-any */
import { Headset, LucideText, Save, StickyNote, Wrench, X } from "lucide-react";
import FormHeader from "../../ui/FormHeader";
import FormLayout from "../../ui/FormLayout";
import { useState } from "react";
import Button from "../../ui/Button";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import TextAreaInput from "../../ui/TextAreaInput";

export function SupportTicketLIfecycleChangeModal({
  isLoading,  
  previousSupportTicketStatus,
  selectedSupportTicketLifecycleName,
  handleSubmit,
  onClose,
}: {
  isLoading: boolean,  
  previousSupportTicketStatus: any;
  selectedSupportTicketLifecycleName: string | undefined;
  handleSubmit: (supportTicketData: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    queryDescription: "",
    publicNotes: "",
    resolutionApplied: "",
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
          description={`support ticket lifecycle is updating from ${previousSupportTicketStatus.supportTicketLifecycleName} to ${selectedSupportTicketLifecycleName} .`}
        />
        <form className="mt-2">
            <div className="gap-2">
          <TextAreaInput
            logo={LucideText}
            label="Query Description"
            name="queryDescription"
            onChange={handleFormChange}
            autoFocus={true}
            rows={2}
            cols={0}
          />
          <TextAreaInput
            logo={Wrench}
            label="Resolution Applied"
            name="resolutionApplied"
            onChange={handleFormChange}
            // autoFocus={true}
            rows={2}
            cols={0}
          />
          <TextAreaInput
            logo={StickyNote}
            label="Public Note"
            name="publicNotes"
            onChange={(e) => handleFormChange(e)}
            // autoFocus={true}
            rows={2}
            cols={0}
          />
          
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
        {isLoading&&
        <LoadingPopUpAnimation
        show={isLoading}     
        />
}
      </FormLayout>
    </>
  );
}
