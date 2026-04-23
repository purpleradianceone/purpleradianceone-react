/* eslint-disable react-hooks/exhaustive-deps */
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
import QuotationIconSvg from "../../svg/QuotationIconSvg";
import {
  FOOTER_STORAGE_KEY_UPDATE,
  HEADER_STORAGE_KEY_UPDATE,
  PAGE_BLOCK_LAYOUT_UPDATE,
  searchParamKey,
  STORAGE_KEY_UPDATE,
} from "../../local-storage/LocalStorageKeys";
import { useSearchParams } from "react-router-dom";
import QuotationTemplate from "../../quotation-template-types/QuotationTemplate";
import { JsonFileData } from "../../quotation-template-types/JsonFileData";
import { QuotationEditorSkeleton } from "../../utils/QuotationEditorSkeleton";
import { QuotationTemplateSettingsPanelUpdate } from "../../template-panel/QuotationTemplateSettingsPanelUpdate";
import { QuotationSummeryBlock } from "../../blocks/QuotationSummeryBlock";
import { EmptyLineBlockQuotation } from "../../blocks/EmptyLineBlockQuotation";

export const EditorCanvasForQuotationEdit: React.FC = () => {
  const canvasBgColor = "#f9f9f9";
  const { userPreference } = useUserPreference();
  const { loginStatus } = useLoggedInUserContext();
  const [searchParams] = useSearchParams();
  const quotationTemplateId = searchParams.get(searchParamKey);
  const [jsonFileData, setJsonFileData] = useState<JsonFileData>();

  const [placeHolderData, setPlaceHolderData] = useState<PlaceholderItem[]>([]);
  const parsedFields: DynamicFieldOption[] =
    convertPlaceholdersToFields(placeHolderData);

  const [editorStateData, setEditorStateData] = useState(() => {
    const jsonEditorState = localStorage.getItem(
      STORAGE_KEY_UPDATE + loginStatus.id,
    );
    return jsonEditorState;
  });

  const [quotationTemplate, setQuotationTemplate] =
    useState<QuotationTemplate>();
  const [isLoadingForData, setIsLogingForData] = useState<boolean>(true);

  useEffect(() => {
    if (jsonFileData) {
      setEditorStateData(jsonFileData.quotationTemplateData);
      //   console.log("stored editor json state:");
      //   console.log(jsonFileData.quotationTemplateData);
      setIsLogingForData(false);
    }
  }, [jsonFileData]);

  const getQuotationTemplate = () => {
    try {
      const postData = {
        company_id: loginStatus.companyId,
        requestedby_id: loginStatus.id,
        id: quotationTemplateId,
      };
      axiosClient
        .post(POST_API.GET_QUOTATION_TEMPLATE, postData)
        .then((response) => {
          if (response.status) {
            setQuotationTemplate(response.data[0]);
          }
        })
        .catch((e) => {
          handleApiError(e);
        })
        .finally(() => {});
    } catch (e) {
      handleApiError(e);
    }
  };

  const getQuotationTemplateFile = () => {
    try {
      const postData = {
        company_id: loginStatus.companyId,
        requestedby_id: loginStatus.id,
        id: quotationTemplateId,
      };
      axiosClient
        .post(POST_API.GET_QUOTATION_TEMPLATE_FILE, postData)
        .then((response) => {
          if (response.status) {
            const responseData = response.data;
            setJsonFileData(responseData);
            // console.error("--------------------------------------------------------------");
            // console.log(responseData);
            // console.error("--------------------------------------------------------------");
            // const jsonFileResponse = convertByteArrayToJson(responseData);
            // setJsonFileData(jsonFileResponse);
          }
        })
        .catch((e) => {
          handleApiError(e);
        });
    } catch (e) {
      handleApiError(e);
    }
  };

  useEffect(() => {
    const response = localStorage.getItem(STORAGE_KEY_UPDATE + loginStatus.id);
    if (quotationTemplate?.id) {
      if (!response) {
        getQuotationTemplateFile();
      }else{
        setIsLogingForData(false);
      }
    }
  }, [quotationTemplate]);

  useEffect(() => {
    if (jsonFileData) {
      console.log("json file data:= ");
      console.log(jsonFileData);
      localStorage.setItem(
        STORAGE_KEY_UPDATE + loginStatus.id,
        jsonFileData.quotationTemplateData,
      );
      localStorage.setItem(
        FOOTER_STORAGE_KEY_UPDATE + loginStatus.id,
        jsonFileData.defaultFooter,
      );

      localStorage.setItem(
        HEADER_STORAGE_KEY_UPDATE + loginStatus.id,
        jsonFileData.defaultHeader,
      );

      localStorage.setItem(
        PAGE_BLOCK_LAYOUT_UPDATE + loginStatus.id,
        jsonFileData.defaultPageLayout,
      );
    }
  }, [jsonFileData]);

  const getPlaceholderForQuotation = () => {
    setIsLogingForData(true);
    try {
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
        });
    } catch (e) {
      handleApiError(e);
    }
  };

  useEffect(() => {
    getPlaceholderForQuotation();
    getQuotationTemplate();
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
              <QuotationIconSvg
                strokeWidth={2}
                size={26}
                className="text-blue-600"
                showCurrency={true}
              />
              <span className="flex items-center gap-2 section-header-custom">
                <span>Quotation Template Builder</span>

                {quotationTemplate?.name && (
                  <span className="caption-custom text-gray-500">
                    (Editing:{" "}
                    <span className="font-medium text-gray-700">
                      {quotationTemplate.name}
                    </span>
                    )
                  </span>
                )}
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
            QuotationSummeryBlock,
            EmptyLineBlockQuotation,

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
          <QuotationTemplateSettingsPanelUpdate
            editQuotationTemplateJson={quotationTemplate}
          />
        </Editor>
      </DynamicFieldsContext.Provider>
    </div>
  );
};
