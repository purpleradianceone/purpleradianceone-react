/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNode, useEditor, Element } from "@craftjs/core";
import Button from "../../ui/Button";
import { Edit, Save, Trash2, X } from "lucide-react";
import FormInput from "../../ui/FormInput";
import { SIZE } from "../../../constants/AppConstants";

export const SectionBlockQuotation: React.FC = () => {
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

   //For Ctrl+s
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "s") {
          handleSave();
        }
      };
  
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [editorActions]);

  return (
    <div
      // onDoubleClick={()=>{    
      //   setEditing(true);
      // }}
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
          className="absolute group w-full flex justify-between items-center -top-3 left-0 z-10 "
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="w-fit scale-50 group-hover:scale-100 transition-transform duration-200">
            <Button type="submit" onClick={(e) => {
              e.preventDefault();
              setEditing(true);
            }} title="Edit Section">
              <div className="flex items-center justify-center gap-1">
                <Edit size={SIZE.SIXTEEN} />
                Edit Section
              </div>
            </Button>
          </div>
          <div className="scale-50 group-hover:scale-100 transition-transform duration-200">
            <Button type="button" onClick={handleDelete} title="Delete Section">
              <div className="flex items-center justify-center gap-1">
                <Trash2 size={SIZE.SIXTEEN} />
                Delete Section
              </div>
            </Button>
          </div>
        </div>
      )}

      {editing && (
        <div className="absolute -top-5 left-0  p-3 w-[220px] z-50 bg-white/80 backdrop-blur-lg 
                  shadow-xl rounded-xl border border-gray-200"
        >
          <FormInput
            type="text"
            label="Section Padding"
            placeholder="Enter padding(eg 16px)"
            value={tempPadding}
            defaultValue={tempPadding}
            onChange={(e) => setTempPadding(e.target.value)}
          />
          <label className="input-label-custom flex justify-between items-center mt-1">
            Background:
            <input
              className="caption-custom"
              type="color"
              value={tempBackground}
              onChange={(e) => setTempBackground(e.target.value)}
            />
          </label>
          <label className="input-label-custom flex justify-between items-center mt-1">
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
          <div className="flex justify-between gap-2 mt-3">
              <Button type="button" onClick={() => setEditing(false)}>
                <div className="flex items-center justify-center gap-0.5">
                  <X size={SIZE.SIXTEEN} />
                  Cancel
                </div>
              </Button>
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
            minHeight: "30px",
          }}
        />
      </div>
    </div>
  );
};

(SectionBlockQuotation as any).craft = {
  displayName: "Section Block",
  props: {
    background: "#f7f7f7",
    padding: "20px",
    align: "center",
  },
rules: {
  canMoveIn: (_incoming: any, currentNode: any) =>
    currentNode.data.parent?.data.displayName === "Page Block",
},
  
};
