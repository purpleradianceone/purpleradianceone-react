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
    open?: boolean;
  setOpen?: (value: boolean) => void;
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
   open: controlledOpen,
  setOpen: setControlledOpen,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);

const open =
  controlledOpen !== undefined
    ? controlledOpen
    : internalOpen;

const setOpen =
  setControlledOpen || setInternalOpen;
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

  // WARNING : DO NOT UNCOMMENT THIS CODE  Outside click
  // FOR LEAD STATUS CHANGE , IF YOU START THIS FUNCTIONALOTY STATUS CHANGING FUNCTIONALITY WILL BREAK!!!
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

  //  Calculate position with viewport collision detection
useEffect(() => {
  if (!open || !triggerRef.current || !popoverRef.current) return;

  const triggerRect = triggerRef.current.getBoundingClientRect();
  const popoverRect = popoverRef.current.getBoundingClientRect();

  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;

  let top: number;
  let left: number;

  //  Vertical positioning (flip if needed)
  if (spaceBelow >= popoverRect.height) {
    // Enough space below
    top = triggerRect.bottom + window.scrollY;
  } else if (spaceAbove >= popoverRect.height) {
    // Flip above
    top = triggerRect.top + window.scrollY - popoverRect.height;
  } else {
    // Not enough space either side → clamp
    top = Math.max(
      8,
      viewportHeight - popoverRect.height - 8
    ) + window.scrollY;
  }

  //  Horizontal positioning
  if (align === "right") {
    left = triggerRect.right + window.scrollX - width;
  } else {
    left = triggerRect.left + window.scrollX;
  }

  //  Prevent right overflow
  if (left + popoverRect.width > viewportWidth) {
    left = viewportWidth - popoverRect.width - 8;
  }

  //  Prevent left overflow
  if (left < 8) {
    left = 8;
  }

  setPosition({ top, left });
}, [open, align, width]);

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
