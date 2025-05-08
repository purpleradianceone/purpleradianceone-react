/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Element, useNode, useEditor } from "@craftjs/core";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

type TableBlockProps = {
  width?: number;
  height?: number;
};

export const TableBlock: React.FC<TableBlockProps> = ({ width = 600, height = 300 }) => {
  const { connectors, id } = useNode();
  const { actions: editorActions } = useEditor();

  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);

  const tableStyle: React.CSSProperties = {
    borderCollapse: "collapse",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  };

  const cellStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "4px",
    textAlign: "center",
    backgroundColor: "transparent",
    minWidth: "100px",
    verticalAlign: "top",
  };

  const handleDeleteTable = () => {
    editorActions.delete(id);
  };

  const addColumn = () => setColumns((c) => c + 1);
  const removeColumn = () => columns > 1 && setColumns((c) => c - 1);

  return (
    <ResizableBox
      width={width}
      height={height}
      minConstraints={[300, 200]}
      maxConstraints={[1000, 800]}
      resizeHandles={["s", "e", "se"]}
    >
      <div
        ref={(ref: HTMLDivElement | null) => {
          if (ref) connectors.connect(connectors.drag(ref));
        }}
        style={{
          width: "100%",
          height: "100%",
          border: "1px dashed #aaa",
          padding: "10px",
          borderRadius: "8px",
          background: "transparent",
          boxSizing: "border-box",
        }}
      >
        <table style={tableStyle}>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} style={cellStyle}>
                    <Element
                      id={`table-cell-${rowIndex}-${colIndex}`}
                      is="div"
                      canvas
                      style={{
                        width: "100%",
                        minHeight: "40px",
                        padding: "4px",
                        display: "block",
                        background: "transparent",
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Control Panel */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "10px",
            justifyContent: "flex-end",
          }}
        >
          <button onClick={() => setRows((r) => r + 1)}>➕ Row</button>
          {rows > 1 && <button onClick={() => setRows((r) => r - 1)}>➖ Row</button>}
          <button onClick={addColumn}>➕ Column</button>
          {columns > 1 && <button onClick={removeColumn}>➖ Column</button>}
          <button
            onClick={handleDeleteTable}
            style={{ backgroundColor: "#dc3545", color: "#fff", borderRadius: "4px" }}
          >
            🗑 Delete Table
          </button>
        </div>
      </div>
    </ResizableBox>
  );
};

(TableBlock as any).craft = {
  displayName: "Table Block",
};
