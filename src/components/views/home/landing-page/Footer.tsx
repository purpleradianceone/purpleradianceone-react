import { Activity, Mail, Phone } from "lucide-react";
import ROUTES_URL from "../../../../constants/Routes";
import { motion } from "framer-motion";
import { AppVersionViewCard } from "../../card/AppVersionViewCard";

function Footer() {
  return (
    <div className="bg-gray-900 text-white">
    <motion.footer
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }} 
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">PurpleRadianceOne</h3>
            </div>
            <p className="caption-custom mb-6 max-w-md">
              The comprehensive customer relationship management platform trusted by businesses worldwide. Streamline your sales process and grow your business with PurpleRadianceOne CRM
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:crm@purpleradiance.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="tel:+1-555-0123"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 caption-custom">
              <li>
                <a href={ROUTES_URL.FEATURES} className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href={ROUTES_URL.PRICING} className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 caption-custom">
              <li>
                <a href={ROUTES_URL.ABOUT_US} className="caption-custom hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href={ROUTES_URL.CAREERS} className="caption-custom hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href={ROUTES_URL.CONTACT_US} className="caption-custom hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="mailto:crm@purpleradiance.com" className="caption-custom hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="caption-custom mb-4 md:mb-0">
              © 2025 PurpleRadianceOne.com All rights reserved.
            </p>


            <div className="flex space-x-6 text-sm">
              <a
                href={ROUTES_URL.PRIVACY_POLICY}
                className="caption-custom hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <a
                href={ROUTES_URL.TERMS_OF_SERVICE}
                className="caption-custom hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
              <a
                href={ROUTES_URL.COOKIE_POLICY}
                className="caption-custom hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cookie Policy
              </a>
            </div>
          </div>

          <AppVersionViewCard/>
        </div>
      </div>
    </motion.footer>
    </div>
  );
}

export default Footer;
