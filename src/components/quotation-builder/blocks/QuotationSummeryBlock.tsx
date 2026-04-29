/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { Edit, Save, Trash2 } from "lucide-react";
import Button from "../../ui/Button";
import { SIZE } from "../../../constants/AppConstants";
import CurrencyUtil from "../utils/CurrencyUtil";

/* =====================================================
   TYPES
===================================================== */
type SummaryRow = {
  label: string;
  value: number;
  highlight?: boolean;
};

/* =====================================================
   HELPERS
===================================================== */
const num = (value: any, fallback = 0): number => {
  const n = Number(value);
  return isNaN(n) ? fallback : n;
};

const money = (value: any): string => num(value).toFixed(2);

/* =====================================================
   COMPONENT
===================================================== */
export const QuotationSummeryBlock: React.FC = () => {
  const {
    id,
    connectors: { connect, drag },
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  const { actions, query } = useEditor();

  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);

  /* =====================================================
     AUTO READ TABLE TOTALS
  ===================================================== */
  const totals = useMemo(() => {
    let rows: any[] = [];

    const nodes = query.getNodes();

    Object.values(nodes).forEach((node: any) => {
      if (
        node?.data?.name === "Quotation Table" ||
        node?.data?.displayName === "Quotation Table"
      ) {
        rows = node?.data?.props?.rows ?? [];
      }
    });

    let basic = 0;
    let discount = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let cess = 0;
    let total = 0;

    rows.forEach((r: any) => {
      const qty = num(r.quantity, 1);
      const basicCost = num(r.basicValue ?? r.price);
      const discP = num(r.discountPercent ?? r.discount);
      const cgp = num(r.cgstPercent ?? r.cgst);
      const sgp = num(r.sgstPercent ?? r.gst);
      const igp = num(r.igstPercent ?? r.igst);
      const cesp = num(r.cessPercent);

      const rowBasic = qty * basicCost;
      const discAmt = (rowBasic * discP) / 100;
      const taxable = rowBasic - discAmt;

      const cg = (taxable * cgp) / 100;
      const sg = (taxable * sgp) / 100;
      const ig = (taxable * igp) / 100;
      const ce = (taxable * cesp) / 100;

      const rowTotal = taxable + cg + sg + ig + ce;

      basic += rowBasic;
      discount += discAmt;
      cgst += cg;
      sgst += sg;
      igst += ig;
      cess += ce;
      total += rowTotal;
    });

    const tax = cgst + sgst + igst + cess;

    return {
      basic,
      discount,
      cgst,
      sgst,
      igst,
      cess,
      tax,
      total,
    };
  }, [query, actions]);

  const amountInWords = useMemo(() => {
    return CurrencyUtil.formatInr(totals.total);
  }, [totals.total]);

  /* =====================================================
     SUMMARY ROWS
  ===================================================== */
  const rows: SummaryRow[] = [
    { label: "Basic Value", value: totals.basic },
    { label: "Total Discount", value: totals.discount },
    { label: "CGST", value: totals.cgst },
    { label: "SGST", value: totals.sgst },
    { label: "IGST", value: totals.igst },
    { label: "Cess", value: totals.cess },
    { label: "Total Tax Amount", value: totals.tax },
    {
      label: "Total Quotation Amount",
      value: totals.total,
      highlight: true,
    },
  ];

  /* =====================================================
     UPDATE TERMS
  ===================================================== */
  const updateTerms = (value: string) => {
    setProp((p: any) => {
      p.terms = value;
    });
  };

  /* =====================================================
       CTRL + S
    ===================================================== */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={() => setEditing(true)}
      style={{
        position: "relative",
        width: "100%",
        marginTop: "12px",
        border: "1px solid #d1d5db",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {/* TOP ACTIONS */}
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
              {editing ? "Save" : "Edit"}
            </Button>
          </div>

          {editing && (
            <div
              style={{
                position: "absolute",
                left: "27%",
                transform: "translateX(-50%)",
                top: 8,
                zIndex: 10,
              }}
            >
              {/* CHANGED: Dropdown instead of Button */}
              <select
                value={props.fontFamily || "Arial"}
                onChange={(e) =>
                  setProp((p: any) => {
                    p.fontFamily = e.target.value;
                  })
                }
                style={{
                  height: "34px",
                  padding: "0 10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <option value="Arial">Arial</option>
                <option value="Roboto">Roboto</option>
                <option value="Times-Roman">Times-Roman</option>
                <option value="Cambria">Cambria</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Courier">Courier</option>

                <option value="Verdana">Verdana</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Georgia">Georgia</option>
                <option value="Trebuchet MS">Trebuchet MS</option>

                <option value="Calibri">Calibri</option>
                {/* <option value="Garamond">Garamond</option>
                <option value="Book Antiqua">Book Antiqua</option>

                <option value="Palatino Linotype">Palatino Linotype</option>
                <option value="Courier New">Courier New</option>
                <option value="Lucida Sans Unicode">Lucida Sans Unicode</option>

                <option value="Segoe UI">Segoe UI</option>
                <option value="Noto Sans">Noto Sans</option>
                <option value="DejaVu Sans">DejaVu Sans</option> */}
              </select>
            </div>
          )}

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
              Delete
            </Button>
          </div>
        </>
      )}

      {/* BODY */}
      <div
        style={{
          display: "flex",
          width: "100%",
          marginTop: "48px",
          minHeight: "220px",
          fontFamily: props.fontFamily,
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            width: "65%",
            borderRight: "1px solid #d1d5db",
            padding: "10px",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: "8px",
              fontSize: "14px",
              textAlign: "left",
              fontFamily: props.fontFamily,
            }}
          >
            Terms & Conditions
          </div>

          {editing ? (
            <textarea
              value={props.terms}
              onChange={(e) => updateTerms(e.target.value)}
              style={{
                width: "100%",
                minHeight: "180px",
                border: "none",
                outline: "none",
                resize: "none",
                fontSize: "12px",
                textAlign: "left",
                fontFamily: props.fontFamily,
              }}
            />
          ) : (
            <div
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "12px",
                lineHeight: "1.6",
                textAlign: "left",
                fontFamily: props.fontFamily,
              }}
            >
              {props.terms}
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            width: "35%",
          }}
        >
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 100px",
                borderBottom: "1px solid #d1d5db",
                background: row.highlight ? "#f3f4f6" : "#fff",
                color: "#111",
                fontWeight: row.highlight ? 700 : 500,
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  padding: "8px",
                  borderRight: "1px solid #d1d5db",
                  textAlign: "left",
                }}
              >
                {row.label}
              </div>

              <div
                style={{
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                {money(row.value)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          borderTop: "1px solid #d1d5db",
          padding: "10px",
          fontSize: "12px",
          lineHeight: "1.6",
          textAlign: "left",
          background: "#fff",
        }}
      >
        <strong>Amount in Words:</strong>
        <br />
        {amountInWords}
      </div>
    </div>
  );
};

/* =====================================================
   CRAFT CONFIG
===================================================== */
(QuotationSummeryBlock as any).craft = {
  displayName: "Quotation Summary",

  props: {
    terms: `
    1. Payment within 7 days.
    2. Material once sold will not be taken back.
    3. Taxes extra as applicable.
    4. Delivery within 5 working days.`,
  },

  fontFamily: "Arial",

  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
