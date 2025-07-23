import { useState, useRef } from "react"; // Import useRef and useEffect
import { motion } from 'framer-motion';
import { X } from "lucide-react";

function ShareStoryModal ({
    isOpen,
    onClose
} : {
    isOpen : boolean,
    onClose : () => void}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [story, setStory] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const [showScrollIndicator, setShowScrollIndicator] = useState(false); // New state for scroll indicator
  const modalContentRef = useRef<HTMLDivElement>(null); // Ref for the modal content div

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (isOpen && modalContentRef.current) {
//       const { scrollHeight, clientHeight } = modalContentRef.current;
//       if (scrollHeight > clientHeight) {
//         setShowScrollIndicator(true);
//         timer = setTimeout(() => {
//           setShowScrollIndicator(false);
//         }, 4000);
//       }
//     }

//     return () => {
//       clearTimeout(timer);
//       setShowScrollIndicator(false); 
//     };
//   }, [isOpen]); 

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({ name, email, designation, company, story, agreedToTerms });
    // In a real application, you would send this data to your backend
    // For demonstration, we'll use a simple alert.
    // IMPORTANT: Avoid using window.alert() in production applications for better UX.
    alert('Thank you for sharing your story! We will review it shortly.');
    onClose();
    // Reset form fields after submission
    setName('');
    setEmail('');
    setDesignation('');
    setCompany('');
    setStory('');
    setAgreedToTerms(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50 overflow-y-auto border border-gray-400
            [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-transparent">
      <motion.div
        ref={modalContentRef} // Assign the ref here
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto border border-gray-400
            [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-transparent"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
        {/* Modal title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">Share Your Story ✍️</h2>
        {/* Form for story submission */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Name input field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Email input field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Designation/Title input field */}
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
              Designation/Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Company Name input field */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name (Optional)
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Your Story textarea */}
          <div>
            <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-1">
              Your Story <span className="text-red-500">*</span>
            </label>
            <textarea
              id="story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={3}
              placeholder="Tell us how our CRM is helping transform your business..."
              maxLength={500}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            ></textarea>
            <p className="text-right text-sm text-gray-500 mt-0.5">{story.length}/500 characters</p>
          </div>
          {/* Agreement checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreedToTerms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="agreedToTerms" className="ml-2 block text-sm text-gray-900">
              By submitting, I agree to allow PurpleCRM to use my testimonial on its website and marketing materials. <span className="text-red-500">*</span>
            </label>
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Submit Story
          </button>
        </form>

        {/* Scroll Indicator */}
        {/* {showScrollIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-sm px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1"
          >
            <span>Scroll down to view more</span>
            <svg
              className="w-4 h-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </motion.div>
        )} */}
      </motion.div>
    </div>
  );
};

export default ShareStoryModal;
