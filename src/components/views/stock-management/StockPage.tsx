import { useInView } from "react-intersection-observer";
import { PageLayout } from "../../ui/PageLayout";
import { motion } from "framer-motion";
import StockTab from "../../tabs/StockTab";
import { Outlet } from "react-router-dom";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import { useState } from "react";
import { Layers } from "lucide-react";
import COLORS from "../../../constants/Colors";

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
            <div className="bg-white overflow-hidden px-2 mb-2">
            {/* Header */}
            <div>
            <div className="flex items-center gap-3 py-1.5">
              <div className={`p-2 rounded-lg ${COLORS.PAGE_HEADER_SECTION_BG_COLOR}`}>
              <Layers className={COLORS.PAGE_HEADER_ICONS_COLOR_AND_SIZE} />
            </div>

              <div>
                <h1 className="page-header-custom tracking-tight">
                  Stock
                </h1>
                <p className="page-subtitle-custom">
                  Manage and track your inventory in real-time
                </p>
              </div>
            </div>
            </div>

            <div className="sticky top-1 left-0 z-20">
              <StockTab />
            </div>

            <div className="">
              <div className="my-2 border rounded-md ">
                <Outlet />
              </div>
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
