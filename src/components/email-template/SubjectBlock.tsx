/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNode, useEditor } from "@craftjs/core";

export const SubjectBlock: React.FC = () => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    props,
    id,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  const { actions: editorActions } = useEditor();
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);

  const [localStyles, setLocalStyles] = useState({
    background: props.background,
    padding: props.padding,
    border: props.border,
    borderRadius: props.borderRadius,
    color: props.color,
  });

  const handleSave = () => {
    setProp((props: any) => {
      props.background = localStyles.background;
      props.padding = localStyles.padding;
      props.border = localStyles.border;
      props.borderRadius = localStyles.borderRadius;
      props.color = localStyles.color;
    });
    setEditing(false);
  };

  const handleDelete = () => {
    editorActions.delete(id);
  };

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: props.background,
        color: props.color,
        padding: props.padding,
        border: props.border,
        borderRadius: props.borderRadius,
        marginBottom: "10px",
        fontSize: "14px",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {hovered && (
        <div style={{ position: "absolute", top: -20, left: -10, zIndex: 10, display: "flex", gap: "6px" }}>
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
            title="Edit Subject Block"
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
          >
            Subject Block 🗑
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
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <label>
            Background:
            <input
              type="color"
              value={localStyles.background}
              onChange={(e) =>
                setLocalStyles({ ...localStyles, background: e.target.value })
              }
            />
          </label>
          <label>
            Text Color:
            <input
              type="color"
              value={localStyles.color}
              onChange={(e) =>
                setLocalStyles({ ...localStyles, color: e.target.value })
              }
            />
          </label>
          <label>
            Padding:
            <input
              type="text"
              value={localStyles.padding}
              onChange={(e) =>
                setLocalStyles({ ...localStyles, padding: e.target.value })
              }
            />
          </label>
          <label>
            Border:
            <input
              type="text"
              value={localStyles.border}
              onChange={(e) =>
                setLocalStyles({ ...localStyles, border: e.target.value })
              }
              placeholder="e.g., 1px solid #aaa"
            />
          </label>
          <label>
            Border Radius:
            <input
              type="text"
              value={localStyles.borderRadius}
              onChange={(e) =>
                setLocalStyles({ ...localStyles, borderRadius: e.target.value })
              }
              placeholder="e.g., 6px"
            />
          </label>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleSave}>✅</button>
            <button onClick={() => setEditing(false)}>❌</button>
          </div>
        </div>
      )}

      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: props.color }}>
        Email Subject
      </label>
      <input
        type="text"
        value={props.subject}
        onChange={(e) =>
          setProp((props: any) => (props.subject = e.target.value))
        }
        placeholder="Enter email subject..."
        style={{
          width: "100%",
          padding: "6px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          color: props.color,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};

(SubjectBlock as any).craft = {
  displayName: "Subject Line",
  props: {
    subject: "",
    background: "#fffbea",
    color: "#333333",
    padding: "10px",
    border: "1px solid #aaa",
    borderRadius: "6px",
  },
};
