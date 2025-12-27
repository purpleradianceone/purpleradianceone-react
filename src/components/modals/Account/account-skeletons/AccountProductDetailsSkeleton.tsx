import React from "react";

const InfoCardSkeleton = () => (
  <div className="flex items-start gap-3 rounded-lg border p-4">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

const AddressSkeleton = () => (
  <div className="rounded-lg border p-4 space-y-2">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
  </div>
);

const TableSkeleton = () => (
  <div className="rounded-lg border overflow-hidden">
    {/* Header */}
    <div className="grid grid-cols-8 gap-4 bg-gray-100 p-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>

    {/* Rows */}
    {Array.from({ length: 2 }).map((_, rowIdx) => (
      <div
        key={rowIdx}
        className="grid grid-cols-8 gap-4 p-3 border-t"
      >
        {Array.from({ length: 8 }).map((_, colIdx) => (
          <Skeleton key={colIdx} className="h-4 w-full" />
        ))}
      </div>
    ))}
  </div>
);

const AccountProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InfoCardSkeleton />
        <InfoCardSkeleton />
        <InfoCardSkeleton />
        <InfoCardSkeleton />
      </div>

      {/* Date & Installer Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InfoCardSkeleton />
        <InfoCardSkeleton />
        <InfoCardSkeleton />
        <InfoCardSkeleton />
      </div>

      {/* Address Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AddressSkeleton />
        <AddressSkeleton />
      </div>

      {/* AMC Details */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <TableSkeleton />
      </div>

      {/* Warranty Details */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-44" />
        <TableSkeleton />
      </div>
    </div>
  );
};

export default AccountProductDetailsSkeleton;



type SkeletonProps = {
  className?: string;
};

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
    />
  );
};
