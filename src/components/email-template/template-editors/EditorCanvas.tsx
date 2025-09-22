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
import DOMPurify from "dompurify";
import "tinymce";
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
import { TemplateSettingsPanelInsert } from "../template-panel/TemplateSettingsPanelInsert";
import { Sidebar } from "../sidebar/Sidebar";
import { STATUS_CODE } from "../../../constants/AppConstants";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import {
  convertPlaceholdersToFields,
  convertPlaceholdersToObject,
  PlaceholderItem,
} from "../template-util/PlaceHolderDataToPlaceHolderRecord";
import RefreshToken from "../../../config/validations/RefreshToken";
import ApiError from "../../../@types/error/ApiError";
import { CanvasWrapper } from "../canvas-wrapper/CanvasWrapper ";
import toast from "react-hot-toast";
import { ExportPanelCreate } from "../template-panel/ExportPanelCreate";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import FormHeader from "../../ui/FormHeader";
import ConfirmationDialog from "../../dialogue-box/ConfirmationDialogue";

export const EditorCanvas: React.FC = () => {
  const canvasBgColor = "#f9f9f9";
  const [previewHtml, setPreviewHtml] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDynamicEditor, setShowDynamicEditor] = useState(true);
  const [mode, setMode] = useState<"editor" | "insert">("editor");
  const [htmlInput, setHtmlInput] = useState("");

  const { loginStatus } = useLoggedInUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [placeHolderData, setPlaceHolderData] = useState<PlaceholderItem[]>([]);
  const [searchParams] = useSearchParams();
  const params = searchParams.get("type");
  const [showConfirm, setShowConfirm] = useState(false);

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
          setIsLoading(false);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (params) {
      setIsLoading(true);
      getPlaceHolderDataFromDatabase({
        templateTypeId: parseInt(JSON.parse(params!).id),
      }).then(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const json = jsonPlaceholdersMap[params?parseInt(JSON.parse(params!).id):1];
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
    <div className="flex h-screen w-screen justify-center items-center ">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  ) : (
    <div className="w-screen h-screen">
      <div className="sticky z-10 top-14 flex items-start justify-between  bg-gray-50 rounded-lg shadow-sm  p-1 px-3">
        <div className="flex  gap-1">
          {<LucideMail className="w-7 h-7 text-blue-600" />}
          <span className="section-header-custom">Email Template</span>
          <span className="section-header-custom">
            : {JSON.parse(params!).name}
          </span>
          <div
            className="fixed  inset-0 justify-center top-14"
            style={{ height: "fit-content" }}
          >
            <div className="flex-col gap-2 justify-center justify-items-center ">
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid #ccc",
                  // marginBottom: "0.75rem",
                }}
              >
                <div
                  onClick={() => setMode("editor")}
                  className={`cursor-pointer ${
                    mode === "editor"
                      ? "main-nav-custom active-header"
                      : "main-nav-custom "
                  }`}
                  style={{
                    padding: "6px 10px",
                    transition: "all 0.2s ease",
                  }}
                >
                  Create Email Template
                </div>

                <div
                  onClick={() => {
                    setShowConfirm(true);
                  }}
                  className={`cursor-pointer ${
                    mode === "insert"
                      ? "main-nav-custom active-header"
                      : "main-nav-custom"
                  }`}
                  style={{
                    padding: "6px 10px",
                    transition: "all 0.2s ease",
                  }}
                >
                  Insert Email Template
                </div>
              </div>
              <div>
                {/* <div className="top-12 flex items-center justify-between bg-gray-50 rounded shadow-sm mb-1 w-fit px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <LucideCode className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold">
                    "{JSON.parse(params!).name}" Template
                  </span>
                </div>
              </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            position: "fixed",
            top: 100,
            right: 0,
            zIndex: 10,
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          {/* Show Fields Button - Always Visible */}
          <div>
            <Button onClick={() => setShowDynamicEditor(!showDynamicEditor)}>
              <div className="flex justify-center gap-1">
                <Settings size={16} className="mt-0.5" />
                <span>{showDynamicEditor ? "Hide Fields" : "Show Fields"}</span>
              </div>
            </Button>
          </div>
          {showConfirm && (
            <ConfirmationDialog
              open={showConfirm}
              title="Leave Create Email Template?"
              message={
                "Are you sure you want to leave the Create Email Template page?\nAll unsaved work will be lost."
              }
              onConfirm={() => setMode("insert")}
              onCancel={() => setShowConfirm(false)}
            />
          )}

          {showDynamicEditor && (
            <div
              style={{
                position: "absolute",
                top: 0,
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
                    <div
                      key={field.value}
                      style={{
                        marginBottom: "6px",
                      }}
                    >
                      {/* <label className=" input-label-custom">
                      {field.label}
                    </label> */}
                      <FormInput
                        label={field.label}
                        value={dynamicVars[field.value] || ""}
                        onChange={(e) => {
                          setDynamicVars((prev) => ({
                            ...prev,
                            [field.value]: e.target.value,
                          }));
                        }}
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
          {mode === "insert" ? (
            <div className="flex justify-center items-center">
              <div
                style={{
                  marginTop: "60px",
                  padding: "40px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
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
                    <Button onClick={insertHtmlTemplate}>
                      <div className="flex items-center justify-center gap-0.5">
                        <Eye size={16} />
                        View HTML Template
                      </div>
                    </Button>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        const beautified = DOMPurify.sanitize(htmlInput);
                        navigator.clipboard.writeText(beautified);
                        toast.success("Email Template copied to clipboard!");
                      }}
                    >
                      <div className="flex items-center justify-center gap-0.5">
                        <ClipboardCopy size={16} />
                        Copy HTML Email
                      </div>
                    </Button>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        const beautified = DOMPurify.sanitize(htmlInput);
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
                        <Save size={16} />
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
                <TemplateSettingsPanelInsert
                  htmlBody={htmlInput}
                  htmlTemplateTypeSubjectPlaceholder={JSON.parse(params!).name}
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
            >
              <div style={{ display: "flex", width: "100%" }}>
                <div
                  style={{
                    position: "sticky",
                    top: "10px",
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
                  <div
                    className="fixed inset-0 justify-self-end top-14 "
                    style={{
                      zIndex: 11,
                      height: "fit-content",
                    }}
                  >
                    <ExportPanelCreate
                      onPreview={handlePreview}
                      htmlTemplateTypeSubjectPlaceholder={
                        JSON.parse(params!).name
                      }
                    />
                  </div>

                  <div style={{ zIndex: 100 }}>
                    <HtmlPreviewModal
                      isOpen={isPreviewOpen}
                      onClose={() => setIsPreviewOpen(false)}
                      html={previewHtml}
                      onHtmlChange={setHtmlContent}
                      editable={false}
                    />
                  </div>
                  <div id="CANVAS" style={{ top: 55 }}>
                    <CanvasWrapper />
                  </div>
                </div>
              </div>
            </Editor>
          )}
        </DynamicFieldsContext.Provider>
      </div>
    </div>
  );
};
