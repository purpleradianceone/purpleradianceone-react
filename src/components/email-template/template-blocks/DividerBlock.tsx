/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

export const DividerBlock: React.FC = () => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    id,
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  const { actions } = useEditor();
  const [hovered, setHovered] = useState(false);

  // Destructure props for customization
  const { width = 400, color = "#ccc", thickness = 1, margin = "10px 0" } = props;

  return (
    <div
      ref={(ref: HTMLDivElement) => {
        if (ref) connect(drag(ref));
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "20px",
        textAlign: "center",
        cursor: "move",
      }}
    >
      {/* Delete Button */}
      {hovered && (
        <button
          onClick={() => actions.delete(id)}
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            background: "#ff5f5f",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            cursor: "pointer",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
          }}
        >
          ×
        </button>
      )}

      {/* Resizable Divider */}
      <ResizableBox
        width={width}
        height={thickness}
        minConstraints={[100, 1]}
        maxConstraints={[1000, 1]} // Adjust max size if necessary
        axis="x"
        onResizeStop={(e, data) => {
          e.preventDefault();
          setProp((props: any) => {
            props.width = data.size.width;
          });
        }}
        resizeHandles={["e", "w"]}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <hr
          style={{
            width: "100%",
            border: "none",
            borderTop: `${thickness}px solid ${color}`,
            margin: margin,
          }}
        />
      </ResizableBox>
    </div>
  );
};

(DividerBlock as any).craft = {
  displayName: "Divider Block",
  props: {
    width: 400,
    color: "#ccc", // default color
    thickness: 1,  // default thickness
    margin: "10px 0", // default margin
  },
};
