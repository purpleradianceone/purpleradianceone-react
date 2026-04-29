import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { useNavigate } from "react-router-dom";

import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import { SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import ROUTES_URL from "../../../constants/Routes";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import Button from "../../ui/Button";
import { Eye, Quote, Save, X } from "lucide-react";
import FormInput from "../../ui/FormInput";
import FormHeader from "../../ui/FormHeader";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import TextAreaInput from "../../ui/TextAreaInput";
import {
  FOOTER_STORAGE_KEY_CREATE,
  HEADER_STORAGE_KEY_CREATE,
  PAGE_BLOCK_LAYOUT_Create,
  STORAGE_KEY_CREATE,
} from "../local-storage/LocalStorageKeys";
import { JsonFileData } from "../quotation-template-types/JsonFileData";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import CustomDocumentPreviewComponent from "../../custom-document-preview-component/CustomDocumentPreviewComponent";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import localforage from "localforage";

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
  const [isLoadingForQuotationCreate, setIsLoadingForQuotationCreate] =
    useState<boolean>(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isLoadingForPreviewTemplate, setisLoadingForPreviewTemplate] = useState<boolean>(false);

  const {userHasAccessToAddQuotationTemplate} = useUserAccessModules();

  //Local Storage
  // function getCraftJson(): string {
  //   const storedDefaultHeader = localStorage.getItem(
  //     HEADER_STORAGE_KEY_CREATE + loginStatus.id,
  //   );
  //   const storedDefaultFooter = localStorage.getItem(
  //     FOOTER_STORAGE_KEY_CREATE + loginStatus.id,
  //   );
  //   const storedDefaultPageLayout = localStorage.getItem(
  //     PAGE_BLOCK_LAYOUT_Create + loginStatus.id,
  //   );
  //   const jsonFileData: JsonFileData = {
  //     defaultHeader: storedDefaultHeader,
  //     defaultFooter: storedDefaultFooter,
  //     defaultPageLayout: storedDefaultPageLayout,
  //     quotationTemplateData: query.serialize(),
  //   };

  //   return JSON.stringify(jsonFileData);
  // }

  // Local Forage
  async function getCraftJson(): Promise<string> {
  const storedDefaultHeader = await localforage.getItem<string>(
    HEADER_STORAGE_KEY_CREATE + loginStatus.id
  );

  const storedDefaultFooter = await localforage.getItem<string>(
    FOOTER_STORAGE_KEY_CREATE + loginStatus.id
  );

  const storedDefaultPageLayout = await localforage.getItem<string>(
    PAGE_BLOCK_LAYOUT_Create + loginStatus.id
  );

  const jsonFileData: JsonFileData = {
    defaultHeader: storedDefaultHeader,
    defaultFooter: storedDefaultFooter,
    defaultPageLayout: storedDefaultPageLayout,
    quotationTemplateData: query.serialize(),
  };

  return JSON.stringify(jsonFileData);
}

//Local Storage
  // function clearLocalStorageOfQuotationTemplate(){
  //   localStorage.removeItem( HEADER_STORAGE_KEY_CREATE + loginStatus.id,);
  //   localStorage.removeItem(FOOTER_STORAGE_KEY_CREATE + loginStatus.id,);
  //   localStorage.removeItem(PAGE_BLOCK_LAYOUT_Create + loginStatus.id,);
  //   localStorage.removeItem(STORAGE_KEY_CREATE + loginStatus.id);
  // }

  //Local Forage
  async function clearLocalStorageOfQuotationTemplate() {
  await localforage.removeItem(
    HEADER_STORAGE_KEY_CREATE + loginStatus.id
  );

  await localforage.removeItem(
    FOOTER_STORAGE_KEY_CREATE + loginStatus.id
  );

  await localforage.removeItem(
    PAGE_BLOCK_LAYOUT_Create + loginStatus.id
  );

  await localforage.removeItem(
    STORAGE_KEY_CREATE + loginStatus.id
  );
}

  const createQuotationTemplate = (resultJson: string) => {
    setIsLoadingForQuotationCreate(true);
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
              clearLocalStorageOfQuotationTemplate();
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
        })
        .finally(() => {
          setIsLoadingForQuotationCreate(false);
        });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const previewQuotationTemplateWhileCreating = async () => {
    try {
      setisLoadingForPreviewTemplate(true);

      const resultJson = await getCraftJson();
      const blob = new Blob([resultJson], { type: "application/json" });
      const file = new File([blob], `quotationTemplate.json`, {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("preview_template_json", resultJson);
      formData.append("company_id", `${loginStatus.companyId}`);
      formData.append("generatedby_id", `${loginStatus.id}`);

      axiosClient
        .post(POST_API.PREVIEW_QUOTATION_TEMPLATE_WHILE_CREATING, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            //
            const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(url);
      setisLoadingForPreviewTemplate(false);
      
      // window.open(url);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = `${loginStatus.id}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
          } else {
            toast.error("error");
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: ApiError | any) => {
          handleApiError(error);
        })
        .finally(() => {
          setisLoadingForPreviewTemplate(false);
        });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <>
      {/* Save Button */}
      {/* Fixed Save Button */}
      <div className="fixed flex  gap-2 top-12 right-4 z-10">
        <div className="hidden">
          <Button
            onClick={(e) => {
              e.preventDefault();
              previewQuotationTemplateWhileCreating();
            }}
          >
            <div className="flex items-center justify-center gap-1">
              <Eye size={SIZE.SIXTEEN} />
              Preview Template
            </div>
          </Button>
        </div>
        <div>
          <Button
            disabled={!userHasAccessToAddQuotationTemplate}
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
            onSubmit={async (e) => {
              e.preventDefault();
              const resultJson = await getCraftJson();
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

      {isLoadingForQuotationCreate && (
        <LoadingPopUpAnimation
          show={isLoadingForQuotationCreate}
          text="Creating quotation template..."
        />
      )}

      {isLoadingForPreviewTemplate || pdfPreviewUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPdfPreviewUrl(null)}
        >
          {" "}
          {isLoadingForPreviewTemplate ? (
            <LoadingPopUpAnimation
              show={isLoadingForPreviewTemplate}
              text="Loading preview..."
            />
          ) : (
            <CustomDocumentPreviewComponent
              fileUrl={pdfPreviewUrl ?? ""}
              fileExtension="pdf"
              enableDownload={true}
              width={"60%"}
              height={"90%"}
            />
          )}
        </div>
      )}
    </>
  );
};
