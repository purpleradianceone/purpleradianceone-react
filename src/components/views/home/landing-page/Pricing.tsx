// import React from 'react';
// import { Check, Star, Shield, HeadphonesIcon, Palette, AreaChart, Upload, Smartphone, Bell, UserPlus, Building, Package, Percent, Calendar } from 'lucide-react';
// import { motion } from "framer-motion";

// const Pricing: React.FC = () => {

// const features = [
//   { icon: AreaChart, text: 'Advanced analytics & reporting' },
//   { icon: Shield, text: 'Enterprise-grade security' },
//   { icon: HeadphonesIcon, text: '24/7 priority support' },
//   { icon: Upload, text: 'Lead Form & Bulk Import' },
//   { icon: Smartphone, text: 'Android & iOS App Access' },
//   { icon: Palette, text: 'Canvas (Email Template Builder)' },
//   { icon: Bell, text: 'Real-time Web & Mobile Notifications' },
//   { icon: UserPlus, text: 'Manual Lead Creation' },
//   { icon: Building, text: 'Company User & Team Management' },
//   { icon: Package, text: 'Product Management' },
//   { icon: Percent, text: 'Product Tax Management' },
//   { icon: Calendar, text: 'Meeting Scheduling (Zoom & Google Meet)' },
// ];

//   return (
//     <div id="pricing" className="bg-gradient-to-b from-blue-200 via-blue-100 to-blue-50 py-20"> {/* Reduced overall padding */}
//     <motion.div
//       initial={{ opacity: 0, y: 60 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: false, amount: 0.15 }}
//       transition={{ duration: 0.4, ease: "easeOut" }}
//     >
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12 sm:mb-14"> {/* Adjusted margin-bottom */}
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"> {/* Slightly smaller h2, adjusted mb */}
//             Simple, Transparent Pricing
//           </h2>
//           <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"> {/* Adjusted font size and line height */}
//             Choose the perfect plan for your team. Scale as you grow with our flexible pricing options.
//           </p>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl lg:max-w-6xl mx-auto"> {/* Changed to md:grid-cols-2, reduced gap, adjusted max-width */}
//           {/* Monthly Plan */}
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 relative hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"> {/* Reduced card padding */}
//             <div className="text-center mb-2"> {/* Adjusted margin-bottom */}
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Monthly Plan</h3>
//               <p className="text-gray-600 mb-4 text-sm sm:text-base">Perfect for growing teams</p> {/* Adjusted font size and margin */}

//               <div className="mb-5"> {/* Adjusted margin-bottom */}
//                 <div className="flex items-baseline justify-center">
//                   <span className="text-4xl sm:text-5xl font-bold text-blue-600">₹500</span> {/* Adjusted font size */}
//                   <span className="text-base sm:text-xl text-gray-500 ml-1">/month</span> {/* Adjusted font size */}
//                 </div>
//                 <p className="text-xs sm:text-sm text-gray-500 mt-1">per user</p> {/* Adjusted font size */}
//               </div>

//               <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 mb-4 sm:mb-6"> {/* Adjusted padding and margin */}
//                 Start Monthly Plan
//               </button>
//             </div>

//             {/* Features */}
//             <div className="space-y-1"> {/* Reduced space-y */}
//               <h4 className="font-semibold text-gray-900 mb-3 text-base">Everything included:</h4> {/* Adjusted font size and margin */}
//               {features.map((feature, index) => (
//                 <div key={index} className="flex items-center space-x-2.5"> {/* Adjusted space-x */}
//                   <div className="flex-shrink-0 w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center"> {/* Reduced size */}
//                     <Check className="w-2.5 h-2.5 text-blue-600" /> {/* Reduced size */}
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <feature.icon className="w-3.5 h-3.5 text-gray-600" /> {/* Reduced size */}
//                     <span className="text-sm text-gray-700">{feature.text}</span> {/* Adjusted font size */}
//                   </div>
//                 </div>
//               ))}

//               <div className="pt-3 border-t border-gray-100"> {/* Reduced padding-top */}
//                 <div className="flex items-center space-x-2.5">
//                   <div className="flex-shrink-0 w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
//                     <Check className="w-2.5 h-2.5 text-blue-600" />
//                   </div>
//                   <span className="text-sm text-gray-700">No setup fees</span>
//                 </div>
//                 <div className="flex items-center space-x-2.5 mt-2">
//                   <div className="flex-shrink-0 w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
//                     <Check className="w-2.5 h-2.5 text-blue-600" />
//                   </div>
//                   <span className="text-sm text-gray-700">Training Included</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Yearly Plan */}
//           <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 sm:p-8 relative hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"> {/* Reduced card padding */}
//             {/* Popular Badge */}
//             <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//               <div className="bg-orange-500 text-white px-3 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-0.5"> {/* Reduced padding, font size, and space-x */}
//                 <Star className="w-3.5 h-3.5" /> {/* Reduced size */}
//                 <span>Most Popular</span>
//               </div>
//             </div>

//             <div className="text-center mb-2"> {/* Adjusted margin-bottom */}
//               <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Yearly Plan</h3>
//               <p className="text-blue-100 mb-4 text-sm sm:text-base">Save 17% with annual billing</p> {/* Adjusted font size and margin */}

//               <div className="mb-5"> {/* Adjusted margin-bottom */}
//                 <div className="flex items-baseline justify-center">
//                   <span className="text-4xl sm:text-5xl font-bold text-white">₹5,000</span> {/* Adjusted font size */}
//                   <span className="text-base sm:text-xl text-blue-200 ml-1">/year</span> {/* Adjusted font size */}
//                 </div>
//                 <p className="text-xs sm:text-sm text-blue-200 mt-1">per user</p> {/* Adjusted font size */}

//               </div>

//               <button className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 mb-4 sm:mb-6"> {/* Adjusted padding and margin */}
//                 Start Yearly Plan
//               </button>
//             </div>

//             {/* Features */}
//             <div className="space-y-1"> {/* Reduced space-y */}
//               <h4 className="font-semibold text-white mb-3 text-base">Everything included:</h4> {/* Adjusted font size and margin */}
//               {features.map((feature, index) => (
//                 <div key={index} className="flex items-center space-x-2.5">
//                   <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
//                     <Check className="w-2.5 h-2.5 text-white" />
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <feature.icon className="w-3.5 h-3.5 text-blue-200" />
//                     <span className="text-sm text-blue-100">{feature.text}</span>
//                   </div>
//                 </div>
//               ))}

//               <div className="pt-3 border-t border-blue-500">
//                 <div className="flex items-center space-x-2.5">
//                   <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
//                     <Check className="w-2.5 h-2.5 text-white" />
//                   </div>
//                   <span className="text-sm text-blue-100">No setup fees</span>
//                 </div>
//                 <div className="flex items-center space-x-2.5 mt-2">
//                   <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
//                     <Check className="w-2.5 h-2.5 text-white" />
//                   </div>
//                   <span className="text-sm text-blue-100">Priority onboarding</span>
//                 </div>
//                 <div className="flex items-center space-x-2.5 mt-2">
//                   <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
//                     <Check className="w-2.5 h-2.5 text-white" />
//                   </div>
//                   <span className="text-sm text-blue-100">Training Included</span>
//                 </div>
//               </div>
//               <div className="mt-2 bg-blue-500/30 place-self-center rounded-lg py-2 px-4">
//                  <span className="text-blue-100 text-sm justify-center ">
//                     Save ₹1,000 per user annually
//                   </span>
//                 </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom CTA */}
//         <div className="text-center mt-8 sm:mt-10"> {/* Adjusted margin-top */}
//           <p className="text-gray-600 mb-3 text-base"> {/* Adjusted font size and margin */}
//             Need a custom plan for your enterprise?
//           </p>
//           <button onClick={()=> {
//             window.location.href = "mailto:crm@purpleradiance.com";
//           }} className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200 text-base"> {/* Adjusted font size */}
//             Contact our sales team
//           </button>
//         </div>
//       </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Pricing;

import React from "react";
import {
  Check,
  Star,
  Shield,
  HeadphonesIcon,
  Palette,
  AreaChart,
  Upload,
  Smartphone,
  Bell,
  UserPlus,
  Building,
  Package,
  Percent,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import ROUTES_URL from "../../../../constants/Routes";

const Pricing: React.FC = () => {
  const features = [
    { icon: AreaChart, text: "Advanced analytics & reporting" },
    { icon: Shield, text: "Enterprise-grade security" },
    { icon: HeadphonesIcon, text: "24/7 priority support" },
    { icon: Upload, text: "Lead Form & Bulk Import" },
    { icon: Smartphone, text: "Android & iOS App Access" },
    { icon: Palette, text: "Canvas (Email Template Builder)" },
    { icon: Bell, text: "Real-time Web & Mobile Notifications" },
    { icon: UserPlus, text: "Manual Lead Creation" },
    { icon: Building, text: "Company User & Team Management" },
    { icon: Package, text: "Product Management" },
    { icon: Percent, text: "Product Tax Management" },
    { icon: Calendar, text: "Meeting Scheduling (Zoom & Google Meet)" },
  ];

  return (
    <div
      id="pricing"
      className="bg-gradient-to-b from-blue-200 via-blue-100 to-blue-50 px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto py-24">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-normal">
              Choose the perfect plan for your team. Scale as you grow with our
              flexible pricing options.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 sm:p-6 relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center mb-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Monthly Plan
                </h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Perfect for growing teams
                </p>

                <div className="mb-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-blue-600">
                      ₹500
                    </span>
                    <span className="text-base text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">per user</p>
                </div>

                <button
                  onClick={() => {
                    window.location.href = ROUTES_URL.SIGN_UP;
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-200 mb-3"
                >
                  Start Monthly Plan
                </button>
              </div>

              {/* Features */}
              <div className="space-y-0.5">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                  Everything included:
                </h4>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-shrink-0 w-3.5 h-3.5 bg-blue-100 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-blue-600" />
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <feature.icon className="w-3 h-3 text-gray-600" />
                      <span className="text-xs text-gray-700">
                        {feature.text}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-gray-100 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0 w-3.5 h-3.5 bg-blue-100 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-700">No setup fees</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <div className="flex-shrink-0 w-3.5 h-3.5 bg-blue-100 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-700">
                      Training Included
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Yearly Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-5 sm:p-6 relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Popular Badge */}
              <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                <div className="bg-orange-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-0.5">
                  <Star className="w-3 h-3" />
                  <span>Most Popular</span>
                </div>
              </div>

              <div className="text-center mb-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Yearly Plan
                </h3>
                <p className="text-blue-100 mb-3 text-sm">
                  Save 17% with annual billing
                </p>

                <div className="mb-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">
                      ₹5,000
                    </span>
                    <span className="text-base text-blue-200 ml-1">/year</span>
                  </div>
                  <p className="text-xs text-blue-200 mt-0.5">per user</p>
                </div>

                <button
                  onClick={() => {
                    window.location.href = ROUTES_URL.SIGN_UP;
                  }}
                  className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-2 px-5 rounded-lg transition-colors duration-200 mb-3"
                >
                  Start Yearly Plan
                </button>
              </div>

              {/* Features */}
              <div className="space-y-0.5">
                <h4 className="font-semibold text-white mb-2 text-sm">
                  Everything included:
                </h4>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-shrink-0 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <feature.icon className="w-3 h-3 text-blue-200" />
                      <span className="text-xs text-blue-100">
                        {feature.text}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-blue-500 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-xs text-blue-100">No setup fees</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <div className="flex-shrink-0 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-xs text-blue-100">
                      Priority onboarding
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <div className="flex-shrink-0 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-xs text-blue-100">
                      Training Included
                    </span>
                  </div>
                </div>
                <div className="mt-2 bg-blue-500/30 place-self-center rounded-lg py-2 px-4">
                  <span className="text-blue-100 text-sm justify-center ">
                    Save ₹1,000 per user annually
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-gray-600 mb-2 text-sm sm:text-base">
              Need a custom plan for your enterprise?
            </p>
            <button
              onClick={() => {
                window.location.href = "mailto:crm@purpleradiance.com";
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200 text-sm sm:text-base"
            >
              Contact our sales team
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Pricing;
