// /* eslint-disable react-hooks/exhaustive-deps */
// import { ArrowRight, BarChart2, Users, Calendar } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import ROUTES_URL from '../../../../constants/Routes';
// import { motion } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import { useLoggedInUserContext } from '../../../../context/user/LoggedInUserContext';
// import { useEffect } from 'react';

// function Hero() {
//   const navigate = useNavigate();
//   const [ref, inView] = useInView({ fallbackInView: true,threshold: 0.1 });

//   const {setLoginStatus} = useLoggedInUserContext();
//   useEffect(() => {
//      setLoginStatus({
//       id: 0,
//       companyId: 0,
//       message: "",
//       token: "",
//       status: false,
//       email: "",
//       fullName: "",
//       companyName: "",
//       createdOn: "",
//       mobileNumber: "",
//       activeUsersInCompany: 0,
//       isActiveSubscription: false,
//       subscriptionAllowedUsers: 0,
//       endDateSubscription: "",
//       startDateSubscription: "",
//       subscriptionId: 0,
//       isSuperUser : false
//     });
//   },[])

//   return (
//     <div className="w-full pt-20 bg-gradient-to-b from-blue-200 via-blue-100 to-blue-50">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">

//         {/* Animated Section */}
//         <motion.div
//           ref={ref}
//           initial={{ opacity: 0, y: 50 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.4, ease: 'easeOut' }}
//           className="text-center max-w-4xl mx-auto"
//         >
//           <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
//             Transform Your Business with
//             <span className="text-blue-600"> Intelligent CRM</span>
//           </h1>
//           <p className="text-lg md:text-xl text-gray-700 mb-10">
//             Streamline your sales process, enhance customer relationships, and boost revenue with our comprehensive CRM solution.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button
//               type="button"
//               onClick={() => navigate(ROUTES_URL.SIGN_UP)}
//               className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-500 flex items-center justify-center transition duration-200"
//             >
//               Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
//             </button>
//             <a href='mailTo:crm@purpleradiance.com'>
//             <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full hover:bg-blue-50 transition duration-200">
//               Schedule Demo
//             </button>
//             </a>
//           </div>
//         </motion.div>

//         {/* Feature Cards */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
//           className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
//         >
//           {[{
//             icon: <BarChart2 className="h-12 w-12 text-blue-600 mb-4" />,
//             title: 'Increase Sales',
//             desc: 'Boost your revenue with data-driven insights and automated workflows.'
//           }, {
//             icon: <Users className="h-12 w-12 text-blue-600 mb-4" />,
//             title: 'Team Collaboration',
//             desc: 'Enable seamless communication and task management across teams.'
//           }, {
//             icon: <Calendar className="h-12 w-12 text-blue-600 mb-4" />,
//             title: 'Smart Scheduling',
//             desc: 'Automate appointment scheduling and follow-ups effortlessly.'
//           }].map((feature, index) => (
//             <div
//               key={index}
//               className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 text-center"
//             >
//               {feature.icon}
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
//               <p className="text-gray-600">{feature.desc}</p>
//             </div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// export default Hero;
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { BsChatLeftTextFill, BsPersonCheckFill } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { LuFileText } from "react-icons/lu";
function Hero() {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="py-6">
        <section className="text-center px-6 py-20 bg-gradient-to-br from-[#f4f2ff] via-white to-[#f0f7ff] relative overflow-hidden">
          <div className="inline-flex items-center gap-2 border px-4 py-1 rounded-full text-xs text-gray-500  bg-white mb-6 shadow-sm">
            <span className="w-2 h-2 bg-purple rounded-full"></span>
            All power in one platform
          </div>

          <h1 className="font-syne text-4xl md:text-5xl font-bold leading-[1.2] tracking-[-0.02em] max-w-3xl mx-auto">
            Capture every lead.
            <br />
            Collect every payment.
            <br />
            <span className="text-purple">Resolve every issue.</span>
          </h1>

          <p className="text-gray-500 mt-6 max-w-xl mx-auto text-lg font-dm">
            PurpleRadiance runs the follow-up so your team doesn't have to —
            from the first enquiry to long-term retention.
          </p>

          <div className="flex justify-center gap-4 mt-8 font-dm flex-wrap">
            <button className="bg-purple text-white px-6 py-3 rounded-full">
              Start free trial
            </button>
            <button className="border border-purple text-purple px-6 py-3 rounded-full">
              See demo
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              "Lead capture",
              "Subscription reminders",
              "Billing & invoicing",
              "Support tickets",
            ].map((item, i) => (
              <span
                key={i}
                className="text-xs border px-3 py-1 rounded-full font-dm text-gray-500 bg-white"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 ">
          {[
            {
              value: "3×",
              text: "Faster lead conversion vs manual follow-up",
              valueColor: "text-purple",
            },
            {
              value: "70%",
              text: "Drop in overdue payments within first month",
              valueColor: "text-orange-950",
            },
            {
              value: "2 min",
              text: "To raise and send a GST invoice",
              valueColor: "text-cyan-600",
            },
            {
              value: "100%",
              text: "Of support tickets tracked to closure",
              valueColor: "text-green-600",
            },
          ].map((stat, i) => (
            <div key={i} className="text-center border py-8 bg-white">
              <div
                className={`font-syne text-3xl font-bold ${stat.valueColor}`}
              >
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 font-dm mt-2">
                {stat.text}
              </div>
            </div>
          ))}
        </section>

        {/* VERTICALS */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mx-auto flex flex-col gap-3 max-w-3xl">
            <p className="text-xs uppercase text-purple font-dm font-semibold mb-2">
              Built for your business
            </p>
            <h2 className="font-syne text-4xl font-bold">
              Your industry, your pain points — solved
            </h2>
            <p className="text-gray-500 max-w-xl font-dm  mx-auto">
              PurpleRadiance is built around the problems that spas, academies,
              service teams and growing companies face every single day.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-10 p-2">
            {[
              {
                title: "Salons & Spas",
                icon: "💆",
                description:
                  "Never miss a walk-in enquiry or WhatsApp booking request. Send automated appointment reminders, collect advance payments, and win back clients who haven't visited in a while.",
                tags: ["WhatsApp booking", "Client win-back", "Fee reminders"],
                color: "bg-purple-light",
                tagColor: "bg-purple-light text-purple-dark",
                iconBg: "bg-purple-light",
              },
              {
                title: "Sports Academies",
                icon: "🏅",
                description:
                  "Collect batch fees without calling every parent individually. Send bulk WhatsApp reminders on due date, track overdue students, and manage enquiries for new admissions automatically.",
                tags: [
                  "Batch fee collection",
                  "Bulk reminders",
                  "Admission leads",
                ],
                color: "bg-orange-50",
                tagColor: "bg-orange-100 text-orange-700",
                iconBg: "bg-orange-100",
              },
              {
                title: "Manufacturing",
                icon: "🏭",
                description:
                  "Capture B2B enquiries from multiple channels, follow up on quotations automatically, raise invoices against purchase orders, and track every client complaint through resolution.",
                tags: [
                  "B2B lead pipeline",
                  "Quotation follow-up",
                  "PO invoicing",
                ],
                color: "bg-blue-50",
                tagColor: "bg-blue-100 text-blue-700",
                iconBg: "bg-blue-100",
              },
              {
                title: "IT & Product Companies",
                icon: "💻",
                description:
                  "Auto-respond to demo requests, manage renewal reminders for subscriptions, send invoices with payment links, and give clients a proper ticket system instead of a chaotic email chain.",
                tags: ["Demo requests", "SaaS renewals", "Client support"],
                color: "bg-teal-50",
                tagColor: "bg-teal-100 text-teal-700",
                iconBg: "bg-teal-100",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 p-6 rounded-2xl bg-white hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Icon Header */}
                <div className="flex items-center text-sm gap-3 mb-4">
                  <div
                    className={`w-8 h-8 ${item.iconBg} rounded-lg flex items-center justify-center text-lg`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-syne font-bold text-gray-800 leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs font-dm leading-relaxed text-gray-500 mb-3 flex-grow">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-[10px] font-medium ${item.tagColor}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOUR PILLARS */}
        <section className="bg-white border-y py-16 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs font-dm uppercase text-purple font-semibold mb-4">
              Everything that breaks — fixed
            </p>
            <h2 className="font-syne text-4xl font-bold mb-4 ">
              Four problems. One platform.
            </h2>
            <p className=" text-gray-500 max-w-lg mx-auto font-dm mb-10">
              Stop juggling tools. PurpleRadiance replaces the four things every
              growing business struggles to manage.
            </p>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                {
                  title: "Lead capture",
                  icon: (
                    <BsPersonCheckFill className="text-indigo-600" size={20} />
                  ),
                  iconBg: "bg-indigo-50",
                  desc: "Every enquiry — WhatsApp, website form, walk-in, or missed call — is captured and auto-replied to instantly, before it goes cold.",
                  tags: ["Auto-reply", "Missed call capture", "Lead tracking"],
                  borderColor: "border-t-indigo-600",
                },
                {
                  title: "Subscription reminders",
                  icon: <CiCalendar className="text-amber-700" size={20} />,
                  iconBg: "bg-amber-50",
                  desc: "Fee due? The system sends WhatsApp reminders on day 1, day 3, and day 7 — automatically. You collect, without chasing a single person.",
                  tags: ["Bulk WhatsApp", "Overdue flags", "Auto-escalation"],
                  borderColor: "border-t-amber-700",
                },
                {
                  title: "Billing & invoicing",
                  icon: <LuFileText className="text-blue-600" size={20} />,
                  iconBg: "bg-blue-50",
                  desc: "Raise a GST-ready invoice in under 2 minutes. Send it with a payment link via WhatsApp. Auto-reminder goes out if it stays unpaid.",
                  tags: ["GST invoices", "Payment link", "Auto-follow up"],
                  borderColor: "border-t-blue-600",
                },
                {
                  title: "Support tickets",
                  icon: (
                    <BsChatLeftTextFill
                      className="text-emerald-800"
                      size={20}
                    />
                  ),
                  iconBg: "bg-emerald-50",
                  desc: "Every customer complaint gets a ticket, an assigned owner, and a deadline. No more issues getting buried in WhatsApp group chats.",
                  tags: ["Auto-assign", "SLA tracking", "Resolution alerts"],
                  borderColor: "border-t-emerald-800",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`border ${item.borderColor} border-t-4 p-4 rounded-xl bg-white shadow-sm text-left flex flex-col h-full`}
                >
                  <div
                    className={`w-8 h-8 ${item.iconBg} rounded-lg flex items-center justify-center mb-2`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-syne font-bold text-sm text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 font-dm flex-grow">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-[10px] font-dm px-3 py-1 rounded-full border border-gray-200 text-gray-600 bg-gray-50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FLOW */}
        <section className="bg-white py-16 px-6 border-b">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xs text-purple font-dm uppercase font-semibold mb-4">
              How it works
            </p>
            <h2 className="font-syne text-4xl font-bold mb-4">
              From first enquiry to happy customer
            </h2>
            <p className="font-dm text-gray-500 max-w-lg mx-auto">
              One continuous journey — PurpleRadiance handles every step
              automatically.
            </p>
            <div className="grid md:grid-cols-5 gap-0 mt-10">
              {[
                {
                  title: "Enquiry arrives",
                  desc: "Via WhatsApp, form, walk-in, or missed call",
                  color: "bg-indigo-50 text-indigo-600",
                },
                {
                  title: "Instant reply",
                  desc: "Auto-response sent, lead captured with full context",
                  color: "bg-purple-light text-purple",
                },
                {
                  title: "Fee reminder sent",
                  desc: "Auto WhatsApp on due date — no manual chasing",
                  color: "bg-orange-50 text-orange-600",
                },
                {
                  title: "Invoice raised",
                  desc: "GST bill + payment link sent in under 2 minutes",
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  title: "Issue resolved",
                  desc: "Ticket closed, customer notified automatically",
                  color: "bg-emerald-50 text-emerald-600",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className={`text-center px-4 relative ${i !== 4 ? "md:border-r border-gray-200" : ""}`}
                >
                  {/* Step Number Circle */}
                  <div
                    className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center mx-auto font-syne font-bold text-sm mb-6`}
                  >
                    {i + 1}
                  </div>

                  {/* Content */}
                  <h4 className="font-syne font-bold text-gray-800 text-[15px] mb-2 px-2">
                    {step.title}
                  </h4>
                  <p className="text-[13px] text-gray-400 leading-relaxed max-w-[180px] mx-auto">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white border-b">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-10">
              <span className="text-indigo-600 font-bold font-dm tracking-widest text-xs uppercase">
                The Real Difference
              </span>
              <h2 className="text-4xl font-syne font-bold mt-3 mb-4">
                Sound familiar?
              </h2>
              <p className="text-gray-500 max-w-2xl font-dm mx-auto">
                Every business owner recognises the "before." PurpleRadiance is
                the after.
              </p>
            </div>

            {/* Comparison Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Without Column */}
              <div className="rounded-2xl overflow-hidden border border-red-50 bg-red-50/30">
                <div className="bg-red-100/50 px-4 py-4 flex items-center gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <h3 className="uppercase text-xs font-bold tracking-wider font-syne text-red-800">
                    Without PurpleRadiance
                  </h3>
                </div>
                <div className="p-4 space-y-6">
                  {[
                    {
                      label: "Lead",
                      text: "Enquiry comes in at 9pm. Nobody sees it until morning. The lead has already called a competitor.",
                    },
                    {
                      label: "Fee",
                      text: "20 overdue members. Someone has to call each one individually. Half don't pick up.",
                    },
                    {
                      label: "Bill",
                      text: "Invoice created in Word, emailed manually. Payment follow-up is forgotten. Cash flow suffers.",
                    },
                    {
                      label: "Support",
                      text: "Customer complaint sent to WhatsApp group. Gets buried in 50 messages. Never properly resolved.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-start border-b border-red-100/50 pb-4 last:border-0 last:pb-0"
                    >
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold font-dm px-2 py-1 rounded min-w-[50px] text-center uppercase">
                        {item.label}
                      </span>
                      <p className="text-xs text-red-700 font-medium  font-dm leading-tight">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* With Column */}
              <div className="rounded-2xl overflow-hidden border border-emerald-50 bg-emerald-50/30">
                <div className="bg-emerald-100/50 px-6 py-4 flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <h3 className="uppercase text-xs font-bold tracking-wider font-syne text-emerald-800">
                    With PurpleRadiance
                  </h3>
                </div>
                <div className="p-4 space-y-6">
                  {[
                    {
                      label: "Lead",
                      text: "Instant auto-reply sent at 9pm. Lead captured with full details. Team follows up in the morning with context.",
                    },
                    {
                      label: "Fee",
                      text: "Reminders go out on day 1, 3, and 7. Over 80% pay within 48 hours. No calls needed.",
                    },
                    {
                      label: "Bill",
                      text: "Invoice raised in 2 minutes. Payment link sent via WhatsApp. Auto-reminder goes out if unpaid.",
                    },
                    {
                      label: "Support",
                      text: "Ticket auto-created and assigned to an owner. Customer gets a resolution update automatically.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-start border-b border-emerald-100 pb-4 last:border-0 last:pb-0"
                    >
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold font-dm px-2 py-1 rounded min-w-[50px] text-center uppercase">
                        {item.label}
                      </span>
                      <p className="text-xs text-emerald-600 font-medium font-dm  leading-tight">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="text-indigo-600 font-bold font-dm tracking-widest text-xs uppercase">
                What customers say
              </span>
              <h2 className="text-4xl font-syne font-bold mt-3">
                Real businesses. Real results.
              </h2>
            </div>

            {/* Featured Testimonial */}
            <div className="bg-gradient-to-r from-indigo-100 to-indigo-50 border border-indigo-100 rounded-3xl p-4 md:p-8 mb-8 relative overflow-hidden">
              <span className="absolute top-2 left-6 text-indigo-200 text-6xl font-dm  opacity-50">
                “
              </span>
              <div className="relative z-10">
                <p className="text-xl md:text-base font-dm text-gray-800 leading-relaxed ">
                  <span className="italic">
                    {" "}
                    "Before PurpleRadiance, we were{"  "}
                  </span>
                  <span className="font-bold font-dm text-gray-900">
                    losing enquiries because we replied too late, chasing
                    overdue payments manually every month, sending invoices from
                    Word files with no follow-up
                  </span>
                  , and had complaints getting buried in WhatsApp with no
                  resolution.{" "}
                  <span className="text-gray-900">
                    One platform fixed all of it. I don't know how we managed
                    without it."
                  </span>
                </p>
                <p className="mt-4 text-gray-500 text-sm">
                  — Owner, subscription-based service business
                </p>
              </div>
            </div>

            {/* Testimonial Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                {
                  quote:
                    "We stopped losing enquiries overnight. Every lead gets a reply before we even see the notification.",
                  author: "Service business owner",
                  border: "border-l-indigo-500",
                },
                {
                  quote:
                    "Pending dues dropped by 70% in the first month. The reminders just go out on their own — no one has to do anything.",
                  author: "Subscription business founder",
                  border: "border-l-amber-700",
                },
                {
                  quote:
                    "Invoicing used to take an hour a day. Now it's done before my morning tea.",
                  author: "Small business owner",
                  border: "border-l-blue-600",
                },
                {
                  quote:
                    "No more complaints getting lost in chat. Every issue is tracked and our customers know it will be resolved.",
                  author: "Operations manager",
                  border: "border-l-emerald-800",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`bg-white border border-gray-200 shadow-sm rounded-xl p-4 border-l-4 ${card.border} flex flex-col justify-between`}
                >
                  <p className="text-xs font-dm leading-relaxed text-gray-700 italic">
                    "{card.quote}"
                  </p>
                  <p className="mt-2 text-gray-700 font-dm text-xs">
                    — {card.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0b0b13] text-white text-center py-20 px-6 rounded-md ">
          {/* Headline with larger leading and Syne font */}
          <h2 className="font-syne text-4xl md:text-5xl font-bold leading-[1.2] max-w-3xl mx-auto">
            Stop juggling four different tools.
            <br />
            Run everything from one place.
          </h2>

          {/* Subtext */}
          <p className="text-gray-400 mt-6 text-[15px]">
            Join hundreds of businesses already using PurpleRadiance.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#5a52ff] hover:bg-[#4a42ef] text-white font-bold px-8 py-4 rounded-full transition-all text-[15px]">
              Start your free trial
            </button>
            <button className="border border-gray-700 hover:border-white text-white font-bold px-8 py-4 rounded-full transition-all text-[15px]">
              Book a demo
            </button>
          </div>
        </section>
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md font-dm p-2 flex gap-3 z-50 ">
          <button className="flex-1 bg-purple text-white py-3 rounded-full text-sm font-medium">
            Start free trial
          </button>
          <button className="flex-1 border border-purple text-purple py-3 rounded-full text-sm font-medium">
            See demo
          </button>
        </div>
      </div>
    </motion.section>
  );
}

export default Hero;
