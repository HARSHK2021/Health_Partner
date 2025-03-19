import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Activity,
  Guitar as Hospital,
  Users,
  FileText,
  Shield,
  ArrowRight,
  Database,
  HeartPulse,
  UserCircle,
  Stethoscope,
  Building2,
  Menu,
} from "lucide-react";
import doc from "../assets/doc.jpg";
import doc2 from "../assets/doc2.jpg";
import clinic from "../assets/clinic.jpg";
import trust from "../assets/trust.jpg";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { UserPlus, Calendar } from "lucide-react";
import { Mail, MessageSquare, Phone } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  // scrolling effect
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollToRoles = () => {
    const rolesSection = document.getElementById("roles");
    if (rolesSection) {
      rolesSection.scrollIntoView({ behavior: "smooth" });
      setActiveSection("roles");
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false); // Close mobile menu after clicking
    }
  };
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Sign Up & Login",
      description: "Create your secure account",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Manage Records",
      description: "Upload and organize your medical history",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Book Appointments",
      description: "Schedule visits with healthcare providers",
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Track Health",
      description: "Monitor your progress with AI insights",
    },
  ];

  ///// api calls 

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#312e81] text-white">
      <div className="min-h-screen relative">
        {/* Fixed Navigation */}
        <nav className="fixed w-full z-50 backdrop-blur-md bg-black/10 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <HeartPulse className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold text-white">
                  Health Partner
                </span>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Menu className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-8">
                {[
                  { name: "Features", id: "features" },
                  { name: "Solutions", id: "roles" },
                  { name: "Contact", id: "contact" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className="text-gray-300 hover:text-blue-400 transition-colors relative group py-2"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
                  </button>
                ))}
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors relative group"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
                </button>
                <button
                  onClick={scrollToRoles}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg hover:opacity-90 transition-all shadow-lg shadow-blue-500/25"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Mobile menu dropdown */}
            {isMobileMenuOpen && (
              <div className="md:hidden pt-4 pb-3 border-t border-white/10 animate-fadeIn">
                {[
                  { name: "Features", id: "features" },
                  { name: "Solutions", id: "roles" },
                  { name: "Contact", id: "contact" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left py-3 px-4 text-gray-300 hover:bg-white/5 hover:text-blue-400 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full text-left py-3 px-4 text-blue-400 hover:bg-white/5"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    scrollToRoles();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full mt-2 mx-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="min-h-screen relative pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
              {/* Content Side */}
              <div className="space-y-8 z-10">
                <div className="relative">
                  <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
                  <h1 className="text-6xl font-bold text-white leading-tight">
                    Revolutionizing{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Healthcare
                    </span>{" "}
                    Management
                  </h1>
                </div>
                <p className="text-xl text-gray-300 max-w-xl">
                  Connect patients, doctors, and hospitals through a unified
                  platform for seamless healthcare record management and
                  improved patient care.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={scrollToRoles}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg hover:opacity-90 transition-all flex items-center shadow-lg shadow-blue-500/25"
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all border border-white/20">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Masonry Image Grid */}
              <div className="hidden lg:block relative">
                <div className="absolute -top-8 -right-8 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="grid grid-cols-2 gap-4 relative">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden shadow-lg h-80">
                      <img
                        src={doc}
                        alt="Medical professionals"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg h-48">
                      <img
                        src={doc2}
                        alt="Healthcare facility"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  {/* Column 2 */}
                  <div className="space-y-4 pt-8">
                    <div className="rounded-2xl overflow-hidden shadow-lg h-48">
                      <img
                        src={clinic}
                        alt="Medical technology"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg h-80">
                      <img
                        src={trust}
                        alt="Medical consultation"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Mobile Image (shown only on small screens) */}
              <div className="lg:hidden relative h-64 rounded-2xl overflow-hidden">
                <img
                  src={doc}
                  alt="Medical professionals"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Comprehensive Healthcare Solutions
              </h2>
              <p className="mt-4 text-xl text-gray-300">
                Everything you need to manage healthcare records efficiently
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Database className="h-8 w-8 text-blue-400" />,
                  title: "Centralized Records",
                  description:
                    "Store and access medical records securely in one place",
                },
                {
                  icon: <Users className="h-8 w-8 text-blue-400" />,
                  title: "Patient Portal",
                  description:
                    "Easy access for patients to view their medical history",
                },
                {
                  icon: <Hospital className="h-8 w-8 text-blue-400" />,
                  title: "Hospital Network",
                  description:
                    "Connect with healthcare providers across the network",
                },
                {
                  icon: <Activity className="h-8 w-8 text-blue-400" />,
                  title: "Real-time Updates",
                  description:
                    "Instant updates on patient status and medical records",
                },
                {
                  icon: <Shield className="h-8 w-8 text-blue-400" />,
                  title: "Secure Platform",
                  description:
                    "Advanced security measures to protect sensitive data",
                },
                {
                  icon: <FileText className="h-8 w-8 text-blue-400" />,
                  title: "Digital Documentation",
                  description:
                    "Paperless solution for all medical documentation",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 glass-effect rounded-xl hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative overflow-hidden p-8 rounded-2xl glass-effect cursor-pointer h-full flex flex-col">
                    <div
                      className={`absolute inset-0 opacity-10 bg-gradient-to-br ${
                        index % 2 === 0
                          ? "from-blue-600 to-blue-400"
                          : "from-purple-600 to-purple-400"
                      }`}
                    />
                    <div className="relative z-10 flex flex-col flex-grow">
                      <div className="p-4 bg-white/10 rounded-xl inline-block mb-6">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 flex-grow">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        {/* how its work section  */}
        <div className="bg-gray-800">
          <section id="how-it-works" className="py-20 ">
            <div className="container mx-auto px-6">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                  How It Works
                </h2>
                <p className="text-xl text-gray-400">
                  Get started with Health Partner in four simple steps
                </p>
              </motion.div>

              <div className="grid md:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.2 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-400">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Role Selection Section */}
        <div id="roles" className="py-24 glass-effect">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">
                Choose Your Role
              </h2>
              <p className="text-xl text-gray-300">
                Select how you want to join Health Partner
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <UserCircle className="h-12 w-12 text-blue-400" />,
                  title: "Join as Patient",
                  description:
                    "Access your medical records, schedule appointments, and manage your healthcare journey",
                  color: "from-blue-600 to-blue-400",
                },
                {
                  icon: <Stethoscope className="h-12 w-12 text-purple-400" />,
                  title: "Join as Doctor",
                  description:
                    "Manage patient records, schedules, and provide better care with our integrated platform",
                  color: "from-purple-600 to-purple-400",
                },
                {
                  icon: <Building2 className="h-12 w-12 text-emerald-400" />,
                  title: "Join as Medical Facility",
                  description:
                    "Streamline operations, manage staff, and enhance patient care delivery",
                  color: "from-emerald-600 to-emerald-400",
                },
              ].map((role, index) => (
                <div key={index} className="h-full">
                  <div className="relative overflow-hidden p-8 rounded-2xl glass-effect cursor-pointer h-full flex flex-col">
                    <div
                      className={`absolute inset-0 opacity-10 bg-gradient-to-br ${role.color}`}
                    />
                    <div className="relative z-10 flex flex-col flex-grow">
                      <div className="p-4 bg-white/10 rounded-xl inline-block mb-6">
                        {role.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {role.title}
                      </h3>
                      <p className="text-gray-300 flex-grow">
                        {role.description}
                      </p>
                      <button
                        className={`mt-6 px-6 py-3 bg-gradient-to-r ${role.color} text-white rounded-lg w-full`}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Contact us section  */}
        <div>
          <section id="contact" className="py-20 bg-gray-800">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Get in Touch
                  </h2>
                  <p className="text-xl text-gray-400">
                    Have questions? We're here to help you 24/7
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-gray-700 p-8 rounded-xl"
                  >
                    <h3 className="text-2xl font-bold text-white mb-6">
                      Send us a message
                    </h3>
                    <form className="space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-400 mb-2"
                        >
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-400 mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-400 mb-2"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Send Message
                      </button>
                    </form>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                  >
                    <div className="bg-gray-700 p-6 rounded-xl">
                      <div className="flex items-center mb-4">
                        <Phone className="w-6 h-6 text-blue-400" />
                        <h4 className="text-xl font-semibold text-white ml-3">
                          Phone
                        </h4>
                      </div>
                      <p className="text-gray-400">+91 XXXXXXXXXX</p>
                    </div>

                    <div className="bg-gray-700 p-6 rounded-xl">
                      <div className="flex items-center mb-4">
                        <Mail className="w-6 h-6 text-blue-400" />
                        <h4 className="text-xl font-semibold text-white ml-3">
                          Email
                        </h4>
                      </div>
                      <p className="text-gray-400">support@healthpartner.com</p>
                    </div>

                    <div className="bg-gray-700 p-6 rounded-xl">
                      <div className="flex items-center mb-4">
                        <MessageSquare className="w-6 h-6 text-blue-400" />
                        <h4 className="text-xl font-semibold text-white ml-3">
                          Live Chat
                        </h4>
                      </div>
                      <p className="text-gray-400">
                        Available 24/7 for your support needs
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="py-12 bg-gray-800 mt-12 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center">
                  <HeartPulse className="h-8 w-8 text-blue-400" />
                  <span className="ml-2 text-xl font-bold">Health Partner</span>
                </div>
                <p className="mt-4 text-gray-300">
                  Transforming healthcare management through innovative
                  technology
                </p>
              </div>
              {[
                {
                  title: "Product",
                  links: ["Features", "Solutions", "Pricing"],
                },
                {
                  title: "Company",
                  links: ["About", "Blog", "Careers"],
                },
                {
                  title: "Legal",
                  links: ["Privacy", "Terms", "Security"],
                },
              ].map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href="#"
                          className="text-gray-300 hover:text-blue-400 transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-300">
              <p>&copy; 2025 Health Partner. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
