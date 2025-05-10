
import React, { useState } from "react";
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



export const EditorCanvas: React.FC = () => {
  const [canvasBgColor, setCanvasBgColor] = useState("#f9f9f9");
  const [previewHtml, setPreviewHtml] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDynamicEditor, setShowDynamicEditor] = useState(true);
  const [mode, setMode] = useState<'editor' | 'insert'>('editor');
  const [htmlInput, setHtmlInput] = useState("");

  const json = `{
    "full_name": "Nitikesh Yewale",
    "email": "nitikesh.yewale@g.com",
    "unsubscribe_link": "https://unsubscribe.example.com",
    "product_name": "CDR software",
    "support_number": "9158176888",
    "company_name":"PurpleRadiance"
  }`;

  const parsedPlaceHolders: Record<string, string> = JSON.parse(json);
  const [dynamicVariables, setDynamicVariables] = useState<Record<string, string>>(parsedPlaceHolders);

  const handlePreview = (html: string) => {
    let replacedHtml = html;
    Object.entries(dynamicVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      replacedHtml = replacedHtml.replace(regex, `<input data-key="${key}" value="${value}" style="border:none;background:transparent;color:#000;width:auto;" />`);
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
    handlePreview(htmlInput);
  };


  const setHtmlContent = (updatedHtml: string) => {
    setHtmlInput(updatedHtml);
    setPreviewHtml(updatedHtml); // Keep modal in sync too
  };

  return (
    <>
      {/* Button to toggle between modes */}
      <div className="fixed  inset-0 justify-self-center top-12  " style={{ height: "fit-content", zIndex: 100,}}>
        <button
          onClick={() => setMode('editor')}
          style={{
            padding: '6px 12px',
            fontSize: '14px',
            borderRadius: '4px',
             height: "fit-content", // or "max-content"
            overflow: "visible",    // Ensures content isn't clipped
            cursor: 'pointer',
            backgroundColor: mode === 'editor' ? '#4CAF50' : '#f1f1f1',
            color: mode === 'editor' ? 'white' : '#000',
            opacity: mode === 'editor' ? 1 : 0.6,
            transition: 'all 0.3s ease'
          }}
        >
          ✏️ Create Email Template
        </button>
        <button
          onClick={() => setMode('insert')}
          style={{
            padding: '6px 12px',
            fontSize: '14px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '10px',
            backgroundColor: mode === 'insert' ? '#4CAF50' : '#f1f1f1',
            color: mode === 'insert' ? 'white' : '#000',
            opacity: mode === 'insert' ? 1 : 0.6,
            transition: 'all 0.3s ease'
          }}
        >
          📥 Insert Email Template
        </button>
      </div>

      {/* Show Fields Button - Always Visible */}
      <button
        onClick={() => setShowDynamicEditor(!showDynamicEditor)}
        style={{
          position: "fixed",
          top: 100,
          right: 20,
          zIndex: 1,
          background: "transparent",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "6px 10px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        ⚙️ {showDynamicEditor ? 'Hide Fields' : 'Show Fields'}
      </button>
      {showDynamicEditor && (
                <div 
                  style={{
                    position: "fixed",
                    top: 100,
                    right: 20,
                    width: "260px",
                    background: "white",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                    zIndex:1
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4 style={{ margin: "0 0 10px 0" }}>Dynamic Fields</h4>
                    <button
                      onClick={() => setShowDynamicEditor(false)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
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

{mode === 'insert' ? (
  <div style={{ marginTop: '60px', padding: '40px' }}>
    <div>
      <textarea
        placeholder="Paste your HTML template here"
        value={htmlInput}
        onChange={handleHtmlInputChange}
        style={{
          width: '100%',
          minWidth: '400px',
          height: '200px',
          padding: '10px',
          resize: 'both',
          overflow: 'auto',
          whiteSpace: 'pre',
        }}
      />
    
    </div>

    <div style={{marginTop: '20px'}}>
      <input
        type="file"
        accept=".html"
        onChange={handleHtmlFileUpload}
        style={{ padding: '8px 16px',
          cursor: 'pointer',
          backgroundColor: "#007bff",
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          transition: 'background-color 0.3s ease', }}
      />
    </div>

    <button
      onClick={insertHtmlTemplate}
      style={{ padding: '8px 14px', marginTop: '20px' }}
    >
      ⏭️ Preview HTML Template 
    </button>

    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
      <button
        onClick={() => {
          const beautified =DOMPurify.sanitize(htmlInput);
          navigator.clipboard.writeText(beautified);
          alert('Email Template copied to clipboard!');
        }}
        style={{ padding: '8px 14px' }}
      >
        📋 Copy HTML Email 
      </button>

      <button
        onClick={() => {
          const beautified = DOMPurify.sanitize(htmlInput);
          const blob = new Blob([beautified], { type: 'text/html' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'sanitized-template.html';
          link.click();
          URL.revokeObjectURL(link.href);
        }}
        style={{ padding: '8px 14px' }}
      >
        💾 Export HTML Email 
      </button>
    </div>

    <div style={{ marginTop: '20px', zIndex: 2000 }}>
      <HtmlPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        html={previewHtml}
        onHtmlChange={setHtmlContent}
        visible={true}

      />
    </div>
  </div>
) : (
      <DynamicFieldsContext.Provider value={parsedFields}>

        <Editor
          resolver={{
            SubjectBlock,
            LexicalText ,
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
            <div style={{ position: 'sticky', top:'50px', height: '3000px', backgroundColor: 'white' }}>
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
              <div style={{ position: "absolute", top: 10, right: 300, zIndex: 10 }}>
                <label style={{ fontSize: "14px", fontWeight: 500 }}>
                  Canvas Background:
                  <input
                    type="color"
                    value={canvasBgColor}
                    onChange={(e) => setCanvasBgColor(e.target.value)}
                    style={{ marginLeft: "10px" }}
                  />
                </label>
              </div>

              <div className="fixed inset-0 justify-self-end top-12 " style={{ zIndex: 15, height: "fit-content" }}>
                <ExportPanel onPreview={handlePreview} />
              </div>
              
              <div style={{zIndex:2000}}>
              <HtmlPreviewModal
              isOpen={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
              html={previewHtml}
              onHtmlChange={setHtmlContent}
              visible={false}

              />
              </div>
              <div id="CANVAS">
                <Frame>
                  <Element
                    is="div"
                    canvas
                    id="ROOT"
                    className="justify-self-start top-18"
                    style={{
                      minWidth:"720px",
                      minHeight: "600px",
                      border: "1px dashed #ccc",
                      padding: "20px",
                    }}
                  />
                </Frame>
              </div>
            </div>
          </div>
        </Editor>

        </DynamicFieldsContext.Provider>
      )}
    </>
  );
};









