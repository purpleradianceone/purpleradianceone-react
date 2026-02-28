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
//  │            ├── SectionBlock  --optional
//  │            │    ├── ContentBlock
//  │            │    ├── TableBlock
//  │            │    ├── HeaderBlock
//  │            │    └── FooterBlock
//  │
//  ├── state/
//  │   ├── templateAtoms.ts
//  ├── pages/
//  │   ├── QuotationTemplateBuilder.tsx
//  ├── services/
//  │   ├── templateApi.ts

import { Editor } from "@craftjs/core";
import { PageBlockQuotation } from "../../blocks/PageBlockQuotation";
import {
  CanvasWrapperQuotation,
  STORAGE_KEY,
} from "../canvas-wrapper/CanvasWrapperQuotation";
import { SectionBlockQuotation } from "../../blocks/SectionBlockQuotation";
import { SidebarQuotation } from "../../sidebar/SidebarQuotation";
import { useUserPreference } from "../../../../context/user/UserPreference";
import Button from "../../../ui/Button";
import { QuoteIcon, Save } from "lucide-react";
import { SIZE } from "../../../../constants/AppConstants";
import COLORS from "../../../../constants/Colors";
import { ImageBlockQuotation } from "../../blocks/ImageBlockQuotation";
import { DocumentCanvasQuotation } from "../../blocks/DocumentCanvasQuotation";
import { HeaderBlockQuotation } from "../../blocks/HeaderBlockQuotation";
import { FooterBlockQuotation } from "../../blocks/FooterBlockQuotation";
import { ContentBlockQuotation } from "../../blocks/ContentBlockQuotation";
import { TableBlockQuotation } from "../../blocks/TableBlockQuotation";
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import {
  convertPlaceholdersToFields,
  PlaceholderItem,
} from "../../../email-template/template-util/PlaceHolderDataToPlaceHolderRecord";
import {
  DynamicFieldOption,
  DynamicFieldsContext,
} from "../../../email-template/DynamicFieldsContext";

export const EditorCanvasForQuotation: React.FC = () => {
  const canvasBgColor = "#f9f9f9";
  const { userPreference } = useUserPreference();
  const { loginStatus } = useLoggedInUserContext();

  const [placeHolderData, setPlaceHolderData] = useState<PlaceholderItem[]>([]);
  const parsedFields: DynamicFieldOption[] =
    convertPlaceholdersToFields(placeHolderData);

  const [editorStateData, setEditorStateData] = useState(() => {
    const jsonEditorState = localStorage.getItem(STORAGE_KEY + loginStatus.id);
    return jsonEditorState;
  });

  useEffect(() => {
    const jsonEditorState = localStorage.getItem(STORAGE_KEY);
    if (jsonEditorState) {
      setEditorStateData(jsonEditorState);
      console.log("stored Local storage editor json state:");
      console.log(jsonEditorState);
    }
  }, []);

const placeholderDatafromApi = [
  {
    isactive: true,
    name: "{{quotation_number}}",
    id: 1,
    email_type_id: 1
  },
  {
    isactive: true,
    name: "{{quotation_date}}",
    id: 2,
    email_type_id: 1

  },
  {
    isactive: true,
    name: "{{quotation_valid_till}}",
    id: 3,
    email_type_id: 1

  },
  {
    isactive: true,
    name: "{{client_name}}",
    id: 4,
    email_type_id: 1

  },
  {
    isactive: true,
    name: "{{client_company}}",
    id: 5,
    email_type_id: 1

  },
  {
    isactive: true,
    name: "{{client_address}}",
    id: 6,
    email_type_id: 1

  },
  {
    isactive: true,
    name: "{{company_name}}",
    id: 7,
    email_type_id: 1

  },
  {
    isactive: true,
    name: "{{company_address}}",
    id: 8,
    email_type_id: 1
  },
  {
    isactive: true,
    name: "{{authorized_name}}",
    id: 9,
    email_type_id: 1
  },
  {
    isactive: true,
    name: "{{authorized_designation}}",
    id: 10,
    email_type_id: 1
  },
];


  useEffect(() => {
    setPlaceHolderData(placeholderDatafromApi);
    // parsedFields = convertPlaceholdersToFields(placeHolderData);
  }, []);

  return (
    <div
      className={`w-full pt-0.5 ${
        userPreference.isLeftMenu ? "pl-5" : "px-1"
      }  gap-1 h-screen flex flex-col `}
    >
      <DynamicFieldsContext.Provider value={parsedFields}>
        <div
          className={`sticky z-10 top-12 mt-1 p-1 flex items-center justify-between gap-2 text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm  
                      w-full
                    `}
        >
          <div className="flex justify-start items-center w-fit gap-5">
            <div className="flex justify-center items-center gap-1">
              <QuoteIcon className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} />
              <span className="section-header-custom">Quotation Template Builder</span>
            </div>
          </div>

          <div className="flex max-w-60 min-h-7 h-8">
            <Button
              type="submit"
              // disabled={!userHasAccessToAddEmailTemplateSetting}
              onClick={(e) => {
                e.preventDefault();
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
            DocumentCanvasQuotation,
            PageBlockQuotation,
            SectionBlockQuotation,
            ImageBlockQuotation,
            HeaderBlockQuotation,
            FooterBlockQuotation,
            ContentBlockQuotation,
            TableBlockQuotation,
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
                <CanvasWrapperQuotation data={editorStateData ?? ""} />
              </div>
            </main>
          </div>
        </Editor>
      </DynamicFieldsContext.Provider>
    </div>
  );
};
