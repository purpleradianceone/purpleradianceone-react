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
import { FileText, Save, Flag, ChevronRight } from "lucide-react";
import useTaskStage from "../../../config/hooks/useTaskStage";
import { Link, useSearchParams } from "react-router-dom";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import ROUTES_URL from "../../../constants/Routes";

function GeneralTask() {
  const { loginStatus } = useLoggedInUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { taskStage } = useTaskStage();
  const [searchParams] = useSearchParams();
  const [selectedGeneralTask] = useState<any>(
    JSON.parse(searchParams.get("task") || "{}"),
  );
  /* ---------- FORM DATA ---------- */
  const [formData, setFormData] = useState({
    remark: "",
    taskStage: undefined as number | undefined,
    isActive: true,
  });
  /* ---------- GET TASK ---------- */
  useEffect(() => {
    if (!selectedGeneralTask) return;
    console.log(selectedGeneralTask);

    setFormData({
      remark: selectedGeneralTask.remark || "",
      taskStage: selectedGeneralTask.taskStageId || undefined,
      isActive: selectedGeneralTask.isActive,
    });
  }, [selectedGeneralTask]);

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

    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  /* ---------- UPDATE ---------- */
  const updateTask = async () => {
    try {
      setIsSubmitting(true);
      await axiosClient.post(
        POST_API.UPDATE_GENERAL_TASK,
        {
          company_id: loginStatus.companyId,
          updatedby_id: loginStatus.id,
          id: selectedGeneralTask.id,
          remark: formData.remark,
          isactive: formData.isActive,
          general_task_stage_id: formData.taskStage,
        },
        {
          withCredentials: true,
        },
      );
      toast.success("Task Updated");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Update Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- UI ---------- */
  return (
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
      <div className=" bg-gray-50 w-full m-2 px-2 rounded">
        {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
        <div className=" bg-white border rounded-lg p-4 space-y-4 ">
          {/* HEADER */}
          <h1 className=" font-semibold text-gray-800 border-b pb-2 ">
            General Task Update
          </h1>
          {/* ROW */}
          <div className=" grid grid-cols-3 gap-3  ">
            <CustomDropdown
              logo={Flag}
              labelName="Task Stage"
              options={taskStage}
              preselectedOption={formData.taskStage}
              onSelect={(v) => handleDropdownChange("taskStage", v)}
            />

            <div>
              <label className="input-label-custom">Task Type</label>
              <p>{selectedGeneralTask?.taskType}</p>
            </div>
            <div>
              <label className="input-label-custom">Due Date Time</label>
              <p>{selectedGeneralTask?.dueDateTime}</p>
            </div>

            <div className="col-span-2">
              <TextAreaInput
                label="remark"
                logo={FileText}
                value={formData.remark}
                onChange={(e: any) =>
                  handleInputChange("remark", e.target.value)
                }
                cols={4}
                rows={3}
              />
            </div>
            <div className="flex w-full items-end justify-start ">
              <ToggleButton
                label="Status"
                wantLabel={true}
                checked={formData.isActive}
                name="isActive"
                onToggle={handleCompanyUserToggle}
              />
            </div>
          </div>
          {/* SAVE */}
          <div className="flex justify-end">
            <div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  updateTask();
                }}
              >
                <div className="flex gap-2 items-center">
                  <Save size={15} />
                  Save
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralTask;
