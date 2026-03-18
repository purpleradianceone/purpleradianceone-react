/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Element, useNode, useEditor } from "@craftjs/core";
import { Edit, Save, X } from "lucide-react";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import { SIZE } from "../../../constants/AppConstants";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import ConfirmationDialog from "../../dialogue-box/ConfirmationDialogue";

export const HEADER_STORAGE_KEY = "quotation_header_data=";

export const HeaderBlockQuotation: React.FC = () => {
  const {
    id,
    connectors: { connect, drag },
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  //for syncing headers on every page
  const { query, actions } = useEditor();

  const { loginStatus } = useLoggedInUserContext();
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] =
    useState<boolean>(false);
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
  };

  const saveHeaderToStorage = () => {
    try {
      const editorState = query.getState();

      setProp((p: any) => {
        p.height = tempHeight;
        p.padding = tempPadding;
        p.backgroundColor = tempBg;
      });

      // This is the linked canvas id created by Craft
      const canvasId = editorState.nodes[id].data.linkedNodes[`${id}-canvas`];

      if (!canvasId) return;

      const canvasNode = editorState.nodes[canvasId];

      if (!canvasNode || !canvasNode.data.nodes.length) return;

      // Get first content node inside header
      const firstNodeId = canvasNode.data.nodes[0];

      // Serialize that node
      const serializedNode = query.node(firstNodeId).toSerializedNode();

      const localStorageData = {
        data: serializedNode,
        props: {
          height: tempHeight,
          padding: tempPadding,
          backgroundColor: tempBg,
        },
      };

      localStorage.setItem(
        HEADER_STORAGE_KEY + loginStatus.id,
        JSON.stringify(localStorageData),
      );
    } catch (err) {
      console.log("Error storing header:", err);
    }
  };

  const handleSaveHeaderLayout = () => {
    setProp((p: any) => {
      p.height = tempHeight;
      p.padding = tempPadding;
      p.backgroundColor = tempBg;
    });

    saveHeaderToStorage(); // Save header
    handleSave(); // Save
    setEditing(false);
    setIsConfirmationPopupOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    const stored = localStorage.getItem(HEADER_STORAGE_KEY + loginStatus.id);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setProp((p: any) => {
        p.padding = parsed.props.padding;
        p.backgroundColor = parsed.props.backgroundColor;
        p.height = parsed.props.height;
      });
    } catch (err) {
      console.log("Error loading header props:", err);
    }
  }, [id]);

  useEffect(() => {
    const stored = localStorage.getItem(HEADER_STORAGE_KEY + loginStatus.id);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      const editorState = query.getState();
      const canvasId = editorState.nodes[id].data.linkedNodes[`${id}-canvas`];

      if (!canvasId) return;

      const node = query.parseSerializedNode(parsed.data).toNode();

      // VERY IMPORTANT: Inject only if empty
      const canvasNode = editorState.nodes[canvasId];
      if (canvasNode.data.nodes.length > 0) return;

      actions.add(node, canvasId);
    } catch (err) {
      console.log("Error loading header:", err);
    }
  }, [id]);

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
        backgroundColor: props.backgroundColor,
        borderBottom: "1px dashed #ddd",
        position: "relative",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ===== Toolbar ===== */}
      {(hovered || editing) && (
        <div className=" group absolute left-1/2 -translate-x-1/2 top-2 flex gap-1 z-50">
          <div className="scale-75 group-hover:scale-100 transition-transform duration-200">
            <Button onClick={() => setEditing(true)}>
              <Edit size={SIZE.SIXTEEN} />
              Edit Header
            </Button>
          </div>
          {/* <Button onClick={() => actions.delete(id)}>
            <Trash2 size={SIZE.SIXTEEN} />
          </Button> */}
        </div>
      )}

      {/* ===== Settings Panel ===== */}
      {editing && (
        <div
          className="absolute right-1/2 translate-x-1/2 top-2 p-3 w-[220px] z-50 bg-white/80 backdrop-blur-lg 
                  shadow-xl rounded-xl border border-gray-200"
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

          <div className="flex justify-between mt-3 gap-2">
            <Button type="button" onClick={() => setEditing(false)}>
              <X size={SIZE.SIXTEEN} /> Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save size={SIZE.SIXTEEN} /> Save
            </Button>
          </div>
          <div className="flex justify-center items-center mt-2">
            <Button onClick={() => setIsConfirmationPopupOpen(true)}>
              <Save size={SIZE.SIXTEEN} /> Save Header Layout
            </Button>
          </div>

          <div
            className=""
            style={{
              zIndex: 1000,
            }}
          >
            <ConfirmationDialog
              open={isConfirmationPopupOpen}
              icon={Save}
              onCancel={() => setIsConfirmationPopupOpen(false)}
              onConfirm={handleSaveHeaderLayout}
              title="Set this header as the default for new pages?"
              description="Newly created pages will automatically follow this header structure."
              message="This will apply the same layout settings — including padding, alignment, background styling, and spacing — to all future pages."
              messageDescription="Note: Header and footer content Visibility must be configured separately in page setting."
              cancelButtonText="Cancel"
              confirmButtonText="Save Header Layout"
            />
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
    height: "180px",
    padding: "1px",
    backgroundColor: "#fafafa",
  },
  rules: {
    canMoveIn: () => true,
    canMoveOut: () => false,
  },
};
