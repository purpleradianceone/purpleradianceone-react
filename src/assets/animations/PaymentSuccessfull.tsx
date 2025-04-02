import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-3"
    >
      <motion.div 
        initial={{ rotate: -180, scale: 0 }} 
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <CheckCircle size={60} className="text-green-500" />
      </motion.div>
      <motion.p 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold text-gray-700"
      >
        Payment Successful!
      </motion.p>
      
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: "100%" }} 
        transition={{ duration: 3, ease: "easeOut" }}
        className="h-1 bg-green-500 rounded-full mt-2"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        className="text-sm text-gray-500"
      >
        Redirecting...
      </motion.div>
    </motion.div>
  );
};

export default PaymentSuccess;
