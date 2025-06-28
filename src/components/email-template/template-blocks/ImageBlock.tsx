/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

type ImageBlockProps = {
  src: string;
  width: number;
  height: number;
  alignment: "left" | "center" | "right";
};

export const ImageBlock: React.FC<ImageBlockProps> = ({
  src,
  width = 200,
  height = 100,
  alignment = "center",
}) => {
  const {
    id,
    connectors: { connect, drag },
    actions: { setProp },
  } = useNode();

  const { actions } = useEditor();
  const [preview, setPreview] = useState<string>(src);

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const base64 = reader.result as string;
  //     setPreview(base64);
  //     setProp((props: any) => {
  //       props.src = base64;
  //     }, 500);
  //   };
  //   reader.readAsDataURL(file);
  // };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreview(url);
    setProp((props: any) => {
      props.src = url;
    }, 500);
  };

  const handleAlignmentChange = (newAlignment: "left" | "center" | "right") => {
    setProp((props: any) => {
      props.alignment = newAlignment;
    }, 500);
  };

  const handleResizeStop = (
    _event: unknown,
    data: { size: { width: number; height: number } }
  ) => {
    setProp((props: any) => {
      props.width = data.size.width;
      props.height = data.size.height;
    }, 500);
  };

  const handleDelete = () => actions.delete(id);

  const alignmentStyles: Record<string, React.CSSProperties> = {
    left: { justifyContent: "flex-start" },
    center: { justifyContent: "center" },
    right: { justifyContent: "flex-end" },
  };

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        position: "relative",
        padding: "20px",
        border: "1px dashed #ccc",
        cursor: "move",
        background: "transparent",
      }}
    >
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          background: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          fontSize: "14px",
          cursor: "pointer",
          // zIndex: 10,
        }}
      >
        ✕
      </button>

      {/* Image with Resizable */}
      <div
        style={{
          display: "flex",
          ...alignmentStyles[alignment],
        }}
      >
        <ResizableBox
          width={width}
          height={height}
          minConstraints={[100, 100]}
          maxConstraints={[1000, 600]}
          onResizeStop={handleResizeStop}
          resizeHandles={["se"]}
        >
          <img
            src={preview}
            alt="Uploaded"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        </ResizableBox>
      </div>

      {/* Controls */}
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Enter image URL"
          value={preview}
          onChange={handleUrlChange}
          style={{
            width: "100%",
            marginBottom: "8px",
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        {/* <input type="file" accept="image/*" onChange={handleFileChange} /> */}

        <div style={{ marginTop: "10px" }}>
          <label style={{ marginRight: "10px" }}>Alignment:</label>
          <button onClick={() => handleAlignmentChange("left")} style={buttonStyle}>
            Left
          </button>
          <button onClick={() => handleAlignmentChange("center")} style={buttonStyle}>
            Center
          </button>
          <button onClick={() => handleAlignmentChange("right")} style={buttonStyle}>
            Right
          </button>
        </div>
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  padding: "6px 10px",
  marginRight: "6px",
  fontSize: "14px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

(ImageBlock as any).craft = {
  displayName: "Image Block",
  props: {
    src: "https://via.placeholder.com/600x200",
    width: 600,
    height: 200,
    alignment: "center",
  },
};
