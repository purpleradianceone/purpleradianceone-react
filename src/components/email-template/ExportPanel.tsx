/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ExportPanel.tsx
import React from "react";
import { useEditor } from "@craftjs/core";
import { craftJsonToHtml } from "./email-template-util/CraftJsonToHtml";

interface ExportPanelProps {
  onPreview: (html: string) => void;
  onCopyHtml?: (html: string) => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ onPreview, onCopyHtml }) => {
  const { query } = useEditor();

  const handlePreview = async () => {
    const json = query.serialize();
    console.log("|||||||||||||||||||||Craft JSON||||||||||||||||||||||");
    console.log(json);
    console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||");

    console.log("|||||||||||||||||||||HTML||||||||||||||||||||||");
    const html1 = craftJsonToHtml(json);
    console.log(html1);
    console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||");

    onPreview(html1);
  };

  const handleCopy = () => {
    const canvasElement = document.getElementById("CANVAS");
    if (!canvasElement) return;
    const json = query.serialize();
    const html = craftJsonToHtml(json);
    navigator.clipboard.writeText(html)
      .then(() => {
        alert("HTML copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy HTML");
      });
  };

 

  return (
    <div style={{ display: "grid", gap: 10 }}>
    <button
      onClick={handlePreview}
      style={{
        top: 50,
        left: "50%",
        padding: "2px 8px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Preview HTML
    </button>

    <button onClick={handleCopy} style={{ 
      padding: "2px 8px", 
      backgroundColor: "#4CAF50", 
      color: "white", 
      borderRadius: "4px", 
      cursor: "pointer",
      }}>
        Copy HTML
      </button>
    </div> 
  );
};








