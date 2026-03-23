/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, Edit, CheckCircle, XCircle, Loader2, X } from "lucide-react";
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
import FormHeader from "../../ui/FormHeader";
import ToggleButton from "../../ui/ToggleButton";
import QuotationTemplate from "../quotation-template-types/QuotationTemplate";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";

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
  const [previewTemplate, setPreviewTemplate] = useState<QuotationTemplate | null>(null);

  const { userHasAccessToUpdateQuotationTemplate } = useUserAccessModules();
  const navigate = useNavigate();

  const handleEditTemplate = (quotationTemplate: QuotationTemplate): void => {
    navigate(
      `${ROUTES_URL.QUOTATION_SETTINGS_UPDATE_TEMPLATE}?template_id=${quotationTemplate.id}`,
    );
  };
  const { loginStatus } = useLoggedInUserContext();

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

  return (
    <>
      {templates.length === 0 && !loading && !hasmore && (
        <div className="text-center caption-custom mt-10 p-4 border rounded-md bg-white shadow-sm">
          No templates found.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="flex justify-center h-full items-center">
          <Loader2 className="animate-spin text-blue-600" size={30} />
        </div>
      )}

      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <FormHeader
              icon={Eye}
              preText={"Preview:"}
              userName={previewTemplate.name}
              description={`This is the preview of ${previewTemplate.name} template.`}
              onClose={() => setPreviewTemplate(null)}
            />
            {/* <div
              className="overflow-y-auto flex-1 border rounded p-4 text-sm text-gray-800 bg-gray-50"
              dangerouslySetInnerHTML={{
                __html: previewTemplate.email_body_html,
              }}
            /> */}
            <div className="relative text-right justify-items-end justify-end items-end w-full">
              <div className="w-fit">
                <Button type="button" onClick={() => setPreviewTemplate(null)}>
                  <div className="flex items-center justify-center gap-0.5">
                    <X size={SIZE.SIXTEEN} />
                    Close
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
