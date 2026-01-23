import SettingsTabs from "../../../tabs/SettingTabs";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { PageLayout } from "../../../ui/PageLayout";
import {  Outlet } from "react-router-dom";

function SettingsPage() {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  return (
    <div className="w-full h-full ">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <PageLayout>
          <div className="sticky top-0 z-50  py-1 flex items-center justify-between  bg-gray-50 rounded-sm shadow-sm   w-full">
            <div className="flex w-full gap-2 justify-start pl-1">
              <div className="flex">
                <span className="section-header-custom">Settings</span>
              </div>
            </div>
          </div>
          <div className="sticky top-8 z-20">
          <SettingsTabs />
          </div>
          <div className="px-1 ">

          <div className="border rounded-md bg-gray-50">

          <Outlet />
          </div>
          </div>
        </PageLayout>
      </motion.section>
    </div>
  );
}

export default SettingsPage;
