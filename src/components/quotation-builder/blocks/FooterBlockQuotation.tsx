/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Element, useEditor, useNode } from "@craftjs/core";
import { Edit, Save, X } from "lucide-react";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import { SIZE } from "../../../constants/AppConstants";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import ConfirmationDialog from "../../dialogue-box/ConfirmationDialogue";
import { useSearchParams } from "react-router-dom";
import {
  FOOTER_STORAGE_KEY_CREATE,
  FOOTER_STORAGE_KEY_UPDATE,
  searchParamKey,
} from "../local-storage/LocalStorageKeys";
import localforage from "localforage";

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

  //for syncking headers on every page end

  /* ===== Local State ===== */
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] =
    useState<boolean>(false);

  const [tempHeight, setTempHeight] = useState(props.height);
  const [tempPadding, setTempPadding] = useState(props.padding);
  const [tempBg, setTempBg] = useState(props.backgroundColor);

  const [searchParams] = useSearchParams();
  const quotationTemplateId = searchParams.get(searchParamKey);

  /* ===== Save ===== */
  const handleSave = async () => {
    console.log("inside footer block save");
    setProp((p: any) => {
      p.height = tempHeight;
      p.padding = tempPadding;
      p.backgroundColor = tempBg;
    });
    setEditing(false);
    // saveFooterToStorage();
    const footerBlockStorageKey = quotationTemplateId
      ? FOOTER_STORAGE_KEY_UPDATE
      : FOOTER_STORAGE_KEY_CREATE;

    // const result = localStorage.getItem(footerBlockStorageKey+loginStatus.id);

    const result = await localforage.getItem(
      footerBlockStorageKey + loginStatus.id,
    );
    if (!result) {
     await saveFooterToStorage();
    }
  };

  const saveFooterToStorage = async () => {
    const footerBlockStorageKey = quotationTemplateId
      ? FOOTER_STORAGE_KEY_UPDATE
      : FOOTER_STORAGE_KEY_CREATE;
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

      console.log(localStorageData);

      // localStorage.setItem(
      //   footerBlockStorageKey + loginStatus.id,
      //   JSON.stringify(localStorageData),
      // );

      await localforage.setItem(
        footerBlockStorageKey + loginStatus.id,
        JSON.stringify(localStorageData),
      );

      setIsConfirmationPopupOpen(false);
    } catch (err) {
      console.log("Error storing header:", err);
    }
  };

  // const handleSaveFooterLayout = async () => {
  //   await handleSave();
  //   await saveFooterToStorage();
  //   window.location.reload();
  // };

  const handleSaveFooterLayout = async () => {
  const footerBlockStorageKey = quotationTemplateId
    ? FOOTER_STORAGE_KEY_UPDATE
    : FOOTER_STORAGE_KEY_CREATE;

  try {
    const editorState = query.getState();

    // 👉 Current footer canvas
    const currentCanvasId =
      editorState.nodes[id].data.linkedNodes[`${id}-canvas`];

    if (!currentCanvasId) return;

    const currentCanvasNode = editorState.nodes[currentCanvasId];

    if (!currentCanvasNode.data.nodes.length) return;

    // 👉 Get first content node
    const firstNodeId = currentCanvasNode.data.nodes[0];

    const serializedNode = query
      .node(firstNodeId)
      .toSerializedNode();

    const newLayout = {
      height: tempHeight,
      padding: tempPadding,
      backgroundColor: tempBg,
    };

    const savedData = {
      data: serializedNode,
      props: newLayout,
    };

    // ✅ 1. Save to localforage
    await localforage.setItem(
      footerBlockStorageKey + loginStatus.id,
      JSON.stringify(savedData)
    );

    // ✅ 2. Sync ALL Footer Blocks
    const allNodes = query.getNodes();

    Object.keys(allNodes).forEach((nodeId) => {
      const node = allNodes[nodeId];

      if (node.data.displayName === "Footer Block") {
        const canvasId =
          editorState.nodes[nodeId].data.linkedNodes[
            `${nodeId}-canvas`
          ];

        if (!canvasId) return;

        const canvasNode = editorState.nodes[canvasId];

        // 🔥 Remove old content
        canvasNode.data.nodes.forEach((childId: string) => {
          actions.delete(childId);
        });

        // 🔥 Add new content
        const newNode = query
          .parseSerializedNode(savedData.data)
          .toNode();

        actions.add(newNode, canvasId);

        // 🔥 Update props
        actions.setProp(nodeId, (props: any) => {
          props.height = newLayout.height;
          props.padding = newLayout.padding;
          props.backgroundColor = newLayout.backgroundColor;
        });
      }
    });

    setEditing(false);
    setIsConfirmationPopupOpen(false);
  } catch (err) {
    console.log("Error syncing footer layout:", err);
  }
};

  useEffect(() => {
    //Local Storage
    // const footerBlockStorageKey = quotationTemplateId
    //   ? FOOTER_STORAGE_KEY_UPDATE
    //   : FOOTER_STORAGE_KEY_CREATE;

    // const stored = localStorage.getItem(footerBlockStorageKey + loginStatus.id);
    // if (!stored) return;

    // try {
    //   const parsed = JSON.parse(stored);
    //   setProp((p: any) => {
    //     p.padding = parsed.props.padding;
    //     p.backgroundColor = parsed.props.backgroundColor;
    //     p.height = parsed.props.height;
    //   });
    // } catch (err) {
    //   console.log("Error loading header props:", err);
    // }

    // Local Forage
    const loadFooterProps = async () => {
      const footerBlockStorageKey = quotationTemplateId
        ? FOOTER_STORAGE_KEY_UPDATE
        : FOOTER_STORAGE_KEY_CREATE;

      const stored = await localforage.getItem(
        footerBlockStorageKey + loginStatus.id,
      );

      if (!stored) return;

      try {
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;

        setProp((p: any) => {
          p.padding = parsed.props.padding;
          p.backgroundColor = parsed.props.backgroundColor;
          p.height = parsed.props.height;
        });
      } catch (err) {
        console.log("Error loading header props:", err);
      }
    };

    loadFooterProps();
  }, [id]);

  useEffect(() => {
    //Local Storage
    // const footerBlockStorageKey = quotationTemplateId
    //   ? FOOTER_STORAGE_KEY_UPDATE
    //   : FOOTER_STORAGE_KEY_CREATE;

    // const stored = localStorage.getItem(footerBlockStorageKey + loginStatus.id);
    // if (!stored) return;

    // try {
    //   const parsed = JSON.parse(stored);

    //   const editorState = query.getState();
    //   const canvasId = editorState.nodes[id].data.linkedNodes[`${id}-canvas`];

    //   if (!canvasId) return;

    //   const node = query.parseSerializedNode(parsed.data).toNode();

    //   // VERY IMPORTANT: Inject only if empty
    //   const canvasNode = editorState.nodes[canvasId];
    //   if (canvasNode.data.nodes.length > 0) return;

    //   actions.add(node, canvasId);
    // } catch (err) {
    //   console.log("Error loading footer:", err);
    // }

    //Local Forage
    const loadFooterBlock = async () => {
      const footerBlockStorageKey = quotationTemplateId
        ? FOOTER_STORAGE_KEY_UPDATE
        : FOOTER_STORAGE_KEY_CREATE;

      const stored = await localforage.getItem(
        footerBlockStorageKey + loginStatus.id,
      );

      if (!stored) return;

      try {
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;

        const editorState = query.getState();
        const canvasId = editorState.nodes[id].data.linkedNodes[`${id}-canvas`];

        if (!canvasId) return;

        const node = query.parseSerializedNode(parsed.data).toNode();

        // Inject only if empty
        const canvasNode = editorState.nodes[canvasId];

        if (canvasNode.data.nodes.length > 0) return;

        actions.add(node, canvasId);
      } catch (err) {
        console.log("Error loading footer:", err);
      }
    };

    loadFooterBlock();
  }, [id]);

  //For Ctrl+s
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        await handleSave();
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
        </div>
      )}

      {/* ===== Settings Panel ===== */}
      {editing && (
        <div
          className="absolute right-1/2 translate-x-1/2 -top-2 p-3 w-[220px] z-50 bg-white/80 backdrop-blur-lg 
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
          <div className="mt-2">
            <Button onClick={() => setIsConfirmationPopupOpen(true)}>
              <Save size={SIZE.SIXTEEN} /> Save Footer Layout
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
              onConfirm={handleSaveFooterLayout}
              title="Set this footer as the default for new pages?"
              description="Newly created pages will automatically follow this footer structure."
              message="This will apply the same layout settings — including padding, alignment, background styling, and spacing — to all future pages."
              messageDescription="Note: Header and footer content Visibility must be configured separately in page setting."
              cancelButtonText="Cancel"
              confirmButtonText="Save Footer Layout"
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
