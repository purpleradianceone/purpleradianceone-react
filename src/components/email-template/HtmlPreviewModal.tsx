import React, { useRef } from "react";
import Modal from "react-modal";
import FormHeader from "../ui/FormHeader";
import { Eye, Save, X } from "lucide-react";
import Button from "../ui/Button";
import { createPortal } from "react-dom";

interface HtmlPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  onHtmlChange: (updatedHtml: string) => void;
  editable?: boolean; // controls Save button + editability
}

export const HtmlPreviewModal: React.FC<HtmlPreviewModalProps> = ({
  isOpen,
  onClose,
  html,
  onHtmlChange,
  editable = false,
}) => {
  const editableRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    if (editableRef.current && editable) {
      onHtmlChange(editableRef.current.innerHTML);
    }
    onClose();
  };

  return (
    <div>
      
      {isOpen &&
        createPortal(
          <div>
          <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="HTML Preview"
            style={{
              content: {
                top: "54%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                minWidth:"60%",
                maxWidth:"70%",
                height: "fit-content",
                maxHeight: "80%",
                overflow: "auto",
              },
            }}
          >
            <div>
              <FormHeader
                icon={Eye}
                preText="HTML Preview"
                description="This is the preview of your HTML template."
                onClose={onClose}
              />
              
              <div
                ref={editableRef}
                contentEditable={editable}
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: html }}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  minHeight: "300px",
                  backgroundColor: "#fff",
                  overflowY: "auto",
                  marginBottom: "20px",
                  cursor: editable ? "text" : "not-allowed",
                }}
              />

              <div className="flex justify-end items-end">
                <div>
                  <Button onClick={onClose}>
                    <div className="flex items-center justify-center gap-0.5">
                      <X size={16} />
                      Close
                    </div>
                  </Button>
                </div>
                {editable && (
                  <div>
                    <Button onClick={handleSave}>
                      <div className="flex items-center justify-center gap-0.5">
                        <Save size={16} />
                        Save
                      </div>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Modal>
          </div>,
          document.body
        )}
    </div>
  );
};
