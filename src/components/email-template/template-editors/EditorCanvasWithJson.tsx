/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { ImageBlock } from "../template-blocks/ImageBlock";
import { ButtonBlock } from "../template-blocks/ButtonBlock";
import { DividerBlock } from "../template-blocks/DividerBlock";
import { SectionBlock } from "../template-blocks/SectionBlock";
import { HtmlPreviewModal } from "../HtmlPreviewModal";
import { ColumnBlock } from "../template-blocks/ColumnBlock";
import { HeadingBlock } from "../template-blocks/HeadingBlock";
import { SubjectBlock } from "../template-blocks/SubjectBlock";
import { DynamicFieldsContext } from "../DynamicFieldsContext";
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
import { MessageSnackbarState, ShowMessageSnackbarProps } from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";


interface DynamicField {
  label: string;
  value: string;
}

export const EditorCanvasWithJson = () => {
  const [canvasBgColor, setCanvasBgColor] = useState("#f9f9f9");
  const [previewHtml, setPreviewHtml] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDynamicEditor, setShowDynamicEditor] = useState(true);
  const [currentJson, setCurrentJson] = useState("");
  const [emailTemplateName,setEmailTemplateName] = useState("");
  const [emailTemplateSubject,setEmailTemplateSubject] = useState("");

  const[emailTemplateDefault,setEmailTemplateDefault] = useState(false);
  
  const [isLoading,setIsLoading] = useState(false);
  const { loginStatus } = useLoggedInUserContext();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const templateTypeId = searchParams.get("template_type_id");
  const emailTemplateId = searchParams.get("template_id");


  //Handaling HTML INSERT TEMPLATES
  const [htmlInput, setHtmlInput] = useState("");
  

  const getTemplateToUpdate = async ({
    emailTemplateId,
    templateTypeId,
  }: {
    emailTemplateId: number;
    templateTypeId: number;
  }) => {
    setIsLoading(true);
    const response = await axios
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
            setEmailTemplateSubject( response.data[0].email_subject);
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
      }).finally(()=>{
        setIsLoading(false);
      })

     
  };

  useEffect(() => {
    if (emailTemplateId && templateTypeId) {
      getTemplateToUpdate({
        emailTemplateId: parseInt(emailTemplateId),
        templateTypeId: parseInt(templateTypeId),
      });
    }
  }, []);

  const jsonPlaceholdersMap: { [key: number]: string } = {
    1: `{
    "company.fullname":"PurpleRadiance",
    "company_user.fullname":"Nitikesh Yewale",
    "company_user.email":"nitikesh@g.co",
    "company_user.mobilenumber":"9878987898",
    "company_user.password":"abc#wio345",
    "current_year":"2025",
    "crm_url":"http://localhost:5173"
    }`,

    2: `{
    "company.fullname":"PurpleRadiance",
    "lead.name":"Elon ",
    "lead.email":"elon@g.co",
    "lead.mobilenumber":"+1 987889978998",
    "lead.owner": "Pravin",
    "lead.status":"on going",
    "lead.source":"web",
    "lead.createdby":"Pratik",
    "lead.createdon":"12 May 2025 ",
    "lead.updatedby":"Kundan",
    "lead.updatedon":"01 June 2025",
    "company_product.name":"CDR Analysis",
    "crm_url":"http://localhost:5173",
    "current_year":"2025"
    }`,

    3: `
    {
    "company.fullname":"PurpleRadiance",
    "lead.name":"Mark3",
    "lead.email":"Mark3@g.co",
    "lead.mobilenumber":"+1 87889978998",
    "lead.owner": "Pravin",
    "lead.status":"on going",
    "lead.source":"web",
    "lead.createdby":"Pratik",
    "lead.createdon":"12 May 2025 ",
    "lead.updatedby":"Kundan",
    "lead.updatedon":"01 June 2025",
    "company_product.name":"CDR Analysis",
    "crm_url":"http://localhost:5173",
    "current_year":"2025"
    }
    `,

    4: `
    {
    "company.fullname":"PurpleRadiance",
    "lead.name":"Elon4",
    "lead.email":"elon4@g.co",
    "lead.mobilenumber":"+1 987889978998",
    "lead.owner": "Suraj",
    "lead.status":"on going",
    "lead.source":"web",
    "lead.createdby":"Pratik",
    "lead.createdon":"12 May 2025 ",
    "lead.updatedby":"Kundan",
    "lead.updatedon":"01 June 2025",
    "company_product.name":"CDR Analysis",
    "crm_url":"http://localhost:5173",
    "current_year":"2025"
    }
    `,
  };

  //   const [dynamicVars, setDynamicVars] = useState<Record<string, string>>(dynamicVariables);
  const json = jsonPlaceholdersMap[parseInt(templateTypeId!)];
  const parsedPlaceHolders: Record<string, string> = JSON.parse(json);
  const [dynamicVars, setDynamicVars] =
    useState<Record<string, string>>(parsedPlaceHolders);
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);
  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  const handlePreview = (html: string) => {
    let replacedHtml = html;
    Object.entries(dynamicVars).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      replacedHtml = replacedHtml.replace(regex, value);
    });
    setPreviewHtml(replacedHtml);
    setIsPreviewOpen(true);
  };

  const parsedFields: DynamicField[] = Object.entries(dynamicVars).map(
    ([key]) => ({
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: key,
    })
  );

  useEffect(() => {
    try {
      JSON.parse(currentJson!);
    } catch (e) {
      console.error("Invalid Craft.js JSON:", e);
      setCurrentJson(
        JSON.stringify({
          ROOT: {
            type: { resolvedName: "Document" },
            isCanvas: true,
            props: {},
            nodes: [],
            linkedNodes: {},
          },
        })
      );
    }
  }, [currentJson]);

  const handleSave = () => {
    // onSave?.(currentJson);
  };


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
            top: 50,
            right: 130,
            width: "260px",
            height: "600px",
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
            }}
          >
            <h4 style={{ margin: 0, fontSize: "14px" }}>Dynamic Fields</h4>
            <button
              onClick={() => setShowDynamicEditor(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                alignContent: "flex-end",
                lineHeight: 1,
              }}
            >
              ✖
            </button>
          </div>

          {Object.entries(dynamicVars).map(([key, value]) => (
            <div key={key} style={{ marginBottom: "8px" }}>
              <label style={{ fontSize: "12px" }}>{key}</label>
              <input
                style={{
                  marginTop: "2px",
                  width: "100%",
                  padding: "4px",
                  fontSize: "12px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                value={value}
                onChange={(e) =>
                  setDynamicVars((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
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
                  alert("Email Template copied to clipboard!");
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