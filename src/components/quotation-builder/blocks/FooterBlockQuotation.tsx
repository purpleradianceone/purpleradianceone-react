/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Element, useEditor, useNode } from "@craftjs/core";
import {  Edit, Save, X } from "lucide-react";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import { SIZE } from "../../../constants/AppConstants";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";

export const FOOTER_STORAGE_KEY = "quotation_footer_data=";


export const FooterBlockQuotation: React.FC = () => {
  const {
    id,
    connectors: { connect, drag },
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

//const { actions } = useEditor();

//for syncing headers on every page
  const { query, actions } = useEditor();

  const { loginStatus } = useLoggedInUserContext();

  useEffect(() => {
    const stored = localStorage.getItem(FOOTER_STORAGE_KEY + loginStatus.id);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      const editorState = query.getState();
      const canvasId = editorState.nodes[id].data.linkedNodes[`${id}-canvas`];

      if (!canvasId) return;

      const node = query.parseSerializedNode(parsed).toNode();

      // VERY IMPORTANT: Inject only if empty
      const canvasNode = editorState.nodes[canvasId];
      if (canvasNode.data.nodes.length > 0) return;

      actions.add(node, canvasId);
    } catch (err) {
      console.log("Error loading header:", err);
    }
  }, [id]);

  const saveFooterToStorage = () => {
    try {
      const editorState = query.getState();

      // This is the linked canvas id created by Craft
      const canvasId = editorState.nodes[id].data.linkedNodes[`${id}-canvas`];

      if (!canvasId) return;

      const canvasNode = editorState.nodes[canvasId];

      if (!canvasNode || !canvasNode.data.nodes.length) return;

      // Get first content node inside header
      const firstNodeId = canvasNode.data.nodes[0];

      // Serialize that node
      const serializedNode = query.node(firstNodeId).toSerializedNode();

      localStorage.setItem(
        FOOTER_STORAGE_KEY + loginStatus.id,
        JSON.stringify(serializedNode),
      );
    } catch (err) {
      console.log("Error storing header:", err);
    }
  };

  //for syncking headers on every page end

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
    saveFooterToStorage();
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
    }, [actions]);

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      style={{
        height: props.height,
        padding: props.padding,
        width: "100%",
        // flexShrink: 0,     
        marginTop: "auto", 
        backgroundColor: props.backgroundColor,
        borderTop: "1px dashed #ddd",
        position: "relative",
        boxSizing: "border-box",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ===== Toolbar ===== */}
      {(hovered || editing) && (
        <div className="group absolute right-1/2 translate-x-1/2 top-2 flex gap-1 z-50">
          <div className="scale-75 group-hover:scale-100 transition-transform duration-200">
          <Button onClick={() => setEditing(true)}>
            <Edit size={SIZE.SIXTEEN} />
            Edit Footer
          </Button>

          </div>

          {/* <Button onClick={() => actions.delete(id)}>
            <Trash2 size={SIZE.SIXTEEN} />
          </Button> */}
        </div>
      )}

      {/* ===== Settings Panel ===== */}
      {editing && (
        <div className="absolute right-1/2 translate-x-1/2 top-2 p-3 w-[220px] z-50 bg-white/80 backdrop-blur-lg 
                  shadow-xl rounded-xl border border-gray-200"
        >
          <FormInput
            label="Footer Height"
            placeholder="eg: 100px"
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

          <div className="flex justify-between mt-3 gap-2">
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
          padding: props.padding,
          backgroundColor: props.backgroundColor,
          width: "100%",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};

/* ===== Craft Config ===== */
(FooterBlockQuotation as any).craft = {
  displayName: "Footer Block",
  props: {
    height: "150px",
    padding: "1px",
    backgroundColor: "#fafafa",
  },
  rules: {
    canMoveIn: () => true,
    canMoveOut: () => false,
  },
};
