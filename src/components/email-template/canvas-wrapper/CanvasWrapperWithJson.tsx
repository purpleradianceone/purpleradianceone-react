/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Frame, Element } from "@craftjs/core";
import { useEffect } from "react";

export const CanvasWrapperWithJson = ({ data }: { data: string }) => {
  let isEmpty = isCanvasTrulyEmpty(data, "ROOT");

  useEffect(() => {
    isEmpty = isCanvasTrulyEmpty(data, "ROOT");
  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      <Frame data={data}>
        <Element
          is="div"
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
      {!isEmpty ? (
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
          📦 Drag the blocks here 👉
        </div>
      ) : null}
    </div>
  );
};

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
