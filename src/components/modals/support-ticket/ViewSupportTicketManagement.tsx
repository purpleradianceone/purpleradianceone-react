import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useUserPreference } from "../../../context/user/UserPreference";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewSupportTicketManagement = () => {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { userPreference } = useUserPreference();
  const navigate = useNavigate();

  return (
    <div
      className={`fixed top-8 inset-0 z-10 bg-white ${
        userPreference.isLeftMenu ? "ml-[54px] mt-4" : " mt-6"
      } overflow-auto`}
    >
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex mt-1 bg-slate-100 mx-2 p-0.5 rounded  items-center justify-between     ">
          <div className="flex w-[30%] gap-6">
            <button
              className="flex items-center gap-1 caption-custom justify-center hover:text-blue-600 "
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowLeft size={14} />
              <span>back</span>
            </button>
          </div>

          {}
        </div>
      </motion.section>
    </div>
  );
};
export default ViewSupportTicketManagement;
