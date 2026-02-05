/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Element,  useNode } from "@craftjs/core";
import {  Edit, Save, X } from "lucide-react";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import { SIZE } from "../../../constants/AppConstants";

export const HeaderBlockQuotation: React.FC = () => {
  const {
    id,
    connectors: { connect, drag },
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

//   const { actions } = useEditor();

  /* ===== Local State ===== */
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);

  const [tempHeight, setTempHeight] = useState(props.height);
  const [tempPadding, setTempPadding] = useState(props.padding);
  const [tempBg, setTempBg] = useState(props.backgroundColor);

  /* ===== Save ===== */
  const handleSave = () => {
    setProp((p: any) => {
      p.height = tempHeight;
      p.padding = tempPadding;
      p.backgroundColor = tempBg;
    });
    setEditing(false);
  };

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      style={{
        height: props.height,
        padding: props.padding,
        width: "100%",
        backgroundColor: props.backgroundColor,
        borderBottom: "1px dashed #ddd",
        position: "relative",
        boxSizing: "border-box",
        flexShrink: 0,       // 🔥 KEY

      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ===== Toolbar ===== */}
      {(hovered || editing) && (
        <div className="absolute left-1/2 -translate-x-1/2 top-2 flex gap-1 z-50">
          <Button onClick={() => setEditing(true)}>
            <Edit size={SIZE.SIXTEEN} />
            Edit Header
          </Button>
          {/* <Button onClick={() => actions.delete(id)}>
            <Trash2 size={SIZE.SIXTEEN} />
          </Button> */}
        </div>
      )}

      {/* ===== Settings Panel ===== */}
      {editing && (
        <div className="absolute right-1/2 translate-x-1/2 top-2 bg-white p-3 border rounded-xl w-[220px] z-50"
          
        >
          <FormInput
            label="Header Height"
            placeholder="eg: 120px"
            value={tempHeight}
            onChange={(e) => setTempHeight(e.target.value)}
          />

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
              value={tempBg}
              onChange={(e) => setTempBg(e.target.value)}
            />
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

      {/* ===== DROP ZONE ===== */}
      <Element
        id={`${id}-canvas`}
        is="div"
        canvas
        style={{
          height: props.height,
          width: "100%",
          padding: props.padding,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};

/* ===== Craft Config ===== */
(HeaderBlockQuotation as any).craft = {
  displayName: "Header Block",
  props: {
    height: "150px",
    padding: "20px",
    backgroundColor: "#fafafa",
  },
  rules: {
    canMoveIn: () => true,
    canMoveOut: () => false,
  },
};
