import React from "react";
import { Clock, XCircle, FileText } from "lucide-react";

interface Props {
  statusId?: number;
}

type StatusConfig = {
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: React.ReactNode;
};

const STATUS_MAP: Record<number, StatusConfig> = {
  1: {
    label: "DRAFT",
    bg: "bg-orange-100",
    text: "text-gray-700",
    border: "border-gray-300",
    icon: <FileText size={12} />,
  },
  2: {
    label: "SUBMITTED",
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
    icon: <Clock size={12} />,
  },
  3: {
    label: "CANCELLED",
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
    icon: <XCircle size={12} />,
  },
};

const DEFAULT_STATUS: StatusConfig = {
  label: "CREATING",
  bg: "bg-gray-50",
  text: "text-gray-500",
  border: "border-gray-200",
  icon: null,
};

const InvoiceStatusChip: React.FC<Props> = ({ statusId }) => {
  const status = STATUS_MAP[statusId || 0] || DEFAULT_STATUS;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs  rounded-full border ${status.bg} ${status.text} ${status.border}`}
    >
      {status.icon}
      {status.label}
    </span>
  );
};

export default InvoiceStatusChip;
