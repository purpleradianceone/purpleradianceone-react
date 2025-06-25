/* eslint-disable @typescript-eslint/no-explicit-any */
import { Frame, Element } from "@craftjs/core";

export const CanvasWrapperWithJson = ({ data }: { data: string }) => {
  const isEmpty = isCanvasTrulyEmpty(data);

  return (
    <Frame data={data}>
      <Element
        is="div"
        canvas
        id="ROOT"
        style={{
          border: "1px dashed #ccc",
          padding: "70px",
          minWidth: "800px",
          position: "relative",
          minHeight: "800px",
        }}
      >
        {isEmpty && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "18px",
              color: "#999",
              textAlign: "center",
              pointerEvents: "none",
              opacity: 1,
              transition: "opacity 0.3s ease, z-index 0.3s ease",
            }}
          >
            📦 Drag the blocks in this box
          </div>
        )}
      </Element>
    </Frame>
  );
};

function isCanvasTrulyEmpty(data: any): boolean {
  const childNodeIds = data?.ROOT?.nodes || [];

  const actualContentNodes = childNodeIds.filter((id: string) => {
    const node = data[id];
    const children = node?.props?.children;

    return !(typeof children === "string" && children.includes("Drag the blocks in this box"));
  });

  return actualContentNodes.length === 0;
}




