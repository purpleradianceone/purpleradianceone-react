/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNode, useEditor, Element } from "@craftjs/core";

export const SectionBlock: React.FC = () => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    id,
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  const { actions: editorActions } = useEditor();

  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);

  const [tempBackground, setTempBackground] = useState(props.background || "#f7f7f7");
  const [tempPadding, setTempPadding] = useState(props.padding || "20px");
  const [tempAlign, setTempAlign] = useState(props.align || "left");

  const handleSave = () => {
    setProp((props: any) => {
      props.background = tempBackground;
      props.padding = tempPadding;
      props.align = tempAlign;
    });
    setEditing(false);
  };

  const handleDelete = () => {
    editorActions.delete(id);
  };

  return (
    <div
      ref={(ref: HTMLDivElement) => {
        if (ref) connect(drag(ref));
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: props.align,
        padding: props.padding,
        backgroundColor: props.background,
        border: "1px dashed #ccc",
        cursor: "move",
        position: "relative",
        marginBottom: "20px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {hovered && (
        <div style={{ position: "absolute", top: "-10px", left: "-10px", display: "flex", gap: "6px", zIndex: 10 }}>
          <button
            onClick={() => setEditing(true)}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              cursor: "pointer",

            }}
            title="Edit Section"
          >
            ✎
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: "#dc3545",
              color: "#fff",
              border: "none",
              width: "140px",
              height: "25px",
              borderRadius: "4px", 
              cursor: "pointer",
            }}
            title="Delete Section"
          >
            Section Block 🗑
          </button>
        </div>
      )}

      {editing && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <label>
            Padding:
            <input
              type="text"
              value={tempPadding}
              onChange={(e) => setTempPadding(e.target.value)}
            />
          </label>
          <label>
            Background:
            <input
              type="color"
              value={tempBackground}
              onChange={(e) => setTempBackground(e.target.value)}
            />
          </label>
          <label>
            Align:
            <select
              value={tempAlign}
              onChange={(e) => setTempAlign(e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleSave}>✅</button>
            <button onClick={() => setEditing(false)}>❌</button>
          </div>
        </div>
      )}

      <Element
        id="section-content"
        is="div"
        canvas
        style={{
          width: "100%",
          boxSizing: "border-box",
          minHeight: "50px",
        }}
      />
    </div>
  );
};

(SectionBlock as any).craft = {
  displayName: "Section Block",
  props: {
    background: "#f7f7f7",
    padding: "20px",
    align: "center",
  },
};
