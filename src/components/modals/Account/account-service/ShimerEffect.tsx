const ShimmerEffect = () => {

    const shimmerStyle = {
        background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite"
    };

    const ShimmerBlock = ({ className }: { className?: string }) => (
        <div
            className={`rounded ${className}`}
            style={shimmerStyle}
        />
    );

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full space-y-6">

            {/* Header */}
            <ShimmerBlock className="h-6 w-48" />

            {/* Top Details */}
            <div className="grid grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <ShimmerBlock className="h-3 w-24" />
                        <ShimmerBlock className="h-4 w-32" />
                    </div>
                ))}
            </div>

            {/* Booking Section */}
            <div className="grid grid-cols-4 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <ShimmerBlock className="h-3 w-24" />
                        <ShimmerBlock className="h-4 w-32" />
                    </div>
                ))}
            </div>

            {/* Address */}
            <ShimmerBlock className="h-16 w-full" />

            {/* Notes */}
            <div className="grid grid-cols-2 gap-6">
                <ShimmerBlock className="h-16 w-full" />
                <ShimmerBlock className="h-16 w-full" />
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ShimmerBlock key={i} className="h-10 w-full" />
                ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
                <ShimmerBlock className="h-10 w-24" />
                <ShimmerBlock className="h-10 w-24" />
            </div>

            {/* Keyframes */}
            <style>
                {`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}
            </style>

        </div>
    );
};

export default ShimmerEffect;