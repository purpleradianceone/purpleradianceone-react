import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ROUTES_URL from '../../../../constants/Routes';
import { motion } from 'framer-motion';

function CallToAction() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full bg-blue-600 py-20"
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses that trust our CRM to drive growth and improve customer relationships.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            type='button'
            onClick={() => {
              navigate(ROUTES_URL.SIGN_UP);
            }}
            className="bg-white text-blue-600 px-8 py-4 rounded-full hover:bg-blue-50 flex items-center justify-center"
          >
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-blue-700">
            Contact Sales
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default CallToAction;
