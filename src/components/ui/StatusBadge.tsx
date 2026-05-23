
function StatusBadge({
  isActive,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}: {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  return (
    <div
      className={`font-sans-status-card ${
        isActive
          ? "bg-green-100 text-green-900"
          : "bg-red-100 text-red-700"
      }`}
    >
      {isActive ? (
        <>
          <div className="w-1.5 h-1.5 rounded-full bg-green-900"/>
          <span>{activeLabel}</span>
        </>
      ) : (
        <>
         <div className="w-1.5 h-1.5 rounded-full bg-red-600"/>
         <span>{inactiveLabel}</span>
        </>
      )}
    </div>
  );
}

export default StatusBadge;