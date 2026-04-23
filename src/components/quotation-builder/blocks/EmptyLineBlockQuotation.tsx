/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import Button from "../../ui/Button";
import { Edit, Save, Trash2, X } from "lucide-react";
import FormInput from "../../ui/FormInput";
import { SIZE } from "../../../constants/AppConstants";

export const EmptyLineBlockQuotation: React.FC = () => {
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

  const [tempHeight, setTempHeight] = useState(props.height || "20px");

  /* SAVE */
  const handleSave = () => {
    setProp((p: any) => {
      p.height = tempHeight;
    });

    setEditing(false);
  };

  /* DELETE */
  const handleDelete = () => {
    editorActions.delete(id);
  };

  /* CTRL + S */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tempHeight]);

  return (
    <div
      ref={(ref: HTMLDivElement) => {
        if (ref) connect(drag(ref));
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        height: props.height,
        minHeight: "5px",
        border: hovered ? "1px dashed #999" : "1px dashed transparent",
        cursor: "move",
        boxSizing: "border-box",
      }}
    >
      {(hovered || editing) && (
        <div
          className="absolute w-full flex justify-between items-center -top-3 left-0 z-10"
        >
          {/* EDIT */}
          <div className="scale-75 hover:scale-100 transition">
            <Button onClick={() => setEditing(true)}>
              <Edit size={SIZE.SIXTEEN} />
              Edit Space
            </Button>
          </div>

          {/* DELETE */}
          <div className="scale-75 hover:scale-100 transition">
            <Button onClick={handleDelete}>
              <Trash2 size={SIZE.SIXTEEN} />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {editing && (
        <div
          className="absolute top-0 left-0 p-3 w-[220px] z-50 bg-white shadow-xl rounded-xl border"
        >
          <FormInput
            label="Height"
            type="text"
            placeholder="20px / 40px"
            value={tempHeight}
            onChange={(e) => setTempHeight(e.target.value)}
          />

          <div className="flex justify-between gap-2 mt-3">
            <Button onClick={() => setEditing(false)}>
              <X size={SIZE.SIXTEEN} />
              Cancel
            </Button>

            <Button onClick={handleSave}>
              <Save size={SIZE.SIXTEEN} />
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

/* CRAFT CONFIG */
(EmptyLineBlockQuotation as any).craft = {
  displayName: "Empty Line",
  props: {
    height: "20px",
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};