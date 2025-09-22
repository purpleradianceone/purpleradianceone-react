/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import Button from "../../ui/Button";
import { AlignCenter, AlignLeft, AlignRight, Trash2 } from "lucide-react";
import FormInput from "../../ui/FormInput";

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
      <div className="absolute top-0 right-0 w-fit h-fit">
        <Button onClick={handleDelete}>
          <div className="flex items-center justify-center gap-1">
            <Trash2 size={14} />
            Delete Image Block
          </div>
        </Button>
      </div>

      {/* Image with Resizable */}
      <div className="mt-5"
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
        <FormInput
          type="text"
          label="Image URL"
          placeholder="Enter Image URL"
          value={preview}
          onChange={handleUrlChange}
        />
        {/* <input type="file" accept="image/*" onChange={handleFileChange} /> */}
        <div style={{ marginTop: "10px" }}>
          <label className="table-header-custom">Alignment:</label>
          <div className="flex gap-2">
            <div className="w-fit">
            <Button
              onClick={() => handleAlignmentChange("left")}
            >
              
              <div className="flex items-center justify-center gap-1">
            <AlignLeft size={14} />
            Left
          </div>
            </Button>
          </div>
          <div className="w-fit">
            <Button
              onClick={() => handleAlignmentChange("center")}
            >
             
               <div className="flex items-center justify-center gap-1">
            <AlignCenter size={14} />
             Center
          </div>
            </Button>
          </div>

          <div className="w-fit">
            <Button
              onClick={() => handleAlignmentChange("right")}
            >
               <div className="flex items-center justify-center gap-1">
            <AlignRight size={14} />
             Right
          </div>
              
            </Button>
          </div>
          </div>
          
        </div>
      </div>
    </div>
  );
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
