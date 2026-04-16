const FacebookPageSkeleton = () => {
  const CardSkeleton = () => {
    return (
      <div className="w-full p-2 bg-white rounded-lg shadow-md border animate-pulse">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="h-4 w-40 bg-gray-300 rounded"></div>
          <div className="h-5 w-5 bg-gray-300 rounded"></div>
        </div>

        {/* Page ID */}
        <div className="h-3 w-52 bg-gray-300 rounded mb-3"></div>

        {/* Created By */}
        <div className="h-3 w-36 bg-gray-300 rounded mb-3"></div>

        {/* Created On */}
        <div className="h-3 w-44 bg-gray-300 rounded mb-3"></div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 bg-gray-300 rounded"></div>
          <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  };
  return (
    <>
      <CardSkeleton />
      {/* <CardSkeleton /> */}
      {/* <CardSkeleton /> */}
    </>
  );
};

export default FacebookPageSkeleton;
