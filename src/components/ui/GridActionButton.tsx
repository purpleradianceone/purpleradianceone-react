import { MoreHorizontal } from "lucide-react";

type GridActionButtonProps = {
  id?: string;
  title?: string;
  disabled?: boolean;
  className?: string;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
};

function GridActionButton(props: GridActionButtonProps) {

  return (
    <div className="flex items-center justify-center h-full">
      <button
        onClick={props.onClick}
        className="
          w-7 h-7
          flex items-center justify-center
          rounded-lg
          border border-slate-300
          bg-white
          text-slate-500
          hover:bg-slate-50
          hover:text-slate-600
          transition-all duration-150
          shadow-sm
        "
      >
        <MoreHorizontal
          size={16}
          strokeWidth={1.2}
        />
      </button>
    </div>
  );
}

export default GridActionButton;