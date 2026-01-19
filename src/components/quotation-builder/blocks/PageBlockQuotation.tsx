import { useNode } from "@craftjs/core";
import { ReactNode } from "react";

type PageProps = {
  padding?: number;
  backgroundColor?: string;
  children?: ReactNode;
};

export const PageBlockQuotation = ({
  padding = 40,
  backgroundColor = "#ffffff",
  children,
}: PageProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      style={{
        width: "794px",          // A4 width
        minHeight: "1123px",     // A4 height
        padding,
        backgroundColor,
        margin: "20px auto",
        boxShadow: "0 0 10px rgba(0,0,0,0.15)",
        pageBreakAfter: "always",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};

PageBlockQuotation.craft = {
  displayName: "Page (A4)",
  props: {
    padding: 40,
    backgroundColor: "#ffffff",
  },
  canvas: true,
  rules: {
    canMoveIn: () => true,
  },
};
