/* eslint-disable @typescript-eslint/no-explicit-any */
// blocks/DocumentCanvasQuotation.tsx
import { useNode } from "@craftjs/core";

export const DocumentCanvasQuotation = ({ children }: any) => {
  const { connectors: { connect } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(ref)}
      className="flex flex-col items-center gap-8"
                style={{
            minWidth: "700px",
            minHeight: "800px",
            border: "1px dashed #ccc",
            padding: "70px",
            position: "relative",
          }}
    >
      {children}
    </div>
  );
};

DocumentCanvasQuotation.craft = {
  displayName: "Quotation Document",
  rules: {
    canDrag: false,
    canMoveIn: (incoming: any[]) =>
      incoming.every(
        (n) => n.data.displayName === "Page Block"
      ),
  },
  
};
