import { useInView } from "react-intersection-observer";
import { PageLayout } from "../../ui/PageLayout";
import { motion } from "framer-motion";
import StockTab from "../../tabs/StockTab";
import { Outlet } from "react-router-dom";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import { useState } from "react";
import { Layers } from "lucide-react";

function StockPage() {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { userHasAccessToViewStock } = useUserAccessModules();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(
    !userHasAccessToViewStock,
  );

  return (
    <PageLayout>
      {userHasAccessToViewStock ? (
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
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span className="section-header-custom">Stock</span>
                </div>
              </div>
            </div>

            <div className="sticky top-1 left-0 z-20">
              <StockTab />
            </div>

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

export default StockPage;
