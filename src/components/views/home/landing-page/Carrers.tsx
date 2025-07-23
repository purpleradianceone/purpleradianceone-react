import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Users,
  Heart,
  Coffee,
  Laptop,
  Globe,
  Award,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";

const CareersPage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const jobListings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Mumbai, India",
      type: "Full-time",
      experience: "3-5 years",
      description:
        "Build amazing user experiences with React, TypeScript, and modern web technologies.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "4-6 years",
      description:
        "Lead product strategy and work with cross-functional teams to deliver exceptional products.",
      skills: ["Product Strategy", "Analytics", "User Research", "Agile"],
    },
    {
      id: 3,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      experience: "2-4 years",
      description:
        "Create beautiful and intuitive user interfaces that delight our customers.",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    },
    {
      id: 4,
      title: "Backend Engineer",
      department: "Engineering",
      location: "Delhi, India",
      type: "Full-time",
      experience: "3-5 years",
      description:
        "Build scalable backend systems and APIs that power our platform.",
      skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
    },
    {
      id: 5,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Mumbai, India",
      type: "Full-time",
      experience: "2-3 years",
      description:
        "Drive growth through creative marketing campaigns and data-driven strategies.",
      skills: ["Digital Marketing", "Content Strategy", "Analytics", "SEO"],
    },
    {
      id: 6,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "4-6 years",
      description:
        "Manage infrastructure and deployment pipelines for our growing platform.",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    },
  ];

  const departments = ["All", "Engineering", "Product", "Design", "Marketing"];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs",
    },
    {
      icon: Coffee,
      title: "Work-Life Balance",
      description: "Flexible hours and unlimited PTO policy",
    },
    {
      icon: Laptop,
      title: "Equipment & Setup",
      description: "Latest MacBook and home office setup allowance",
    },
    {
      icon: Globe,
      title: "Remote First",
      description: "Work from anywhere with quarterly team meetups",
    },
    {
      icon: Award,
      title: "Learning & Growth",
      description: "₹50,000 annual learning budget and conference tickets",
    },
    {
      icon: Users,
      title: "Amazing Team",
      description: "Work with talented people who care about what they do",
    },
  ];

  const filteredJobs = jobListings.filter((job) => {
    const matchesDepartment =
      selectedDepartment === "All" || job.department === selectedDepartment;
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-32">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6">Join Our Amazing Team</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              We're building the future of technology and looking for passionate
              people to join us on this journey. Come work with some of the
              brightest minds in the industry.
            </p>
            <div className="flex items-center justify-center space-x-8 text-blue-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">15+</div>
                <div className="text-sm">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.8/5</div>
                <div className="text-sm">Employee Rating</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Benefits Section */}
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Work With Us?
              </h2>
              <p className="text-xl text-gray-600">
                We believe in taking care of our team
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Job Listings Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Open Positions
              </h2>
              <p className="text-xl text-gray-600">
                Find your next opportunity
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Cards */}
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {job.title}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                          {job.department}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{job.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{job.experience}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-6">
                      <button className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                        <span>Apply Now</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No positions found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Don't See the Right Role?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              We're always looking for talented people. Send us your resume and
              we'll keep you in mind for future opportunities.
            </p>
            <button className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Send Your Resume
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CareersPage;
