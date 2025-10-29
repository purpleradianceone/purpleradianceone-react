import { useState } from "react";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import { motion } from "framer-motion";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { useInView } from "react-intersection-observer";

const StockManagement = () =>{
const { userHasAccessToViewProduct } = useUserAccessModules();
//   const { loginStatus } = useLoggedInUserContext();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

     const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState<boolean>(
        false
      );
    return(
       <div className="w-full">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
      {userHasAccessToViewProduct ? (
        <>
          <div>
          </div>
        </>
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
      </motion.section>
    </div>
    )
}

export default StockManagement;