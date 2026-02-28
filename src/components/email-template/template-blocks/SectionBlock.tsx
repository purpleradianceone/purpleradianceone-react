/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNode, useEditor, Element } from "@craftjs/core";
import Button from "../../ui/Button";
import { Edit, Save, Trash2, X } from "lucide-react";
import FormInput from "../../ui/FormInput";
import { SIZE } from "../../../constants/AppConstants";

export const SectionBlock: React.FC = () => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    id,
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  const { actions: editorActions } = useEditor();

  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);

  const [tempBackground, setTempBackground] = useState(
    props.background || "#f7f7f7"
  );
  const [tempPadding, setTempPadding] = useState(props.padding || "20px");
  const [tempAlign, setTempAlign] = useState(props.align || "left");

  const handleSave = () => {
    setProp((props: any) => {
      props.background = tempBackground;
      props.padding = tempPadding;
      props.align = tempAlign;
    });
    setEditing(false);
  };

  const handleDelete = () => {
    editorActions.delete(id);
  };

  return (
    <div
      ref={(ref: HTMLDivElement) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        textAlign: props.align,
        padding: props.padding,
        backgroundColor: props.background,
        border: "1px dashed #ccc",
        cursor: "move",
        position: "relative",
        marginBottom: "20px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {(hovered || editing) && (
        <div
          className="absolute w-full flex justify-between items-center -top-3 left-0 z-10 "
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="w-fit">
            <Button type="submit" onClick={(e) => {
              e.preventDefault();
              setEditing(true);
            }} title="Edit Section">
              <div className="flex items-center justify-center gap-1">
                <Edit size={SIZE.SIXTEEN} />
                Edit Section Bock
              </div>
            </Button>
          </div>
          <div>
            <Button type="button" onClick={handleDelete} title="Delete Section">
              <div className="flex items-center justify-center gap-1">
                <Trash2 size={SIZE.SIXTEEN} />
                Delete Section Block
              </div>
            </Button>
          </div>
        </div>
      )}

      {editing && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "10%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >

          <FormInput
            type="text"
            label="Padding"
            placeholder="Enter padding(eg 16px)"
            value={tempPadding}
            defaultValue={tempPadding}
            onChange={(e) => setTempPadding(e.target.value)}
          />
          <label className="input-label-custom flex justify-between items-center">
            Background:
            <input
              className="caption-custom"
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
          <div className="flex justify-between">
            <div className="w-fit h-fit">
              <Button type="button" onClick={() => setEditing(false)}>
                <div className="flex items-center justify-center gap-0.5">
                  <X size={SIZE.SIXTEEN} />
                  Cancel
                </div>
              </Button>
            </div>
            <div className="w-fit h-fit">
              <Button type="submit" onClick={(e) => {
                e.preventDefault();
                handleSave();
              }}>
                <div className="flex items-center justify-center gap-1">
                  <Save size={SIZE.SIXTEEN} />
                  Save
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Element
          id="section-content"
          is="div"
          canvas
          style={{
            width: "100%",
            boxSizing: "border-box",
            minHeight: "50px",
          }}
        />
      </div>
    </div>
  );
};

(SectionBlock as any).craft = {
  displayName: "Section Block",
  props: {
    background: "#f7f7f7",
    padding: "20px",
    align: "center",
  },
};
