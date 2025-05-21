// HtmlPreviewModal.tsx
import React, { useRef } from "react";
import Modal from "react-modal";

interface HtmlPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  onHtmlChange: (updatedHtml: string) => void;
  visible?: boolean; // controls Save button + editability
}

export const HtmlPreviewModal: React.FC<HtmlPreviewModalProps> = ({
  isOpen,
  onClose,
  html,
  onHtmlChange,
  visible = false
}) => {
  const editableRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    if (editableRef.current && visible) {
      onHtmlChange(editableRef.current.innerHTML);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="HTML Preview"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
          overflow: "auto",
          zIndex: 1000
        },
      }}
    >
      <div>
        <h2>HTML Preview</h2>
        <div
          ref={editableRef}
          contentEditable={visible}
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            minHeight: "300px",
            backgroundColor: "#fff",
            overflowY: "auto",
            marginBottom: "20px",
            cursor: visible ? "text" : "not-allowed",
          }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          {visible && (
            <button
              onClick={handleSave}
              style={{
                padding: "8px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              💾 Save Changes
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            ✖ Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
