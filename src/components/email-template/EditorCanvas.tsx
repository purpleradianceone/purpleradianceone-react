/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import { Editor, Frame, Element } from "@craftjs/core";
import { Sidebar } from "./Sidebar";
import { LexicalText } from "./LexicalText";
import { ImageBlock } from "./ImageBlock";
import { ButtonBlock } from "./ButtonBlock";
import { DividerBlock } from "./DividerBlock";
import { SectionBlock } from "./SectionBlock";
import { HtmlPreviewModal } from "./HtmlPreviewModal";
import { ExportPanel } from "./ExportPanel";
import { ColumnBlock } from "./ColumnBlock";
import { HeadingBlock } from "./HeadingBlock";
import { DynamicFieldBlock } from "./DynamicFieldBlock";
import { SubjectBlock } from "./SubjectBlock";
import DOMPurify from 'dompurify';
import 'tinymce';
import { DynamicFieldsContext } from "./DynamicFieldsContext";
import { TableBlock } from "./TableBlock";
import { LucideCode,  LucideMail,  } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import { TemplateSettingsPanelCreate } from "./TemplateSettingsPanelCreate ";
import { TemplateSettingsPanelEdit } from "./TemplateSettingsPanelEdit";



export const EditorCanvas: React.FC = () => {
  const [canvasBgColor, setCanvasBgColor] = useState("#f9f9f9");
  const [previewHtml, setPreviewHtml] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDynamicEditor, setShowDynamicEditor] = useState(true);
  const [mode, setMode] = useState<'editor' | 'insert'>('editor');
  const [htmlInput, setHtmlInput] = useState("");

  const jsonPlaceholdersMap:{ [key: number]: string } = {
    1:`{
    "company.fullname":"PurpleRadiance",
    "company_user.fullname":"Nitikesh Yewale",
    "company_user.email":"nitikesh@g.co",
    "company_user.mobilenumber":"9878987898",
    "company_user.password":"abc#wio345",
    "current_year":"2025",
    "crm_url":"http://localhost:5173"
    }`,

    2:`{
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

    3:`
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

    4:`
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

  const [searchParams] = useSearchParams();
const params = searchParams.get("type");
  useEffect(()=> {
if(params){
  console.log("parsed JsonPArmas : ")
  console.log(JSON.parse(params))
}

  
  },[])
  
  const json = jsonPlaceholdersMap[parseInt(JSON.parse(params!).id)];
  const parsedPlaceHolders: Record<string, string> = JSON.parse(json);
  const [dynamicVariables, setDynamicVariables] = useState<Record<string, string>>(parsedPlaceHolders);

  const handlePreview = (html: string) => {
    let replacedHtml = html;
    Object.entries(dynamicVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      replacedHtml = replacedHtml.replace(regex, value);
      // replacedHtml = replacedHtml.replace(regex, `<input data-key="${key}" value="${value}" style="border:none;background:transparent;color:#000;width:auto;" />`);
    });
    setPreviewHtml(replacedHtml); 
    setIsPreviewOpen(true);
  };

  const parsedFields = Object.entries(JSON.parse(json)).map(
  ([key]) => ({
    label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: key,
  })
);

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



  return (
    <>
      <div className="fixed z-10 top-12 left-14 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-fit p-2">
        <div className="flex  gap-1">
          {<LucideMail className="w-6 h-6 text-blue-600" />}
          {<LucideCode className="w-4 h-4 text-blue-600" />}
          <span className="text-1xl font-bold">Email Template</span>
          <span className="text-1xl font-bold">
            : : : {JSON.parse(params!).name} Template
          </span>
          <div
            className="fixed  inset-0 justify-center  top-12 "
            style={{ height: "fit-content", zIndex: 100 }}
          >
            <div className="flex-col gap-2 justify-center justify-items-center">
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid #ccc",
                  // marginBottom: "0.75rem",
                }}
              >
                <div
                  onClick={() => setMode("editor")}
                  style={{
                    padding: "6px 10px",
                    fontSize: "13px",
                    cursor: "pointer",
                    borderBottom:
                      mode === "editor"
                        ? "2px solid #007BFF"
                        : "2px solid transparent",
                    color: mode === "editor" ? "#007BFF" : "#555",
                    fontWeight: mode === "editor" ? "bold" : "normal",
                    transition: "all 0.2s ease",
                  }}
                >
                  Create Email Template
                </div>

                <div
                  onClick={() => {
                    if (mode === "editor") {
                      const confirmed = window.confirm(
                        "\nAre you sure you want to leave the Create Email Template page?\nAll unsaved work will be lost.\n\nClick OK to continue or Cancel to stay on this page."
                      );
                      if (!confirmed) return;
                    }
                    setMode("insert");
                  }}
                  style={{
                    padding: "6px 10px",
                    fontSize: "13px",
                    cursor: "pointer",
                    borderBottom:
                      mode === "insert"
                        ? "2px solid #007BFF"
                        : "2px solid transparent",
                    color: mode === "insert" ? "#007BFF" : "#555",
                    fontWeight: mode === "insert" ? "bold" : "normal",
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
      <>
        {/* Show Fields Button - Always Visible */}
        <button
          onClick={() => setShowDynamicEditor(!showDynamicEditor)}
          style={{
            position: "fixed",
            top: 50,
            right: 130,
            zIndex: 10,
            color:"white",
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
              height: "600px", // Fixed height
              background: "white",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              zIndex: 11,
              overflowY: "auto", // Enables scrolling
            }}
          >
            <div
              style={{
                position:"sticky",
                display: "flex",
                top:0,
                justifyContent: "space-between",
                background:"white",
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
                  alignContent:"flex-end",
                  lineHeight: 1,
                }}
              >
                ✖
              </button>
            </div>

            {Object.entries(dynamicVariables).map(([key, value]) => (
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
                    setDynamicVariables((prev) => ({
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
          {mode === "insert" ? (
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
                    const beautified = DOMPurify.sanitize(htmlInput);
                    navigator.clipboard.writeText(beautified);
                    alert("Email Template copied to clipboard!");
                  }}
                  style={{ padding: "8px 14px" }}
                >
                  📋 Copy HTML Email
                </button>

                <button
                  onClick={() => {
                    const beautified = DOMPurify.sanitize(htmlInput);
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
                <TemplateSettingsPanelEdit
                  htmlBody={htmlInput}
                  htmlTemplateTypeSubjectPlaceholder={JSON.parse(params!).name}
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
              }}
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
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 300,
                      zIndex: 10,
                    }}
                  >
                    <label style={{ fontSize: "14px", fontWeight: 500}}>
                      Canvas Background:
                      <input
                        type="color"
                        value={canvasBgColor}
                        onChange={(e) => setCanvasBgColor(e.target.value)}
                        style={{ marginLeft: "10px" }}
                      />
                    </label>
                  </div>

                  <div
                    className="fixed inset-0 justify-self-end top-12 "
                    style={{ zIndex: 15, height: "fit-content" }}
                  >
                    <ExportPanel onPreview={handlePreview} />
                  </div>

                  <div style={{ zIndex: 2000 }}>
                    <HtmlPreviewModal
                      isOpen={isPreviewOpen}
                      onClose={() => setIsPreviewOpen(false)}
                      html={previewHtml}
                      onHtmlChange={setHtmlContent}
                      editable={false}
                    />
                  </div>
                  <div id="CANVAS" style={{ top: 55 }}>
                    <Frame>
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
              <>
                {/* Settings panel */}
                <TemplateSettingsPanelCreate
                  htmlTemplateTypeSubjectPlaceholder={JSON.parse(params!).name}
                />
              </>
            </Editor>
          )}
        </DynamicFieldsContext.Provider>
      </>
    </>
  );
};









