// quotation-builder/
//  ├── builder/
//  │   ├── EditorCanvas.tsx
//  │   ├── Toolbox.tsx
//  │   ├── SettingsPanel.tsx
//  |   |── canvas-wrapper
//  |         |──CanvasWrapperQuotation
//  |
//  ├── blocks/
//  │        PageBlock (A4)
//  │            ├── SectionBlock
//  │            │    ├── HeaderBlock
//  │            │    ├── TextBlock
//  │            │    ├── ImageBlock
//  │            │    ├── TableBlock
//  │            │    └── FooterBlock
//  │
//  ├── state/
//  │   ├── templateAtoms.ts
//  ├── pages/
//  │   ├── QuotationTemplateBuilder.tsx
//  ├── services/
//  │   ├── templateApi.ts

import { Editor } from "@craftjs/core";
import { PageBlockQuotation } from "../blocks/PageBlockQuotation";
import { CanvasWrapperQuotation } from "./canvas-wrapper/CanvasWrapperQuotation";
import { SectionBlockQuotation } from "../blocks/SectionBlockQuotation";
import { SidebarQuotation } from "../sidebar/SidebarQuotation";
import { useUserPreference } from "../../../context/user/UserPreference";
import Button from "../../ui/Button";
import { QuoteIcon, Save } from "lucide-react";
import { SIZE } from "../../../constants/AppConstants";
import COLORS from "../../../constants/Colors";

export const EditorCanvasForQuotation: React.FC = () => {
  const canvasBgColor = "#f9f9f9";

  const { userPreference } = useUserPreference();

  return (
    <div
      className={`w-full pt-0.5 ${
        userPreference.isLeftMenu ? "pl-5" : "px-1"
      }  gap-1 h-screen flex flex-col `}
    >
      <div
        className={`sticky z-10 top-12 mt-1 p-1 flex items-center justify-between gap-2 text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm  
                      w-full
                    `}
      >
        <div className="flex justify-start items-center w-fit gap-5">
          <div className="flex justify-center items-center gap-1">
            <QuoteIcon className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} />
            <span className="section-header-custom">Quotation Builder</span>
          </div>
        </div>

        <div className="flex max-w-60 min-h-7 h-8">
          <Button
            type="submit"
            // disabled={!userHasAccessToAddEmailTemplateSetting}
            onClick={(e) => {
              e.preventDefault();
              // if (userHasAccessToAddEmailTemplateSetting) {
              //   setShowModal(true);
              // } else {
              //   toast.error(MESSAGE.ERROR.NOT_ATHORISED);
              // }
            }}
          >
            <div className="flex items-center justify-center gap-1">
              <Save size={SIZE.SIXTEEN} />
              <span>Save</span>
            </div>
          </Button>
        </div>
      </div>
      <Editor
        resolver={{
          PageBlockQuotation,
          SectionBlockQuotation,
        }}
      >
        {/* ROOT WRAPPER */}
        <div className={`flex w-full h-screen overflow-hidden `}>
          {/* SIDEBAR (NO SCROLL) */}
          <aside
            className="w-fit h-screen overflow-hidden border-r"
            style={{ backgroundColor: canvasBgColor }}
          >
            <SidebarQuotation />
          </aside>

          {/* MAIN CANVAS (SCROLLABLE) */}
          <main
            className="flex-1 relative overflow-auto p-[20px]"
            style={{ backgroundColor: canvasBgColor }}
          >
            <div id="CANVAS" className=" w-full">
              <CanvasWrapperQuotation />
            </div>
          </main>
        </div>
      </Editor>
    </div>
  );
};
