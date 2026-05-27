import { Check, Copy, FileBarChart2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import ReportSnapshotProps from "../../../@types/report/ReportSnapshotProps";
import useScreenSize from "../../../config/hooks/useScreenSize";
import FormHeader from "../../ui/FormHeader";

function ReportSnapshotModal({
  isOpen,
  onClose,
  reportSnapshotData,
}: {
  isOpen: boolean;
  onClose: () => void;
  reportSnapshotData?: ReportSnapshotProps;
}) {
  const { isSmallScreen } = useScreenSize();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const formattedJson = useMemo(() => {
    try {
      return JSON.stringify(
        reportSnapshotData?.reportData ?? {},
        null,
        2,
      );
    } catch {
      return "Invalid JSON";
    }
  }, [reportSnapshotData]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formattedJson);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="
        fixed inset-0 z-50
        bg-black/40
        backdrop-blur-[2px]
        flex items-center justify-center
        p-2 sm:p-5
        animate-fadeIn
      "
    >
      <div
        className={`
          relative
          w-full
          ${
            isSmallScreen
              ? "max-w-full h-[95vh]"
              : "max-w-5xl max-h-[92vh]"
          }
          bg-white
          rounded-2xl
          shadow-2xl
          border border-gray-200
          overflow-hidden
          flex flex-col
        `}
      >
        {/* HEADER */}
        <div
          className="
            sticky top-0 z-20
            bg-white/95
            backdrop-blur
            border-b
            border-gray-200
            px-5 py-4
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <FormHeader
                icon={FileBarChart2}
                onClose={onClose}
                preText="Report Data"
                description={`This is auto generated report data from ${reportSnapshotData?.reportFromInclusive} to ${reportSnapshotData?.reportToInclusive}.`}
              />
            </div>
          </div>
        </div>

        {/* ACTION BAR */}
        <div
          className="
            flex items-center justify-between
            px-5 py-3
            border-b border-gray-100
            bg-gray-50
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                px-2 py-1
                rounded-md
                bg-blue-100
                text-blue-700
                text-xs
                font-semibold
              "
            >
              JSON
            </div>

            <span className="text-xs text-gray-500">
              Structured report snapshot data
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="
              flex items-center gap-2
              px-3 py-1.5
              rounded-lg
              bg-white
              border border-gray-200
              hover:bg-gray-100
              transition-all
              text-sm
              font-medium
            "
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-600" />
                Copy JSON
              </>
            )}
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="
            flex-1
            overflow-auto
            bg-[#0f172a]
            text-gray-100
            p-5
            font-mono
            text-sm
            leading-6
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-slate-800
            [&::-webkit-scrollbar-thumb]:bg-slate-600
            [&::-webkit-scrollbar-thumb]:rounded-full
          "
        >
          <pre className="whitespace-pre-wrap break-words">
            {formattedJson}
          </pre>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ReportSnapshotModal;