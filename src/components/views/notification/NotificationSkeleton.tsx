import React from "react";

interface NotificationSkeletonProps {
  count?: number;
}

const NotificationSkeleton: React.FC<NotificationSkeletonProps> = ({
  count = 5,
}) => {
  return (
    <div className="w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-4 border-b border-gray-200 animate-pulse"
        >
          {/* Header Row */}
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 w-40 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-gray-300 rounded" />
          </div>

          {/* Message Lines */}
          <div className="space-y-2 mb-3">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
          </div>

          {/* Date */}
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;