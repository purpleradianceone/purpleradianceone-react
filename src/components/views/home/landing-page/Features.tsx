import { 
  LineChart, 
  Mail, 
  PhoneCall, 
  MessageSquare, 
  PieChart,
  Settings
} from 'lucide-react';

function Features(){
  const features = [
    {
      icon: <LineChart className="h-8 w-8 text-blue-600" />,
      title: "Advanced Analytics",
      description: "Get detailed insights into your sales pipeline and team performance"
    },
    {
      icon: <Mail className="h-8 w-8 text-blue-600" />,
      title: "Email Integration",
      description: "Seamlessly integrate with your email for better communication tracking"
    },
    {
      icon: <PhoneCall className="h-8 w-8 text-blue-600" />,
      title: "Call Center",
      description: "Built-in calling features with automatic call logging and recording"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "Smart Communication",
      description: "Automated follow-ups and personalized message templates"
    },
    {
      icon: <PieChart className="h-8 w-8 text-blue-600" />,
      title: "Reports & Dashboards",
      description: "Customizable reports and real-time performance dashboards"
    },
    {
      icon: <Settings className="h-8 w-8 text-blue-600" />,
      title: "Workflow Automation",
      description: "Automate repetitive tasks and streamline your processes"
    }
  ];

  return (
    <div id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage your customer relationships effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;