/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowRight, BarChart2, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ROUTES_URL from '../../../../constants/Routes';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLoggedInUserContext } from '../../../../context/user/LoggedInUserContext';
import { useEffect } from 'react';

function Hero() {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ fallbackInView: true,threshold: 0.1 });

  const {setLoginStatus} = useLoggedInUserContext();
  useEffect(() => {
     setLoginStatus({
      id: 0,
      companyId: 0,
      message: "",
      token: "",
      status: false,
      email: "",
      fullName: "",
      companyName: "",
      createdOn: "",
      mobileNumber: "",
      activeUsersInCompany: 0,
      isActiveSubscription: false,
      subscriptionAllowedUsers: 0,
      endDateSubscription: "",
      startDateSubscription: "",
      subscriptionId: 0,
    });
  },[])

  return (
    <div className="w-full pt-20 bg-gradient-to-b from-blue-200 via-blue-100 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">

        {/* Animated Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Transform Your Business with
            <span className="text-blue-600"> Intelligent CRM</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10">
            Streamline your sales process, enhance customer relationships, and boost revenue with our comprehensive CRM solution.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES_URL.SIGN_UP)}
              className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-500 flex items-center justify-center transition duration-200"
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <a href='mailTo:crm@purpleradiance.com'>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full hover:bg-blue-50 transition duration-200">
              Schedule Demo
            </button>
            </a>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {[{
            icon: <BarChart2 className="h-12 w-12 text-blue-600 mb-4" />,
            title: 'Increase Sales',
            desc: 'Boost your revenue with data-driven insights and automated workflows.'
          }, {
            icon: <Users className="h-12 w-12 text-blue-600 mb-4" />,
            title: 'Team Collaboration',
            desc: 'Enable seamless communication and task management across teams.'
          }, {
            icon: <Calendar className="h-12 w-12 text-blue-600 mb-4" />,
            title: 'Smart Scheduling',
            desc: 'Automate appointment scheduling and follow-ups effortlessly.'
          }].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 text-center"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
