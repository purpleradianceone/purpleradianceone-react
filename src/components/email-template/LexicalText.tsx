/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useEditor, useNode } from "@craftjs/core";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
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
  UNDO_COMMAND,
  REDO_COMMAND,
  LexicalCommand,
} from "lexical";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";

import { ResizableBox } from "react-resizable";

import "react-resizable/css/styles.css";
import "./lexical.css";

// Error boundary
export function ErrorBoundaryComponent({
  children,
  onError,
}: {
  children: React.JSX.Element;
  onError: (error: Error) => void;
}) {
  return <>{children}</>;
}

// Toolbar
const Toolbar = ({ editor }: { editor: any }) => {
  const applyFormat = (command: LexicalCommand<any>, value?: any) => {
    editor.dispatchCommand(command, value);
  };

  const setInlineStyle = (style: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.setStyle(style);
      }
    });
  };

  return (
    <div className="editor-toolbar" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
      {[
        { label: "Bold", command: FORMAT_TEXT_COMMAND, value: "bold" },
        { label: "Italic", command: FORMAT_TEXT_COMMAND, value: "italic" },
        { label: "Left", command: FORMAT_ELEMENT_COMMAND, value: "left" },
        { label: "Center", command: FORMAT_ELEMENT_COMMAND, value: "center" },
        { label: "Right", command: FORMAT_ELEMENT_COMMAND, value: "right" },
        { label: "Undo", command: UNDO_COMMAND },
        { label: "Redo", command: REDO_COMMAND },
      ].map(({ label, command, value }, index) => (
        <button key={index} onClick={() => applyFormat(command, value)}>
          {label}
        </button>
      ))}

      <label>
        Text Color:
        <input type="color" onChange={(e) => setInlineStyle(`color: ${e.target.value}`)} />
      </label>

      <label>
        Background:
        <input type="color" onChange={(e) => setInlineStyle(`background-color: ${e.target.value}`)} />
      </label>

      <label>
        Font Size:
        <select onChange={(e) => setInlineStyle(`font-size: ${e.target.value}`)}>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
        </select>
      </label>

      <label>
        Font Family:
        <select onChange={(e) => setInlineStyle(`font-family: ${e.target.value}`)}>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>
      </label>
    </div>
  );
};

const ToolbarWrapper = () => {
  const [editor] = useLexicalComposerContext();
  return <Toolbar editor={editor} />;
};

export const LexicalText: React.FC = () => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    id,
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  const { actions } = useEditor();

  const initialConfig = {
    namespace: "LexicalEmailEditor",
    theme: { paragraph: "editor-paragraph" },
    onError(error: any) {
      console.error("Lexical error:", error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  };

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        position: "relative",
        border: "1px solid #ccc",
        backgroundColor: "transparent",
        padding: "10px",
        display: "inline-block",
        maxWidth: "100%",
      }}
    >
      <button
        onClick={() => actions.delete(id)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "#ff5f5f",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          cursor: "pointer",
        }}
      >
        ×
      </button>

      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarWrapper />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="editor-content"
              style={{
                minHeight: "40px",
                minWidth: "100px",
                maxWidth: "100%",
                resize: "both",
                overflow: "auto",
                padding: "6px",
                boxSizing: "border-box",
              }}
            />
          }
          placeholder={<div className="editor-placeholder">Type your content…</div>}
          ErrorBoundary={ErrorBoundaryComponent}
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
    </div>
  );
};

(LexicalText as any).craft = {
  displayName: "Rich Text (Lexical)",
  props: {
    text: "",
    editorState: "",
  },
};
