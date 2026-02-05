/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Element, useNode, useEditor } from "@craftjs/core";
import "react-resizable/css/styles.css";
import Button from "../../ui/Button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SIZE } from "../../../constants/AppConstants";

const buttonTextStyle = "input-label-custom-white";

type TableBlockProps = {
  width?: number;
  height?: number;
};

export const TableBlock: React.FC<TableBlockProps> = () => {
  const { connectors, id, linkedNodes } = useNode((node) => ({
    linkedNodes: (node.data.linkedNodes as Record<string, string>) || {},
  }));
  const { actions } = useEditor();

  // Dynamically detect rows/columns based on linkedNodes on mount
  const detectGridSize = () => {
    const cellKeys = Object.keys(linkedNodes || {});
    const rowIndexes = new Set<number>();
    const colIndexes = new Set<number>();

    for (const key of cellKeys) {
      const parts = key.split("-");
      if (parts.length >= 4) {
        const row = parseInt(parts[2]);
        const col = parseInt(parts[3]);
        if (!isNaN(row)) rowIndexes.add(row);
        if (!isNaN(col)) colIndexes.add(col);
      }
    }

    return {
      rows: rowIndexes.size > 0 ? Math.max(...Array.from(rowIndexes)) + 1 : 2,
      columns:
        colIndexes.size > 0 ? Math.max(...Array.from(colIndexes)) + 1 : 2,
    };
  };

  const initialGrid = detectGridSize();
  const [rows, setRows] = useState(initialGrid.rows);
  const [columns, setColumns] = useState(initialGrid.columns);

  const tableStyle: React.CSSProperties = {
    borderCollapse: "collapse",
    width: "100%",
    height: "100%",
    backgroundColor: "#f9f9f9",
  };

  const cellStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "4px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    minWidth: "100px",
    verticalAlign: "top",
  };

  const handleDeleteTable = () => {
    actions.delete(id);
  };

  const addColumn = () => setColumns((c) => c + 1);
  

const removeRow = () => {
  if (rows > 1) {
    // const lastRowIndex = rows - 1;
    // Delete all cells in the last row
    // for (let colIndex = 0; colIndex < columns; colIndex++) {
    //   const cellKey = `table-cell-${lastRowIndex}-${colIndex}`;
    //   const nodeId = linkedNodes[cellKey];
    //   if (nodeId) actions.delete(nodeId);
    // }

    setRows((r) => r - 1);
  }
};

const removeColumn = () => {
  if (columns > 1) {
    // const lastColIndex = columns - 1;
    // // Delete all cells in the last column
    // for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    //   const cellKey = `table-cell-${rowIndex}-${lastColIndex}`;
    //   const nodeId = linkedNodes[cellKey];
    //   if (nodeId) actions.delete(nodeId);
    // }

    setColumns((c) => c - 1);
  }
};


  useEffect(() => {
    // Prevent overwriting restored layout on update
    setRows(initialGrid.rows);
    setColumns(initialGrid.columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minWidth: "800px",
        width: "fit-content",
        // width: "1000px",
        height: "fit-content",
      }}
    >
      <div
        ref={(ref: HTMLDivElement | null) => {
          if (ref) connectors.connect(connectors.drag(ref));
        }}
        className="min-w-72 h-fit border border-dashed border-gray-400 p-4 rounded-lg bg-gray-50 box-border"
      >
        <div className="relative flex  justify-end items-center -top-4  -right-4 z-10">
          <div className="w-fit h-fit">
            <Button type="button" onClick={handleDeleteTable}>
              <div className="flex items-center justify-center gap-1">
                <Trash2 size={SIZE.SIXTEEN} />
                <span className={buttonTextStyle}>Table Block</span>
              </div>
            </Button>
          </div>
        </div>
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
          <div className="w-fit h-fit">
            <Button type="submit" onClick={(e) => {
              e.preventDefault();
              setRows((r) => r + 1);
            }}>
              <div className="flex items-center justify-center gap-1">
                <Plus size={SIZE.SIXTEEN} />
               <span className={buttonTextStyle}>Row</span>
              </div>
              </Button>
          </div>

          {rows > 1 && (
            <div className="w-fit h-fit">
              <Button type="button" onClick={() => removeRow()}>
              <div className="flex items-center justify-center gap-1">
                <Minus size={SIZE.SIXTEEN} />
               <span className={buttonTextStyle}>Row</span>
              </div>
               </Button>
            </div>
          )}
          <div className="w-fit h-fit">
            <Button type="submit" onClick={(e) => {
              e.preventDefault();
              addColumn();
            }}>
              <div className="flex items-center justify-center gap-1">
                <Plus size={SIZE.SIXTEEN} />
               <span className={buttonTextStyle}>Column</span>
              </div>
              </Button>
          </div>

          {columns > 1 && (
            <div className="w-fit h-fit">
              <Button type="button" onClick={removeColumn}>
                <div className="flex items-center justify-center gap-1">
                <Minus size={SIZE.SIXTEEN} />
               <span className={buttonTextStyle}>
                Column
              </span>
              </div>
                
                </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

(TableBlock as any).craft = {
  displayName: "Table Block",
};
