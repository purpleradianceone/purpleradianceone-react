/* eslint-disable @typescript-eslint/no-explicit-any */
// blocks/DocumentCanvasQuotation.tsx
import { useNode } from "@craftjs/core";
import { useUserPreference } from "../../../context/user/UserPreference";

export const DocumentCanvasQuotation = ({ children }: any) => {
  const { connectors: { connect } } = useNode();

  const{userPreference} = useUserPreference();

  return (
    <div
      ref={(ref) => ref && connect(ref)}
      className="flex flex-col items-center gap-8"
            style={{
            minWidth: `${(userPreference.isLeftMenu && userPreference.sidebarOpen)?"900px":"700px"}`,
            minHeight: "800px",
            border: "2px dashed #ccc",
            padding: `${(userPreference.isLeftMenu && userPreference.sidebarOpen)?"10px":"50px"}`,
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
