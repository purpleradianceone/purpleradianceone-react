import { ICellRendererParams } from "ag-grid-community";
import { User } from "lucide-react";

import { SkeletonRowsAgGrid } from "./SkeletonRowsAgGrid";

const RenderUserWithIcon = (
  params: ICellRendererParams,
) => {
  if (params.data?.__isSkeleton) {
    return <SkeletonRowsAgGrid />;
  }

  return (
    <div className="flex items-center gap-2 h-full">
      <User size={14} className="text-slate-500" />

      <span className="truncate">
        {params.value || "-"}
      </span>
    </div>
  );
};

export default RenderUserWithIcon;