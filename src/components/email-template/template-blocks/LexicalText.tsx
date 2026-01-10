/* eslint-disable @typescript-eslint/no-unused-expressions */
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
import {
  FiBold,
  FiItalic,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
} from "react-icons/fi";
import { DynamicFieldsContext } from "../DynamicFieldsContext";
import { Trash2 } from "lucide-react";
import Button from "../../ui/Button";
import { SIZE } from "../../../constants/AppConstants";

const buttonTextStyle = "input-label-custom-white";
// Styled Components
const EditorContainer = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => (
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
  <div className="absolute top-3 right-2 w-fit h-fit cursor-pointer">
    <Button type="button" onClick={onClick}>
      <div className="flex items-center justify-center gap-1">
        <Trash2 size={SIZE.SIXTEEN} />
        <span className={buttonTextStyle}>Text Block</span>
      </div>
    </Button>
  </div>
);

const ToolbarButton = ({
  onClick,
  children,
  active = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) => (
  <Button
    type="submit"
    className={`table-data-custom color:${active ? "#4f46e5" : "#4b5563"} ${
      active ? "bg-indigo-100" : "bg-transparent"
    } border border-gray-300 rounded-[4px] px-[10px] py-[6px] cursor-pointer flex items-center gap-[6px]`}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
  >
    {children}
  </Button>
);

const ToolbarSelect = ({
  onChange,
  children,
  defaultValue = "",
}: {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  defaultValue?: string;
}) => (
  <select
    className="table-data-custom border border-gray-300 rounded py-1.5 px-2.5 bg-white text-gray-600 cursor-pointer"
    onChange={onChange}
    defaultValue={defaultValue}
  >
    {children}
  </select>
);

const Toolbar = ({ editor }: { editor: any }) => {
  const dynamicFields = useContext(DynamicFieldsContext);
  const [activeFontSize, setActiveFontSize] = React.useState("");
  const [activeFormats, setActiveFormats] = React.useState<
    Record<string, boolean>
  >({
    bold: false,
    italic: false,
    left: false,
    center: false,
    right: false,
  });

  const applyFormat = (command: any, value?: any) => {
    editor.dispatchCommand(command, value);
    if (value === "left" || value === "center" || value === "right") {
      setActiveFormats((prev) => ({
        ...prev,
        left: value === "left",
        center: value === "center",
        right: value === "right",
      }));
    } else {
      setActiveFormats((prev) => ({ ...prev, [value]: !prev[value] }));
    }
  };

  const setInlineStyle = (style: string) => {
    if (style.includes("font-size")) {
      setActiveFontSize(style.slice(10));
      console.log(activeFontSize);
    }
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
        selection.insertText(`${fieldKey}`);
      }
    });
  };
  if (dynamicFields.length === 0) {
    return (
      <div className=" table-data-custom p-2 bg-gray-100 text-gray-600">
        Loading dynamic fields...
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-[12px] pb-[12px] border-b border-[#f1f5f9]">
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

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <label className="table-data-custom" style={{ fontSize: "12px", color: "#64748b" }}>Text:</label>
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
        <label className="table-data-custom" style={{ fontSize: "12px", color: "#64748b" }}>BG:</label>
        <input 
          type="color"
          onChange={(e) =>
            setInlineStyle(`background-color: ${e.target.value}`)
          }
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
        {[
          "8px",
          "10px",
          "12px",
          "14px",
          "16px",
          "18px",
          "20px",
          "22px",
          "24px",
          "26px",
          "28px",
          "30px",
          "32px",
          "34px",
          "36px",
          "38px",
          "40px",
          "42px",
          "44px",
          "46px",
          "48px",
          "50px",
          "52px",
          "54px",
          "56px",
          "58px",
          "60px",
          "62px",
          "64px",
          "66px",
          "68px",
          "70px",
          "72px",
        ].map((size) => (
          <option className="table-data-custom" key={size} value={size}>
            {size.replace("px", "")}
          </option>
        ))}
      </ToolbarSelect>

      <ToolbarSelect
        onChange={(e) => setInlineStyle(`font-family: ${e.target.value}`)}
        defaultValue="Arial"
      >
        {[
          "Arial",
          "Courier New",
          "Georgia",
          "Times New Roman",
          "Verdana",
          "Helvetica",
        ].map((font) => (
          <option className="table-data-custom" key={font} value={font}>
            {font}
          </option>
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
        <option className="table-data-custom" value="" disabled>
          Insert Field
        </option>
        {dynamicFields.map((field) => (
          <option className="table-data-custom" key={field.value} value={field.value}>
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
export const LexicalText = React.forwardRef<HTMLDivElement>((props, ref) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    id,
  } = useNode((node) => ({
    editorState: node.data.props.editorState,
  }));

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
    editorState: (editor: any) => {
      if ((props as any)?.editorState) {
        try {
          const parsed = editor.parseEditorState((props as any).editorState);
          editor.setEditorState(parsed);
        } catch (err) {
          console.warn("Failed to parse editor state:", err);
        }
      }
    },
  };

  return (
    <EditorContainer
      ref={(el) => {
        if (el) connect(drag(el));
        if (ref) typeof ref === "function" ? ref(el) : (ref.current = el);
      }}
    >
      <DeleteButton onClick={() => actions.delete(id)} />
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarWrapper />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              style={{
                minHeight: "100px",
                padding: "12px",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                backgroundColor: "white",
                lineHeight: "1.5",
                outline: "none",
              }}
            />
          }
          placeholder={
            <div className="relative -top-[70px] left-10 text-slate-400 pointer-events-none">
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
