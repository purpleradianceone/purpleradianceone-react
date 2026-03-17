import React, { useState } from "react";
import { Download } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  fileUrl: string;
  fileExtension?: string;
  height?: string | number;
  width?: string | number;
  enableDownload?: boolean;
};

const CustomDocumentPreviewComponent: React.FC<Props> = ({
  fileUrl,
  fileExtension,
  height = "80%",
  width = "80%",
  enableDownload = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number>();

  if (!fileUrl) return null;

  // -------- EXTENSION DETECTION LOGIC --------
  let ext = "";

  if (fileExtension) {
    if (fileExtension.includes("/")) {
      // MIME type like image/png
      ext = fileExtension.split("/")[1];
    } else {
      // direct extension like png
      ext = fileExtension;
    }
  } else {
    // extract from URL
    ext = fileUrl.split("?")[0].split(".").pop() || "";
  }

  ext = ext.toLowerCase();
  // -------------------------------------------

  const imageTypes = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
    "bmp",
    "tiff",
  ];

  const isImage = imageTypes.includes(ext);
  const isPdf = ext === "pdf";

  const isLocal =
    fileUrl.includes("localhost") ||
    fileUrl.includes("127.0.0.1") ||
    fileUrl.startsWith("blob:");

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "";
    link.click();
  };

  return (
    <div
      style={{
        width,
        height,
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        background: "#fff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {enableDownload && (
        <div
          style={{
            padding: "10px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "flex-end",
            background: "#fafafa",
          }}
        >
          <button
            onClick={downloadFile}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            <Download size={16} />
            Download
          </button>
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: isImage ? "hidden" : "auto",
          position: "relative",
        }}
      >
        {/* IMAGE */}
        {isImage && (
          <img
            src={fileUrl}
            alt="preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
            onLoad={() => setLoading(false)}
          />
        )}

        {/* PDF */}
        {isPdf && (
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setLoading(false);
            }}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page key={index} pageNumber={index + 1} width={800} />
            ))}
          </Document>
        )}

        {/* OTHER FILES */}
        {!isImage && !isPdf && (
          <iframe
            src={
              isLocal
                ? fileUrl
                : `https://docs.google.com/gview?url=${encodeURIComponent(
                    fileUrl
                  )}&embedded=true`
            }
            width="100%"
            height="100%"
            style={{ border: "none" }}
            onLoad={() => setLoading(false)}
          />
        )}

        {loading && (
          <div
            style={{
              position: "absolute",
              fontSize: 14,
              color: "#666",
            }}
          >
            Loading Preview...
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDocumentPreviewComponent;
