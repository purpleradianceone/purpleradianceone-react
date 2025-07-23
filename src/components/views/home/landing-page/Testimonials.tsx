import { Star, Users, MessageCircle, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import { useInView } from 'react-intersection-observer';
import ShareStoryModal from './ShareStoryModal';



function Testimonials() {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [clickedStar, setClickedStar] = useState<number | null>(null);
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const earlyAdopterContent = {
    title: "Join Our Growing Community",
    subtitle: "Be among the first to experience the future of CRM",
    callToAction: "Become a Beta User",
  };

  const socialProof = [
    {
      icon: Users,
      metric: "500+",
      label: "Early Adopters",
      description: "Forward-thinking businesses already testing our platform",
    },
    {
      icon: TrendingUp,
      metric: "40%",
      label: "Productivity Increase",
      description: "Average improvement reported by beta users",
    },
    {
      icon: MessageCircle,
      metric: "24/7",
      label: "Support Available",
      description: "Dedicated support for all our users",
    },
  ];

  return (
    <div className="bg-gradient-to-t from-blue-200 via-blue-100 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {earlyAdopterContent.title}
          </h2>
          <p className="text-xl text-gray-600 mb-8">{earlyAdopterContent.subtitle}</p>
        </motion.div>

        {/* Social Proof Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {socialProof.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <item.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{item.metric}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.label}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Feedback Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Want to Share Your Experience?</h3>
          <p className="text-gray-600 mb-6">
            We'd love to hear how our CRM is helping transform your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setIsModalOpen(true)
                
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Share Your Story
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Join Beta Program
            </button>
          </div>
        </motion.div>

        {/* Emoji Feedback Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="h-6 w-6 flex justify-self-center mb-4 text-2xl">
              {
                hoveredStar === 0 || clickedStar === 0 ? '🙁' :
                hoveredStar === 1 || clickedStar === 1 ? '😕' :
                hoveredStar === 2 || clickedStar === 2 ? '😐' :
                hoveredStar === 3 || clickedStar === 3 ? '🙂' :
                hoveredStar === 4 || clickedStar === 4 ? '😊' : ''
              }
            </div>
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  onMouseEnter={() => setHoveredStar(i)}
                  onMouseLeave={() => setHoveredStar(null)}
                  onClick={() => {
                    setClickedStar(i)
                  }}
                  className={`h-8 w-8 mx-1 cursor-pointer transition-colors duration-200 ${
                    (hoveredStar !== null && i <= hoveredStar) || (clickedStar !==null && i <= clickedStar )
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 fill-current'
                  }`}
                />
              ))}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Stories Coming Soon</h3>
            <p className="text-gray-600 text-lg">
              We're collecting feedback from our amazing users. Check back soon to see what they're saying!
            </p>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {isModalOpen && <ShareStoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default Testimonials;