/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNode } from "@craftjs/core";

type HeadingBlockProps = {
  text: string;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  fontSize: string;
  textAlign: "left" | "center" | "right";
  color: string;
};

// Component part
export const HeadingBlockComponent: React.FC<HeadingBlockProps> = ({
  text,
  level,
  fontSize,
  textAlign,
  color,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const HeadingTag = level || "h2";

  return (
    <div
    ref={(ref) => {
        if (ref) connect(drag(ref));
      }}      style={{ textAlign, color }}
    >
      <HeadingTag style={{ fontSize }}>{text}</HeadingTag>
    </div>
  );
};

// Settings panel
const HeadingBlockSettings: React.FC = () => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <label>
        Text:
        <input
          type="text"
          value={props.text}
          onChange={(e) =>
            actions.setProp((p: any) => (p.text = e.target.value))
          }
        />
      </label>

      <label>
        Heading Level:
        <select
          value={props.level}
          onChange={(e) =>
            actions.setProp((p: any) => (p.level = e.target.value))
          }
        >
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </select>
      </label>

      <label>
        Font Size:
        <input
          type="text"
          value={props.fontSize}
          onChange={(e) =>
            actions.setProp((p: any) => (p.fontSize = e.target.value))
          }
          placeholder="e.g., 24px"
        />
      </label>

      <label>
        Text Align:
        <select
          value={props.textAlign}
          onChange={(e) =>
            actions.setProp((p: any) => (p.textAlign = e.target.value))
          }
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>

      <label>
        Text Color:
        <input
          type="color"
          value={props.color}
          onChange={(e) =>
            actions.setProp((p: any) => (p.color = e.target.value))
          }
        />
      </label>
    </div>
  );
};

// Attach Craft config
export const HeadingBlock = Object.assign(HeadingBlockComponent, {
  craft: {
    displayName: "Heading",
    props: {
      text: "Your Heading",
      level: "h2",
      fontSize: "24px",
      textAlign: "center",
      color: "#000000",
    },
    related: {
      settings: HeadingBlockSettings,
    },
  },
});
