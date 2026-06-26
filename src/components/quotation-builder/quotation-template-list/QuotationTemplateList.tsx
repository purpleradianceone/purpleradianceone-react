/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, Edit, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ApiError from "../../../@types/error/ApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import MESSAGE from "../../../constants/Messages";
import POST_API from "../../../constants/PostApi";
import ROUTES_URL from "../../../constants/Routes";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import Button from "../../ui/Button";
import ToggleButton from "../../ui/ToggleButton";
import QuotationTemplate from "../quotation-template-types/QuotationTemplate";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import CustomDocumentPreviewComponent from "../../custom-document-preview-component/CustomDocumentPreviewComponent";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";

export type QuotationTemplateListProps = {
  templates: QuotationTemplate[];
  loading: boolean;
  hasmore: boolean;
  reset: () => void;
};

export const QuotationTemplateList: React.FC<QuotationTemplateListProps> = ({
  templates,
  loading,
  hasmore,
  reset,
}) => {
  const [previewTemplate, setPreviewTemplate] =
    useState<QuotationTemplate | null>(null);

  const { userHasAccessToUpdateQuotationTemplate } = useUserAccessModules();
  const navigate = useNavigate();

  const handleEditTemplate = (quotationTemplate: QuotationTemplate): void => {
    navigate(
      `${ROUTES_URL.QUOTATION_SETTINGS_UPDATE_TEMPLATE}?template_id=${quotationTemplate.id}`,
    );
  };
  const { loginStatus } = useLoggedInUserContext();

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isLoadingForGenerateTemplate, setisLoadingForGenerateTemplate] =
    useState<boolean>(true);

  const handleDefaultToggle = async (template: QuotationTemplate) => {
    if (!userHasAccessToUpdateQuotationTemplate) {
      toast.error("You don't have access to update quotation template.");
      return;
    }

    if (loginStatus.companyId === 0) return;

    try {
      const blob = new Blob([], { type: "application/json" });
      const file = new File([blob], `quotationTemplate.json`, {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("company_id", `${loginStatus.companyId}`);
      formData.append("id", `${template.id}`);
      formData.append("isactive", `${template.isactive}`);
      formData.append("updatedby_id", `${loginStatus.id}`);
      formData.append("file", file);
      formData.append("name", "");
      formData.append("description", "");

      await axiosClient
        .post(POST_API.UPDATE_QUOTATION_TEMPLATE, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            reset();
            toast.success(response.data.message);
          }
        })
        .catch(async (error: ApiError | any) => {
          handleApiError(error);
        });
    } catch (error: ApiError | any) {
      handleApiError(error);
    } finally {
      //
    }
  };

  const handleQuotationPdfGeneration = async (templateId: number) => {
    try {
      setisLoadingForGenerateTemplate(true);
      const payload = {
        // quotationId: "QT-2026-0001",
        quotation_template_id: templateId,
        company_id: loginStatus.companyId,
        generatedby_id: loginStatus.id,
        // quotation_account: {
        //   id: 101,
        //   company_id: 1,
        //   name: "PurpleRadiance Pvt Ltd",
        //   email: "contact@purpleradiance.com",
        //   mobilenumber: "9876543210",
        //   industry_type_id: 3,
        //   industry_type_name: "Information Technology",
        //   business_type_id: 2,
        //   business_type_name: "Private Limited",
        //   country_id: 101,
        //   state_id: 27,
        //   district_id: 501,
        //   country_name: "India",
        //   state_name: "Maharashtra",
        //   district_name: "Pune",
        //   pan: "ABCDE1234F",
        //   gst: "27ABCDE1234F1Z5",
        //   tan: "PNEA12345B",
        //   billing_address: "PurpleRadiance, Office No. 07, Chandhere Complex, Viman Nagar, Pune - 411057",
        //   shipping_address: "Warehouse 5, Chandan Nagar, Pune - 411018",
        //   registered_office_address: "PurpleRadiance, Office No. 07, Chandhere Complex, Viman Nagar, Pune - 411045",
        //   business_registration_number: "U12345MH2020PTC123456",
        //   website: "https://www.technova.com",
        //   isactive: true,
        //   createdby: "admin@purpleradiance.com",
        //   createdon: "2026-03-23T10:30:00",
        //   requestedby: 45,
        //   lead_id: 789,
        //   company_account_type_id_array: [1, 2, 3],
        //   createdby_id: 10,
        //   updatedby_id: 12,
        // },
        // quotation_items: [
        //   {
        //     productName: "Laptop Dell Inspiron 15 : Laptop Dell Inspiron 15 Laptop Dell Inspiron 15 ",
        //     quantity: 2,
        //     unitPrice: 55000.0,
        //     discountPercent: 10.0,
        //     gstPercent: 18.0,
        //     cgstPercent: 9.0,
        //     lineSubTotal: 99000.0,
        //   },
        //   {
        //     productName: "Wireless Mouse Logitech M235",
        //     quantity: 5,
        //     unitPrice: 800.0,
        //     discountPercent: 5.0,
        //     gstPercent: 18.0,
        //     cgstPercent: 9.0,
        //     lineSubTotal: 3800.0,
        //   },
        //   {
        //     productName: "Office Chair Ergonomic",
        //     quantity: 3,
        //     unitPrice: 7000.0,
        //     discountPercent: 15.0,
        //     gstPercent: 18.0,
        //     cgstPercent: 9.0,
        //     lineSubTotal: 17850.0,
        //   },
        // ],
      };

      const response = await axiosClient.post(
        POST_API.QUOTATION_PDF_GENERATION,
        payload,
        {
          responseType: "blob",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(url);
      setisLoadingForGenerateTemplate(false);
      
      // window.open(url);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = `${payload.quotationId}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to generate quotation PDF", error);
      handleApiError(error);
      setisLoadingForGenerateTemplate(false);
    }
  };

  return (
    <>
      {templates.length === 0 && !loading && !hasmore && (
        <div className="text-center caption-custom mt-10 p-4 border rounded-md bg-white shadow-sm">
          No templates found.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-200 ease-in-out">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white shadow rounded-lg p-4 border hover:shadow-md transition duration-200 ease-in-out flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="table-header-custom">{template.name}</h3>

                <p
                  className="table-data-custom mt-2"
                  title={template.description || ""}
                >
                  <strong className="input-label-custom">Description:</strong>{" "}
                  <span className="caption-custom line-clamp-3 ">
                    {template.description || <em></em>}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setPreviewTemplate(template);
                    handleQuotationPdfGeneration(template.id);
                  }}
                  aria-label={`Preview ${template.name}`}
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <Eye size={SIZE.SIXTEEN} />
                    View
                  </div>
                </Button>

                <Button
                  type="submit"
                  aria-label={`Edit ${template.name}`}
                  disabled={!userHasAccessToUpdateQuotationTemplate}
                  onClick={(e) => {
                    e.preventDefault();
                    if (userHasAccessToUpdateQuotationTemplate) {
                      handleEditTemplate(template);
                    } else {
                      toast.error("You don't have access!");
                    }
                  }}
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <Edit size={SIZE.SIXTEEN} />
                    Edit
                  </div>
                </Button>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex items-center justify-between col-span-2 input-label-custom">
                <div className="flex flex-col col-span-1">
                  {/* Active */}
                  <span className="flex items-center mb-2 justify-between gap-2">
                    {template.isactive ? (
                      <CheckCircle className="text-green-500" size={16} />
                    ) : (
                      <XCircle className="text-gray-400" size={16} />
                    )}

                    <strong className="input-label-custom">Active: </strong>

                    <ToggleButton
                      checked={template.isactive}
                      name={`active-${template.id}`}
                      onToggle={() => {
                        if (userHasAccessToUpdateQuotationTemplate) {
                          template.isactive = !template.isactive;
                          handleDefaultToggle(template);
                        } else {
                          toast.error(MESSAGE.ERROR.NOT_ATHORISED);
                        }
                      }}
                    />
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 -mt-3">
                  <div className="px-3 rounded-md">
                    <p>
                      <strong className="input-label-custom">
                        Created By:
                      </strong>{" "}
                      <span className="caption-custom">
                        {template.createdby}
                      </span>
                    </p>
                    <p>
                      <strong className="input-label-custom">
                        Created On:
                      </strong>{" "}
                      <span className="caption-custom">
                        {template.createdon}
                      </span>
                    </p>
                    <p>
                      <strong className="input-label-custom">
                        Updated By:
                      </strong>{" "}
                      <span className="caption-custom">
                        {template.updatedby}
                      </span>
                    </p>
                    <p>
                      <strong className="input-label-custom">
                        Updated On:
                      </strong>{" "}
                      <span className="caption-custom">
                        {template.updatedon}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && hasmore && (
        <div className="flex justify-center h-[7vh] items-center transition duration-200 ease-in-out">
          <Loader2 className="animate-spin text-blue-600" size={30} />
        </div>
      )}

      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewTemplate(null)}
        >
          {" "}
          {isLoadingForGenerateTemplate ? (
            <LoadingPopUpAnimation
              show={isLoadingForGenerateTemplate}
              text="Loading preview..."
            />
          ) : (
            <CustomDocumentPreviewComponent
              fileUrl={pdfPreviewUrl ?? ""}
              fileExtension="pdf"
              enableDownload={true}
              width={"60%"}
              height={"90%"}
            />
          )}
        </div>
      )}
    </>
  );
};
