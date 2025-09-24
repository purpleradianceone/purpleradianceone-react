/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Element, useEditor, useNode } from "@craftjs/core";
import { v4 as uuidv4 } from "uuid";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import Button from "../../ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { SIZE } from "../../../constants/AppConstants";

interface ColumnBlockProps {
  columnIds?: string[];
}

interface ColumnBlockNodeProps {
  columnIds: string[];
}

export const ColumnBlock: React.FC<ColumnBlockProps> = ({ columnIds = [] }) => {
  const { actions, query } = useEditor();
  const { connectors, id } = useNode();
  const { linkedNodes, actions: nodeActions } = useNode((node) => ({
    columnIds: node.data.props.columnIds as string[],
    linkedNodes: (node.data.linkedNodes as Record<string, string>) || {},
    data: node.data,
  }));

  const [columns, setColumns] = useState<string[]>(
    columnIds.length > 0 ? columnIds : Object.keys(linkedNodes)
  );

  // Sync with Craft.js state
  useEffect(() => {
    const currentLinkedNodes = Object.keys(linkedNodes);
    if (JSON.stringify(currentLinkedNodes) !== JSON.stringify(columns)) {
      setColumns(currentLinkedNodes);
    }
  }, [linkedNodes]);

  // Update internal state if props change
  useEffect(() => {
    if (
      columnIds.length > 0 &&
      JSON.stringify(columnIds) !== JSON.stringify(columns)
    ) {
      setColumns(columnIds);
      nodeActions.setProp((props: ColumnBlockNodeProps) => {
        props.columnIds = columnIds;
      });
    }
  }, [columnIds, nodeActions, columns]);

  const addColumn = () => {
    let newId = uuidv4();
    if (columns.length !== 0) {
      const lastId = columns[columns.length - 1];
      let isNewIdIsLesserThanLastId: boolean = true;
      if (newId > lastId) {
        isNewIdIsLesserThanLastId = false;
      }
      while (isNewIdIsLesserThanLastId) {
        newId = uuidv4();
        if (newId > lastId) {
          isNewIdIsLesserThanLastId = false;
        }
      }
    }

    const newColumns = [...columns, newId];
    setColumns(newColumns);
    nodeActions.setProp((props: ColumnBlockNodeProps) => {
      props.columnIds = newColumns;
    });
  };

  const removeColumn = (columnId: string) => {
    if (columns.length <= 1) return;

    try {
      // First check if the node exists in the linkedNodes
      const nodeExists = linkedNodes[columnId] !== undefined;

      // Also check if it exists in the editor state
      const editorNodeExists = query.node(columnId).get();

      if (nodeExists || editorNodeExists) {
        try {
          actions.delete(columnId);
          actions.delete(linkedNodes[columnId][0]);
        } catch (deleteError) {
          console.warn(
            `Node ${columnId} couldn't be deleted from editor`,
            deleteError
          );
        }
      }

      // Always update our state to maintain consistency
      const newColumns = columns.filter((id) => id !== columnId);
      setColumns(newColumns);
      nodeActions.setProp((props: ColumnBlockNodeProps) => {
        props.columnIds = newColumns;
      });

      // Also clean up the linkedNodes reference
      nodeActions.setProp((props: any) => {
        if (props.linkedNodes && props.linkedNodes[columnId]) {
          const { [columnId]: _, ...rest } = props.linkedNodes;
          props.linkedNodes = rest;
        }
      });
    } catch (error) {
      console.error("Error in removeColumn:", error);
      // Fallback: still update our state
      const newColumns = columns.filter((id) => id !== columnId);
      setColumns(newColumns);
      nodeActions.setProp((props: ColumnBlockNodeProps) => {
        props.columnIds = newColumns;
      });
    }
  };

  const deleteEntireBlock = () => {
    try {
      actions.delete(id);
    } catch (error) {
      console.error("Error deleting block:", error);
    }
  };

  const [blockSize, setBlockSize] = useState({
    width: 800,
    height: "auto" as number | "auto",
  });

  const onResize = (
    _: unknown,
    { size }: { size: { width: number; height: number } }
  ) => {
    setBlockSize((prev) => ({
      ...prev,
      width: size.width,
      height: size.height > 0 ? size.height : "auto",
    }));
  };

  return (
    <Resizable
      width={blockSize.width}
      height={blockSize.height === "auto" ? 300 : blockSize.height}
      onResize={onResize}
      resizeHandles={["s", "e", "se"]}
      minConstraints={[500, 200]}
      maxConstraints={[1200, 800]}
    >
      <div
        ref={(ref: HTMLDivElement | null) => {
          if (ref) connectors.connect(connectors.drag(ref));
        }}
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#f9f9f9",
          position: "relative",
          width: `${blockSize.width}px`,
          height:
            blockSize.height === "auto" ? "auto" : `${blockSize.height}px`,
          minHeight: "200px",
          boxSizing: "border-box",
        }}
      >
        {/* Delete entire block */}
        <div className="flex justify-end items-end w-full mb-2">
          <div className="w-fit">
            <Button type="button" onClick={deleteEntireBlock}>
              <div className="flex items-center justify-center gap-1">
                <Trash2 size={SIZE.SIXTEEN} />
                Delete Column Block
              </div>
            </Button>
          </div>
        </div>

        {/* 📦 Columns */}
        <div style={{ display: "flex", gap: "10px" }}>
          {columns.map((columnId) => (
            <div
              key={columnId}
              style={{
                flex: "1",
                minHeight: "120px",
                border: "1px dashed #aaa",
                padding: "10px",
                position: "relative",
                backgroundColor: "#fff",
              }}
            >
              {/* Each column is a canvas zone */}
              <Element
                id={columnId}
                is="div"
                canvas
                style={{ minHeight: "80px" }}
              />
              {columns.length > 1 && (
                <div className="absolute top-1 right-1 w-fit ">
                  <Button
                    type="button"
                    onClick={() => removeColumn(columnId)}
                    title="Delete Column"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Trash2 size={SIZE.SIXTEEN} />
                    </div>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ➕ Add Column */}
        <div className="flex justify-end items-end mt-2 text-right w-full">
          <div className="w-fit">
            <Button type="submit" onClick={(e) => {
              e.preventDefault();
                addColumn();
            }}>
              <div className="flex items-center justify-center gap-1">
                <Plus size={SIZE.SIXTEEN} />
                Add Column
              </div>
            </Button>
          </div>
        </div>
      </div>
    </Resizable>
  );
};

(ColumnBlock as any).craft = {
  displayName: "Column Block",
  props: {
    columnIds: [],
  },
};

//2

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect } from "react";
// import { Element, useEditor, useNode } from "@craftjs/core";
// import { v4 as uuidv4 } from "uuid";
// import { Resizable } from "react-resizable";

// interface ColumnBlockProps {
//   columnIds?: string[];
// }

// export const ColumnBlock: React.FC<ColumnBlockProps> = ({ columnIds = [] }) => {
//     const { actions: editorActions } = useEditor();
// const {
//     connectors,
//     id,
//     linkedNodes,
//   } = useNode((node) => ({
//     columnIds: node.data.props.columnIds,
//     linkedNodes: node.data.linkedNodes,
//     data: node.data,
//   }));
// const [columns, setColumns] = useState<string[]>(columnIds.length > 0 ? columnIds : Object.keys(linkedNodes || {}));

//   // Update internal state if props change (during reload)
//   useEffect(() => {
//     if (columnIds.length > 0) {
//       setColumns(columnIds);
//     }
//   }, [columnIds]);

//   const addColumn = () => {
//     const newId = uuidv4();
//     setColumns((prev) => [...prev, newId]);
//   };

//   const removeColumn = (colId: string) => {
//     if (columns.length <= 1) return;
//     setColumns((prev) => prev.filter((id) => id !== colId));
//   };

//   const deleteEntireBlock = () => {
//     editorActions.delete(id);
//   };

//   const [blockSize, setBlockSize] = useState({
//     width: '100%',
//     height: 'auto',
//     maxWidth: 1200,  // Maximum width in pixels
//     maxHeight: 800   // Maximum height in pixels
//   });

//   const onResize = (event: any, { size }: { size: { width: number; height: number } }) => {
//     // Apply maximum size constraints
//     const constrainedWidth = Math.min(size.width, blockSize.maxWidth);
//     const constrainedHeight = Math.min(size.height, blockSize.maxHeight);

//     setBlockSize(prev => ({
//       ...prev,
//       width: `${constrainedWidth}px`,
//       height: constrainedHeight > 0 ? `${constrainedHeight}px` : 'auto'
//     }));
//   };

//   return (
//     <Resizable
//       width={parseInt(blockSize.width) || 800}
//       height={blockSize.height === 'auto' ? 0 : parseInt(blockSize.height) || 300}
//       onResize={onResize}
//       resizeHandles={['s', 'e', 'se']}
//       minConstraints={[300, 200]}
//       maxConstraints={[blockSize.maxWidth, blockSize.maxHeight]}
//     >
//     <div
//       ref={(ref: HTMLDivElement | null) => {
//         if (ref) connectors.connect(connectors.drag(ref));
//       }}
//       style={{
//         marginBottom: "20px",
//         border: "1px solid #ccc",
//         borderRadius: "8px",
//         padding: "16px",
//         backgroundColor: "#f9f9f9",
//         position: "relative",
//       }}
//     >
//       {/* 🗑️ Delete entire block */}
//       <div style={{ textAlign: "right", marginBottom: "10px" }}>
//         <button
//           onClick={deleteEntireBlock}
//           style={{
//             padding: "6px 12px",
//             fontSize: "13px",
//             backgroundColor: "#dc3545",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}
//         >
//           🗑️ Delete Column Block
//         </button>
//       </div>

//       {/* 📦 Columns */}
//       <div style={{ display: "flex", gap: "10px" }}>
//         {columns.map((colId) => (
//           <div
//             key={colId}
//             style={{
//               flex: "1",
//               minHeight: "120px",
//               border: "1px dashed #aaa",
//               padding: "10px",
//               position: "relative",
//               backgroundColor: "#fff",
//             }}
//           >
//             {/* Each column is a canvas zone */}
//             <Element id={colId} is="div" canvas style={{ minHeight: "80px" }} />

//             {/* ❌ Delete this column */}
//             {columns.length > 1 && (
//               <button
//                 onClick={() => removeColumn(colId)}
//                 style={{
//                   position: "absolute",
//                   top: 6,
//                   right: 6,
//                   backgroundColor: "#dc3545",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "50%",
//                   width: "26px",
//                   height: "26px",
//                   cursor: "pointer",
//                   fontSize: "16px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//                 title="Delete Column"
//               >
//                 ×
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* ➕ Add Column */}
//       <div style={{ marginTop: "16px", textAlign: "right" }}>
//         <button
//           onClick={addColumn}
//           style={{
//             padding: "6px 12px",
//             fontSize: "13px",
//             backgroundColor: "#007bff",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}
//         >
//           ➕ Add Column
//         </button>
//       </div>
//     </div>
//     </Resizable>
//   );

// };

// (ColumnBlock as any).craft = {
//   displayName: "Column Block",
//   props: {
//     columnIds: [],
//   },
// };

//1

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from "react";
// import { Element, useNode, useEditor } from "@craftjs/core";
// import { v4 as uuidv4 } from "uuid";

// type ColumnBlockProps = {
//   columnIds?: string[];
// };

// export const ColumnBlock: React.FC<ColumnBlockProps> = () => {
//   const {
//     connectors,
//     id,
//     data,
//     setProp,
//     linkedNodes,
//   } = useNode((node) => ({
//     columnIds: node.data.props.columnIds,
//     linkedNodes: node.data.linkedNodes,
//     data: node.data,
//   }));

//   const { actions: editorActions } = useEditor();
//   const [columns, setColumns] = useState<string[]>([]);

//   // ✅ On mount: use linkedNodes from saved JSON or default
//   useEffect(() => {
//     const initialColumnIds = data?.props?.columnIds;

//     if (initialColumnIds && initialColumnIds.length > 0) {
//       setColumns(initialColumnIds);
//     } else if (linkedNodes && Object.values(linkedNodes).length > 0) {
//       const restoredIds = Object.values(linkedNodes);
//       setColumns(restoredIds);
//       setProp((props: any) => {
//         props.columnIds = restoredIds;
//       });
//     } else {
//       // default 2 columns
//       const newIds = [uuidv4(), uuidv4()];
//       setColumns(newIds);
//       setProp((props: any) => {
//         props.columnIds = newIds;
//       });
//     }
//   }, []);

//   // Keep props in sync
//   useEffect(() => {
//     setProp((props: any) => {
//       props.columnIds = columns;
//     }, 500);
//   }, [columns]);

//   const addColumn = () => {
//     const newId = uuidv4();
//     setColumns((prev) => [...prev, newId]);
//   };

//   const deleteColumn = (colId: string) => {
//     setColumns((prev) => prev.filter((id) => id !== colId));
//   };

//   const deleteBlock = () => {
//     editorActions.delete(id);
//   };

//   return (
//     <div
//       ref={(ref) => ref && connectors.connect(connectors.drag(ref))}
//       style={{
//         position: "relative",
//         marginBottom: "20px",
//         border: "1px solid #ccc",
//         borderRadius: "8px",
//         padding: "16px",
//       }}
//     >
//       <div style={{ textAlign: "right", marginBottom: "10px" }}>
//         <button onClick={deleteBlock} style={{ backgroundColor: "#777", color: "#fff", borderRadius: "4px", padding: "6px 10px", cursor: "pointer" }}>
//           🗑️ Delete Block
//         </button>
//       </div>

//       <div style={{ display: "flex", gap: "10px" }}>
//         {columns.map((colId) => (
//           <div
//             key={colId}
//             style={{
//               flex: `1`,
//               minHeight: "100px",
//               border: "1px dashed #aaa",
//               padding: "10px",
//               position: "relative",
//             }}
//           >
//             {/* ✅ Render Element with linked node ID if present */}
//             <Element
//               id={linkedNodes?.[colId] || colId}
//               is="div"
//               canvas
//               style={{ minHeight: "80px" }}
//             />

//             {/* Delete Column */}
//             {columns.length > 1 && (
//               <button
//                 onClick={() => deleteColumn(colId)}
//                 style={{
//                   position: "absolute",
//                   top: 5,
//                   right: 5,
//                   backgroundColor: "#dc3545",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "50%",
//                   width: "24px",
//                   height: "24px",
//                   cursor: "pointer",
//                   fontSize: "14px",
//                 }}
//               >
//                 ×
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       <div style={{ marginTop: "10px", textAlign: "right" }}>
//         <button onClick={addColumn} style={{ backgroundColor: "#007bff", color: "#fff", borderRadius: "4px", padding: "6px 10px", cursor: "pointer" }}>
//           ➕ Add Column
//         </button>
//       </div>
//     </div>
//   );
// };

// (ColumnBlock as any).craft = {
//   displayName: "Column Block",
//   props: {
//     columnIds: [],
//   },
// };
