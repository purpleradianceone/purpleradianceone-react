import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useInView } from "react-intersection-observer";

function AboutUs() {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  return (
    <div className="w-full pt-20 bg-gradient-to-t from-blue-200 via-blue-100 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      id="aboutUs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About Purple CRM
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We empower businesses to build better relationships with customers
            through a modern, intuitive CRM platform designed to scale with your
            growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Our Mission
            </h3>
            <p className="text-gray-600">
              Helping companies succeed by simplifying customer management
              through automation, insights, and seamless integration.
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Our Vision
            </h3>
            <p className="text-gray-600">
              To become the most trusted CRM solution for startups, enterprises,
              and everyone in between.
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Our Values
            </h3>
            <p className="text-gray-600">
              Customer-first approach, innovation, simplicity, and transparency
              in everything we do.
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Why Choose Us
            </h3>
            <p className="text-gray-600">
              We deliver a powerful yet easy-to-use CRM platform backed by
              expert support and constant innovation tailored for your success.
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Our Technology
            </h3>
            <p className="text-gray-600">
              Built with the latest scalable technologies, our CRM ensures
              speed, security, and flexibility for businesses of all sizes.
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Global Impact
            </h3>
            <p className="text-gray-600">
              Serving clients worldwide, we help diverse industries connect with
              their customers and grow beyond boundaries.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
    </div>
    </div>
  );
}

export default AboutUs;
