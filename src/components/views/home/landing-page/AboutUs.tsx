// import { motion } from "framer-motion";
// import { Activity } from "lucide-react";
// import { useInView } from "react-intersection-observer";

// function AboutUs() {
//   const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

//   return (
//     <section id="aboutUs" className="w-full bg-gradient-to-t from-blue-200 via-blue-100 to-blue-50 py-20">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
//     <motion.section
//       ref={ref}
//       initial={{ opacity: 0, y: 40 }}
//       animate={inView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 0.4, ease: "easeOut" }}

//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <div className="flex justify-center items-center mb-4">
//             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//               <Activity className="h-6 w-6 text-white" />
//             </div>
//           </div>
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             About PurpleRadianceOne
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             We empower businesses to build better relationships with customers
//             through a modern, intuitive CRM platform designed to scale with your
//             growth.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
//           <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
//             <h3 className="text-xl font-semibold text-blue-700 mb-2">
//               Our Mission
//             </h3>
//             <p className="text-gray-600">
//               Helping companies succeed by simplifying customer management
//               through automation, insights, and seamless integration.
//             </p>
//           </div>
//           <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
//             <h3 className="text-xl font-semibold text-blue-700 mb-2">
//               Our Vision
//             </h3>
//             <p className="text-gray-600">
//               To become the most trusted CRM solution for startups, enterprises,
//               and everyone in between.
//             </p>
//           </div>
//           <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
//             <h3 className="text-xl font-semibold text-blue-700 mb-2">
//               Our Values
//             </h3>
//             <p className="text-gray-600">
//               Customer-first approach, innovation, simplicity, and transparency
//               in everything we do.
//             </p>
//           </div>
//           <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
//             <h3 className="text-xl font-semibold text-blue-700 mb-2">
//               Why Choose Us
//             </h3>
//             <p className="text-gray-600">
//               We deliver a powerful yet easy-to-use CRM platform backed by
//               expert support and constant innovation tailored for your success.
//             </p>
//           </div>
//           <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
//             <h3 className="text-xl font-semibold text-blue-700 mb-2">
//               Our Technology
//             </h3>
//             <p className="text-gray-600">
//               Built with the latest scalable technologies, our CRM ensures
//               speed, security, and flexibility for businesses of all sizes.
//             </p>
//           </div>
//           <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
//             <h3 className="text-xl font-semibold text-blue-700 mb-2">
//               Global Impact
//             </h3>
//             <p className="text-gray-600">
//               Serving clients worldwide, we help diverse industries connect with
//               their customers and grow beyond boundaries.
//             </p>
//           </div>
//         </div>
//       </div>
//     </motion.section>
//     </div>
//     </section>
//   );
// }

// export default AboutUs;
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { BsFillPersonCheckFill } from "react-icons/bs";

function AboutUs() {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div id="aboutUs" className="font-dm text-[#0f0e1a] bg-[#fafafa]">
        {/* HERO */}
        <section className="relative text-center px-6 py-20 bg-gradient-to-br from-[#f4f2ff] via-white to-[#f0f7ff] overflow-hidden">
          <div className="inline-flex items-center gap-2 border px-4 py-1 rounded-full shadow-md text-sm text-gray-500 mb-6 bg-white">
            <span className="w-2 h-2 bg-purple rounded-full "></span>
            Our story
          </div>

          <h1 className="font-syne text-4xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight">
            We built <span className="text-purple">PurpleRadianceOne</span>{" "}
            because{" "}
            <span className="text-purple">
              businesses were bleeding revenue
            </span>{" "}
            without knowing it.
          </h1>

          <p className="mt-10 font-dm text-gray-500 max-w-xl mx-auto">
            Missed enquiries. Unpaid fees. Lost invoices. Unresolved complaints.
            We saw it everywhere — and decided to fix it all in one place.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-20">
          {/* Label */}
          <p className="text-[12px] font-semibold text-[#5b4bff] mb-3 uppercase tracking-[1px]">
            The problem we saw
          </p>

          {/* Heading */}
          <h2 className="font-syne text-[28px] md:text-[34px] font-[700] leading-[1.3] tracking-[-0.01em] mb-6">
            Every growing business faces the same four revenue leaks
          </h2>

          {/* Paragraph 1 */}
          <p className="text-[15px] text-[#6b6b80] leading-[1.8] mb-5">
            We talked to hundreds of spa owners, academy managers, service
            teams, and company founders. They all had the same story.{" "}
            <strong className="text-[#0f0e1a] font-[600]">
              An enquiry came in at 9pm and nobody replied until the next
              morning — the lead had already gone to a competitor.
            </strong>{" "}
            A batch of subscription fees was due and someone had to spend two
            hours calling every member individually.
          </p>

          {/* Paragraph 2 */}
          <p className="text-[15px] text-[#6b6b80] leading-[1.8] mb-6">
            Invoices were created in Word, emailed manually, and the follow-up
            was forgotten. Customer complaints landed in a WhatsApp group, got
            buried under 50 messages, and were never properly resolved.{" "}
            <strong className="text-[#0f0e1a] font-[600]">
              Every one of these problems cost real money, every single month.
            </strong>
          </p>

          {/* Highlight box */}
          <div
            className="
    bg-[#eeedfe] 
    border-l-[3px] 
    border-[#5b4bff] 
    rounded-r-xl 
    px-5 py-4 
    italic 
    text-[15px] 
    text-[#0f0e1a] 
    leading-[1.7] 
    mb-6
  "
          >
            "The tools that existed were either too complex, too expensive, or
            built for enterprises — not for the salon owner managing 80 clients
            or the sports academy collecting fees from 200 families."
          </div>

          {/* Final paragraph */}
          <p className="text-[15px] text-[#6b6b80] leading-[1.8]">
            So we built{" "}
            <span className="text-[#0f0e1a] font-[600]">PurpleRadianceOne</span>
            .{" "}
            <strong className="text-[#0f0e1a] font-[600]">
              One platform that captures every lead, collects every fee, raises
              every invoice, and resolves every complaint
            </strong>{" "}
            — automatically, without your team having to chase anything
            manually.
          </p>
        </section>
        {/* MISSION VISION */}
        {/* <section className="bg-white border-y py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-syne text-3xl font-bold mb-10">
            Mission. Vision. Values.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Our Mission",
                text: "Help businesses stop losing revenue.",
                border: "border-purple",
              },
              {
                title: "Our Vision",
                text: "Everything automated. No manual follow-ups.",
                border: "border-green-500",
              },
              {
                title: "Our Promise",
                text: "One platform for everything.",
                border: "border-yellow-600",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-6 border rounded-xl border-t-4 ${item.border}`}
              >
                <h3 className="font-syne font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

        <section className="bg-white border-y border-[#e8e8f0] py-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            {/* Label */}
            <p className="text-[12px] font-semibold text-[#5b4bff] uppercase tracking-[1px] mb-3">
              What drives us
            </p>

            {/* Heading */}
            <h2
              className="
      font-syne 
      text-[28px] md:text-[34px] 
      font-[700] 
      leading-[1.3] 
      tracking-[-0.01em] 
      mb-12
    "
            >
              Mission. Vision. Values.
            </h2>

            {/* Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white border border-[#e8e8f0] border-t-4 border-t-[#5b4bff] rounded-[14px] p-8 text-left hover:shadow-md transition">
                <div className="text-2xl mb-4">🎯</div>
                <h3 className="font-syne text-[16px] font-[700] mb-2">
                  Our Mission
                </h3>
                <p className="text-[13px] text-[#6b6b80] leading-[1.7]">
                  To help every growing business — a spa, an academy, a
                  manufacturer, a product company — stop losing revenue to
                  missed follow-ups, forgotten reminders, and unresolved issues.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-[#e8e8f0] border-t-4 border-t-[#0F6E56] rounded-[14px] p-8 text-left hover:shadow-md transition">
                <div className="text-2xl mb-4">🔭</div>
                <h3 className="font-syne text-[16px] font-[700] mb-2">
                  Our Vision
                </h3>
                <p className="text-[13px] text-[#6b6b80] leading-[1.7]">
                  A world where no business owner has to manually chase a lead,
                  remind a customer to pay, or follow up on a complaint.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-[#e8e8f0] border-t-4 border-t-[#854F0B] rounded-[14px] p-8 text-left hover:shadow-md transition">
                <div className="text-2xl mb-4">🤝</div>
                <h3 className="font-syne text-[16px] font-[700] mb-2">
                  Our Promise
                </h3>
                <p className="text-[13px] text-[#6b6b80] leading-[1.7]">
                  We are not a CRM. We are not a billing tool. We are not a
                  helpdesk. We are the one platform built for businesses that
                  cannot afford to lose a single lead or payment.
                </p>

                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#854F0B] rounded-t-[14px]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* FOUR PILLARS */}
        {/* <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-[12px] font-semibold text-[#5b4bff] uppercase tracking-[1px] mb-3">
          What we do
        </p>

        <h2 className="font-syne text-3xl text-center font-bold mb-10">
          Four problems. One platform.
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          {["Lead capture", "Reminders", "Billing", "Support"].map(
            (item, i) => (
              <div key={i} className="p-4 border rounded-xl bg-white">
                <h4 className="font-syne text-sm font-semibold">{item}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Simplified automation for your business.
                </p>
              </div>
            ),
          )}
        </div>
      </section> */}

        <section className="max-w-6xl mx-auto px-6 py-20">
          {/* Label */}
          <p className="text-[12px] font-semibold text-[#5b4bff] uppercase tracking-[1px] mb-3 text-center">
            What we do
          </p>

          {/* Heading */}
          <h2
            className="
    font-syne 
    text-[28px] md:text-[32px] 
    text-center 
    font-[700] 
    leading-[1.3] 
    tracking-[-0.01em] 
    mb-12
  "
          >
            Four problems. One platform. Zero revenue leaks.
          </h2>

          {/* Cards */}
          <div className="grid md:grid-cols-4 gap-5">
            {/* CARD 1 */}
            <div className="flex gap-4 items-start bg-white border border-[#e8e8f0] rounded-[14px] p-4 border-l-[4px] border-l-[#5b4bff]">
              <div className="w-9 h-9 rounded-lg bg-[#e8e7fd] flex items-center justify-center shrink-0">
                <BsFillPersonCheckFill className="" />
              </div>
              <div>
                <h4 className="font-syne text-[13px] font-[600] mb-1">
                  Lead capture
                </h4>
                <p className="text-[12px] text-[#6b6b80] leading-[1.5]">
                  Every enquiry auto-replied and tracked before it goes cold.
                </p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="flex gap-4 items-start bg-white border border-[#e8e8f0] rounded-[14px] p-4 border-l-[4px] border-l-[#854F0B]">
              <div className="w-9 h-9 rounded-lg bg-[#FAEEDA] flex items-center justify-center shrink-0">
                📅
              </div>
              <div>
                <h4 className="font-syne text-[13px] font-[600] mb-1">
                  Subscription reminders
                </h4>
                <p className="text-[12px] text-[#6b6b80] leading-[1.5]">
                  Automated fee reminders so you collect without chasing.
                </p>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="flex gap-4 items-start bg-white border border-[#e8e8f0] rounded-[14px] p-4 border-l-[4px] border-l-[#185FA5]">
              <div className="w-9 h-9 rounded-lg bg-[#E6F1FB] flex items-center justify-center shrink-0">
                🧾
              </div>
              <div>
                <h4 className="font-syne text-[13px] font-[600] mb-1">
                  Billing & invoicing
                </h4>
                <p className="text-[12px] text-[#6b6b80] leading-[1.5]">
                  GST invoices with payment links in under 2 minutes.
                </p>
              </div>
            </div>

            {/* CARD 4 */}
            <div className="flex gap-4 items-start bg-white border border-[#e8e8f0] rounded-[14px] p-4 border-l-[4px] border-l-[#0F6E56]">
              <div className="w-9 h-9 rounded-lg bg-[#E1F5EE] flex items-center justify-center shrink-0">
                💬
              </div>
              <div>
                <h4 className="font-syne text-[13px] font-[600] mb-1">
                  Support tickets
                </h4>
                <p className="text-[12px] text-[#6b6b80] leading-[1.5]">
                  Every complaint tracked to resolution — nothing buried in
                  chat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHO WE SERVE */}
        <section className="bg-[#0f0e1a] text-white py-20 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Label */}
            <p className="text-[12px] font-semibold uppercase tracking-[1px] text-white/40 mb-3">
              Who we serve
            </p>

            {/* Heading */}
            <h2
              className="
      font-syne 
      text-[28px] md:text-[34px] 
      font-[700] 
      leading-[1.3] 
      tracking-[-0.01em] 
      mb-4
    "
            >
              Built for businesses that run on relationships
            </h2>

            {/* Sub text */}
            <p className="text-[15px] text-white/50 max-w-lg leading-[1.7] mb-12">
              We are not built for Fortune 500 companies. We are built for the
              business owner who is doing everything themselves and can't afford
              to lose a single customer.
            </p>

            {/* Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-white/5 border border-white/10 rounded-[14px] p-6 hover:bg-white/10 transition">
                <div className="text-xl mb-3">💆</div>
                <h4 className="font-syne text-[14px] font-[600] mb-2">
                  Salons & Spas
                </h4>
                <p className="text-[12px] text-white/50 leading-[1.6]">
                  Capture walk-in enquiries, send appointment reminders, collect
                  membership fees, and win back clients.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/5 border border-white/10 rounded-[14px] p-6 hover:bg-white/10 transition">
                <div className="text-xl mb-3">🏅</div>
                <h4 className="font-syne text-[14px] font-[600] mb-2">
                  Sports Academies
                </h4>
                <p className="text-[12px] text-white/50 leading-[1.6]">
                  Collect batch fees without calling every parent. Auto-remind
                  overdue students.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white/5 border border-white/10 rounded-[14px] p-6 hover:bg-white/10 transition">
                <div className="text-xl mb-3">🏭</div>
                <h4 className="font-syne text-[14px] font-[600] mb-2">
                  Manufacturing
                </h4>
                <p className="text-[12px] text-white/50 leading-[1.6]">
                  Capture B2B leads, follow up on quotations, raise invoices,
                  and track complaints.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white/5 border border-white/10 rounded-[14px] p-6 hover:bg-white/10 transition">
                <div className="text-xl mb-3">💻</div>
                <h4 className="font-syne text-[14px] font-[600] mb-2">
                  IT & Product Companies
                </h4>
                <p className="text-[12px] text-white/50 leading-[1.6]">
                  Auto-respond to demo requests, manage SaaS renewals, and run
                  support systems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="bg-white py-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-[12px] font-semibold text-[#5b4bff] uppercase tracking-[1px] mb-4 text-center">
              How we operate
            </p>

            <h2 className="font-syne text-3xl font-bold mb-10">Our values</h2>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  number: "01",
                  title: "Outcome over feature",
                  discription:
                    "We don't build features for the sake of it. Every part of PurpleRadiance exists to solve a specific revenue or operations problem for real businesses.",
                },
                {
                  number: "02",
                  title: "Simplicity is product",
                  discription:
                    "If a spa owner or academy manager can't use it on day one without training, we haven't done our job. Ease of use is a design requirement, not an afterthought.",
                },
                {
                  number: "03",
                  title: "Automation as the default",
                  discription:
                    "Every follow-up, reminder, and notification should happen automatically. If your team has to manually trigger something, we have more work to do.",
                },
                {
                  number: "04",
                  title: "Built for India first",
                  discription:
                    "WhatsApp is how Indian businesses communicate. GST is how they invoice. We are built around how businesses actually operate here, not how enterprise software assumes they do.",
                },
                {
                  number: "05",
                  title: "Customer success is our growth",
                  discription:
                    "We grow when our customers grow. Our measure of success is not features shipped — it is leads captured, fees collected, and issues resolved for the businesses that trust us.",
                },
                {
                  number: "06",
                  title: "Transparent and honest",
                  discription:
                    "No hidden charges. No confusing pricing tiers. No locking you in. We earn your business every month because the platform delivers, not because switching is painful.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 border rounded-xl bg-gray-50 items-start text-left"
                >
                  <span className="text-xs font-bold text-purple mb-1 block">
                    {item.number}
                  </span>
                  <h4 className="font-syne text-sm font-semibold">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-gray-500 leading-[1.6] mt-2">
                    {item.discription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-20 px-6 bg-gradient-to-r from-purple-dark to-purple text-white">
          <div className="max-w-xl m-auto text-center">
            <h2 className="font-syne text-4xl font-bold px-14">
              Ready to stop losing revenue? you already earned?
            </h2>

            <p className="text-white/70 mt-2">
              Join businesses running on PurpleRadianceOne.
            </p>

            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <button className="bg-white text-purple px-6 py-3 rounded-full">
                Start free trial
              </button>
              <button className="border px-6 py-3 rounded-full">
                Book demo
              </button>
            </div>
          </div>
        </section>
      </div>
    </motion.section>
  );
}

export default AboutUs;
