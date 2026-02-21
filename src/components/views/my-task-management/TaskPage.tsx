import { useInView } from "react-intersection-observer";
import { PageLayout } from "../../ui/PageLayout";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import TaskTab from "../../tabs/TaskTab";

function TaskPage() {
    const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

    return (
        <PageLayout>
            <div className="w-full h-full ">
                <motion.section
                    ref={ref}
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    {<div className="sticky top-1 left-0 z-20">
                        <TaskTab />
                    </div>}
                    <div className="">
                        <div className="border rounded-md  bg-gray-50">
                            <Outlet />
                        </div>
                    </div>
                </motion.section>
            </div>
        </PageLayout>
    );
}
export default TaskPage;