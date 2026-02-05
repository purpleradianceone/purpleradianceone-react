/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useEditor, useNode } from "@craftjs/core";
import JoditEditor from "jodit-react";
import { Edit, Trash2, Save, X } from "lucide-react";
import Button from "../../ui/Button";
import { SIZE } from "../../../constants/AppConstants";

export const ContentBlockQuotation: React.FC = () => {
  const editorRef = useRef<any>(null);

  const {
    id,
    connectors: { connect, drag },
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  const { actions } = useEditor();

  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);

  const [content, setContent] = useState<string>(props.htmlContent);

  useEffect(() => {
    if (editing) {
      setContent(props.htmlContent);
    }
  }, [editing, props.htmlContent]);

  const joditConfig = useMemo(
    () => ({
      readonly: false,
      height: 300,
      toolbarAdaptive: false,
      toolbarSticky: true,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,

      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "fontsize",
        "brush",
        "|",
        "ul",
        "ol",
        "|",
        "align",
        "|",
        "quote",
        "|",
        "table",
        "image",
        "|",
        "undo",
        "redo",
        "|",
        "fullsize",
      ],

      removeButtons: [
        "source",
        "video",
        "file",
        "print",
        "selectall",
        "copyformat",
        "hr",
        "symbols",
        "spellcheck",
        "preview",
      ],

      uploader: {
        insertImageAsBase64URI: true,
      },

      disablePlugins: ["file", "video", "about", "clipboard"],
      placeholder: "Enter quotation text...",
    }),
    []
  );

  const handleSave = () => {
    setProp((p: any) => {
      p.htmlContent = content;
    });
    setEditing(false);
  };

  return (
    <div
      ref={(ref) => ref && (!editing ? connect(drag(ref)) : connect(ref))}
      style={{
        minHeight: "120px",
        padding: "16px",
        width: "100%",
        backgroundColor: "#fafafa",
        borderTop: "1px dashed #ddd",
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {(hovered || editing) && (
        <div className={`flex ${editing?"col-span-3":"col-span-2"}`}>
          <div className="absolute w-fit left-2 -top-2 z-50 flex gap-1">
            {!editing ? (
              <div>
              <Button onClick={() => setEditing(true)}>
                <Edit size={SIZE.SIXTEEN} />
                Edit Content
              </Button>
              </div>
            ) : (
              <div className="flex col-span-2 w-full gap-1">
                <div>
                <Button onClick={handleSave}>
                  <Save size={SIZE.SIXTEEN} />
                  <span>Save Content</span>
                </Button>
                </div>
                <div>
                <Button type="button" onClick={() => setEditing(false)}>
                  <X size={SIZE.SIXTEEN} />
                  Cancel
                </Button>
                </div>
              </div>
            )}
          </div>
           <div className="absolute right-2 -top-2 z-50">
            <Button type="button" onClick={() => actions.delete(id)}>
              <Trash2 size={SIZE.SIXTEEN} />
              Delete Content
            </Button>
          </div>
        </div>
      )}

      {editing ? (
        <JoditEditor
          ref={editorRef}
          value={content}
          onChange={setContent}
          config={joditConfig}
        />
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: props.htmlContent || "<em>Click edit to add text</em>",
          }}
          style={{ wordBreak: "break-word" }}
        />
      )}
    </div>
  );
};

/* ================= Craft Config ================= */
(ContentBlockQuotation as any).craft = {
  displayName: "Content Block Text",
  props: {
    htmlContent: "<p>Your quotation text</p>",
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
