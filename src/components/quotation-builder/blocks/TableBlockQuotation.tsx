/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { Trash2, Plus, Edit, Save } from "lucide-react";
import Button from "../../ui/Button";
import { SIZE } from "../../../constants/AppConstants";

/* ================= TYPES ================= */
type Row = {
  productName: string;
  quantity: number;
  price: number;
  gst: number;
  cgst: number;
};

/* ================= COMPONENT ================= */
export const TableBlockQuotation: React.FC = () => {
  const {
    id,
    connectors: { connect, drag },
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  const { actions } = useEditor();
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);

  /* ================= CALCULATIONS ================= */
  const calculatedRows = useMemo(() => {
    return props.rows.map((row: Row) => {
      const total = row.quantity * row.price;
      const gstAmount = (total * row.gst) / 100;
      const cgstAmount = (total * row.cgst) / 100;
      const effectivePrice = total + gstAmount + cgstAmount;

      return {
        ...row,
        total,
        effectivePrice,
      };
    });
  }, [props.rows]);

  const grandTotal = useMemo(
    () =>
      calculatedRows.reduce((sum: number, r: any) => sum + r.effectivePrice, 0),
    [calculatedRows],
  );

  /* ================= UPDATE CELL ================= */
  const updateCell = (
    index: number,
    key: keyof Row,
    value: string | number,
  ) => {
    setProp((p: any) => {
      p.rows[index][key] = key === "productName" ? value : Number(value);
    });
  };

  /* ================= ADD ROW ================= */
  const addRow = () => {
    setProp((p: any) => {
      p.rows.push({
        productName: "",
        quantity: 1,
        price: 0,
        gst: 9,
        cgst: 9,
      });
    });
  };

    //For Ctrl+s
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "s") {
         setEditing(false);
        }
      };
  
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [actions]);

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      onDoubleClick={() => setEditing(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        background: "#fff",
        border: "1px solid #ddd",
        boxSizing: "border-box",
      }}
    >
      {/* ================= Hover and Editing Details ================= */}
      {(hovered || editing) && (
        <div className="group flex justify-between">
          <div
            className={`absolute left-0 -top-0 ${editing?"":"scale-75 group-hover:scale-100 transition-transform duration-200"}`}
            style={{
              zIndex: 9999,
            }}
          >
            <Button onClick={() => setEditing(!editing)}>
              {editing ? (
                <Save size={SIZE.SIXTEEN} />
              ) : (
                <Edit size={SIZE.SIXTEEN} />
              )}
              {editing ? "Save Table" : "Edit Table"}
            </Button>
          </div>

          <div
            className="absolute right-0 -top-0 scale-75 group-hover:scale-100 transition-transform duration-200"
            style={{
              zIndex: 9999,
            }}
          >
            <Button 
            type="button"
            onClick={() => actions.delete(id)}>
              <Trash2 size={SIZE.SIXTEEN} />
              Delete Table
            </Button>
          </div>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <table
        style={{
          width: "100%",
          maxWidth: "100%",
          tableLayout: "fixed", // KEY FOR A4
          borderCollapse: "collapse",
          fontSize: "12px",
        }}
      >
        {/* ================= COLUMN WIDTHS ================= */}
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "17%" }} />
        </colgroup>

        <thead>
          <tr>
            {[
              "Sr",
              "Product",
              "Qty",
              "Price",
              "Total",
              "GST %",
              "CGST %",
              "Effective Price",
            ].map((h) => (
              <th key={h} style={headerCell}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {calculatedRows.map((row: any, i: number) => (
            <tr key={i}>
              <td style={cell}>{i + 1}</td>

              <td style={cell}>
                <input
                  style={input}
                  value={row.productName}
                  onChange={(e) => updateCell(i, "productName", e.target.value)}
                />
              </td>

              <td style={cell}>
                <input
                  type="number"
                  style={input}
                  value={row.quantity}
                  onChange={(e) => updateCell(i, "quantity", e.target.value)}
                />
              </td>

              <td style={cell}>
                <input
                  type="number"
                  style={input}
                  value={row.price}
                  onChange={(e) => updateCell(i, "price", e.target.value)}
                />
              </td>

              <td style={cell}>{row.total.toFixed(2)}</td>

              <td style={cell}>
                <input
                  type="number"
                  style={input}
                  value={row.gst}
                  onChange={(e) => updateCell(i, "gst", e.target.value)}
                />
              </td>

              <td style={cell}>
                <input
                  type="number"
                  style={input}
                  value={row.cgst}
                  onChange={(e) => updateCell(i, "cgst", e.target.value)}
                />
              </td>

              <td style={cell}>{row.effectivePrice.toFixed(2)}</td>
            </tr>
          ))}

          {/* ================= GRAND TOTAL ================= */}
          <tr>
            <td colSpan={7} style={{ ...cell, fontWeight: 600 }}>
              Grand Total
            </td>
            <td style={{ ...cell, fontWeight: 600 }}>
              {grandTotal.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================= ADD ROW ================= */}
      {editing && (
        <div style={{ padding: "8px" }}>
          <Button onClick={addRow}>
            <Plus size={SIZE.SIXTEEN} /> Add Item
          </Button>
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */
const cell: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "6px",
  wordBreak: "break-word",
  whiteSpace: "normal",
  overflow: "hidden",
};

const headerCell: React.CSSProperties = {
  ...cell,
  background: "#f5f5f5",
  fontWeight: 600,
};

const input: React.CSSProperties = {
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  fontSize: "12px",
};

/* ================= CRAFT CONFIG ================= */
(TableBlockQuotation as any).craft = {
  displayName: "Quotation Table",
  props: {
    rows: [
      {
        productName: "Product A",
        quantity: 1,
        price: 100,
        gst: 9,
        cgst: 9,
      },
    ],
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
