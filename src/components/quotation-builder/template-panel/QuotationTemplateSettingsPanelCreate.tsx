import React, {  useState } from "react";
import { useEditor } from "@craftjs/core";
import { useNavigate } from "react-router-dom";

import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import { SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import ROUTES_URL from "../../../constants/Routes";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import Button from "../../ui/Button";
import { Quote, Save, X } from "lucide-react";
import FormInput from "../../ui/FormInput";
import FormHeader from "../../ui/FormHeader";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import TextAreaInput from "../../ui/TextAreaInput";
import {
  FOOTER_STORAGE_KEY_CREATE,
  HEADER_STORAGE_KEY_CREATE,
  PAGE_BLOCK_LAYOUT_Create,
} from "../local-storage/LocalStorageKeys";
import { JsonFileData } from "../quotation-template-types/JsonFileData";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";

type QuotationTemplateSettingsPanelCreateProps = {
  quotationTemplateNamePlaceholder?: string;
};

export const QuotationTemplateSettingsPanelCreate: React.FC<
  QuotationTemplateSettingsPanelCreateProps
> = ({ quotationTemplateNamePlaceholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const navigate = useNavigate();
  const { query } = useEditor();
  const { loginStatus } = useLoggedInUserContext();
   const [isLoadingForQuotationUpdate, setIsLoadingForQuotationUpdate] =
      useState<boolean>(false);

  function getCraftJson(): string {
    setIsLoadingForQuotationUpdate(true);
    const storedDefaultHeader = localStorage.getItem(
      HEADER_STORAGE_KEY_CREATE + loginStatus.id,
    );
    const storedDefaultFooter = localStorage.getItem(
      FOOTER_STORAGE_KEY_CREATE + loginStatus.id,
    );
    const storedDefaultPageLayout = localStorage.getItem(
      PAGE_BLOCK_LAYOUT_Create + loginStatus.id,
    );
    const jsonFileData: JsonFileData = {
      defaultHeader: storedDefaultHeader,
      defaultFooter: storedDefaultFooter,
      defaultPageLayout: storedDefaultPageLayout,
      quotationTemplateData: query.serialize(),
    };

    return JSON.stringify(jsonFileData);
  }

  const createQuotationTemplate = (resultJson: string) => {
    try {
      const blob = new Blob([resultJson], { type: "application/json" });
      const file = new File([blob], `quotationTemplate.json`, {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("company_id", `${loginStatus.companyId}`);
      formData.append("createdby_id", `${loginStatus.id}`);
      formData.append("name", templateName);
      formData.append("description", templateDescription);

      axiosClient
        .post(POST_API.CREATE_QUOTATION_TEMPLATE, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            if (response.data.status) {
              setIsOpen(false);
              toast.success(response.data.message);
              navigate(`${ROUTES_URL.QUOTATION_SETTINGS}`);
            } else {
              toast.error(response.data.message);
            }
          } else {
            toast.error(response.data.message);
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: ApiError | any) => {
          handleApiError(error);
        }).finally(()=>{
          setIsLoadingForQuotationUpdate(false);
        });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };



  return (
    <>
      {/* Save Button */}
      {/* Fixed Save Button */}
      <div
        style={{
          position: "fixed",
          top: "50px",
          right: "20px",
          zIndex: 10,
        }}
      >
        <Button
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          <div className="flex items-center justify-center gap-1">
            <Save size={SIZE.SIXTEEN} />
            Save Template
          </div>
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10,
          }}
        />
      )}

      {/* Right Top Fixed Panel */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: "50px",
            right: "20px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            zIndex: 9999,
            maxHeight: "calc(100vh - 40px)",
            overflowY: "auto",
            transition: "transform 0.3s ease",
          }}
          onClick={(e) => e.stopPropagation()} // prevent overlay close
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const resultJson = getCraftJson();
              createQuotationTemplate(resultJson);
            }}
          >
            <FormHeader
              icon={Quote}
              onClose={() => setIsOpen(false)}
              preText="Template Settings"
              description="Provide the necessary fields to create your quotation template."
            />

            <div className="flex flex-col gap-4 mt-2">
              {/* Template Name */}
              <FormInput
                label="Name"
                type="text"
                required
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder={
                  quotationTemplateNamePlaceholder ?? "Enter template name"
                }
              />

              {/* Description */}
              <TextAreaInput
                label="Description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Enter description"
                rows={3}
                cols={0}
              />

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-3">
                <div>
                  <Button type="button" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center gap-1">
                      <X size={SIZE.SIXTEEN} />
                      Cancel
                    </div>
                  </Button>
                </div>

                <div>
                  <Button type="submit">
                    <div className="flex items-center gap-1">
                      <Save size={SIZE.SIXTEEN} />
                      Save
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      {isLoadingForQuotationUpdate && (
        <LoadingPopUpAnimation
          show={isLoadingForQuotationUpdate}
          text="Creating quotation template..."
        />
      )}
    </>
  );
};
