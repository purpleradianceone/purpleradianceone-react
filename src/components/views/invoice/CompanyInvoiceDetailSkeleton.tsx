function SkeletonStyles() {
  return (
    <style>
      {`
        .skeleton-wave {
          position: relative;
          overflow: hidden;
          background-color: #e5e7eb; /* gray-200 */
          border-radius: 0.375rem;
        }

        .skeleton-wave::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}
    </style>
  );
}

function SkeletonBox({ className = "" }) {
  return <div className={`skeleton-wave ${className}`} />;
}

export function InvoiceHeaderSkeleton() {
  return (
    <>
      <SkeletonStyles />

      <div className="space-y-3">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <SkeletonBox className="h-6 w-56" />
            <SkeletonBox className="h-4 w-40" />
          </div>
        </div>

        {/* META */}
        <div className="grid grid-cols-4 gap-2 bg-gray-100 border rounded p-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonBox key={i} className="h-10 w-full" />
          ))}
        </div>

        {/* ADDRESS */}
        <div className="grid grid-cols-2 gap-3 border rounded p-2 bg-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-20 w-full" />
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-8 w-24" />
          ))}
        </div>
      </div>
    </>
  );
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 gap-2 py-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonBox key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

export function InvoiceItemsSkeleton() {
  return (
    <>
      <SkeletonStyles />

      <div className="bg-white border rounded p-2 space-y-2">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <SkeletonBox className="h-5 w-40" />
          <SkeletonBox className="h-8 w-48" />
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-12 gap-2 border-b pb-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonBox key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* ROWS */}
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}

        {/* FOOT */}
        <div className="flex justify-end">
          <SkeletonBox className="h-32 w-72" />
        </div>
      </div>
    </>
  );
}
