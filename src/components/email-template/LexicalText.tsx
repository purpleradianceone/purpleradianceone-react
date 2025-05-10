/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";
import { useEditor, useNode } from "@craftjs/core";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { FiBold, FiItalic, FiAlignLeft, FiAlignCenter, FiAlignRight, FiX } from "react-icons/fi";
import { DynamicFieldsContext } from "./DynamicFieldsContext";

// Styled Components
const EditorContainer = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children }, ref) => (
  <div
    ref={ref}
    className="lexical-editor-container"
    style={{
      position: "relative",
      border: "1px solid #e2e8f0",
      backgroundColor: "white",
      padding: "16px",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      maxWidth: "100%",
      minWidth: "300px",
      transition: "all 0.2s ease",
    
    }}
  >
    {children}
  </div>
));

const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="lexical-delete-button"
    style={{
      position: "absolute",
      top: "8px",
      right: "8px",
      background: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      
    }}
  >
    <FiX size={14} />
  </button>
);

const ToolbarButton = ({ onClick, children, active = false }: { onClick: () => void; children: React.ReactNode; active?: boolean }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? "#e0e7ff" : "transparent",
      color: active ? "#4f46e5" : "#4b5563",
      border: "1px solid #e2e8f0",
      borderRadius: "4px",
      padding: "6px 10px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease",
    
    }}
  >
    {children}
  </button>
);

const ToolbarSelect = ({ onChange, children, defaultValue = "" }: { onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; defaultValue?: string }) => (
  <select
    onChange={onChange}
    defaultValue={defaultValue}
    style={{
      border: "1px solid #e2e8f0",
      borderRadius: "4px",
      padding: "6px 10px",
      background: "white",
      color: "#4b5563",
      cursor: "pointer",
      transition: "all 0.2s ease",
     
    }}
  >
    {children}
  </select>
);

// Toolbar Component
// Toolbar Component
const Toolbar = ({ editor }: { editor: any }) => {
  const dynamicFields = useContext(DynamicFieldsContext);
  const [activeFormats, setActiveFormats] = React.useState<Record<string, boolean>>({
    bold: false,
    italic: false,
    left: false,
    center: false,
    right: false
  });

  const applyFormat = (command: any, value?: any) => {
    editor.dispatchCommand(command, value);
    
    // Special handling for alignment buttons to ensure only one is active
    if (value === 'left' || value === 'center' || value === 'right') {
      setActiveFormats(prev => ({
        ...prev,
        left: value === 'left',
        center: value === 'center',
        right: value === 'right'
      }));
    } else {
      // Toggle other formats (bold, italic)
      setActiveFormats(prev => ({ ...prev, [value]: !prev[value] }));
    }
  };

  const setInlineStyle = (style: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.setStyle(style);
      }
    });
  };

  const insertDynamicField = (fieldKey: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertText(`{{${fieldKey}}}`);
      }
    });
  };

  return (
    <div style={{
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginBottom: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid #f1f5f9",
    }}>
      <ToolbarButton 
        onClick={() => applyFormat(FORMAT_TEXT_COMMAND, "bold")} 
        active={activeFormats["bold"]}
      >
        <FiBold size={14} />
      </ToolbarButton>
      <ToolbarButton 
        onClick={() => applyFormat(FORMAT_TEXT_COMMAND, "italic")} 
        active={activeFormats["italic"]}
      >
        <FiItalic size={14} />
      </ToolbarButton>
      <ToolbarButton 
        onClick={() => applyFormat(FORMAT_ELEMENT_COMMAND, "left")} 
        active={activeFormats["left"]}
      >
        <FiAlignLeft size={14} />
      </ToolbarButton>
      <ToolbarButton 
        onClick={() => applyFormat(FORMAT_ELEMENT_COMMAND, "center")} 
        active={activeFormats["center"]}
      >
        <FiAlignCenter size={14} />
      </ToolbarButton>
      <ToolbarButton 
        onClick={() => applyFormat(FORMAT_ELEMENT_COMMAND, "right")} 
        active={activeFormats["right"]}
      >
        <FiAlignRight size={14} />
      </ToolbarButton>

      {/* Rest of your toolbar components remain the same */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <label style={{ fontSize: "12px", color: "#64748b" }}>Text:</label>
        <input 
          type="color" 
          onChange={(e) => setInlineStyle(`color: ${e.target.value}`)}
          style={{
            width: "24px",
            height: "24px",
            border: "1px solid #e2e8f0",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <label style={{ fontSize: "12px", color: "#64748b" }}>BG:</label>
        <input 
          type="color" 
          onChange={(e) => setInlineStyle(`background-color: ${e.target.value}`)}
          style={{
            width: "24px",
            height: "24px",
            border: "1px solid #e2e8f0",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        />
      </div>

      <ToolbarSelect 
        onChange={(e) => setInlineStyle(`font-size: ${e.target.value}`)}
        defaultValue="14px"
      >
        {["12px", "14px", "16px", "18px", "20px", "24px"].map(size => (
          <option key={size} value={size}>{size.replace('px', '')}</option>
        ))}
      </ToolbarSelect>

      <ToolbarSelect 
        onChange={(e) => setInlineStyle(`font-family: ${e.target.value}`)}
        defaultValue="Arial"
      >
        {["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana", "Helvetica"].map(font => (
          <option key={font} value={font}>{font}</option>
        ))}
      </ToolbarSelect>

      <ToolbarSelect 
        onChange={(e) => {
          const value = e.target.value;
          if (value) insertDynamicField(value);
          e.target.value = "";
        }}
        defaultValue=""
      >
        <option value="" disabled>Insert Field</option>
        {dynamicFields.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </ToolbarSelect>
    </div>
  );
};
const ToolbarWrapper = () => {
  const [editor] = useLexicalComposerContext();
  return <Toolbar editor={editor} />;
};

// Main Editor Component
export const LexicalText = React.forwardRef<HTMLDivElement>((_, ref) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    id,
  } = useNode();

  const { actions } = useEditor();

  const initialConfig = {
    namespace: "LexicalEmailEditor",
    theme: { 
      paragraph: "editor-paragraph",
      text: {
        bold: "editor-text-bold",
        italic: "editor-text-italic",
      },
    },
    onError(error: Error) {
      console.error("Lexical error:", error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  };

  return (
    <EditorContainer ref={(el) => {
      if (el) connect(drag(el));
      if (ref) {
        if (typeof ref === "function") ref(el);
        else ref.current = el;
      }
    }}>
      <DeleteButton onClick={() => actions.delete(id)} />
      
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarWrapper />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              style={{
                minHeight: "100px",
                minWidth: "200px",
                maxWidth: "100%",
                padding: "12px",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                outline: "none",
                backgroundColor: "white",
                lineHeight: "1.5",
               
              }}
            />
          }
          placeholder={
            <div style={{
              position: "absolute",
              top: "60",
              left: "12px",
              color: "#94a3b8",
              pointerEvents: "none",
              userSelect: "none",
            }}>
              Type your content here...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const root = $getRoot();
              const textContent = root.getTextContent();
              const editorJson = JSON.stringify(editorState);
              setProp((props: any) => {
                props.text = textContent;
                props.editorState = editorJson;
              }, 500);
            });
          }}
        />
      </LexicalComposer>
    </EditorContainer>
  );
});

LexicalText.displayName = "LexicalText";

(LexicalText as any).craft = {
  displayName: "Rich Text Editor",
  props: {
    text: "",
    editorState: "",
  },
};
