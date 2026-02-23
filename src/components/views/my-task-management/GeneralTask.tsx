/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client/AxiosClient";
import POST_API from "../../../constants/PostApi";
import toast from "react-hot-toast";
import Button from "../../ui/Button";
import TextAreaInput from "../../ui/TextAreaInput";
import ToggleButton from "../../ui/ToggleButton";
import LoadingPopUpAnimation from "../card/LoadingPopUpAnimation";
import CustomDropdown from "../../modals/leads/CustomDropdown";
import { FileText, Flag, ChevronRight } from "lucide-react";
import useTaskStage from "../../../config/hooks/useTaskStage";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import ROUTES_URL from "../../../constants/Routes";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import { handleApiError } from "../../../config/error/handleApiError";
import { MytaskQueryKey } from "../../lists/MyAllTaskManagementList";

function GeneralTask() {
  const { loginStatus } = useLoggedInUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<any>(null);
  const { taskStage } = useTaskStage();
  const [searchParams] = useSearchParams();
  const { userHasAccessToUpdateAllTasks } = useUserAccessModules();
  const [selectedGeneralTask, setSelectedGeneralTask] = useState<any>(
    JSON.parse(searchParams.get(MytaskQueryKey) || "{}"),
  );

  useEffect(() => {
    if (!userHasAccessToUpdateAllTasks) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToUpdateAllTasks]);
  /* ---------- FORM DATA ---------- */
  const [formData, setFormData] = useState({
    remark: "",
    taskStageId: undefined as number | undefined,
    isActive: false,
  });
  /* ---------- GET TASK ---------- */
  useEffect(() => {
    if (!selectedGeneralTask) return;
    console.log(selectedGeneralTask);

    const data = {
      remark: selectedGeneralTask.remark || "",
      taskStageId: selectedGeneralTask.taskStageId || undefined,
      isActive: selectedGeneralTask.isActive,
    };

    setFormData(data);
    // 👇 store original copy
    setOriginalFormData(data);
  }, [selectedGeneralTask]);

  const hasChanges = () => {
    if (!originalFormData) return false;

    return (
      originalFormData.remark !== formData.remark ||
      originalFormData.taskStageId !== formData.taskStageId ||
      originalFormData.isActive !== formData.isActive
    );
  };

  /* ---------- HANDLERS ---------- */
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDropdownChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompanyUserToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { checked } = event.target;

    axiosClient
      .post(
        POST_API.UPDATE_GENERAL_TASK,
        {
          company_id: loginStatus.companyId,
          updatedby_id: loginStatus.id,
          id: selectedGeneralTask.id,
          isactive: checked,
        },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        if (res.data.status) {
          toast.success(res.data.message);
          const updatedTask = {
            ...selectedGeneralTask,
            isActive: checked,
          };
          setSelectedGeneralTask(updatedTask);
          const params = new URLSearchParams(location.search);
          params.set(MytaskQueryKey, JSON.stringify(updatedTask));

          navigate(`${location.pathname}?${params.toString()}`, {
            replace: true,
          });
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  };

  const autoSave = async () => {
    if (!hasChanges()) return; // 🚀 no changes = no API
    await updateTask();
    // update original after save
    setOriginalFormData(formData);
  };

  /* ---------- UPDATE ---------- */
  const updateTask = async () => {
    try {
      setIsSubmitting(true);
      const res = await axiosClient.post(
        POST_API.UPDATE_GENERAL_TASK,
        {
          company_id: loginStatus.companyId,
          updatedby_id: loginStatus.id,
          id: selectedGeneralTask.id,
          remark: formData.remark,
          isactive: formData.isActive,
          general_task_stage_id: formData.taskStageId,
        },
        {
          withCredentials: true,
        },
      );
      if (res.data.status) {
        toast.success(res.data.message);
        const updatedTask = {
          ...selectedGeneralTask,
          remark: formData.remark,
          taskStageId: formData.taskStageId,
          isActive: formData.isActive,
        };

        // ✅ Update local state
        setSelectedGeneralTask(updatedTask);
        // ✅ Update original form snapshot
        setOriginalFormData({ ...updatedTask });
        // ✅ Update URL query
        const params = new URLSearchParams(location.search);
        params.set(MytaskQueryKey, JSON.stringify(updatedTask));

        navigate(`${location.pathname}?${params.toString()}`, {
          replace: true,
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <>
      {userHasAccessToUpdateAllTasks ? (
        <div className=" w-full h-[100vh] pl-5 pt-2 ">
          <div className=" sticky top-10 z-20 bg-slate-100 flex text-center justify-start items-center gap-3 ml-0.5 ">
            <Link to={ROUTES_URL.TASKS_MANAGEMENT}>
              <Button className="caption-custom flex items-center justify-center hover:text-gray-800">
                My Tasks
              </Button>
            </Link>
            <ChevronRight size={16} />
            <h1 className="table-header-custom">My Task Details</h1>
          </div>
          <div className=" grid grid-cols-2 gap-1 p-4">
            <div className=" bg-gray-50 w-full  rounded">
              {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
              <div className=" bg-white border rounded-lg p-4 space-y-4 ">
                {/* HEADER */}
                <h1 className=" font-semibold text-gray-800 border-b pb-2 ">
                  General Task Update
                </h1>
                {/* ROW */}
                <div className=" grid grid-cols-2 gap-3">
                  <CustomDropdown
                    logo={Flag}
                    labelName="Task Stage"
                    options={taskStage}
                    preselectedOption={formData.taskStageId}
                    onSelect={(v) => {
                      handleDropdownChange("taskStageId", v);
                      autoSave();
                    }}
                  />
                  <div className="flex w-full items-end justify-end ">
                    <ToggleButton
                      label="Status"
                      wantLabel={true}
                      checked={formData.isActive}
                      name="isActive"
                      onToggle={handleCompanyUserToggle}
                    />
                  </div>

                  <div className="col-span-2">
                    <TextAreaInput
                      label="Remark"
                      logo={FileText}
                      value={formData.remark}
                      onChange={(e: any) => {
                        handleInputChange("remark", e.target.value);
                      }}
                      onBlur={autoSave}
                      cols={4}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" bg-gray-50 w-full m-2 px-2 rounded">
              <div className=" bg-white border rounded-lg p-4 space-y-4 ">
                <div className="grid grid-cols-2 gap-4 input-label-custom">
                  <div>
                    <label className="input-label-custom">Task Type</label>
                    <p>{selectedGeneralTask?.taskType}</p>
                  </div>
                  <div>
                    <label className="input-label-custom">Due Date Time</label>
                    <p>{selectedGeneralTask?.dueDateTime}</p>
                  </div>
                  <div>
                    <label className="input-label-custom">Description</label>
                    <p>{selectedGeneralTask?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-none mx-96 mt-14">
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpOpen}
            onClose={() => {
              setAccessDeniedPopUpOpen(false);
              window.history.back();
            }}
          />
        </div>
      )}
    </>
  );
}

export default GeneralTask;
