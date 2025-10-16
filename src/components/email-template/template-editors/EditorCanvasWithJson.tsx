/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Editor } from "@craftjs/core";
import { ImageBlock } from "../template-blocks/ImageBlock";
import { ButtonBlock } from "../template-blocks/ButtonBlock";
import { DividerBlock } from "../template-blocks/DividerBlock";
import { SectionBlock } from "../template-blocks/SectionBlock";
import { HtmlPreviewModal } from "../HtmlPreviewModal";
import { ColumnBlock } from "../template-blocks/ColumnBlock";
import { HeadingBlock } from "../template-blocks/HeadingBlock";
import { SubjectBlock } from "../template-blocks/SubjectBlock";
import {
  DynamicFieldOption,
  DynamicFieldsContext,
} from "../DynamicFieldsContext";
import { TableBlock } from "../template-blocks/TableBlock";
import {
  ClipboardCopy,
  Eye,
  LucideDatabase,
  LucideMail,
  Save,
  Settings,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { DynamicFieldBlock } from "../template-blocks/DynamicFieldBlock";
import { LexicalText } from "../template-blocks/LexicalText";
import { GenericBlock } from "../template-blocks/GenericBlock";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import { Sidebar } from "../sidebar/Sidebar";
import { TemplateSettingsPanelInsertTemplateUpdate } from "../template-panel/TemplateSettingsPanelInsertTemplateUpdate";
import {
  convertPlaceholdersToFields,
  convertPlaceholdersToObject,
  PlaceholderItem,
} from "../template-util/PlaceHolderDataToPlaceHolderRecord";
import { CanvasWrapperWithJson } from "../canvas-wrapper/CanvasWrapperWithJson";
import toast from "react-hot-toast";
import { ExportPanelUpdate } from "../template-panel/ExportPanelUpdate";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import FormHeader from "../../ui/FormHeader";

export const EditorCanvasWithJson = () => {
  const canvasBgColor = "#f9f9f9";
  const [previewHtml, setPreviewHtml] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDynamicEditor, setShowDynamicEditor] = useState(true);
  const [currentJson, setCurrentJson] = useState("");
  const [emailTemplateName, setEmailTemplateName] = useState("");
  const [emailTemplateSubject, setEmailTemplateSubject] = useState("");

  const [emailTemplateDefault, setEmailTemplateDefault] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { loginStatus } = useLoggedInUserContext();

  const [searchParams] = useSearchParams();
  const templateTypeId = searchParams.get("template_type_id");
  const emailTemplateId = searchParams.get("template_id");

  //Handaling HTML INSERT TEMPLATES
  const [htmlInput, setHtmlInput] = useState("");
  const [placeHolderData, setPlaceHolderData] = useState<PlaceholderItem[]>([]);

  const getPlaceHolderDataFromDatabase = async ({
    templateTypeId,
  }: {
    templateTypeId: number;
  }) => {
    setIsLoading(true);
    await axios
      .post(
        POST_API.GET_EMAIL_PLACEHOLDER,
        {
          company_id: loginStatus.companyId,
          id: null,
          isactive: true,
          email_type_id: templateTypeId,
          requestedby: loginStatus.id,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.length > 0) {
            console.log(response.data);
            if (response.data) {
              setPlaceHolderData(response.data);
              console.log(
                convertPlaceholdersToObject(response.data).toString()
              );
            }
          }
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithParamsNotEvent: getPlaceHolderDataFromDatabase,
          });
          if (refreshTokenResponse) {
            getPlaceHolderDataFromDatabase({ templateTypeId });
          }
        }
      });
  };

  const getTemplateToUpdate = async ({
    emailTemplateId,
    templateTypeId,
  }: {
    emailTemplateId: number;
    templateTypeId: number;
  }) => {
    await axios
      .post(
        POST_API.GET_EMAIL_TEMPLATE,
        {
          company_id: loginStatus.companyId,
          requestedby_id: loginStatus.id,
          id: emailTemplateId,
          email_type_id: templateTypeId,
          search_company_specific_date_range_id: null,
          search_parameter: null,
          search_parameter_date: null,
          offset: null,
          limit: null,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.length > 0) {
            setCurrentJson(response.data[0].email_body_json);

            setEmailTemplateName(response.data[0].name);
            setEmailTemplateSubject(response.data[0].email_subject);
            setHtmlInput(response.data[0].email_body_html);
            setEmailTemplateDefault(response.data[0].is_default);
          } else {
            //
          }
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithParamsNotEvent: getTemplateToUpdate,
          });
          if (refreshTokenResponse) {
            getTemplateToUpdate({ emailTemplateId, templateTypeId });
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (emailTemplateId && templateTypeId) {
      setIsLoading(true);
      getPlaceHolderDataFromDatabase({
        templateTypeId: parseInt(templateTypeId),
      }).then(() => {
        getTemplateToUpdate({
          emailTemplateId: parseInt(emailTemplateId),
          templateTypeId: parseInt(templateTypeId),
        });
      });
    }
  }, []);

  const parsedPlaceHolders: Record<string, string> =
    convertPlaceholdersToObject(placeHolderData);
  const [dynamicVars, setDynamicVars] =
    useState<Record<string, string>>(parsedPlaceHolders);

  const handlePreview = (html: string) => {
    let replacedHtml = html;
    Object.entries(dynamicVars).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        const regex = new RegExp(`${key}`, "g");
        replacedHtml = replacedHtml.replace(regex, value);
      }
    });
    setPreviewHtml(replacedHtml);
    setIsPreviewOpen(true);
  };

  const parsedFields: DynamicFieldOption[] =
    convertPlaceholdersToFields(placeHolderData);

  //FOR HANDALING INSERT HTML TEMPLATES
  const handleHtmlInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlInput(e.target.value);
  };

  const handleHtmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setHtmlInput(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const insertHtmlTemplate = () => {
    const htmlForPreview = htmlInput.toString();
    handlePreview(htmlForPreview);
  };

  const setHtmlContent = (updatedHtml: string) => {
    setHtmlInput(updatedHtml);
    setPreviewHtml(updatedHtml);
  };

  return isLoading ? (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  ) : (
    <div className="w-screen h-screen">
      <div className="sticky z-10 top-14 flex items-start justify-between  bg-gray-50 rounded-lg shadow-sm  p-1 px-3">
        <div className="flex gap-1">
          <LucideMail className="w-7 h-7 text-blue-600" />
          <span className="section-header-custom">Email Template Update</span>
          {templateTypeId && (
            <span className="section-header-custom">: {emailTemplateName}</span>
          )}
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          top: 100,
          right: 0,
          zIndex: 10,
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        <Button type="submit" onClick={(e) => {
          e.preventDefault();
          setShowDynamicEditor(!showDynamicEditor);
        }}>
          <div className="flex justify-center gap-1">
            <Settings size={SIZE.SIXTEEN} className="mt-0.5" />
            <span>{showDynamicEditor ? "Hide Fields" : "Show Fields"}</span>
          </div>
        </Button>

        {showDynamicEditor && (
          <div
            style={{
              position: "absolute",
              top: 0, // Adjusted to appear below the toggle button
              right: 0,
              width: "260px",
              background: "white",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              zIndex: 11,
            }}
          >
            <FormHeader
              icon={LucideDatabase}
              onClose={() => setShowDynamicEditor(false)}
              preText="Dynamic Fields"
            />

            <div className="overflow-y-auto max-h-[400px]">
              {parsedFields.length === 0 ? (
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "12px",
                  }}
                >
                  {isLoading
                    ? "Loading dynamic fields..."
                    : "No dynamic fields available"}
                </div>
              ) : (
                parsedFields.map((field) => (
                  <div key={field.value} style={{ marginBottom: "12px" }}>
                    {/* <label
                   className="mb-2 input-label-custom"
                  >
                    {field.label}
                  </label> */}
                    <FormInput
                      label={field.label}
                      value={dynamicVars[field.value] || ""}
                      onChange={(e) =>
                        setDynamicVars((prev) => ({
                          ...prev,
                          [field.value]: e.target.value,
                        }))
                      }
                      placeholder={`Enter value for ${field.label}`}
                    />
                    <div className="caption-custom">{field.value}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <DynamicFieldsContext.Provider value={parsedFields}>
        {currentJson == null || currentJson === "" ? (
          <div className="flex justify-center items-center">
            <div style={{ marginTop: "60px", padding: "40px" }}>
              <div>
                <textarea
                  placeholder="Paste your HTML template here"
                  value={htmlInput}
                  onChange={handleHtmlInputChange}
                  style={{
                    width: "100%",
                    minWidth: "400px",
                    height: "200px",
                    padding: "10px",
                    resize: "both",
                    overflow: "auto",
                    whiteSpace: "pre",
                  }}
                />
              </div>

              <div style={{ marginTop: "20px" }}>
                <input
                  type="file"
                  accept=".html"
                  onChange={handleHtmlFileUpload}
                  style={{
                    padding: "8px 16px",
                    cursor: "pointer",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "14px",
                    transition: "background-color 0.3s ease",
                  }}
                />
              </div>

              <div className="mt-2 flex gap-4">
                <div>
                  <Button type="submit" onClick={(e) => {
                    e.preventDefault();
                    insertHtmlTemplate();
                  }}>
                    <div className="flex items-center justify-center gap-0.5">
                      <Eye size={SIZE.SIXTEEN} />
                      View HTML Template
                    </div>
                  </Button>
                </div>
                <div>
                  <Button
                  type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      const beautified = htmlInput;
                      navigator.clipboard.writeText(beautified);
                      toast.success("Html copied to clipboard!");
                      // showMessageSnackbar({message:"Html copied to clipboard!", type:"success"})
                    }}
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      <ClipboardCopy size={SIZE.SIXTEEN} />
                      Copy HTML Email
                    </div>
                  </Button>
                </div>

                <div>
                  <Button
                  type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      const beautified = htmlInput;
                      const blob = new Blob([beautified], {
                        type: "text/html",
                      });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.download = "sanitized-template.html";
                      link.click();
                      URL.revokeObjectURL(link.href);
                    }}
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      <Save size={SIZE.SIXTEEN} />
                      Export HTML Email
                    </div>
                  </Button>
                </div>
              </div>

              <div style={{ marginTop: "20px", zIndex: 2000 }}>
                <HtmlPreviewModal
                  isOpen={isPreviewOpen}
                  onClose={() => setIsPreviewOpen(false)}
                  html={previewHtml}
                  onHtmlChange={setHtmlContent}
                  editable={false}
                />
              </div>

              {/* Settings panel */}
              <TemplateSettingsPanelInsertTemplateUpdate
                htmlBody={htmlInput}
                id={parseInt(emailTemplateId!)}
                templateTypeId={parseInt(templateTypeId!)}
                emailTemplateName={emailTemplateName}
                emailTemplateSubject={emailTemplateSubject}
                emailTemplateIsDefault={emailTemplateDefault}
              />
            </div>
          </div>
        ) : (
          <Editor
            resolver={{
              SubjectBlock,
              LexicalText,
              ImageBlock,
              ButtonBlock,
              DividerBlock,
              SectionBlock,
              ColumnBlock,
              TableBlock,
              HeadingBlock,
              DynamicFieldBlock,
              GenericBlock,
            }}
            enabled={true}
          >
            <div style={{ display: "flex", width: "100%" }}>
              <div
                style={{
                  position: "sticky",
                  top: "0px",
                  height: "10000px",
                  backgroundColor: "blue",
                }}
              >
                <Sidebar />
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "20px",
                  backgroundColor: canvasBgColor,
                  position: "relative",
                }}
              >
                {/* <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 300,
                    zIndex: 10,
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: 500 }}>
                    Canvas Background:
                    <input
                      type="color"
                      value={canvasBgColor}
                      onChange={(e) => setCanvasBgColor(e.target.value)}
                      style={{ marginLeft: "10px" }}
                    />
                  </label>
                </div> */}

                <div
                  className="fixed inset-0 justify-self-end top-14"
                  style={{
                    zIndex: 11,
                    height: "fit-content",
                  }}
                >
                  <ExportPanelUpdate
                    onPreview={handlePreview}
                    templateSettingsPanelUpdateProps={{
                      id: parseInt(emailTemplateId!),
                      templateTypeId: parseInt(templateTypeId!),
                      emailTemplateName: emailTemplateName,
                      emailTemplateSubject: emailTemplateSubject,
                      emailTemplateIsDefault: emailTemplateDefault,
                    }}
                  />
                </div>

                <div style={{ zIndex: 100 }}>
                  <HtmlPreviewModal
                    isOpen={isPreviewOpen}
                    onClose={() => setIsPreviewOpen(false)}
                    html={previewHtml}
                    editable={false}
                    onHtmlChange={setPreviewHtml}
                  />
                </div>
                <div id="CANVAS" style={{ top: 55 }}>
                  <CanvasWrapperWithJson data={currentJson} />
                </div>
              </div>
            </div>
          </Editor>
        )}
      </DynamicFieldsContext.Provider>
    </div>
  );
};
