export const QuotationEditorSkeleton = () => {
 
 return (
    <div className="w-[97%] h-screen flex flex-col animate-pulse bg-gray-100 ">
      
      {/* TOP HEADER */}
      <div className="h-14 flex items-center justify-between px-5 bg-gray-200 shadow-sm">
        <div className="h-5 w-64 bg-gray-300 rounded"></div>
        <div className="h-9 w-32 bg-gray-300 rounded"></div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden mt-10">
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-gray-100 border-r p-4 space-y-5">
          <div className="h-5 w-40 bg-gray-300 rounded"></div>

          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-300 rounded-xl"
              ></div>
            ))}
          </div>
        </aside>

        {/* EMPTY CANVAS AREA */}
        <main className="flex-1 overflow-auto flex justify-center items-start py-2">
          
          {/* CANVAS WRAPPER */}
          <div className="w-[1070px] h-[900px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center space-y-4 bg-white">
            
            {/* ICON PLACEHOLDER */}
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>

            {/* TEXT PLACEHOLDER */}
            <div className="h-4 w-64 bg-gray-300 rounded"></div>

            {/* SUBTEXT */}
            <div className="h-3 w-40 bg-gray-300 rounded"></div>
          </div>
        </main>
      </div>
    </div>
  );
};