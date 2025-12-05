import { useUserPreference } from "../../../../context/user/UserPreference";
import SettingsTabs from "../../../tabs/SettingTabs";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

function SettingsPage() {
  const { userPreference } = useUserPreference();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  return (
    <div className="w-full text center">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div
          className={`w-full pt-2 ${
            userPreference.isLeftMenu ? "pl-5" : "pl-1"
          } pr-1 gap-1`}
        >
          <div className="sticky top-6 p-1 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm   w-full">
            <div className="flex w-full gap-2 justify-center">
              <div className="flex">
                <span className="section-header-custom">
                  Tailor Settings to Your Needs
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-y-auto rounded-lg shadow-sm pt-2">
            <SettingsTabs></SettingsTabs>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default SettingsPage;
