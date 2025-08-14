// ExportPanel.tsx
import React from "react";
import { useEditor } from "@craftjs/core";
import { craftJsonToHtml } from "../template-util/CraftJsonToHtml";
import toast from "react-hot-toast";
import {
  TemplateSettingsPanelCreateTemplateUpdate,
  TemplateSettingsPanelUpdateProps,
} from "./TemplateSettingsPanelCreateTemplateUpdate";

interface ExportPanelProps {
  onPreview: (html: string) => void;
  onCopyHtml?: (html: string) => void;
  templateSettingsPanelUpdateProps: TemplateSettingsPanelUpdateProps;
}

export const ExportPanelUpdate: React.FC<ExportPanelProps> = ({
  onPreview,
  templateSettingsPanelUpdateProps,
}) => {
  const { query } = useEditor();

  const handlePreview = async () => {
    const json = query.serialize();
    const html1 = craftJsonToHtml(json);
    console.error(html1);
    console.error(json);
    onPreview(html1);
  };

  const handleCopy = () => {
    const canvasElement = document.getElementById("CANVAS");
    if (!canvasElement) return;
    const json = query.serialize();
    const html = craftJsonToHtml(json);
    navigator.clipboard
      .writeText(html)
      .then(() => {
        toast.success("HTML copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy HTML");
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

      <button
        onClick={handleCopy}
        style={{
          padding: "2px 8px",
          backgroundColor: "#4CAF50",
          color: "white",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Copy HTML
      </button>

      {templateSettingsPanelUpdateProps.templateTypeId && (
        <TemplateSettingsPanelCreateTemplateUpdate
          id={templateSettingsPanelUpdateProps.id}
          templateTypeId={templateSettingsPanelUpdateProps.templateTypeId}
          emailTemplateName={templateSettingsPanelUpdateProps.emailTemplateName}
          emailTemplateSubject={
            templateSettingsPanelUpdateProps.emailTemplateSubject
          }
          emailTemplateIsDefault={
            templateSettingsPanelUpdateProps.emailTemplateIsDefault
          }
        />
      )}
    </div>
  );
};
