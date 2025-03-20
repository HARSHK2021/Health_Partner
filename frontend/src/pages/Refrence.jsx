import React from 'react'
import { useState, useEffect } from 'react';
import {
  Activity,
  Calendar,
  FileText,
  Building2 as Hospital,
  Lock,
  MessageSquare,
  Search,
  User,
  UserCog,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  Newspaper
} from 'lucide-react';
const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  //// apii call and functionality 


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    {/* Navigation */}
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'glass-effect shadow-lg' : ''
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <Hospital className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">HealthPartner</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#news" className="text-gray-700 hover:text-blue-600 transition-colors">Medical News</a>
            <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-b-2xl p-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#news" className="text-gray-700 hover:text-blue-600 transition-colors">Medical News</a>
              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>

    {/* Hero Section */}
    <section className="relative min-h-screen pt-20 flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 -z-10" />
      <div className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-slide-in">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-6">
            Your Health, Your Records – One Platform for Everything
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Seamlessly manage your medical records, connect with healthcare providers, and take control of your health journey with our comprehensive platform.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 transform flex items-center gap-2">
            Get Started <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="relative animate-fade-in">
          <div className="absolute inset-0 bg-blue-600/10 rounded-2xl transform rotate-6"></div>
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
            alt="Healthcare Professional"
            className="rounded-2xl shadow-2xl relative transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </section>

    {/* Key Features Section */}
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16 animate-fade-in">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Search className="w-8 h-8 text-blue-600" />,
              title: "Find & Connect",
              description: "Search for hospitals, doctors, and pharmacies in your area"
            },
            {
              icon: <FileText className="w-8 h-8 text-blue-600" />,
              title: "Medical Records",
              description: "Access and update your complete health history"
            },
            {
              icon: <Calendar className="w-8 h-8 text-blue-600" />,
              title: "Appointments & Reminders",
              description: "Book appointments and get medicine alerts"
            },
            {
              icon: <Activity className="w-8 h-8 text-blue-600" />,
              title: "Health Insights",
              description: "AI-driven analysis of your health trends"
            },
            {
              icon: <Lock className="w-8 h-8 text-blue-600" />,
              title: "Secure & Private",
              description: "HIPAA-compliant data protection for your peace of mind"
            },
            {
              icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
              title: "24/7 Support",
              description: "Get help whenever you need it"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How It Works Section */}
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16 animate-fade-in">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: <User className="w-8 h-8" />,
              title: "Sign Up & Login",
              description: "Create your secure account"
            },
            {
              icon: <FileText className="w-8 h-8" />,
              title: "Manage Records",
              description: "Upload and organize your medical history"
            },
            {
              icon: <Calendar className="w-8 h-8" />,
              title: "Book Appointments",
              description: "Schedule visits with healthcare providers"
            },
            {
              icon: <Activity className="w-8 h-8" />,
              title: "Track Health",
              description: "Monitor your progress with AI insights"
            }
          ].map((step, index) => (
            <div 
              key={index} 
              className={`text-center animate-fade-in`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white transform hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* User Categories Section */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16 animate-fade-in">Who It's For</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <UserCog className="w-12 h-12 text-blue-600" />,
              title: "For Doctors",
              description: "Manage patients & track treatments efficiently"
            },
            {
              icon: <Hospital className="w-12 h-12 text-blue-600" />,
              title: "For Hospitals",
              description: "Monitor doctors & streamline patient care"
            },
            {
              icon: <User className="w-12 h-12 text-blue-600" />,
              title: "For Patients",
              description: "Access health records & book appointments"
            }
          ].map((category, index) => (
            <div 
              key={index} 
              className={`text-center p-8 rounded-xl border-2 border-gray-100 hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="mb-6 transform hover:scale-110 transition-transform">{category.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{category.title}</h3>
              <p className="text-gray-600 mb-6">{category.description}</p>
              <button className="text-blue-600 font-semibold flex items-center justify-center gap-2 mx-auto group">
                Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Medical News Section */}
    <section id="news" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16 animate-fade-in">Latest Medical News</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
              title: "Breakthrough in Cancer Treatment Research",
              date: "March 15, 2025",
              description: "New immunotherapy approach shows promising results in early clinical trials."
            },
            {
              image: "https://images.unsplash.com/photo-1581093458791-4b432292cbe9?auto=format&fit=crop&w=800&q=80",
              title: "AI in Healthcare Diagnostics",
              date: "March 14, 2025",
              description: "Machine learning algorithms achieve new milestone in early disease detection."
            },
            {
              image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80",
              title: "Advances in Telemedicine",
              date: "March 13, 2025",
              description: "Remote healthcare solutions show significant impact on rural communities."
            }
          ].map((news, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Newspaper className="w-4 h-4" />
                  <span className="text-sm">{news.date}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                <p className="text-gray-600">{news.description}</p>
                <button className="mt-4 text-blue-600 font-semibold flex items-center gap-2 group">
                  Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Hospital className="w-6 h-6" />
              HealthPartner
            </h3>
            <p className="text-gray-400">Your trusted healthcare management platform</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-white transition-colors cursor-pointer">Features</li>
              <li className="hover:text-white transition-colors cursor-pointer">For Doctors</li>
              <li className="hover:text-white transition-colors cursor-pointer">For Hospitals</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-white transition-colors cursor-pointer">HIPAA Compliance</li>
              <li className="hover:text-white transition-colors cursor-pointer">Security</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Twitter</li>
              <li className="hover:text-white transition-colors cursor-pointer">LinkedIn</li>
              <li className="hover:text-white transition-colors cursor-pointer">Facebook</li>
              <li className="hover:text-white transition-colors cursor-pointer">Instagram</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 HealthPartner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
  )
}

export default Home
