import React, { useEffect, useRef } from "react";

type AutoScrollWrapperProps = {
  children: React.ReactNode;
  threshold?: number;
  scrollSpeed?: number;
};

const AutoScrollWrapper: React.FC<AutoScrollWrapperProps> = ({
  children,
  threshold = 200,
  scrollSpeed = 20,
}) => {
  const animationFrame = useRef<number | null>(null);
  const scrollDirection = useRef<"up" | "down" | null>(null);

  const startScrolling = () => {
    const scroll = () => {
      if (scrollDirection.current === "down") {
        window.scrollBy(0, scrollSpeed);
      } else if (scrollDirection.current === "up") {
        window.scrollBy(0, -scrollSpeed);
      }

      animationFrame.current = requestAnimationFrame(scroll);
    };

    if (!animationFrame.current) {
      animationFrame.current = requestAnimationFrame(scroll);
    }
  };

  const stopScrolling = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  };

  useEffect(() => {
    const handleDrag = (e: DragEvent) => {
      const y = e.clientY;
      const windowHeight = window.innerHeight;

      if (y > windowHeight - threshold) {
        scrollDirection.current = "down";
        startScrolling();
      } else if (y < threshold) {
        scrollDirection.current = "up";
        startScrolling();
      } else {
        scrollDirection.current = null;
        stopScrolling();
      }
    };

    const stop = () => stopScrolling();

    window.addEventListener("dragover", handleDrag);
    window.addEventListener("drop", stop);
    window.addEventListener("dragend", stop);

    return () => {
      window.removeEventListener("dragover", handleDrag);
      window.removeEventListener("drop", stop);
      window.removeEventListener("dragend", stop);
      stopScrolling();
    };
  }, [threshold, scrollSpeed]);

  return <>{children}</>;
};

export default AutoScrollWrapper;
