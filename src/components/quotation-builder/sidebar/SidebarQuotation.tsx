/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { useEditor } from "@craftjs/core";

import "./Sidebar.css"; 
import { PageBlockQuotation } from "../blocks/PageBlockQuotation";
import { LucideClipboardPlus, LucideTextSelection } from "lucide-react";
import { ContentBlockQuotation } from "../blocks/ContentBlockQuotation";


export const SidebarQuotation: React.FC = () => {
  const { connectors } = useEditor();

  return (
    <div className="sidebar-container z-0" >
      <h1 style={{color:"transparent"}}>_</h1>
      <h1 className="sidebar-title table-header-custom">Quotation Blocks</h1>
      <div className="sidebar-grid">
       
         <div id="page" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <PageBlockQuotation />); }} className="sidebar-block caption-custom">
          <span><LucideClipboardPlus/></span>
          <span>Page</span>
        </div>
        {/* <div id="section" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <SectionBlockQuotation />); }} className="sidebar-block caption-custom">
          <span><LucidePackage/></span>
          <span>Section</span>
        </div>
        
        <div id="image" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <ImageBlockQuotation alignment="left" height={0} width={0} src="" />); }} className="sidebar-block caption-custom">
          <span><LucideImage/></span>
          <span>Image</span>
        </div> */}

        <div id="textBlock" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <ContentBlockQuotation/>); }} className="sidebar-block caption-custom">
          <span><LucideTextSelection/></span>
          <span>Content Block</span>
        </div>
        
        {/* <div id="image" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <HeaderBlockQuotation/>); }} className="sidebar-block caption-custom">
          <span><LucideHeading/></span>
          <span>Header</span>
        </div>
        
        <div id="image" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <FooterBlockQuotation/>); }} className="sidebar-block caption-custom">
          <span><LucideFootprints/></span>
          <span>Footer</span>
        </div> */}

        
        
      </div>
    </div>
  );
};


