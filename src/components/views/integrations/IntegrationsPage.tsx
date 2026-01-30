import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { PageLayout } from "../../ui/PageLayout";
import { Outlet } from "react-router-dom";
import IntegrationsTabs from "../../tabs/IntegrationsTabs";

function IntegrationsPage() {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  return(
     <PageLayout>
      <div className="w-full h-full ">
        <motion.section
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-50  py-1  flex items-center justify-between  bg-gray-50 rounded-sm shadow-sm   w-full">
            <div className="flex w-full gap-2 justify-start pl-1">
              <div className="flex">
                <span className="section-header-custom">Setting - Integration</span>
              </div>
            </div>
          </div>
          <div className="sticky top-8 left-0 z-20">
             <IntegrationsTabs/>
          </div>
          <div className="">
            <div className="border rounded-md  bg-gray-50">
              <Outlet />
            </div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  )
  // return (
  //   <div className="w-full text center">
  //     <motion.section
  //       ref={ref}
  //       initial={{ opacity: 0, y: 40 }}
  //       animate={inView ? { opacity: 1, y: 0 } : {}}
  //       transition={{ duration: 0.4, ease: "easeOut" }}
  //     >
  //       <div
  //         className={`w-full pt-2 ${
  //           userPreference.isLeftMenu ? "pl-5" : "pl-1"
  //         } pr-1 gap-1`}
  //       >
  //         <div className="sticky top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
  //           <div className="flex w-full gap-2 justify-center">
  //             <div className="flexr">
  //               <span className="section-header-custom">
  //                 Inegration setting 
  //               </span>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
  //          <IntegrationsTabs/>
  //         </div>
  //       </div>
  //     </motion.section>
  //   </div>
  // );
}

export default IntegrationsPage;
