/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Eye, Edit, CheckCircle, XCircle, Star, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EmailTemplate from "../../../@types/email-template/EmailTemplateType";
import ApiError from "../../../@types/error/ApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import RefreshToken from "../../../config/validations/RefreshToken";
import { SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import MESSAGE from "../../../constants/Messages";
import POST_API from "../../../constants/PostApi";
import ROUTES_URL from "../../../constants/Routes";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import Button from "../../ui/Button";
import FormHeader from "../../ui/FormHeader";

export type TemplateListProps = {
  templates: EmailTemplate[];
  loading: boolean;
  hasmore: boolean;
  selectedTypeId: number;
  reset: () => void;
};

export const EmailTemplateList: React.FC<TemplateListProps> = ({
  templates,
  loading,
  hasmore,
  reset,
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(
    null
  );

  const { userHasAccessToUpdateEmailTemplateSetting } = useUserAccessModules();
  const navigate = useNavigate();

  const handleEditTemplate = (emailTemplate: EmailTemplate): void => {
    navigate(
      `${ROUTES_URL.EMAIL_TEMPLATE_UPDATE}?template_type_id=${emailTemplate.email_type_id}&template_id=${emailTemplate.id}`
    );
  };
  const { loginStatus } = useLoggedInUserContext();

  const handleDefaultToggle = async (template: EmailTemplate) => {
    if (!userHasAccessToUpdateEmailTemplateSetting) {
      toast.error("You don't have access to update the default status.");
      return;
    }

    try {
      const postDataUpdateEmailTemplate = {
        company_id: loginStatus.companyId,
        updatedby_id: loginStatus.id,
        id: template.id,
        email_type_id: template.email_type_id,
        name: null,
        email_subject: null,
        email_body_html: null,
        email_body_json: null,
        isactive: template.isactive,
        is_default: template.is_default,
      };

      await axios
        .post(POST_API.UPDATE_EMAIL_TEMPLATE, postDataUpdateEmailTemplate, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            reset();
            toast.success(response.data.message);
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunctionWithParamsNotEvent: handleDefaultToggle,
            });
            if (refreshTokenResponse) {
              handleDefaultToggle(template);
            }
          }
        });
    } catch (error: ApiError | any) {
      console.error("Failed to update default status:", error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithParamsNotEvent: handleDefaultToggle,
        });
        if (refreshTokenResponse) {
          handleDefaultToggle(template);
        }
      }
      toast.error("Failed to update default status.");
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
            className="bg-white shadow rounded-lg p-4 border hover:shadow-md transition duration-200 ease-in-out"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="table-header-custom">{template.name}</h3>
                <p className="table-data-custom">
                  <strong className="input-label-custom">Subject:</strong>{" "}
                  <span className="caption-custom">
                    {template.email_subject || <em>No subject</em>}
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
                  // className="px-3 py-1 text-sm border rounded"
                  aria-label={`Preview ${template.name}`}
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <Eye size={SIZE.SIXTEEN} />
                    View
                  </div>
                </Button>
                <Button
                type="submit"
                  // className="px-3 py-1 text-sm border rounded"
                  aria-label={`Edit ${template.name}`}
                  disabled={
                    !userHasAccessToUpdateEmailTemplateSetting ||
                    template.is_master
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      userHasAccessToUpdateEmailTemplateSetting &&
                      !template.is_master
                    ) {
                      handleEditTemplate(template);
                    } else {
                      toast.error(
                        template.is_master
                          ? "Can't Update Master Templates!"
                          : "You don't have access!"
                      );
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

            <div className="flex  items-center justify-between col-span-2 input-label-custom">
              {/* <div className="grid  items-center justify-between grid-cols-2 space-y-2   text-sm text-gray-700"> */}

              <div className="flex flex-col col-span-1">
                {/* Active */}
                <span className="flex items-center mb-2 justify-between gap-2">
                  {template.isactive ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <XCircle className="text-gray-400" size={16} />
                  )}
                  <strong className="input-label-custom">Active: </strong>
                  <label className="inline-flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={template.isactive}
                      id={`active-${template.id}`}
                      onChange={() => {
                        if (!template.is_master) {
                          if (!template.is_default) {
                            if (
                              userHasAccessToUpdateEmailTemplateSetting &&
                              !template.is_master
                            ) {
                              template.isactive = !template.isactive;
                              handleDefaultToggle(template);
                            } else {
                              if (template.is_master) {
                                toast.error(
                                  "Can't change active status of master template."
                                );
                              } else {
                                toast.error(MESSAGE.ERROR.NOT_ATHORISED);
                              }
                            }
                          } else {
                            toast.error(
                              "To make this inactive, please set another template as default first."
                            );
                          }
                        } else {
                          toast.error(
                            "The master template cannot be deactivated."
                          );
                        }
                      }}
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />
                  </label>
                </span>

                {/* Default */}
                <span className="flex items-center mb-2 justify-between gap-2">
                  {template.is_default ? (
                    <Star className="text-yellow-500" size={16} />
                  ) : (
                    <XCircle className="text-gray-400" size={16} />
                  )}
                  <strong className="input-label-custom">Default: </strong>
                  <label className="inline-flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={template.is_default}
                      id={`default-${template.id}`}
                      onChange={() => {
                        if (template.isactive) {
                          if (!template.is_default) {
                            if (userHasAccessToUpdateEmailTemplateSetting) {
                              template.is_default = !template.is_default;
                              handleDefaultToggle(template);
                            } else {
                              toast.error(MESSAGE.ERROR.NOT_ATHORISED);
                            }
                          } else {
                            toast.error(
                              "Please make another template the default to remove this one as default."
                            );
                          }
                        } else {
                          toast.error(
                            "Set this template as active to make it your default email template."
                          );
                        }
                      }}
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />
                  </label>
                </span>

                {/* Master (readonly toggle → disabled) */}
                <span className="flex items-center mb-2 gap-2">
                  {template.is_master ? (
                    <Star className="text-purple-500" size={16} />
                  ) : (
                    <XCircle className="text-gray-400" size={16} />
                  )}
                  <strong className="input-label-custom">Master:</strong>
                  <span
                    className={
                      template.is_master
                        ? "caption-custom-blue"
                        : "caption-custom"
                    }
                  >
                    {template.is_master ? "Yes" : "No"}
                  </span>
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600 -mt-3">
                <div className="px-3 rounded-md">
                  <p>
                    <strong className="input-label-custom">Created By:</strong>{" "}
                    <span className="caption-custom">{template.createdby}</span>
                  </p>
                  <p>
                    <strong className="input-label-custom">Created On:</strong>{" "}
                    <span className="caption-custom">{template.createdon}</span>
                  </p>
                  <p>
                    <strong className="input-label-custom">Updated By:</strong>{" "}
                    <span className="caption-custom">{template.updatedby}</span>
                  </p>
                  <p>
                    <strong className="input-label-custom">Updated On:</strong>{" "}
                    <span className="caption-custom">{template.updatedon}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && hasmore && (
        <div className="flex justify-center items-center flex-1">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      )}

      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <FormHeader
              icon={Eye}
              preText={"Preview:"}
              userName={previewTemplate.name}
              description={`This is the preview of ${previewTemplate.name} HTML template.`}
              onClose={() => setPreviewTemplate(null)}
            />
            <div
              className="overflow-y-auto flex-1 border rounded p-4 text-sm text-gray-800 bg-gray-50"
              dangerouslySetInnerHTML={{
                __html: previewTemplate.email_body_html,
              }}
            />
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