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
import { CanvasWrapperQuotation } from "../canvas-wrapper/CanvasWrapperQuotation";
import { SectionBlockQuotation } from "../../blocks/SectionBlockQuotation";
import { SidebarQuotation } from "../../sidebar/SidebarQuotation";
import { useUserPreference } from "../../../../context/user/UserPreference";
import { STATUS_CODE } from "../../../../constants/AppConstants";
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
import { handleApiError } from "../../../../config/error/handleApiError";
import axiosClient from "../../../../axios-client/AxiosClient";
import POST_API from "../../../../constants/PostApi";
import AutoScrollWrapper from "../../utils/AutoScrollWrapper";
import { QuotationTemplateSettingsPanelCreate } from "../../template-panel/QuotationTemplateSettingsPanelCreate";
import QuotationIconSvg from "../../svg/QuotationIconSvg";
import { STORAGE_KEY_CREATE } from "../../local-storage/LocalStorageKeys";
import { QuotationEditorSkeleton } from "../../utils/QuotationEditorSkeleton";

export const EditorCanvasForQuotation: React.FC = () => {
  const canvasBgColor = "#f9f9f9";
  const { userPreference } = useUserPreference();
  const { loginStatus } = useLoggedInUserContext();

  const [placeHolderData, setPlaceHolderData] = useState<PlaceholderItem[]>([]);
  const parsedFields: DynamicFieldOption[] =
    convertPlaceholdersToFields(placeHolderData);

  const [editorStateData, setEditorStateData] = useState(() => {
    const jsonEditorState = localStorage.getItem(
      STORAGE_KEY_CREATE + loginStatus.id,
    );
    return jsonEditorState;
  });

  const [isLoadingForData, setIsLogingForData] = useState<boolean>(true);

  useEffect(() => {
    const jsonEditorState = localStorage.getItem(STORAGE_KEY_CREATE + loginStatus.id);
    if (jsonEditorState) {
      setEditorStateData(jsonEditorState);
      console.log("stored Local storage editor json state:");
      console.log(jsonEditorState);
    }
  }, []);

  const getPlaceholderForQuotation = () => {
    try {
      setIsLogingForData(true);
      axiosClient
        .post(POST_API.GET_QUOTATION_PLACEHOLDER, {
          company_id: loginStatus.companyId,
          isactive: true,
          requestedby: loginStatus.id,
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            setPlaceHolderData(response.data);
          }
        })
        .finally(() => {
          setIsLogingForData(false);
        });
    } catch (e) {
      handleApiError(e);
    }
  };

  useEffect(() => {
    getPlaceholderForQuotation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoadingForData ? (
    <QuotationEditorSkeleton />
  ) : (
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
              {/* <QuoteIcon className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} /> */}
              <QuotationIconSvg
                strokeWidth={2}
                size={26}
                className="text-blue-600"
                showCurrency={true}
              />
              <span className="section-header-custom">
                Quotation Template Builder
              </span>
            </div>
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
            <AutoScrollWrapper threshold={200} scrollSpeed={25}>
              {/* MAIN CANVAS (SCROLLABLE) */}
              <main
                className="flex-1 relative overflow-auto p-[40px]"
                style={{ backgroundColor: canvasBgColor }}
              >
                <div id="CANVAS" className=" w-full">
                  <CanvasWrapperQuotation data={editorStateData ?? ""} />
                </div>
              </main>
            </AutoScrollWrapper>
          </div>
          <QuotationTemplateSettingsPanelCreate quotationTemplateNamePlaceholder="Enter quotation name. (ex: Quotation 1)"/>
        </Editor>
      </DynamicFieldsContext.Provider>
    </div>
  );
};
