// ExportPanel.tsx
import React from "react";
import { useEditor } from "@craftjs/core";
import { craftJsonToHtml } from "../template-util/CraftJsonToHtml";
import toast from "react-hot-toast";
import {
  TemplateSettingsPanelCreateTemplateUpdate,
  TemplateSettingsPanelUpdateProps,
} from "./TemplateSettingsPanelCreateTemplateUpdate";
import Button from "../../ui/Button";
import { ClipboardCopy, Eye } from "lucide-react";

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
    <div style={{ display: "flex", gap: 5 }}>
      <div>
        <Button onClick={handlePreview}>
          <div className="flex items-center justify-center gap-0.5">
            <Eye size={16} />
            Preview HTML
          </div>
        </Button>
      </div>

      <div>
        <Button onClick={handleCopy}>
          <div className="flex items-center justify-center gap-0.5">
            <ClipboardCopy size={16} />
            Copy HTML
          </div>
        </Button>
      </div>

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
