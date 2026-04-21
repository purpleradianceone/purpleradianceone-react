/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { useEditor } from "@craftjs/core";

import "./Sidebar.css"; 
import { PageBlockQuotation } from "../blocks/PageBlockQuotation";
import { LucideAlignJustify, LucideClipboardPlus, LucidePackage, LucideTable, LucideTextSelection } from "lucide-react";
import { ContentBlockQuotation } from "../blocks/ContentBlockQuotation";
import { SectionBlockQuotation } from "../blocks/SectionBlockQuotation";
import { TableBlockQuotation } from "../blocks/TableBlockQuotation";
import { QuotationSummeryBlock } from "../blocks/QuotationSummeryBlock";


export const SidebarQuotation: React.FC = () => {
  const { connectors } = useEditor();

  return (
    <div className="sidebar-container z-0" >
      <h1 style={{color:"transparent"}}>_</h1>
      <h1 className="sidebar-title table-header-custom">Quotation Blocks</h1>
      <div className="sidebar-grid">
       
        <div id="pageBlock" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <PageBlockQuotation />); }} className="sidebar-block caption-custom">
          <span><LucideClipboardPlus/></span>
          <span>Page</span>
          <span className="info-icon"
          title="This block represent the A4 size page for quotation.">i</span>
        </div>

        <div id="sectionBlock" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <SectionBlockQuotation />); }} className="sidebar-block caption-custom">
          <span><LucidePackage/></span>
          <span>Section</span>
          <span className="info-icon" title="This block is used for creating different sections in page block." >i</span>
        </div>
        
        <div id="dynamicTableBlock" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <TableBlockQuotation/>); }} className="sidebar-block caption-custom">
          <span><LucideTable/></span>
          <span>Dynamic Table Block</span>
          <span className="info-icon"
            title="This table block represent the position where the runtime product pricing table is generate."
          >i</span>
        </div>

        <div id="dynamicQuotationSummeryBlock" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <QuotationSummeryBlock/>); }} className="sidebar-block caption-custom">
          <span><LucideAlignJustify/></span>
          <span>Quotation Summery Block</span>
          <span className="info-icon"
            title="This block represent the position where the runtime quotation summery is generate."
          >i</span>
        </div>

        <div id="contentBlock" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <ContentBlockQuotation/>); }} className="sidebar-block caption-custom">
          <span><LucideTextSelection/></span>
          <span>Content Block</span>
          <span className="info-icon"
          title="This block is use to add different type of content in quotation."
          >i</span>
        </div>
      </div>
    </div>
  );
};


