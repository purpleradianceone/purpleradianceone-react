import {
  LineChart,
  Mail,
  MessageSquare,
  PieChart,
  Settings,
  Target,
  Calendar,
  TrendingUpIcon,
  Users,
  BarChart3
} from 'lucide-react';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function Features() {
  const [ref, inView] = useInView({fallbackInView: true, threshold: 0.15 });

  const features = [
    {
      icon: <LineChart className="h-8 w-8 text-blue-600" />,
      title: "Advanced Analytics",
      description: "Get detailed insights into your sales pipeline and team performance"
    },
    {
      icon: <TrendingUpIcon className="h-8 w-8 text-blue-600" />,
      title: 'Sales Pipeline',
      description: 'Visualize your sales process, track deal progression, and forecast revenue with customizable pipeline stages and automation.'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Contact Management',
      description: 'Centralize all customer information, track interactions, and maintain detailed contact profiles with complete communication history.'
    },
    {
      icon: <Mail className="h-8 w-8 text-blue-600" />,
      title: "Email Integration",
      description: "Seamlessly integrate with your email for better communication tracking"
    },
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: 'Lead Scoring & Qualification',
      description: 'Automatically score leads based on behavior and engagement, prioritizing your most promising prospects.'
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "Smart Communication",
      description: "Automated follow-ups and personalized message templates"
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: 'Task & Schedule Management',
      description: 'Never miss important follow-ups with integrated calendar, automated reminders, and task prioritization features.'
    },
    {
      icon: <PieChart className="h-8 w-8 text-blue-600" />,
      title: "Reports & Dashboards",
      description: "Customizable reports and real-time performance dashboards"
    },
    {
      icon: <Settings className="h-8 w-8 text-blue-600" />,
      title: "Easy to Configure",
      description: "Configure all your setttings as per your needs"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: 'Advanced Analytics',
      description: 'Generate comprehensive reports, track KPIs, and gain actionable insights to optimize your sales and marketing performance.'
    },
  ];

  return (
    <div id="features" className="py-20 bg-gradient-to-b from-blue-200 via-blue-100 to-blue-50 w-full">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage your customer relationships effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 border rounded-xl hover:shadow-lg transition-shadow w-full bg-white"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Features;
