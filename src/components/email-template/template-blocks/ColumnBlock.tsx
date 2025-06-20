/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Element, useNode, useEditor } from "@craftjs/core";
import { v4 as uuidv4 } from "uuid";

export const ColumnBlock: React.FC = () => {
  const { connectors, id } = useNode();
  const { actions } = useEditor();
  const [columns, setColumns] = useState<string[]>([uuidv4(), uuidv4()]);

  const deleteColumn = (idToDelete: string) => {
    setColumns((prev) => prev.filter((colId) => colId !== idToDelete));
  };

  const addColumn = () => {
    setColumns((prev) => [...prev, uuidv4()]);
  };

  const deleteEntireBlock = () => {
    actions.delete(id);
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) connectors.connect(connectors.drag(ref));
      }}
      style={{
        position: "relative",
        marginBottom: "20px",
        border: "1px solid #ddd",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "transparent",
      }}
    >
      {/* Delete Entire Block Button */}
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <button
          onClick={deleteEntireBlock}
          style={{
            padding: "8px 14px",
            fontSize: "14px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🗑️ Delete Column Block
        </button>
      </div>

      {/* Columns Container */}
      <div style={{ display: "flex", width: "100%", gap: "10px", flexWrap: "nowrap" }}>
        {columns.map((colId) => (
          <div
            key={colId}
            style={{
              flex: `0 0 calc(${100 / columns.length}% - ${(columns.length - 1) * 10 / columns.length}px)`,
              minWidth: 0,
              border: "1px dashed #ccc",
              padding: "20px",
              backgroundColor: "transparent",
              minHeight: "120px",
              position: "relative",
            }}
          >
            <Element id={colId} is="div" canvas style={{ minHeight: "100px" }} />

            {/* Delete Column Button */}
            {columns.length > 1 && (
              <button
                onClick={() => deleteColumn(colId)}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  cursor: "pointer",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Delete Column"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Column Button */}
      <div style={{ marginTop: "16px", textAlign: "right" }}>
        <button
          onClick={addColumn}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ➕ Add Column
        </button>
      </div>
    </div>
  );
};

(ColumnBlock as any).craft = {
  displayName: "Column Block",
};
