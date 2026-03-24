import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { PageLayout } from "../../ui/PageLayout";
import { Outlet } from "react-router-dom";
import IntegrationsTabs from "../../tabs/IntegrationsTabs";
import { Settings } from "lucide-react";
import { ComponentHeaderAndLogo } from "../../ui/ComponentHeaderAndLogo";

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
             <ComponentHeaderAndLogo
              headerText="Settings- Integration"
              logo={Settings}
             />
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
}

export default IntegrationsPage;
