/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { useEditor } from "@craftjs/core";

import "./Sidebar.css"; 
import { PageBlockQuotation } from "../blocks/PageBlockQuotation";
import { SectionBlockQuotation } from "../blocks/SectionBlockQuotation";
import { LucideClipboardPlus, LucidePackage } from "lucide-react";


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
        <div id="section" ref={(ref: HTMLDivElement) => { ref && connectors.create(ref, <SectionBlockQuotation />); }} className="sidebar-block caption-custom">
          <span><LucidePackage/></span>
          <span>Section</span>
        </div>
        
      </div>
    </div>
  );
};


