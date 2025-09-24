// ExportPanel.tsx
import React from "react";
import { useEditor } from "@craftjs/core";
import { craftJsonToHtml } from "../template-util/CraftJsonToHtml";
import toast from "react-hot-toast";
import { TemplateSettingsPanelCreate } from "./TemplateSettingsPanelCreate ";
import Button from "../../ui/Button";
import { ClipboardCopy, Eye } from "lucide-react";
import { SIZE } from "../../../constants/AppConstants";

interface ExportPanelProps {
  onPreview: (html: string) => void;
  onCopyHtml?: (html: string) => void;
  htmlTemplateTypeSubjectPlaceholder: string;
}

export const ExportPanelCreate: React.FC<ExportPanelProps> = ({
  onPreview,
  htmlTemplateTypeSubjectPlaceholder,
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
        <Button type="submit" onClick={(e) => {
          e.preventDefault();
          handlePreview();
        }}>
          <div className="flex items-center justify-center gap-0.5">
            <Eye size={SIZE.SIXTEEN} />
            Preview HTML
          </div>
        </Button>
      </div>

      <div>
        <Button type="submit" onClick={(e) => {
          e.preventDefault();
          handleCopy();
        }}>
          <div className="flex items-center justify-center gap-0.5">
            <ClipboardCopy size={SIZE.SIXTEEN} />
            Copy HTML
          </div>
        </Button>
      </div>

      <>
        {/* Settings panel */}
        <TemplateSettingsPanelCreate
          htmlTemplateTypeSubjectPlaceholder={
            htmlTemplateTypeSubjectPlaceholder
          }
        />
      </>
    </div>
  );
};
