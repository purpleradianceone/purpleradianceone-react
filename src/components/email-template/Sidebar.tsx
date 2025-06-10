/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { useEditor } from "@craftjs/core";
import { ImageBlock } from "./email-template-blocks/ImageBlock";
import { ButtonBlock } from "./email-template-blocks/ButtonBlock";
import { DividerBlock } from "./email-template-blocks/DividerBlock";
import { SectionBlock } from "./email-template-blocks/SectionBlock";
import { ColumnBlock } from "./email-template-blocks/ColumnBlock";
import { TableBlock } from "./email-template-blocks/TableBlock";
import { SubjectBlock } from "./email-template-blocks/SubjectBlock";
import "./Sidebar.css"; // 👈 Import the CSS
import { DynamicFieldBlock } from "./email-template-blocks/DynamicFieldBlock";
import { LexicalText } from "./email-template-blocks/LexicalText";

export const Sidebar: React.FC = () => {
  const { connectors } = useEditor();

  return (
    <div className="sidebar-container" >
      <h1 style={{color:"transparent"}}>_</h1>
      <h1 className="sidebar-title">Email Template Blocks</h1>
      <div className="sidebar-grid">
        {/* <div ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <SubjectBlock />); }} className="sidebar-block">
          <span>📄</span>
          <span>Subject</span>
        </div> */}
        <div ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <SectionBlock />); }} className="sidebar-block">
          <span>📦</span>
          <span>Section</span>
        </div>
        <div ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <LexicalText />); }} className="sidebar-block">
          <span>📝</span>
          <span>Text</span>
        </div>
        <div ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <ImageBlock src="" width={0} height={0} alignment={"left"} />); }} className="sidebar-block">
          <span>🖼️</span>
          <span>Image</span>
        </div>
        <div ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <ButtonBlock />); }} className="sidebar-block">
          <span>🔘</span>
          <span>Button</span>
        </div>
        <div ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <DividerBlock />); }} className="sidebar-block">
          <span>➖</span>
          <span>Divider</span>
        </div>
        <div ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <ColumnBlock />); }}  className="sidebar-block">
          <span>📊</span>
          <span>Column</span>
        </div>
        <div ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <TableBlock />); }}  className="sidebar-block">
          <span>📋</span>
          <span>Table</span>
        </div>
        <div ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <DynamicFieldBlock />); }} className="sidebar-block">
          <span>∯</span>
          <span>Dynamic Fields</span>
        </div>
      </div>
    </div>
  );
};


