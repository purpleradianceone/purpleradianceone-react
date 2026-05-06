/* eslint-disable @typescript-eslint/no-explicit-any */
import { Frame, Element, useEditor } from "@craftjs/core";
import { useEffect, useState } from "react";
import { DocumentCanvasQuotation } from "../../blocks/DocumentCanvasQuotation";
import { LucideClipboardPaste, Redo, Undo } from "lucide-react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import {
  searchParamKey,
  STORAGE_KEY_CREATE,
  STORAGE_KEY_UPDATE,
} from "../../local-storage/LocalStorageKeys";
import { useSearchParams } from "react-router-dom";
import localforage from "localforage";

export const CanvasWrapperQuotation = ({ data }: { data: string }) => {
  const { canUndo, canRedo, actions, query, store } = useEditor(
    (state, query) => ({
      state,
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
    }),
  );
  const [searchParams] = useSearchParams();
  const quotationTemplateId = searchParams.get(searchParamKey);

  const [isEmpty, setIsEmpty] = useState(true);
  const { loginStatus } = useLoggedInUserContext();

  useEffect(() => {
    const checkCanvasEmpty = () => {
      const serialized = query.serialize();
      const data = JSON.parse(serialized);
      const result = isCanvasTrulyEmpty(data, "ROOT");
      setIsEmpty(result);
    };

    checkCanvasEmpty();
    const interval = setInterval(checkCanvasEmpty, 500);
    return () => clearInterval(interval);
  }, [query]);

  //Auto save editor state
  useEffect(() => {
    //Local Storage
    // const unsubscribe = store.subscribe(
    //   (state) => state,
    //   () => {
    //     const serialized = query.serialize();
    //     const data = JSON.parse(serialized);
    //     const result = isCanvasTrulyEmpty(data, "ROOT");
    //     // console.log(`Craft Json: ${serialized}`);
    //     const storageKey = !quotationTemplateId
    //       ? STORAGE_KEY_CREATE
    //       : STORAGE_KEY_UPDATE;
    //     if (!result)
    //       localStorage.setItem(storageKey + loginStatus.id, serialized);
    //   },
    // );
    // return () => unsubscribe();

    //Local forage
      const unsubscribe = store.subscribe(
    (state) => state,
    async () => {
      const serialized = query.serialize();
      const data = JSON.parse(serialized);

      const result = isCanvasTrulyEmpty(data, "ROOT");

      const storageKey = !quotationTemplateId
        ? STORAGE_KEY_CREATE
        : STORAGE_KEY_UPDATE;

      if (!result) {
        await localforage.setItem(
          storageKey + loginStatus.id,
          serialized
        );
      }
    }
  );

  return () => unsubscribe();
  }, [store, query]);

  //For undo and redo handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        actions.history.undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        actions.history.redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions]);

  //preventing default browser behavior
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        console.log("Ctrl + S blocked");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div style={{ position: "relative" }} className="table-data-custom">
      {/* Redo Undo */}
      <div className="fixed top-28 right-9 " style={{ zIndex: 51 }}>
        <div
          className="flex items-center gap-2 px-2 py-1 
                  bg-white/80 backdrop-blur-lg 
                  shadow-xl rounded-xl border border-gray-200"
        >
          {/* Undo */}
          <button
            disabled={!canUndo}
            onClick={() => actions.history.undo()}
            title="Undo (Ctrl + Z)"
            className={`group relative flex items-center justify-center
                  w-9 h-9 rounded-xl transition-all duration-200
                  ${
                    canUndo
                      ? "hover:bg-primary/10 text-gray-600 hover:text-primary"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
          >
            <Undo size={20} strokeWidth={2} />

            {/* Tooltip */}
            <span
              className="absolute w-28 -top-7 scale-0 group-hover:scale-100 transition-transform duration-200
                       bg-black text-white text-xs px-2 py-1 rounded-md shadow-lg"
            >
              Undo (Ctrl + Z)
            </span>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200" />

          {/* Redo */}
          <button
            disabled={!canRedo}
            onClick={() => actions.history.redo()}
            title="Redo (Ctrl + Y)"
            className={`group relative flex items-center justify-center
                  w-9 h-9 rounded-xl transition-all duration-200
                  ${
                    canRedo
                      ? "hover:bg-primary/10 text-gray-600 hover:text-primary"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
          >
            <Redo size={20} strokeWidth={2} />

            {/* Tooltip */}
            <span
              className="absolute w-28 -top-7 scale-0 group-hover:scale-100
                       transition-transform duration-200
                       bg-black text-white text-xs px-2 py-1 rounded-md shadow-lg"
            >
              Redo (Ctrl + Y)
            </span>
          </button>
        </div>
      </div>

      {/* Redo Undo end */}

      {/* Canvas frame */}
      <Frame data={data}>
        <Element
          is={DocumentCanvasQuotation}
          canvas
          id="ROOT"
          style={{
            minWidth: "700px",
            minHeight: "800px",
            border: "1px dashed #ccc",
            padding: "70px",
            position: "relative",
          }}
        />
      </Frame>

      {/* Floating overlay message outside the Element */}
      <div
        className="table-data-custom"
        style={{
          position: "absolute",
          top: "30%",
          left: "20%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
          opacity: isEmpty ? 1 : 0,
          transition: "opacity 0.3s ease",
          zIndex: isEmpty ? 1 : -1, // hide from interaction when invisible
        }}
      >
        <div className="flex gap-1">
          <LucideClipboardPaste size={19} />
          Drag the Page blocks here 👉
        </div>
      </div>
    </div>
  );
};

/**
 * Recursively checks whether a given node ID has any non-placeholder children.
 */
function isCanvasTrulyEmpty(data: any, nodeId: string): boolean {
  const node = data[nodeId];
  if (!node || !node.nodes) return true;

  for (const childId of node.nodes) {
    const child = data[childId];
    if (!child) continue;

    // If child has text content that's not placeholder
    const children = child?.props?.children;
    if (
      typeof children === "string" &&
      children.trim() !== "" &&
      !children.includes("Drag the blocks in this box")
    ) {
      return false;
    }

    // If this child has deeper children, check them recursively
    if (child.nodes && child.nodes.length > 0) {
      if (!isCanvasTrulyEmpty(data, childId)) {
        return false;
      }
    }
  }

  // If we looped through all children and found nothing
  return node.nodes.length === 0;
}
