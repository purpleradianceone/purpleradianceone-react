// import {
//   LineChart,
//   Mail,
//   MessageSquare,
//   PieChart,
//   Settings,
//   Target,
//   Calendar,
//   TrendingUpIcon,
//   Users,
//   BarChart3
// } from 'lucide-react';

// import { motion } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';

// function Features() {
//   const [ref, inView] = useInView({fallbackInView: true, threshold: 0.15 });

//   const features = [
//     {
//       icon: <LineChart className="h-8 w-8 text-blue-600" />,
//       title: "Advanced Analytics",
//       description: "Get detailed insights into your sales pipeline and team performance"
//     },
//     {
//       icon: <TrendingUpIcon className="h-8 w-8 text-blue-600" />,
//       title: 'Sales Pipeline',
//       description: 'Visualize your sales process, track deal progression, and forecast revenue with customizable pipeline stages and automation.'
//     },
//     {
//       icon: <Users className="h-8 w-8 text-blue-600" />,
//       title: 'Contact Management',
//       description: 'Centralize all customer information, track interactions, and maintain detailed contact profiles with complete communication history.'
//     },
//     {
//       icon: <Mail className="h-8 w-8 text-blue-600" />,
//       title: "Email Integration",
//       description: "Seamlessly integrate with your email for better communication tracking"
//     },
//     {
//       icon: <Target className="h-8 w-8 text-blue-600" />,
//       title: 'Lead Scoring & Qualification',
//       description: 'Automatically score leads based on behavior and engagement, prioritizing your most promising prospects.'
//     },
//     {
//       icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
//       title: "Smart Communication",
//       description: "Automated follow-ups and personalized message templates"
//     },
//     {
//       icon: <Calendar className="h-8 w-8 text-blue-600" />,
//       title: 'Task & Schedule Management',
//       description: 'Never miss important follow-ups with integrated calendar, automated reminders, and task prioritization features.'
//     },
//     {
//       icon: <PieChart className="h-8 w-8 text-blue-600" />,
//       title: "Reports & Dashboards",
//       description: "Customizable reports and real-time performance dashboards"
//     },
//     {
//       icon: <Settings className="h-8 w-8 text-blue-600" />,
//       title: "Easy to Configure",
//       description: "Configure all your setttings as per your needs"
//     },
//     {
//       icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
//       title: 'Advanced Analytics',
//       description: 'Generate comprehensive reports, track KPIs, and gain actionable insights to optimize your sales and marketing performance.'
//     },
//   ];

//   return (
//     <div id="features" className="py-20 bg-gradient-to-b from-blue-200 via-blue-100 to-blue-50 w-full">
//       <motion.div
//         ref={ref}
//         initial={{ opacity: 0, y: 50 }}
//         animate={inView ? { opacity: 1, y: 0 } : {}}
//         transition={{ duration: 0.4, ease: 'easeOut' }}
//         className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full"
//       >
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             Powerful Features for Modern Businesses
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Everything you need to manage your customer relationships effectively
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
//           {features.map((feature, index) => (
//             <motion.div
//               key={index}
//               className="p-6 border rounded-xl hover:shadow-lg transition-shadow w-full bg-white"
//               initial={{ opacity: 0, y: 40 }}
//               animate={inView ? { opacity: 1, y: 0 } : {}}
//               transition={{ duration: 0.5, delay: index * 0.05 }}
//             >
//               <div className="mb-4">{feature.icon}</div>
//               <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
//               <p className="text-gray-600">{feature.description}</p>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export default Features;

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BsWhatsapp, BsPersonCheckFill, BsBoxSeam } from "react-icons/bs";

import { LuUsers, LuFileText, LuReceipt, LuTicket } from "react-icons/lu";
import { NavLink } from "react-router-dom";

const features = [
  {
    title: "Lead Lifecycle Management",
    icon: <BsPersonCheckFill size={20} className="text-purple" />,
    iconBg: "bg-purple-light",
    border: " border-t-4 border-t-purple",
    description:
      "Track every enquiry from the moment it arrives to the day it becomes a paying customer. Auto-reply instantly, assign leads, and never miss a follow-up.",
    tags: [
      "Auto-reply",
      "Follow-up sequences",
      "Lead assignment",
      "Pipeline view",
    ],
    tagClass: "bg-purple-light text-purple border-purple-light",
    visual: (
      <div className="mt-5 bg-purple-light rounded-xl p-4">
        <div className="text-[11px] font-semibold text-purple uppercase tracking-wide mb-3">
          Lead journey
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-purple">
          {["Enquiry", "Auto-reply", "Follow-up", "Converted"].map(
            (item, i) => (
              <>
                <span
                  key={item}
                  className="bg-white px-3 py-1 rounded-lg font-medium"
                >
                  {item}
                </span>

                {i !== 3 && <span>→</span>}
              </>
            ),
          )}
        </div>
      </div>
    ),
  },

  {
    title: "Contact Management",
    icon: <LuUsers size={20} className="text-teal-700" />,
    iconBg: "bg-teal-50",
    border: "border-t-4 border-t-teal-700",
    description:
      "One place for every customer, lead, and business contact. See interaction history, invoices, support tickets, and payment records in one profile.",
    tags: [
      "Full interaction history",
      "Custom fields",
      "Payment records",
      "Tag & segment",
    ],
    tagClass: "bg-teal-50 text-teal-700 border-teal-100",
  },

  {
    title: "Proforma Invoice",
    icon: <LuFileText size={20} className="text-blue-700" />,
    iconBg: "bg-blue-50",
    border: "border-t-4 border-t-blue-700",
    description:
      "Send professional proforma invoices before work starts. Convert them into GST invoices in one click without entering data twice.",
    tags: ["One-click conversion", "WhatsApp sharing", "Custom branding"],
    tagClass: "bg-blue-50 text-blue-700 border-blue-100",

    visual: (
      <div className="mt-5 bg-blue-50 rounded-xl p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="text-[11px] font-semibold text-blue-700 mb-1">
            Proforma → Invoice
          </div>

          <p className="text-[11px] text-gray-500">
            Convert to final GST invoice instantly.
          </p>
        </div>

        <div className="text-2xl">⚡</div>
      </div>
    ),
  },

  {
    title: "Invoice & Billing",
    icon: <LuReceipt size={20} className="text-amber-700" />,
    iconBg: "bg-amber-50",
    border: "border-t-4 border-t-amber-700",
    description:
      "Raise GST-ready invoices in under 2 minutes and send them directly via WhatsApp with payment links attached.",
    tags: ["GST compliant", "Payment links", "Auto-reminders", "2 min to send"],
    tagClass: "bg-amber-50 text-amber-700 border-amber-100",
  },

  {
    title: "Inventory Management",
    icon: <BsBoxSeam size={20} className="text-green-700" />,
    iconBg: "bg-green-50",
    border: "border-t-4 border-t-green-700",
    description:
      "Track stock levels, receive low-stock alerts, and connect products directly to invoices automatically.",
    tags: [
      "Stock tracking",
      "Low-stock alerts",
      "Linked to invoices",
      "Product catalogue",
    ],
    tagClass: "bg-green-50 text-green-700 border-green-100",
  },

  {
    title: "Product Support Tickets",
    icon: <LuTicket size={20} className="text-rose-700" />,
    iconBg: "bg-rose-50",
    border: "border-t-4 border-t-rose-700",
    description:
      "Every customer issue gets a ticket, an owner, and a resolution deadline. Customers automatically receive updates.",
    tags: [
      "Auto ticket creation",
      "SLA tracking",
      "Team assignment",
      "Resolution alerts",
    ],
    tagClass: "bg-rose-50 text-rose-700 border-rose-100",
  },
];

export default function FeaturesPage() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    fallbackInView: true,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="bg-[#fafafa] text-[#0f0e1a] overflow-hidden"
    >
      {/* HERO */}
      <section className="max-w-3xl mx-auto bg-gradient-to-br from-[#f4f2ff] via-white to-[#f0f7ff] py-20 mt-8 px-6 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1 text-xs text-gray-500 shadow-sm">
          <span className="w-2 h-2 bg-purple rounded-full"></span>
          Platform features
        </div>

        <h1 className="font-syne text-4xl md:text-5xl font-bold leading-[1.2] tracking-[-0.03em] max-w-4xl mx-auto mt-6">
          Every tool your business needs.
          <br />
          <span className="text-purple">Nothing you don't.</span>
        </h1>

        <p className="mt-6 max-w-xl mx-auto text-gray-500 text-base font-dm leading-7">
          From capturing the first enquiry to raising the final invoice —
          PurpleRadiance handles the entire customer lifecycle in one place.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {[
            "Lead lifecycle",
            "Contacts",
            "Proforma invoice",
            "Invoice",
            "Inventory",
            "Product support",
            "WhatsApp",
          ].map((item) => (
            <span
              key={item}
              className="bg-white border border-gray-200 rounded-full px-2 py-1 text-sm text-gray-500 font-dm"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="uppercase tracking-[2px] text-xs text-purple font-semibold font-dm mb-4">
            7 features built around how you actually work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`
                relative overflow-hidden
                bg-white rounded-2xl border border-gray-200
                p-7
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]
                 ${feature.border}
                after:absolute after:bottom-0 after:left-0
                after:w-full after:h-[3px]
              `}
            >
              <div
                className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5`}
              >
                {feature.icon}
              </div>

              <h3 className="font-syne text-lg font-bold mb-3">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-500  font-dm mb-5">
                {feature.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[11px] border rounded-full px-3 py-1 font-medium ${feature.tagClass}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {feature.visual}
            </div>
          ))}

          {/* WHATSAPP FEATURE */}
          <div className="relative overflow-hidden md:col-span-2 xl:col-span-3 bg-gradient-to-br from-[#f4f2ff] to-[#e8f7ff] border border-gray-200 rounded-2xl p-8 flex flex-col lg:flex-row gap-10 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:w-full border-t-4 border-t-[#25D366]">
            {/* LEFT */}
            <div className="flex-1">
              <div className="w-12 h-12 rounded-2xl bg-[#e8fdf0] flex items-center justify-center mb-5">
                <BsWhatsapp className="text-[#25D366]" size={22} />
              </div>

              <h3 className="font-syne text-2xl font-bold mb-4">
                WhatsApp Integration
              </h3>

              <p className="text-gray-600  font-dm max-w-xl">
                WhatsApp is where your customers already communicate — so that's
                where PurpleRadiance works too. Send auto-replies, invoices,
                reminders, payment links, and support updates directly through
                WhatsApp.
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                {[
                  "Lead auto-reply",
                  "Bulk campaigns",
                  "Invoice sharing",
                  "Payment links",
                  "Fee reminders",
                  "Support updates",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-[#e8fdf0] text-[#1a7a40] border border-[#a3e4bc] rounded-full px-2 font-dm py-1 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-3">
                Live example
              </div>

              <div className="bg-[#e5ddd5] rounded-2xl p-4 space-y-3">
                <div className="bg-white rounded-2xl rounded-bl-sm p-4 max-w-sm">
                  <p className="text-sm font-dm">
                    Hi, I'm interested in enrolling. What are your fees?
                  </p>

                  <div className="text-[10px] text-gray-400 text-right mt-2">
                    9:03 PM
                  </div>
                </div>

                <div className="bg-[#d9fdd3] rounded-2xl rounded-br-sm p-4 max-w-sm ml-auto">
                  <p className="text-sm font-dm">
                    Hi! Thanks for reaching out 👋 Our fees start at
                    ₹2,500/month. I'll have someone call you tomorrow morning to
                    walk you through everything. Anything specific you'd like to
                    know?
                  </p>

                  <div className="text-[10px] text-gray-500 text-right mt-2">
                    9:03 PM ✓✓
                  </div>
                </div>

                <div className="bg-white rounded-2xl rounded-bl-sm p-4 max-w-sm">
                  <p className="text-sm font-dm">
                    Great! Please also send me an invoice for the first month.
                  </p>

                  <div className="text-[10px] text-gray-400 text-right mt-2">
                    9:05 PM
                  </div>
                </div>

                <div className="bg-[#d9fdd3] rounded-2xl rounded-br-sm p-4 max-w-sm ml-auto">
                  <p className="text-sm font-dm">
                    Sure! Here's your invoice 🧾 Amount: ₹2,500 Pay here →
                    pay.purpleradiance.in/inv001
                    <br />
                    <br />
                    Valid for 3 days.
                  </p>

                  <div className="text-[10px] text-gray-500 text-right mt-2">
                    9:05 PM ✓✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOW */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="uppercase tracking-[2px] text-xs text-purple font-semibold font-dm mb-4">
              The full picture
            </p>

            <h2 className="font-syne text-4xl font-bold">
              All 7 features work together
            </h2>

            <p className="mt-4 text-gray-500 font-dm">
              Each feature connects to the next — from first enquiry to closed
              ticket, nothing is standalone.
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            {[
              {
                title: "Lead arrives",
                desc: "Via WhatsApp, form, or walk-in. Auto-reply sent instantly.",
                color: "bg-purple-light text-purple",
              },

              {
                title: "Contact created",
                desc: "Full profile with interaction history, tags, and notes.",
                color: "bg-teal-50 text-teal-700",
              },

              {
                title: "Proforma sent",
                desc: "Professional estimate shared via WhatsApp before work starts.",
                color: "bg-blue-50 text-blue-700",
              },

              {
                title: "Invoice raised",
                desc: "GST invoice with payment link. Auto-reminder if unpaid.",
                color: "bg-amber-50 text-amber-700",
              },

              {
                title: "Stock updated",
                desc: "Inventory deducted automatically when product is invoiced.",
                color: "bg-green-50 text-green-700",
              },

              {
                title: "Issue resolved",
                desc: "Ticket raised, assigned, tracked and closed. Customer notified.",
                color: "bg-rose-50 text-rose-700",
              },
            ].map((step, i) => (
              <div
                key={step.title}
                className={`flex-1 text-center px-5 py-6 ${
                  i !== 5
                    ? "border-b md:border-b-0 md:border-r border-gray-200"
                    : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-sm font-bold font-syne mb-5 ${step.color}`}
                >
                  {i + 1}
                </div>

                <h4 className="font-syne text-sm font-bold mb-2">
                  {step.title}
                </h4>

                <p className="text-xs text-gray-500  font-dm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-purple-dark to-purple py-24 px-6 text-center text-white">
        <h2 className="font-syne text-4xl md:text-4xl font-bold leading-[1.2] max-w-3xl mx-auto">
          See all 7 features working
          <br />
          together — live.
        </h2>

        <p className="mt-5 text-white/70 text-sm font-dm">
          14-day free trial. No credit card required.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <button className="hidden bg-white text-purple px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all">
            Start Free Trial
          </button>
          <NavLink to="/contactUs">
            <button className="border border-white/30 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all">
              Book a Demo
            </button>
          </NavLink>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500 font-dm">
        © 2026 PurpleRadiance. All power in one platform.
      </footer>
    </motion.div>
  );
}
