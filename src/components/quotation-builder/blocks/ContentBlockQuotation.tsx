/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import { useEditor, useNode } from "@craftjs/core";
import JoditEditor, { Jodit } from "jodit-react";
import { Edit, Trash2, Save, X } from "lucide-react";
import Button from "../../ui/Button";
import { SIZE } from "../../../constants/AppConstants";
import { DynamicFieldsContext } from "../../email-template/DynamicFieldsContext";

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

  const dynamicFields = useContext(DynamicFieldsContext);

  const placeholderList = useMemo(() => {
    return dynamicFields.reduce((acc: Record<string, string>, item) => {
      acc[item.value] = item.label;
      return acc;
    }, {});
  }, [dynamicFields]);

  useEffect(() => {
    Jodit.defaultOptions.controls.placeholders = {
      name: "placeholders",
      text: "Placeholders",
      list: placeholderList,
      exec: (view: any, current: any, options: any) => {
        const editor = view; // Jodit instance

        // Extract value safely
        const selectedValue =
          typeof current === "string"
            ? current
            : options?.control?.args?.[0] || "";

        if (!selectedValue) return;

        editor.s.focus();

        editor.selection.insertHTML(
          `<span class="placeholder-token">${selectedValue}</span>`,
        );
      },
    };
  }, [placeholderList]);

  useEffect(() => {
    if (editing) {
      setContent(props.htmlContent);
    }
  }, [editing, props.htmlContent]);

  const joditConfig = useMemo(
    () =>
      ({
        readonly: false,
        height: 90,
        toolbarAdaptive: false,
        toolbarSticky: true,
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        //Fix for enter taking extra line
        enter: "br",
        enterBlock: "p",
        defaultActionOnEnter: "insert_br",

        cleanHTML: {
          fillEmptyParagraph: false,
          removeEmptyElements: false,
        },
        //Fix end

        //Fix for font family
        allowTags: {
          span: { style: true },
          p: { style: true },
        },

        style: {
          font: true,

          // for tabs below 1
          tabSize: 4,
        },
        //Fix end

        buttons: [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "eraser",
          "|",
          "font",
          "fontsize",
          "brush",
          "paragraph",
          "lineHeight",
          "|",
          "ul",
          "ol",
          "|",
          "align",
          "|",
          "hr",
          "table",
          "image",
          "link",
          "symbols",
          "|",
          "selectall",

          "|",
          "placeholders",
          "|",

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
          // "selectall",
          "copyformat",
          // "hr",
          "spellcheck",
          "preview",
        ],

        uploader: {
          insertImageAsBase64URI: true,
        },

        events: {
          afterInit: (editor: any) => {
            const MIN_HEIGHT = 90;

            const autoResize = () => {
              requestAnimationFrame(() => {
                const content = editor.editor;

                // Reset first so shrink also works
                content.style.height = "auto";

                const contentHeight = content.scrollHeight;
                const toolbarHeight =
                  editor.toolbar?.container?.offsetHeight || 0;

                const finalHeight = Math.max(
                  MIN_HEIGHT,
                  contentHeight + toolbarHeight + 20,
                );

                editor.container.style.height = finalHeight + "px";
                editor.workplace.style.height =
                  finalHeight - toolbarHeight + "px";

                content.style.height = finalHeight - toolbarHeight + "px";
              });
            };

            // Initial height when edit mode opens
            setTimeout(autoResize, 100);

            // Resize only when layout/content actually changes
            editor.e.on("paste", () => setTimeout(autoResize, 50));
            editor.e.on("mouseup", autoResize);

            // ===============================
            // FINAL TAB SUPPORT (MULTIPLE TABS)
            // ===============================
            editor.editor.addEventListener("keydown", (e: KeyboardEvent) => {
              if (e.key === "Tab") {
                e.preventDefault();
                e.stopPropagation();

                editor.s.focus();

                // each Tab press inserts 4 preserved spaces
                // multiple tabs supported
                editor.execCommand(
                  "insertHTML",
                  false,
                  '<span style="white-space:nowrap;">&nbsp;&nbsp;&nbsp;&nbsp;</span>',
                );

              }
              setTimeout(autoResize, 0);
            });
          },
        },

        disablePlugins: ["file", "video", "about", "clipboard"],
        placeholder: "Enter quotation text...",
      }) as any,
    [],
  );

  const handleSave = () => {
    console.error("content html:-------------------");
    console.log(content);
    setProp((p: any) => {
      p.htmlContent = content;
    });
    try {
      // if(!editing)return;
      const editor = editorRef.current as any;

      if (editor?.isFullSize) {
        editor.events.one("afterResize", () => {
          setEditing(false);
        });
        editor.execCommand("toggleFullScreen");
      } else {
        setEditing(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //For Ctrl+s
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions]);

  return (
    <div
      ref={(ref) => ref && (!editing ? connect(drag(ref)) : connect(ref))}
      style={{
        minHeight: "60px",
        padding: "4px",
        width: "100%",
        backgroundColor: "#fafafa",
        borderTop: "1px dashed #ddd",
        position: "relative",
      }}
      onDoubleClick={() => {
        setEditing(true);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {(hovered || editing) && (
        <div className={`group flex ${editing ? "col-span-3" : "col-span-2"}`}>
          <div className="absolute w-fit left-0 -top-2 z-50 flex gap-1">
            {!editing ? (
              <div className="scale-75 group-hover:scale-100 transition-transform duration-200">
                <Button onClick={() => setEditing(true)}>
                  <Edit size={SIZE.SIXTEEN} />
                  Edit Content
                </Button>
              </div>
            ) : (
              <div className="flex col-span-2 w-full gap-2">
                <div className="">
                  <Button onClick={handleSave}>
                    <Save size={SIZE.SIXTEEN} />
                    <span>Save Content</span>
                  </Button>
                </div>
                <div className="">
                  <Button type="button" onClick={() => setEditing(false)}>
                    <X size={SIZE.SIXTEEN} />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="absolute right-0 -top-2 z-50 scale-75 group-hover:scale-100 transition-transform duration-200">
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
            __html:
              props.htmlContent || "<em>Click 'Edit Content' to add text</em>",
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
    htmlContent: "",
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
