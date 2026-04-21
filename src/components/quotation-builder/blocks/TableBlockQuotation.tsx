/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { Trash2, Plus, Edit, Save } from "lucide-react";
import Button from "../../ui/Button";
import { SIZE } from "../../../constants/AppConstants";
import  CurrencyUtil   from "../utils/CurrencyUtil";


/* =====================================================
   TYPES
===================================================== */
type Row = {
  companyProductName?: string;
  hsn?: string;
  sac?: string;

  quantity?: number;
  rate?: number;

  basicValue?: number;

  discountPercent?: number;
  discountAmount?: number;

  taxableValue?: number;

  cgstPercent?: number;
  sgstPercent?: number;
  cessPercent?: number;

  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  cessAmount?: number;

  totalTax?: number;
  totalAmount?: number;
};

/* =====================================================
   HELPERS
===================================================== */

/* ✅ NEW: Prevent undefined / null / NaN */
const num = (value: any, fallback = 0): number => {
  const n = Number(value);
  return isNaN(n) ? fallback : n;
};

/* ✅ NEW: Safe toFixed */
const money = (value: any, digits = 2): string => {
  return num(value).toFixed(digits);
};

/* ✅ NEW: Old templates compatibility */
const normalizeRow = (row: any): Row => ({
  companyProductName: row?.companyProductName ?? row?.productName ?? "",

  hsn: row?.hsn ?? "",
  sac: row?.sac ?? "",

  quantity: num(row?.quantity, 1),

  rate: num(row?.rate ?? row?.price, 0),

  basicValue: num(row?.basicValue),

  discountPercent: num(row?.discountPercent ?? row?.discount, 0),

  discountAmount: num(row?.discountAmount),

  taxableValue: num(row?.taxableValue),

  cgstPercent: num(row?.cgstPercent ?? row?.cgst, 9),

  sgstPercent: num(row?.sgstPercent ?? row?.gst, 9),

  cessPercent: num(row?.cessPercent, 0),

  cgstAmount: num(row?.cgstAmount),

  sgstAmount: num(row?.sgstAmount),

  igstAmount: num(row?.igstAmount),

  cessAmount: num(row?.cessAmount),

  totalTax: num(row?.totalTax),

  totalAmount: num(row?.totalAmount),
});

/* =====================================================
   COMPONENT
===================================================== */
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

  /* =====================================================
     CALCULATIONS
  ===================================================== */
  const calculatedRows = useMemo(() => {
    const rows = props?.rows ?? [];

    return rows.map((rawRow: any) => {
      const row = normalizeRow(rawRow);

      const basicValue = row.quantity! * row.rate!;

      const discountAmount = (basicValue * row.discountPercent!) / 100;

      const taxableValue = basicValue - discountAmount;

      const sgstAmount = (taxableValue * row.sgstPercent!) / 100;

      const cgstAmount = (taxableValue * row.cgstPercent!) / 100;

      const cessAmount = (taxableValue * row.cessPercent!) / 100;

      const totalTax = sgstAmount + cgstAmount + cessAmount;

      const totalAmount = taxableValue + totalTax;

      return {
        ...row,
        basicValue,
        discountAmount,
        taxableValue,
        sgstAmount,
        cgstAmount,
        cessAmount,
        totalTax,
        totalAmount,
      };
    });
  }, [props?.rows]);

  const grandTotal = useMemo(() => {
    return calculatedRows.reduce(
      (sum: number, row: any) => sum + num(row.totalAmount),
      0,
    );
  }, [calculatedRows]);

  const amountInWords = useMemo(() => {
    return CurrencyUtil.formatInr(grandTotal);
  }, [grandTotal]);

  /* =====================================================
     UPDATE CELL
  ===================================================== */
  const updateCell = (
    index: number,
    key: keyof Row,
    value: string | number,
  ) => {
    setProp((p: any) => {
      if (!p.rows) p.rows = [];

      if (!p.rows[index]) p.rows[index] = {};

      p.rows[index][key] =
        key === "companyProductName" || key === "hsn" || key === "sac"
          ? value
          : num(value);
    });
  };

  /* =====================================================
     ADD ROW
  ===================================================== */
  const addRow = () => {
    setProp((p: any) => {
      if (!p.rows) p.rows = [];

      p.rows.push({
        companyProductName: "",
        hsn: "",
        sac: "",

        quantity: 1,
        rate: 0,

        discountPercent: 0,

        cgstPercent: 4.5,
        sgstPercent: 4.5,
        cessPercent: 0,
      });
    });
  };

  /* =====================================================
     DELETE ROW
  ===================================================== */
  const deleteRow = (index: number) => {
    setProp((p: any) => {
      if (p.rows?.length) {
        p.rows.splice(index, 1);
      }
    });
  };

  /* =====================================================
     CTRL + S
  ===================================================== */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setEditing(false);
      }
    };

    window.addEventListener("keydown", handle);

    return () => window.removeEventListener("keydown", handle);
  }, []);

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      onDoubleClick={() => setEditing(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        background: "#fff",
        border: "1px solid #d8dee6",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {(hovered || editing) && (
        <>
          <div
            style={{
              position: "absolute",
              left: 8,
              top: 8,
              zIndex: 10,
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
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 10,
            }}
          >
            <Button onClick={() => actions.delete(id)}>
              <Trash2 size={SIZE.SIXTEEN} />
              Delete Table
            </Button>
          </div>
        </>
      )}

      <div
        style={{
          marginTop: "52px",
        }}
      >
        <table
          style={{
            width: "100%",
            tableLayout: "fixed",
            borderCollapse: "collapse",
            fontSize: "10px",
          }}
        >
          <thead>
            <tr>
              {[
                "Sr",
                "Product",
                "Qty",
                "Rate",
                "Basic",
                "Disc %",
                "Disc Amt",
                "Taxable",
                "SGST %",
                "CGST %",
                "Total",
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
                <td
                  style={{
                    ...cell,
                    position: "relative",
                  }}
                >
                  {i + 1}

                  {editing && (
                    <button
                      onClick={() => deleteRow(i)}
                      style={{
                        position: "absolute",
                        top: 1,
                        right: 1,
                        width: 14,
                        height: 14,
                      }}
                    >
                      <Trash2 size={8} />
                    </button>
                  )}
                </td>

                <td
                  style={{
                    ...cell,
                    textAlign: "left",
                  }}
                >
                  {editing ? (
                    <input
                      style={{
                        ...input,
                        textAlign: "left",
                      }}
                      value={row.companyProductName}
                      onChange={(e) =>
                        updateCell(i, "companyProductName", e.target.value)
                      }
                    />
                  ) : (
                    row.companyProductName
                  )}
                </td>

                <td style={cell}>
                  {editing ? (
                    <input
                      type="number"
                      style={input}
                      value={row.quantity}
                      onChange={(e) =>
                        updateCell(i, "quantity", e.target.value)
                      }
                    />
                  ) : (
                    row.quantity
                  )}
                </td>

                {/* <td style={cell}>{money(row.rate)}</td> */}

                <td style={cell}>
                  {editing ? (
                    <input
                      type="number"
                      style={input}
                      value={row.rate}
                      onChange={(e) =>
                        updateCell(i, "rate", e.target.value)
                      }
                    />
                  ) : (
                   money(row.rate)
                  )}
                </td>

                <td style={cell}>{money(row.basicValue)}</td>

                {/* <td style={cell}>{row.discountPercent}</td> */}

                <td style={cell}>
                  {editing ? (
                    <input
                      type="number"
                      style={input}
                      value={row.discountPercent}
                      onChange={(e) =>
                        updateCell(i, "discountPercent", e.target.value)
                      }
                    />
                  ) : (
                   row.discountPercent
                  )}
                </td>

                <td style={cell}>{money(row.discountAmount)}</td>

                <td style={cell}>{money(row.taxableValue)}</td>

                {/* <td style={cell}>{row.sgstPercent}</td> */}

                <td style={cell}>
                  {editing ? (
                    <input
                      type="number"
                      style={input}
                      value={row.sgstPercent}
                      onChange={(e) =>
                        updateCell(i, "sgstPercent", e.target.value)
                      }
                    />
                  ) : (
                   row.sgstPercent
                  )}
                </td>

                {/* <td style={cell}>{row.cgstPercent}</td> */}

                <td style={cell}>
                  {editing ? (
                    <input
                      type="number"
                      style={input}
                      value={row.cgstPercent}
                      onChange={(e) =>
                        updateCell(i, "cgstPercent", e.target.value)
                      }
                    />
                  ) : (
                   row.cgstPercent
                  )}
                </td>

                <td style={cell}>{money(row.totalAmount)}</td>
              </tr>
            ))}

            <tr>
              <td
                colSpan={10}
                style={{
                  ...cell,
                  fontWeight: 700,
                  textAlign: "right",
                }}
              >
                Grand Total
              </td>

              <td
                style={{
                  ...cell,
                  fontWeight: 700,
                }}
              >
                {money(grandTotal)}
              </td>
            </tr>

             {/* =====================================================
               CHANGE 3: ADD THIS BELOW GRAND TOTAL ROW
          ===================================================== */}
          <tr>
            <td
              colSpan={11}
              style={{
                textAlign: "left",
                padding: "8px",
                fontWeight: 600,
                lineHeight: "1.5",
                borderTop: "1px solid #ddd",
              }}
            >
              <strong>Amount in Words:</strong>
              <br />
              {amountInWords}
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      {editing && (
        <div
          style={{
            padding: "12px",
          }}
        >
          <Button onClick={addRow}>
            <Plus size={SIZE.SIXTEEN} />
            Add Item
          </Button>
        </div>
      )}
    </div>
  );
};

/* =====================================================
   STYLES
===================================================== */
const cell: React.CSSProperties = {
  border: "1px solid #edf1f5",
  padding: "4px",
  fontSize: "10px",
  textAlign: "center",
  verticalAlign: "middle",
};

const headerCell: React.CSSProperties = {
  ...cell,
  background: "#f8fafc",
  fontWeight: 700,
};

const input: React.CSSProperties = {
  width: "100%",
  border: "none",
  background: "transparent",
  fontSize: "10px",
  outline: "none",
};

/* =====================================================
   CRAFT CONFIG
===================================================== */
(TableBlockQuotation as any).craft = {
  displayName: "Quotation Table",
  props: {
    rows: [
      {
        companyProductName: "Product A",
        quantity: 1,
        rate: 100,
        discountPercent: 5,
        cgstPercent: 9,
        sgstPercent: 9,
      },
    ],
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};


