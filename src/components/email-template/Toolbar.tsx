import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";

export const Toolbar: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  const format = (type: "bold" | "italic" | "underline") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
  };

  return (
    <div style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
      <button onClick={() => format("bold")}><b>B</b></button>
      <button onClick={() => format("italic")}><i>I</i></button>
      <button onClick={() => format("underline")}><u>U</u></button>
    </div>
  );
};
