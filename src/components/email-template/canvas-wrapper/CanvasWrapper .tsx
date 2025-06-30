/* eslint-disable @typescript-eslint/no-explicit-any */
import { Frame, Element, useEditor } from "@craftjs/core";
import { useEffect, useState } from "react";

export const CanvasWrapper = () => {
  const { query } = useEditor();
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const checkCanvasEmpty = () => {
      const serialized = query.serialize(); // returns a string
      const data = JSON.parse(serialized); // convert to object
      const result = isCanvasTrulyEmpty(data);
      setIsEmpty(result);
    };

    checkCanvasEmpty();
    const interval = setInterval(checkCanvasEmpty, 500); // keep checking

    return () => clearInterval(interval);
  }, [query]);

  return (
    <Frame>
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
      >
        {isEmpty && (
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "20%",
              transform: "translate(-50%, -50%)",
              fontSize: "18px",
              color: "#999",
              textAlign: "center",
              pointerEvents: "none",
              opacity: isEmpty?1:0,
              transition: "opacity 0.3s ease, z-index 0.3s ease",
            }}
          >
            📦 Drag the blocks here 👉
          </div>
        )}
      </Element>
    </Frame>
  );
};

function isCanvasTrulyEmpty(data: any): boolean {
  const childNodeIds = data?.ROOT?.nodes || [];

  // Check if there are only placeholders
  const realNodes = childNodeIds.filter((id: string) => {
    const node = data[id];
    const children = node?.props?.children;

    // If this is the placeholder, skip it
    if (typeof children === "string" && children.includes("Drag the blocks in this box")) {
      return false;
    }

    return true; // keep real nodes
  });

  return realNodes.length === 0;
}
