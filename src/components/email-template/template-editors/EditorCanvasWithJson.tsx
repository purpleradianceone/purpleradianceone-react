/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Editor, Frame, Element } from "@craftjs/core";
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
import { LucideCode, LucideMail } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DynamicFieldBlock } from "../template-blocks/DynamicFieldBlock";
import { LexicalText } from "../template-blocks/LexicalText";
import { TemplateSettingsPanelCreateTemplateUpdate } from "../template-panel/TemplateSettingsPanelCreateTemplateUpdate";
import { GenericBlock } from "../template-blocks/GenericBlock";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { NUMBER_VALUES, STATUS_CODE } from "../../../constants/AppConstants";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import ROUTES_URL from "../../../constants/Routes";
import { ExportPanel } from "../template-panel/ExportPanel";
import { Sidebar } from "../sidebar/Sidebar";
import { TemplateSettingsPanelInsertTemplateUpdate } from "../template-panel/TemplateSettingsPanelInsertTemplateUpdate";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import {
  convertPlaceholdersToFields,
  convertPlaceholdersToObject,
  PlaceholderItem,
} from "../template-util/PlaceHolderDataToPlaceHolderRecord";


export const EditorCanvasWithJson = () => {
  const canvasBgColor="#f9f9f9";
  const [previewHtml, setPreviewHtml] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDynamicEditor, setShowDynamicEditor] = useState(true);
  const [currentJson, setCurrentJson] = useState("");
  const [emailTemplateName, setEmailTemplateName] = useState("");
  const [emailTemplateSubject, setEmailTemplateSubject] = useState("");

  const [emailTemplateDefault, setEmailTemplateDefault] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { loginStatus } = useLoggedInUserContext();
  const navigate = useNavigate();

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
            setIsDialogueOpen(false);
          } else {
            setIsDialogueOpen(true);
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

  const parsedPlaceHolders: Record<string, string> = convertPlaceholdersToObject(placeHolderData);
  const [dynamicVars, setDynamicVars] = useState<Record<string, string>>(parsedPlaceHolders);
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);
  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  const handlePreview = (html: string) => {
    let replacedHtml = html;
    Object.entries(dynamicVars).forEach(([key, value]) => {
      const regex = new RegExp(`${key}`, "g");
      replacedHtml = replacedHtml.replace(regex, value);
    });
    setPreviewHtml(replacedHtml);
    setIsPreviewOpen(true);
  };

  

  const parsedFields: DynamicFieldOption[] = convertPlaceholdersToFields(placeHolderData);

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

  //message snakbar
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  //for instruction

  return isLoading ? (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  ) : (
    <>
      <div className="fixed z-10 top-12 left-14 flex items-center justify-between bg-gray-50 rounded-lg shadow-sm mb-1.5 w-fit p-2">
        <div className="flex gap-1">
          <LucideMail className="w-6 h-6 text-blue-600" />
          <LucideCode className="w-4 h-4 text-blue-600" />
          <span className="text-1xl font-bold">Email Template Update</span>
          {templateTypeId && (
            <span className="text-1xl font-bold">
              : : : {emailTemplateName}
            </span>
          )}
        </div>
        <MessageSnackBar
          isOpen={messageSnackbar.open}
          message={messageSnackbar.message}
          type={messageSnackbar.type}
          onClose={handleMessageSnackbarClose}
          duration={NUMBER_VALUES.SNACKBAR_DURATION}
        />
      </div>

      <button
        onClick={() => setShowDynamicEditor(!showDynamicEditor)}
        style={{
          position: "fixed",
          top: 50,
          right: 130,
          zIndex: 10,
          color: "white",
          background: "#007bff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "6px 10px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        ⚙️ {showDynamicEditor ? "Hide Fields" : "Show Fields"}
      </button>

      {showDynamicEditor && (
        <div
          style={{
            position: "fixed",
            top: 80, // Adjusted to appear below the toggle button
            right: 130,
            width: "260px",
            maxHeight: "600px",
            background: "white",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
            zIndex: 11,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              position: "sticky",
              display: "flex",
              top: 0,
              justifyContent: "space-between",
              background: "white",
              alignItems: "center",
              marginBottom: "10px",
              paddingBottom: "8px",
              borderBottom: "1px solid #eee",
            }}
          >
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
              Dynamic Fields
            </h4>
            <button
              onClick={() => setShowDynamicEditor(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                lineHeight: 1,
                color: "#666",
                padding: "4px",
              }}
            >
              ✖
            </button>
          </div>

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
                <label
                  style={{
                    fontSize: "12px",
                    display: "block",
                    marginBottom: "4px",
                    fontWeight: 500,
                    color: "#333",
                  }}
                >
                  {field.label}
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    fontSize: "12px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    backgroundColor: "#fff",
                    boxSizing: "border-box",
                  }}
                  value={dynamicVars[field.value] || ""}
                  onChange={(e) =>
                    setDynamicVars((prev) => ({
                      ...prev,
                      [field.value]: e.target.value,
                    }))
                  }
                  placeholder={`Enter value for ${field.label}`}
                />
                <div
                  style={{
                    fontSize: "10px",
                    color: "#999",
                    marginTop: "4px",
                    fontFamily: "monospace",
                  }}
                >
                  {field.value}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <DynamicFieldsContext.Provider value={parsedFields}>
        {currentJson == null || currentJson === "" ? (
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

            <button
              onClick={insertHtmlTemplate}
              style={{ padding: "8px 14px", marginTop: "20px" }}
            >
              ⏭️ Preview HTML Template
            </button>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  const beautified = htmlInput;
                  navigator.clipboard.writeText(beautified);
                  showMessageSnackbar({message:"Html copied to clipboard!", type:"success"})
                }}
                style={{ padding: "8px 14px" }}
              >
                📋 Copy HTML Email
              </button>

              <button
                onClick={() => {
                  const beautified = htmlInput;
                  const blob = new Blob([beautified], { type: "text/html" });
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = "sanitized-template.html";
                  link.click();
                  URL.revokeObjectURL(link.href);
                }}
                style={{ padding: "8px 14px" }}
              >
                💾 Export HTML Email
              </button>
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
            <>
              {/* Settings panel */}
              <TemplateSettingsPanelInsertTemplateUpdate
                htmlBody={htmlInput}
                id={parseInt(emailTemplateId!)}
                templateTypeId={parseInt(templateTypeId!)}
                emailTemplateName={emailTemplateName}
                emailTemplateSubject={emailTemplateSubject}
                emailTemplateIsDefault={emailTemplateDefault}
              />
            </>
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
              GenericBlock, // 👈 Don't forget
            }}
            enabled={true}
          >
            <div style={{ display: "flex", width: "100%" }}>
              <div
                style={{
                  position: "sticky",
                  top: "0px",
                  height: "3000px",
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
                  className="fixed inset-0 justify-self-end top-12"
                  style={{ zIndex: 15, height: "fit-content" }}
                >
                  <ExportPanel
                    onPreview={handlePreview}
                    //   onSave={handleSave}
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
                  <Frame data={currentJson}>
                    <Element
                      is="div"
                      canvas
                      id="ROOT"
                      className="justify-self-start top-28"
                      style={{
                        minWidth: "700px",
                        minHeight: "800px",
                        border: "1px dashed #ccc",
                        padding: "70px",
                      }}
                    />
                    <Element
                      is={ColumnBlock}
                      canvas
                      columnIds={["col-1", "col-2"]}
                    />
                  </Frame>
                </div>
              </div>
            </div>
            {templateTypeId && (
              <TemplateSettingsPanelCreateTemplateUpdate
                id={parseInt(emailTemplateId!)}
                templateTypeId={parseInt(templateTypeId!)}
                emailTemplateName={emailTemplateName}
                emailTemplateSubject={emailTemplateSubject}
                emailTemplateIsDefault={emailTemplateDefault}
              />
            )}
          </Editor>
        )}
      </DynamicFieldsContext.Provider>
      <DialogueBox
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        onConfirm={handleDialogueConfirm}
        title="Session Expired !"
        message="Session Expired. Please login again."
      />
    </>
  );
};
