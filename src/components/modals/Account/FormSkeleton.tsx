const FormSkeleton = () => {
  return (
    <div className="p-6 animate-pulse">
      {/* Heading */}
      <div className="h-6 bg-gray-200 rounded w-40 mb-6" />

      {/* Grid with 2 columns */}
      <div className="grid grid-cols-2 gap-4">
        {/* Row 1 */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded-md" />
        </div>

        {/* Row 2 */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-28" />
          <div className="h-10 bg-gray-200 rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-28" />
          <div className="h-10 bg-gray-200 rounded-md" />
        </div>

        {/* Row 3 */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-10 bg-gray-200 rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-10 bg-gray-200 rounded-md" />
        </div>

        {/* Row 4 (Dropdowns) */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-28" />
          <div className="h-10 bg-gray-200 rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-28" />
          <div className="h-10 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Company account type (section) */}
      <div className="mt-6 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-40" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
      
      
    </div>
  );
};

export default FormSkeleton;
