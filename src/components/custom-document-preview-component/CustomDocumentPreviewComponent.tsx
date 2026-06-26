import React, { useState } from "react";
import { Download } from "lucide-react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  fileUrl: string;
  fileExtension?: string;
  fileName?: string;
  height?: string | number;
  width?: string | number;
  enableDownload?: boolean;
};

const CustomDocumentPreviewComponent: React.FC<Props> = ({
  fileUrl,
  fileExtension,
  fileName,
  height = "80%",
  width = "80%",
  enableDownload = false,
}) => {
  const [loading, setLoading] = useState(true);

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

  // const downloadFile = () => {
  //   const link = document.createElement("a");
  //   link.href = fileUrl;
  //   link.download = "";
  //   link.click();
  // };

  const downloadFile = async () => {
    try {
      // If blob/local → direct download works
      if (fileUrl.startsWith("blob:") || fileUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = fileUrl;

        if (fileName) {
          const hasExt = fileName.includes(".");
          link.download = hasExt ? fileName : `${fileName}.${ext}`;
        } else {
          link.download = "";
        }

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // 🔥 For external URLs (S3/CDN) → fetch as blob
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;

      if (fileName) {
        const hasExt = fileName.includes(".");
        link.download = hasExt ? fileName : `${fileName}.${ext}`;
      } else {
        // fallback from URL
        const defaultName =
          fileUrl.split("/").pop()?.split("?")[0] || "download";
        link.download = defaultName;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
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
          // <Document
          //   file={fileUrl}
          //   onLoadSuccess={({ numPages }) => {
          //     setNumPages(numPages);
          //     setLoading(false);
          //   }}
          // >
          //   {Array.from(new Array(numPages), (_, index) => (
          //     <Page key={index} pageNumber={index + 1} width={800} />
          //   ))}
          // </Document>
          <iframe
            src={`${fileUrl}#toolbar=0`}
            title="PDF Preview"
            className="w-full h-full"
            onLoad={() => setLoading(false)}
          />
        )}

        {/* OTHER FILES */}
        {!isImage && !isPdf && (
          <iframe
            src={
              isLocal
                ? fileUrl
                : `https://docs.google.com/gview?url=${encodeURIComponent(
                    fileUrl,
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
