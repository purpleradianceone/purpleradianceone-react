/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

interface ButtonBlockProps {
  text: string;
  href: string;
  align: "left" | "center" | "right";
  bgColor: string;
  textColor: string;
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  icon: string;
}

export const ButtonBlock: React.FC = () => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    id,
    props,
  } = useNode((node) => ({
    props: node.data.props as ButtonBlockProps,
  }));

  const { actions } = useEditor();
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);

  const [tempText, setTempText] = useState(props.text || "Click Me");
  const [tempUrl, setTempUrl] = useState(props.href || "#");
  const [tempAlign, setTempAlign] = useState<ButtonBlockProps["align"]>(
    props.align || "center"
  );
  const [tempBgColor, setTempBgColor] = useState(props.bgColor || "#007bff");
  const [tempTextColor, setTempTextColor] = useState(props.textColor || "#ffffff");
  const [tempFontSize, setTempFontSize] = useState(props.fontSize || "16px");
  const [tempFontWeight, setTempFontWeight] = useState(props.fontWeight || "normal");
  const [tempFontFamily, setTempFontFamily] = useState(props.fontFamily || "inherit");
  const [tempIcon, setTempIcon] = useState(props.icon || "");

  const handleSave = () => {
    setProp((props: any) => {
      props.text = tempText;
      props.href = tempUrl;
      props.align = tempAlign;
      props.bgColor = tempBgColor;
      props.textColor = tempTextColor;
      props.fontSize = tempFontSize;
      props.fontWeight = tempFontWeight;
      props.fontFamily = tempFontFamily;
      props.icon = tempIcon;
    });
    setEditing(false);
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) connect(drag(ref));
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        border: "1px dashed #ccc",
        padding: "10px",
        cursor: "move",
        textAlign: props.align,
      }}
    >
      {hovered && (
        <>
          <button onClick={() => actions.delete(id)} style={btnStyle("#ff5f5f", "right")}>
            ×
          </button>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              style={btnStyle("#007bff", "left")}
              title="Edit Button"
            >
              ✎
            </button>
          )}
        </>
      )}

      {editing && (
        <div style={editPanelStyle}>
          <input
            placeholder="Button Text"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
          />
          <input
            placeholder="Button URL"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
          />
          <select value={tempAlign} onChange={(e) => setTempAlign(e.target.value as any)}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
          <label>
            Background Color
            <input type="color" value={tempBgColor} onChange={(e) => setTempBgColor(e.target.value)} />
          </label>
          <label>
            Text Color
            <input type="color" value={tempTextColor} onChange={(e) => setTempTextColor(e.target.value)} />
          </label>
          <input
            placeholder="Font Family"
            value={tempFontFamily}
            onChange={(e) => setTempFontFamily(e.target.value)}
          />
          <input
            placeholder="Font Size (e.g., 16px)"
            value={tempFontSize}
            onChange={(e) => setTempFontSize(e.target.value)}
          />
          <select value={tempFontWeight} onChange={(e) => setTempFontWeight(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
          </select>
          <input
            placeholder="FontAwesome Icon Class (e.g. fa fa-star)"
            value={tempIcon}
            onChange={(e) => setTempIcon(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleSave}>✅</button>
            <button onClick={() => setEditing(false)}>❌</button>
          </div>
        </div>
      )}

      <ResizableBox
        width={200}
        height={50}
        minConstraints={[100, 40]}
        maxConstraints={[400, 100]}
        resizeHandles={["e", "s", "se"]}
      >
        <a
          href={props.href} 
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: props.bgColor,
            color: props.textColor,
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontWeight: props.fontWeight,
            textDecoration: "none",
            borderRadius: "4px",
            width: "100%",
            height: "100%",
            lineHeight: "30px",
            textAlign: "center",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }} target="_blank" rel="noreferrer"
        >
          {props.icon && <i className={props.icon} style={{ marginRight: "6px" }}></i>}
          {props.text}
        </a>
      </ResizableBox>
    </div>
  );
};

const btnStyle = (bg: string, position: "left" | "right"): React.CSSProperties => ({
  position: "absolute",
  top: "-10px",
  [position]: "-10px",
  background: bg,
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  cursor: "pointer",
  zIndex: 1,
});

const editPanelStyle: React.CSSProperties = {
  position: "absolute",
  top: "55px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#fff",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

(ButtonBlock as any).craft = {
  displayName: "Button Block",
  props: {
    text: "Click Me",
    href: "#",
    align: "center",
    bgColor: "#007bff",
    textColor: "#ffffff",
    fontSize: "16px",
    fontWeight: "normal",
    fontFamily: "inherit",
    icon: "",
  },
};


