import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import COLORS from "../../constants/Colors";

type StatusOption = {
  id: number;
  name: string;
  value: string;
};

type CustomStatusFilterDropdownProps = {
  options: StatusOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  showBorder?: boolean;
  height?: string;
  className?: string;
};

function CustomStatusFilterDropdown({
  options,
  selectedValue,
  onChange,
  showBorder = true,
  height = "",
  className = "",
}: CustomStatusFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] =
    useState<StatusOption | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected =
      options.find(
        (item) => item.value === selectedValue,
      ) || null;

    setSelectedOption(selected);
  }, [selectedValue, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const getStatusStyles = () => {
    switch (selectedValue) {
      case "ACTIVE":
        return {
          bg: "bg-green-100",
          dot: "bg-green-500",
        };

      case "INACTIVE":
        return {
          bg: "bg-red-100",
          dot: "bg-red-500",
        };

      default:
        return {
          bg: COLORS.LIGHT_PURPLE_BACKGROUND,
          dot: "bg-violet-500",
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div
      ref={dropdownRef}
      className={`relative w-auto ${className}`}
    >
      {/* DROPDOWN BUTTON */}
      <div
        role="button"
        tabIndex={0}
        className={`
          relative
          h-9
          w-[134px]
          px-2
          rounded-lg
          bg-white
          flex items-center justify-between
          gap-3
          shadow-sm
          transition-all duration-200
          ${
            showBorder
              ? "border border-slate-200 hover:border-slate-300"
              : ""
          }
          ${height}
          cursor-pointer
        `}
        onClick={() =>
          setIsOpen((prev) => !prev)
        }
      >
        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 min-w-0">
          {/* STATUS ICON */}
          <div
            className={`
              h-5
              w-5
              rounded-md
              flex
              justify-center
              items-center
              flex-shrink-0
              ${styles.bg}
            `}
          >
            <div
              className={`
                w-2
                h-2
                rounded-full
                ${styles.dot}
              `}
            />
          </div>

          {/* LABEL */}
          <span className="input-label-custom text-slate-700 truncate">
            {selectedOption?.name || "Select"}
          </span>
        </div>

        {/* ARROW */}
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp
              size={16}
              className="text-slate-500"
            />
          ) : (
            <ChevronDown
              size={16}
              className="text-slate-500"
            />
          )}
        </div>
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div
          className="
            absolute
            top-11
            left-0
            z-50
            w-full
            bg-white
            border
            border-slate-200
            rounded-lg
            shadow-lg
            overflow-hidden
          "
        >
          {options.map((option) => {
            const optionStyles =
              option.value === "ACTIVE"
                ? {
                    bg: "bg-green-100",
                    dot: "bg-green-500",
                  }
                : option.value === "INACTIVE"
                  ? {
                      bg: "bg-red-100",
                      dot: "bg-red-500",
                    }
                  : {
                      bg: "bg-violet-100",
                      dot: "bg-violet-500",
                    };

            return (
              <button
                key={option.id}
                type="button"
                className={`
                  w-full
                  px-3
                  py-1
                  flex
                  items-center
                  gap-3
                  text-left
                  text-sm
                  transition-colors
                  hover:bg-slate-50
                  ${
                    selectedValue === option.value
                      ? `${COLORS.LIGHT_PURPLE_BACKGROUND} ${COLORS.PRIMARY_PURPLE}`
                      : "text-slate-700"
                  }
                `}
                onClick={() => {
                  onChange(option.value);

                  setIsOpen(false);
                }}
              >
                {/* STATUS DOT */}
                <div
                  className={`
                    h-5
                    w-5
                    rounded-md
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                    ${optionStyles.bg}
                  `}
                >
                  <div
                    className={`
                      w-2
                      h-2
                      rounded-full
                      ${optionStyles.dot}
                    `}
                  />
                </div>

                {/* TEXT */}
                <span>{option.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CustomStatusFilterDropdown;