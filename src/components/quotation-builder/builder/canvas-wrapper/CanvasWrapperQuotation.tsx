/* eslint-disable @typescript-eslint/no-explicit-any */
import { Frame, Element, useEditor } from "@craftjs/core";
import { useEffect, useState } from "react";
import { DocumentCanvasQuotation } from "../../blocks/DocumentCanvasQuotation";
import { LucideClipboardPaste } from "lucide-react";
export const STORAGE_KEY = "quotation_editor_json";

export const CanvasWrapperQuotation = ({ data }: { data: string }) => {
  const { query, store } = useEditor();
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const checkCanvasEmpty = () => {
      const serialized = query.serialize();
      const data = JSON.parse(serialized);
      const result = isCanvasTrulyEmpty(data, "ROOT");
      setIsEmpty(result);
    };

    checkCanvasEmpty();
    const interval = setInterval(checkCanvasEmpty, 500);
    return () => clearInterval(interval);
  }, [query]);

  //Auto save editor state
  useEffect(() => {
    const unsubscribe = store.subscribe(
      (state) => state,
      () => {
        const serialized = query.serialize();
        const data = JSON.parse(serialized);
        const result = isCanvasTrulyEmpty(data, "ROOT");
        if (!result) localStorage.setItem(STORAGE_KEY, serialized);
      },
    );

    return () => unsubscribe();
  }, [store, query]);

 

  return (
    <div style={{ position: "relative" }} className="table-data-custom">
      {/* Canvas frame */}
      <Frame data={data}>
        <Element
          is={DocumentCanvasQuotation}
          canvas
          id="ROOT"
          style={{
            minWidth: "700px",
            minHeight: "800px",
            border: "1px dashed #ccc",
            padding: "70px",
            position: "relative",
          }}
        />
      </Frame>

      {/* Floating overlay message outside the Element */}
      <div
        className="table-data-custom"
        style={{
          position: "absolute",
          top: "30%",
          left: "20%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
          opacity: isEmpty ? 1 : 0,
          transition: "opacity 0.3s ease",
          zIndex: isEmpty ? 1 : -1, // hide from interaction when invisible
        }}
      >
        <div className="flex gap-1">
          <LucideClipboardPaste size={19} />
          Drag the Page blocks here 👉
        </div>
      </div>
    </div>
  );
};

/**
 * Recursively checks whether a given node ID has any non-placeholder children.
 */
function isCanvasTrulyEmpty(data: any, nodeId: string): boolean {
  const node = data[nodeId];
  if (!node || !node.nodes) return true;

  for (const childId of node.nodes) {
    const child = data[childId];
    if (!child) continue;

    // If child has text content that's not placeholder
    const children = child?.props?.children;
    if (
      typeof children === "string" &&
      children.trim() !== "" &&
      !children.includes("Drag the blocks in this box")
    ) {
      return false;
    }

    // If this child has deeper children, check them recursively
    if (child.nodes && child.nodes.length > 0) {
      if (!isCanvasTrulyEmpty(data, childId)) {
        return false;
      }
    }
  }

  // If we looped through all children and found nothing
  return node.nodes.length === 0;
}
