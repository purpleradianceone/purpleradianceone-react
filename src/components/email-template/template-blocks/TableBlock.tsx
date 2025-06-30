/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Element, useNode, useEditor } from "@craftjs/core";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

type TableBlockProps = {
  width?: number;
  height?: number;
};

export const TableBlock: React.FC<TableBlockProps> = ({ width = 600, height = 300 }) => {
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
      columns: colIndexes.size > 0 ? Math.max(...Array.from(colIndexes)) + 1 : 2,
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
  const removeColumn = () => columns > 1 && setColumns((c) => c - 1);

  useEffect(() => {
    // Prevent overwriting restored layout on update
    setRows(initialGrid.rows);
    setColumns(initialGrid.columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          padding: "40px",
          borderRadius: "8px",
          background: "#f9f9f9",
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


// /* eslint-disable @typescript-eslint/no-explicit-any */


// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
// import { Element, useNode, useEditor } from "@craftjs/core";
// import { ResizableBox } from "react-resizable";
// import "react-resizable/css/styles.css";

// type TableBlockProps = {
//   width?: number;
//   height?: number;
// };

// export const TableBlock: React.FC<TableBlockProps> = ({ width = 600, height = 300 }) => {
//   const { connectors, id } = useNode();
//   const { actions } = useEditor();

//   const [rows, setRows] = useState(2);
//   const [columns, setColumns] = useState(2);

//   const tableStyle: React.CSSProperties = {
//     borderCollapse: "collapse",
//     width: "100%",
//     height: "100%",
//     backgroundColor: "transparent",
//   };

//   const cellStyle: React.CSSProperties = {
//     border: "1px solid #ccc",
//     padding: "4px",
//     textAlign: "center",
//     backgroundColor: "transparent",
//     minWidth: "100px",
//     verticalAlign: "top",
//   };

//   const handleDeleteTable = () => {
//     actions.delete(id);
//   };

//   const addColumn = () => setColumns((c) => c + 1);
//   const removeColumn = () => columns > 1 && setColumns((c) => c - 1);

//   return (
//     <ResizableBox
//       width={width}
//       height={height}
//       minConstraints={[300, 200]}
//       maxConstraints={[1000, 800]}
//       resizeHandles={["s", "e", "se"]}
//     >
//       <div
//         ref={(ref: HTMLDivElement | null) => {
//           if (ref) connectors.connect(connectors.drag(ref));
//         }}
//         style={{
//           width: "100%",
//           height: "100%",
//           border: "1px dashed #aaa",
//           padding: "40px",
//           borderRadius: "8px",
//           background: "transparent",
//           boxSizing: "border-box",
//         }}
//       >
//         <table style={tableStyle}>
//           <tbody>
//             {Array.from({ length: rows }).map((_, rowIndex) => (
//               <tr key={rowIndex}>
//                 {Array.from({ length: columns }).map((_, colIndex) => (
//                   <td key={colIndex} style={cellStyle}>
//                     <Element
//                       id={`table-cell-${rowIndex}-${colIndex}`}
//                       is="div"
//                       canvas
//                       style={{
//                         width: "100%",
//                         minHeight: "40px",
//                         padding: "4px",
//                         display: "block",
//                         background: "transparent",
//                       }}
//                     />
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Control Panel */}
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "8px",
//             marginTop: "10px",
//             justifyContent: "flex-end",
//           }}
//         >
//           <button onClick={() => setRows((r) => r + 1)}>➕ Row</button>
//           {rows > 1 && <button onClick={() => setRows((r) => r - 1)}>➖ Row</button>}
//           <button onClick={addColumn}>➕ Column</button>
//           {columns > 1 && <button onClick={removeColumn}>➖ Column</button>}
//           <button
//             onClick={handleDeleteTable}
//             style={{ backgroundColor: "#dc3545", color: "#fff", borderRadius: "4px" }}
//           >
//             🗑 Delete Table
//           </button>
//         </div>
//       </div>
//     </ResizableBox>
//   );
// };

// (TableBlock as any).craft = {
//   displayName: "Table Block",
// };
