/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { useEditor } from "@craftjs/core";

import "./Sidebar.css"; // 👈 Import the CSS

import { ButtonBlock } from "../template-blocks/ButtonBlock";
import { ColumnBlock } from "../template-blocks/ColumnBlock";
import { DividerBlock } from "../template-blocks/DividerBlock";
import { ImageBlock } from "../template-blocks/ImageBlock";
import { LexicalText } from "../template-blocks/LexicalText";
import { SectionBlock } from "../template-blocks/SectionBlock";
import { TableBlock } from "../template-blocks/TableBlock";

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
        <div id="section" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <SectionBlock />); }} className="sidebar-block">
          <span>📦</span>
          <span>Section</span>
        </div>
        <div id="text" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <LexicalText />); }} className="sidebar-block">
          <span>📝</span>
          <span>Text</span>
        </div>
        <div id="image" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <ImageBlock src="" width={0} height={0} alignment={"left"} />); }} className="sidebar-block">
          <span>🖼️</span>
          <span>Image</span>
        </div>
        <div id="button" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <ButtonBlock />); }} className="sidebar-block">
          <span>🔘</span>
          <span>Button</span>
        </div>
        <div id="divider" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <DividerBlock />); }} className="sidebar-block">
          <span>➖</span>
          <span>Divider</span>
        </div>
        <div id="column" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <ColumnBlock />); }}  className="sidebar-block">
          <span>📊</span>
          <span>Column</span>
        </div>
        <div id="table" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <TableBlock />); }}  className="sidebar-block">
          <span>📋</span>
          <span>Table</span>
        </div>
        {/* <div id="dynamic_fields" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <DynamicFieldBlock />); }} className="sidebar-block">
          <span>∯</span>
          <span>Dynamic Fields</span>
        </div> */}
        {/* <div id="generic_block" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <GenericBlock />); }} className="sidebar-block">
          <span>"<>"</></span>
          <span>Generic Block</span>
        </div> */}
      </div>
    </div>
  );
};


