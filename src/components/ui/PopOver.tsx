import {
  useState,
  useRef,
  useEffect,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

interface PopoverProps {
  trigger: ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "left" | "right";
  width?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onTriggerClick?: () => void; //  API call hook
  padding ? : number,
   accessRight?: boolean;
}

/**
 * POP OVER - REUSABLE COMPONENT
 * 
 * @param trigger - ReactNode, give jsx on action that pop up will show
 * @param align - where to align popup - right , left
 * @param width - give required width
 * @param onOpen - function call if want any data / need to perform any action onOpen of the popup.
 * @param onClose - function call if want any data / need to perform any action onClose of the popup.
 * @param onTriggerClick - Same as above 2 functions, function call if want any data / need to perform any action ontriggerClick of the popup.
 * @param padding - give required padding
 * @param accessRight - give required access right , if want conditinal opening of popup.
 * @returns JSX 
 */
export function Popover({
  trigger,
  children,
  align = "left",
  width = 300,
  onOpen,
  onClose,
  onTriggerClick,
  padding =9,
  accessRight = true,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const close = () => {
    setOpen(false);
    onClose?.();
  };

  const openPopover = () => {
    if(!accessRight) {
      toast.error("You dont have permission to perform this action")
      return;
    };

    onTriggerClick?.(); //  API call happens here
    setOpen(true);
    onOpen?.();
  };

  //  Calculate position
  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    const top = rect.bottom + window.scrollY ;// +8

    const left =
      align === "right"
        ? rect.right + window.scrollX - width
        : rect.left + window.scrollX;

    setPosition({ top, left });
  }, [open, align, width]);

  //  Outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  //  ESC key close
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={open ? close : openPopover}
        className="inline-block  "
      >
        {isValidElement(trigger)
          ? cloneElement(trigger as React.ReactElement)
          : trigger}
      </div>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              width,
              zIndex: 9999,
              padding: padding,
              // marginBottom: 40

            }}
            className="bg-white shadow-lg border border-gray-300 rounded-lg"
          >
            {children(close)} {/*  Pass close function */}
          </div>,
          document.body
        )}
    </>
  );
}
