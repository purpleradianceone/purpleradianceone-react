/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { useEditor } from "@craftjs/core";

import "./Sidebar.css"; 

import { ButtonBlock } from "../template-blocks/ButtonBlock";
import { ColumnBlock } from "../template-blocks/ColumnBlock";
import { DividerBlock } from "../template-blocks/DividerBlock";
import { ImageBlock } from "../template-blocks/ImageBlock";
import { LexicalText } from "../template-blocks/LexicalText";
import { SectionBlock } from "../template-blocks/SectionBlock";
import { TableBlock } from "../template-blocks/TableBlock";
import { LucideClipboardEdit, LucideColumns, LucideImage, LucidePackage, LucideSeparatorHorizontal, LucideTable, MousePointerSquare } from "lucide-react";

export const Sidebar: React.FC = () => {
  const { connectors } = useEditor();

  return (
    <div className="sidebar-container" >
      <h1 style={{color:"transparent"}}>_</h1>
      <h1 className="sidebar-title table-header-custom">Email Template Blocks</h1>
      <div className="sidebar-grid">
        {/* <div ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <SubjectBlock />); }} className="sidebar-block">
          <span>📄</span>
          <span>Subject</span>
        </div> */}
        <div id="section" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <SectionBlock />); }} className="sidebar-block caption-custom">
          <span><LucidePackage/></span>
          <span>Section</span>
          <span className="info-icon" title="This block is used for creating different sections in template." >i</span>
        </div>
        <div id="text" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <LexicalText />); }} className="sidebar-block caption-custom">
          <span><LucideClipboardEdit/></span>
          <span>Text</span>
          <span className="info-icon" title="This block is used for adding text in the template." >i</span>
        </div>
        <div id="image" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <ImageBlock src="" width={0} height={0} alignment={"left"} />); }} className="sidebar-block caption-custom">
          <span><LucideImage/></span>
          <span>Image</span>
          <span className="info-icon" title="This block is used for adding image in the template." >i</span>
        </div>
        <div id="button" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <ButtonBlock />); }} className="sidebar-block caption-custom">
          <span><MousePointerSquare/></span>
          <span>Button</span>
          <span className="info-icon" title="This block is used for adding button in the template." >i</span>
        </div>
        <div id="divider" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <DividerBlock />); }} className="sidebar-block caption-custom">
          <span><LucideSeparatorHorizontal/></span>
          <span>Divider</span>
          <span className="info-icon" title="This block is used for adding divider between two blocks in the template." >i</span>
        </div>
        <div id="column" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <ColumnBlock />); }}  className="sidebar-block caption-custom">
          <span><LucideColumns/></span>
          <span>Column</span>
          <span className="info-icon" title="This block is used for adding column in the template." >i</span>
        </div>
        <div id="table" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <TableBlock />); }}  className="sidebar-block caption-custom">
          <span><LucideTable/></span>
          <span>Table</span>
          <span className="info-icon" title="This block is used for adding table in the template." >i</span>
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


