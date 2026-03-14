import { motion } from "framer-motion";
import { ListChecks } from "lucide-react";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Outlet } from "react-router-dom";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import TaskTab from "../../tabs/TaskTab";
import { PageLayout } from "../../ui/PageLayout";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";

function TaskPage() {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { userHasAccessToViewTasks } = useUserAccessModules();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(
    !userHasAccessToViewTasks,
  );

  return (
    <PageLayout>
      {userHasAccessToViewTasks ? (
        <div className="w-full h-full ">
          <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="sticky top-0 z-50  py-1  flex items-center justify-between bg-gray-50 rounded-sm shadow-sm   w-full">
              <div className="flex w-full gap-2 justify-start pl-1">
                <div className="flex items-center gap-1">
                  <ListChecks className="w-5 h-5 text-blue-600" />
                  <span className="section-header-custom">Tasks</span>
                </div>
              </div>
            </div>
            {
              <div className="sticky top-1 left-0 z-20">
                <TaskTab />
              </div>
            }
            <div className="">
              <div className="border rounded-md  bg-gray-50">
                <Outlet />
              </div>
            </div>
          </motion.section>
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
    </PageLayout>
  );
}
export default TaskPage;
