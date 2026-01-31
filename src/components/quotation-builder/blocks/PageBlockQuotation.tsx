/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Element, useEditor, useNode } from "@craftjs/core";
import { Save, X, Trash2, Edit } from "lucide-react";
import { SIZE } from "../../../constants/AppConstants";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import { HeaderBlockQuotation } from "./HeaderBlockQuotation";
import { FooterBlockQuotation } from "./FooterBlockQuotation";

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

export const PageBlockQuotation: React.FC = () => {
  const {
    id,
    connectors: { connect, drag },
    actions: { setProp },
    props,
    node,
  } = useNode((node) => ({
    props: node.data.props,
    node,
  }));

  const { actions, query } = useEditor();

  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tempPadding, setTempPadding] = useState(props.padding);
  const [tempBackground, setTempBackground] = useState(props.backgroundColor);
  const [tempAlign, setTempAlign] = useState(props.align);

  /* ---------- Detect Header / Footer ---------- */
  const childNodes = node.data.nodes || [];

  const hasHeader = childNodes.some(
    (id) => query.node(id).get().data.displayName === "Header Block",
  );
  const hasFooter = childNodes.some(
    (id) => query.node(id).get().data.displayName === "Footer Block",
  );

  const [isHeaderRequired, setIsHeaderRequired] = useState<boolean>(hasHeader);
  const [isFooterRequired, setIsFooterRequired] = useState<boolean>(hasFooter);

  const handleSave = () => {
    if (isHeaderRequired) {
      if (!hasHeader) {
        addHeader();
      }
    } else {
      console.log("else of isHeaderRequired");
      deleteHeader();
    }
    if (isFooterRequired) {
      if (!hasFooter) {
        addFooter();
      }
    } else {
      console.log("else of isFooterRequired");
      deleteFooter();
    }
    setProp((p: any) => {
      p.padding = tempPadding;
      p.backgroundColor = tempBackground;
      p.align = tempAlign;
      p.isHeader = isHeaderRequired;
      p.isFooter = isFooterRequired;
    });
    setEditing(false);
  };

  const addHeader = () => {
    const headerNode = query.createNode(
      <Element is={HeaderBlockQuotation} canvas />,
    );
    actions.add(headerNode, id);
  };
  const deleteHeader = () => {
    // const childNodeIds = query.node(id).descendants();
    // const headerNodeId = childNodeIds.find((childId) => {
    //   const node = query.node(childId).get();
    //   return node.data.type === HeaderBlockQuotation;
    // });
    // if (headerNodeId) {
    //   actions.delete(headerNodeId);
    // }
  };

  const deleteFooter = () => {
    // const childNodeIds = query.node(id).descendants();
    // const footerNodeId = childNodeIds.find((childId) => {
    //   const node = query.node(childId).get();
    //   return node.data.type === FooterBlockQuotation;
    // });
    // if (footerNodeId) {
    //   actions.delete(footerNodeId);
    // }
  };

  const addFooter = () => {
    const footerNode = query.createNode(
      <Element is={FooterBlockQuotation} canvas />,
    );
    actions.add(footerNode, id);
  };

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      style={{
        width: A4_WIDTH,
        height: A4_HEIGHT,
        backgroundColor: props.backgroundColor,
        margin: "24px auto",
        boxShadow: "0 0 10px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Toolbar */}
      {(hovered || editing) && (
        <div className="absolute w-full flex justify-between top-0 z-50">
          <div>
            <Button onClick={() => setEditing(true)}>
              <Edit size={SIZE.SIXTEEN} />
              Edit Page
            </Button>
          </div>
          <div>
            <Button type="button" onClick={() => actions.delete(id)}>
              <Trash2 size={SIZE.SIXTEEN} />
              Delete Page
            </Button>
          </div>
        </div>
      )}

      {/* Header (dynamic) */}
      {/* {node.data.nodes.map((childId) => {
        const child = query.node(childId).get();
        if (child.data.displayName === "Header Block") {
          return (
            <Element is={HeaderBlockQuotation} key={childId} id={childId} />
          );
        }
        return null;
      })} */}
      {props.isHeader && (
        <Element
          id={`${id}-header`}
          key={`${id}-header`}
          is={HeaderBlockQuotation}
        />
      )}

      {/* Body */}
      <div
        style={{
          flex: 1,
          padding: props.padding,
          textAlign: props.align,
          overflow: "hidden",
        }}
      >
        <Element
          id={`${id}-body`}
          is="div"
          canvas
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Footer (dynamic) */}
      {/* {node.data.nodes.map((childId) => {
        const child = query.node(childId).get();
        if (child.data.displayName === "Footer Block") {
          return <Element is={FooterBlockQuotation} id={childId} />;
        }
        return null;
      })} */}

      {props.isFooter && (
        <Element
          is={FooterBlockQuotation}
          id={`${id}-footer`}
          key={`${id}-footer`}
        />
      )}

      {/* Settings */}
      {editing && (
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            background: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "6px",
            zIndex: 100,
            width: "220px",
          }}
        >
          <FormInput
            label="Padding"
            placeholder="eg: 16px"
            value={tempPadding}
            onChange={(e) => setTempPadding(e.target.value)}
          />

          <label className="flex justify-between items-center mt-2">
            Background
            <input
              type="color"
              value={tempBackground}
              onChange={(e) => setTempBackground(e.target.value)}
            />
          </label>

          <label className="input-label-custom flex justify-between items-center">
            Align:
            <select
              className="caption-custom"
              value={tempAlign}
              onChange={(e) => setTempAlign(e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>

          <label className="input-label-custom flex justify-between items-center">
            Header:
            <input
              type="checkbox"
              checked={isHeaderRequired}
              onChange={(e) => {
                setIsHeaderRequired(e.target.checked);
              }}
            ></input>
          </label>

          <label className="input-label-custom flex justify-between items-center">
            Footer:
            <input
              type="checkbox"
              checked={isFooterRequired}
              onChange={(e) => {
                setIsFooterRequired(e.target.checked);
              }}
            ></input>
          </label>

          <div className="flex justify-between mt-3">
            <Button type="button" onClick={() => setEditing(false)}>
              <X size={SIZE.SIXTEEN} /> Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save size={SIZE.SIXTEEN} /> Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

(PageBlockQuotation as any).craft = {
  displayName: "Page Block",
  props: {
    padding: "40px",
    backgroundColor: "#ffffff",
    align: "center",
    isHeader: false,
    isFooter: false,
  },
  rules: {
    canMoveIn: (incoming: any[]) =>
      incoming.every((n) => n.data.displayName !== "Page Block"),
    canMoveOut: () => false,
  },
};
