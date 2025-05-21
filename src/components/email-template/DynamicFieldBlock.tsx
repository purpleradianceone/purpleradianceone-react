/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { useDynamicFields } from "./DynamicFieldsContext"; // ⬅️ import this

interface DynamicFieldBlockProps {
  name: string;
  color: string;
  fontSize: string;
  borderStyle: string;
  backgroundColor: string;
}

export const DynamicFieldBlock: React.FC<Partial<DynamicFieldBlockProps>> = ({
  name = "full_name",
  color = "#000000",
  fontSize = "14px",
  borderStyle = "1px dashed #888",
  backgroundColor = "#fafafa",
}) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    id,
  } = useNode();

  const { actions: editorActions } = useEditor();
  const [editing, setEditing] = useState(false);
  const availableFields = useDynamicFields(); // ⬅️ Use context

  const handleSelectField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newField = e.target.value;
    setProp((props: Partial<DynamicFieldBlockProps>) => {
      props.name = newField;
    });
    setEditing(false);
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        padding: "6px 10px",
        border: borderStyle,
        borderRadius: "4px",
        fontSize,
        color,
        backgroundColor,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        cursor: "move",
      }}
    >
      {editing ? (
        availableFields.length > 0 ? (
          <select value={name} onChange={handleSelectField}>
            {availableFields.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        ) : (
          <span style={{ color: "gray" }}>No dynamic fields available</span>
        )
      ) : (
        <span>{`{{${name}}}`}</span>
      )}

      <button
        style={{
          fontSize: "12px",
          padding: "2px 6px",
          cursor: "pointer",
          backgroundColor: "#eee",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setEditing((prev) => !prev);
        }}
      >
        ✏️
      </button>

      <button
        style={{
          fontSize: "12px",
          padding: "2px 6px",
          cursor: "pointer",
          backgroundColor: "#ffe6e6",
          border: "1px solid #cc0000",
          color: "#cc0000",
          borderRadius: "4px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          editorActions.delete(id);
        }}
      >
        🗑
      </button>
    </div>
  );
};

(DynamicFieldBlock as any).craft = {
  displayName: "Dynamic Field",
  props: {
    name: "company_name",
    fontSize: "14px",
    color: "#000000",
    backgroundColor: "transparent",
    borderStyle: "0px dashed #888",
  },
};
