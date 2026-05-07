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
import { Quote, Save, X } from "lucide-react";
import FormInput from "../../ui/FormInput";
import FormHeader from "../../ui/FormHeader";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import TextAreaInput from "../../ui/TextAreaInput";
import {
  FOOTER_STORAGE_KEY_UPDATE,
  HEADER_STORAGE_KEY_UPDATE,
  PAGE_BLOCK_LAYOUT_UPDATE,
} from "../local-storage/LocalStorageKeys";
import { JsonFileData } from "../quotation-template-types/JsonFileData";
import QuotationTemplate from "../quotation-template-types/QuotationTemplate";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import localforage from "localforage";

type QuotationTemplateSettingsPanelUpdateProps = {
  editQuotationTemplateJson?: QuotationTemplate;
};

export const QuotationTemplateSettingsPanelUpdate: React.FC<
  QuotationTemplateSettingsPanelUpdateProps
> = ({ editQuotationTemplateJson }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingForQuotationUpdate, setIsLoadingForQuotationUpdate] =
    useState<boolean>(false);

  const [quotationTemplate, setQuotationTemplate] = useState<QuotationTemplate>(
    editQuotationTemplateJson ?? {
      company_id: 0,
      createdby: "",
      createdon: "",
      description: "",
      id: 0,
      isactive: false,
      json_cdn_url: "",
      json_file_extension: "application/json",
      json_origin_url: "",
      name: "",
      updatedby: "",
      updatedon: "",
    },
  );

  const navigate = useNavigate();
  const { query } = useEditor();
  const { loginStatus } = useLoggedInUserContext();

  //Local Storage
  // function getCraftJson(): string {
  //   setIsLoadingForQuotationUpdate(true);
  //   const storedDefaultHeader = localStorage.getItem(
  //     HEADER_STORAGE_KEY_UPDATE + loginStatus.id,
  //   );
  //   const storedDefaultFooter = localStorage.getItem(
  //     FOOTER_STORAGE_KEY_UPDATE + loginStatus.id,
  //   );
  //   const storedDefaultPageLayout = localStorage.getItem(
  //     PAGE_BLOCK_LAYOUT_UPDATE + loginStatus.id,
  //   );
  //   const jsonFileData: JsonFileData = {
  //     defaultHeader: storedDefaultHeader,
  //     defaultFooter: storedDefaultFooter,
  //     defaultPageLayout: storedDefaultPageLayout,
  //     quotationTemplateData: query.serialize(),
  //   };

  //   return JSON.stringify(jsonFileData);
  // }

  async function getCraftJson(): Promise<string> {
  setIsLoadingForQuotationUpdate(true);

  const storedDefaultHeader = await localforage.getItem<string>(
    HEADER_STORAGE_KEY_UPDATE + loginStatus.id
  );

  const storedDefaultFooter = await localforage.getItem<string>(
    FOOTER_STORAGE_KEY_UPDATE + loginStatus.id
  );

  const storedDefaultPageLayout = await localforage.getItem<string>(
    PAGE_BLOCK_LAYOUT_UPDATE + loginStatus.id
  );

  const jsonFileData: JsonFileData = {
    defaultHeader: storedDefaultHeader,
    defaultFooter: storedDefaultFooter,
    defaultPageLayout: storedDefaultPageLayout,
    quotationTemplateData: query.serialize(),
  };

  return JSON.stringify(jsonFileData);
}

  const updateQuotationTemplate = (resultJson: string) => {
    try {
      const blob = new Blob([resultJson], { type: "application/json" });
      const file = new File([blob], `quotationTemplate.json`, {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("company_id", `${loginStatus.companyId}`);
      formData.append("id", `${quotationTemplate.id}`);
      formData.append("name", quotationTemplate.name);
      formData.append("description", quotationTemplate.description);
      formData.append("isactive", "true");
      formData.append("updatedby_id", `${loginStatus.id}`);

      axiosClient
        .post(POST_API.UPDATE_QUOTATION_TEMPLATE, formData, {
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
        })
        .finally(() => {
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
            onSubmit={async (e) => {
              e.preventDefault();
              const resultJson = await getCraftJson();
              updateQuotationTemplate(resultJson);
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
                value={quotationTemplate.name}
                onChange={(e) =>
                  setQuotationTemplate((prev) => {
                    return {
                      ...prev,
                      name: e.target.value,
                    };
                  })
                }
                placeholder={
                  editQuotationTemplateJson?.name ?? "Enter template name"
                }
                // autoFocus={true}
              />

              {/* Description */}
              <TextAreaInput
                label="Description"
                value={quotationTemplate.description}
                onChange={(e) =>
                  setQuotationTemplate((prev) => {
                    return {
                      ...prev,
                      description: e.target.value,
                    };
                  })
                }
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
          text="Updating template..."
        />
      )}
    </>
  );
};
