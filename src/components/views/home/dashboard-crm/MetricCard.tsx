import React from 'react';
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";


interface MetricCardProps {
  title: string;
  value: string;
  icon : React.ElementType,
  color: string;
  gradient: string;
  visibility:boolean;
  id : string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value,  
  icon: Icon,
  color, 
  gradient,
  visibility,
  id
}) => {
    const [ref, inView] = useInView({ fallbackInView: false, threshold: 0.1 });

  if(!visibility) return null;
  // return (
  //   <motion.section
  //     ref={ref}
  //     initial={{ opacity: 0, y: 40 }}
  //     animate={inView ? { opacity: 1, y: 0 } : {}}
  //     transition={{ duration: 0.4, ease: "easeOut" }}
      
  //   >
  //   <div className="relative overflow-hidden min-w-44 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
  //     <div className={`absolute inset-0 ${gradient} opacity-5`}></div>
  //     <div className="relative p-6">
  //       <div className="flex items-center justify-between mb-4">
  //         <div className={`p-3 rounded-xl ${color} shadow-lg`}>
  //           <Icon className="w-6 h-6 text-white" />
  //         </div>
  //       </div>
  //       <div>
  //         <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
  //         <p className="text-3xl font-bold text-gray-900">{value}</p>
  //       </div>
  //     </div>
  //   </div>
  //   </motion.section>
  // );
  return (
    <div id={id} className="w-full">
  <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <div  className="relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
        <div className={`absolute inset-0 ${gradient} opacity-5`}></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="tabel-header-custom mb-1">{title}</p>
            <p className="main-title-custom">{value}</p>
          </div>
        </div>
      </div>
    </motion.section>
    </div>
);

};

export default MetricCard;