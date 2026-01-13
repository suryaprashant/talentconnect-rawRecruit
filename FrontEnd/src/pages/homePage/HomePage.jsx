import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, Briefcase, GraduationCap, Target,
  TrendingUp, Award, Calendar, Lightbulb, UserCheck,
  Menu, X, ChevronRight, CheckCircle, Star, Sparkles,
  ArrowRight, Users2, TargetIcon, Zap, Globe, Shield,
  BarChart3, HeartHandshake, Rocket, PieChart, BookOpen,
  MessageSquare, Network, ShieldCheck, Trophy, Clock,
  Coffee, Linkedin, Grid, Layout, Settings, Eye,
  Layers, Palette, Code, Zap as Lightning
} from 'lucide-react';
import { TermsModal } from '@/components/onboarding/Terms&conditionModal';
import heroImage from "../../assets/image.jpg";

const App = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);

  // Refs for sections
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const companyServicesRef = useRef(null);
  const collegeServicesRef = useRef(null);
  const employerServicesRef = useRef(null);
  const statsRef = useRef(null);
  const footerRef = useRef(null);

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track scroll position for color changes
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
      const sections = [
        { ref: heroRef, id: 'hero' },
        { ref: howItWorksRef, id: 'how-it-works' },
        { ref: companyServicesRef, id: 'companies' },
        { ref: collegeServicesRef, id: 'colleges' },
        { ref: employerServicesRef, id: 'employers' },
        { ref: statsRef, id: 'stats' }
      ];
      
      let currentActive = null;
      let maxVisibility = 0;
      
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(windowHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const sectionVisibility = visibleHeight / Math.min(windowHeight, rect.height);
          
          if (sectionVisibility > 0.2 && sectionVisibility > maxVisibility) {
            maxVisibility = sectionVisibility;
            currentActive = section.id;
          }
        }
      }
      
      setActiveSection(currentActive);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCardClick = (cardType) => {
    const hiringRoutes = {
      'On-Campus': '/hiring-channels/on-campus-hiring',
      'Pool-Campus': '/hiring-channels/pool-campus-hiring',
      'Off-Campus': '/hiring-channels/off-campus-hiring'
    };

    const targetRoute = hiringRoutes[cardType];
    if (targetRoute) {
      localStorage.setItem('redirectAfterAuth', targetRoute);
      navigate(targetRoute);
    }
  };

  const handleRoleSelect = (role) => {
    console.log('here')
    if (role) {
      localStorage.setItem('selectedRole', role);
      navigate('/signup');
    }
  };

  const handleServiceCardClick = (serviceType, serviceTitle) => {
    localStorage.setItem('selectedServiceType', serviceType);
    localStorage.setItem('selectedServiceTitle', serviceTitle);
    
    const companyRoutes = {
      'On-Campus': '/hiring-channels/on-campus-hiring',
      'Off-Campus': '/hiring-channels/off-campus-hiring',
      'Pool-Campus': '/hiring-channels/pool-campus-hiring',
      'Workforce Solution': '/service-request/workforce-solution',
      'Employee Training': '/service-request/employee-training',
      'Branding': '/service-request/branding'
    };
    
    const collegeRoutes = {
      'On-Campus': '/service-request/campus-placement',
      'Pool-Campus': '/service-request/poolcampus-placement',
      'Student Training': '/service-request/student-training-programs',
      'Seminar': '/service-request/seminars',
      'Campus Branding': '/service-request/campus-branding',
      'Analytics': '/services/college/analytics'
    };
    
    const employerRoutes = {
      'On-Campus': '/hiring-channels/on-campus-hiring/employer',
      'Off-Campus': '/hiring-channels/off-campus-hiring/employer',
      'Pool-Campus': '/hiring-channels/pool-campus-hiring/employer',
      'Workforce Solution': '/service-request/workforce-solution',
      'Training Management': '/service-request/employee-training',
      'Brand Representation': '/service-request/branding'
    };
    
    let routeMap;
    switch (serviceType) {
      case 'company':
        routeMap = companyRoutes;
        break;
      case 'college':
        routeMap = collegeRoutes;
        break;
      case 'employer':
        routeMap = employerRoutes;
        break;
      default:
        routeMap = {};
    }
    
    const targetRoute = routeMap[serviceTitle];
    
    if (targetRoute) {
      navigate(targetRoute);
    } else {
      navigate(`/services/${serviceType}`);
    }
  };

  const handleGetStarted = () => {
    navigate('/userselection');
  };

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  const heroCards = [
    {
      title: 'On-Campus',
      description: 'Direct recruitment at college campus',
      icon: <GraduationCap className="w-8 h-8" />,
      gradient: 'from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9]',
      accentColor: 'bg-[#7C3AED]',
      features: ['Direct access', 'Live interactions', 'Customized tests']
    },
    {
      title: 'Pool-Campus',
      description: 'Multi-college recruitment opportunities',
      icon: <Users2 className="w-8 h-8" />,
      gradient: 'from-[#F472B6] via-[#EC4899] to-[#DB2777]',
      accentColor: 'bg-[#EC4899]',
      features: ['Multiple colleges', 'Centralized process', 'Cost-effective']
    },
    {
      title: 'Off-Campus',
      description: 'Flexible hiring solutions',
      icon: <Globe className="w-8 h-8" />,
      gradient: 'from-[#60A5FA] via-[#3B82F6] to-[#1D4ED8]',
      accentColor: 'bg-[#3B82F6]',
      features: ['Wide reach', 'Flexible timing', 'Diverse talent pool']
    }
  ];

  const services = {
    company: {
      title: 'Companies',
      desc: 'Complete recruitment solutions for your organization',
      cards: [
        { 
          icon: <GraduationCap className="w-10 h-10" />, 
          title: 'On-Campus', 
          desc: 'Direct campus recruitment', 
          color: '#8B5CF6'
        },
        { 
          icon: <Users className="w-10 h-10" />, 
          title: 'Off-Campus', 
          desc: 'Open recruitment drives', 
          color: '#F472B6'
        },
        { 
          icon: <Target className="w-10 h-10" />, 
          title: 'Pool-Campus', 
          desc: 'Multi-college hiring', 
          color: '#60A5FA'
        },
        { 
          icon: <UserCheck className="w-10 h-10" />, 
          title: 'Workforce Solution', 
          desc: 'Complete hiring solutions', 
          color: '#10B981'
        },
        { 
          icon: <TrendingUp className="w-10 h-10" />, 
          title: 'Employee Training', 
          desc: 'Skill development programs', 
          color: '#F59E0B'
        },
        { 
          icon: <Award className="w-10 h-10" />, 
          title: 'Branding', 
          desc: 'Employer brand building', 
          color: '#8B5CF6'
        }
      ]
    },
    college: {
      title: 'Colleges',
      desc: 'Enhance placement opportunities for your students',
      cards: [
        { 
          icon: <GraduationCap className="w-10 h-10" />, 
          title: 'On-Campus', 
          desc: 'Host campus drives', 
          color: '#8B5CF6'
        },
        { 
          icon: <Users className="w-10 h-10" />, 
          title: 'Pool-Campus', 
          desc: 'Collaborative hiring events', 
          color: '#F472B6'
        },
        { 
          icon: <BookOpen className="w-10 h-10" />, 
          title: 'Student Training', 
          desc: 'Upskill your students', 
          color: '#60A5FA'
        },
        { 
          icon: <MessageSquare className="w-10 h-10" />, 
          title: 'Seminar', 
          desc: 'Industry expert sessions', 
          color: '#10B981'
        },
        { 
          icon: <Award className="w-10 h-10" />, 
          title: 'Campus Branding', 
          desc: 'Enhance college reputation', 
          color: '#F59E0B'
        },
        { 
          icon: <PieChart className="w-10 h-10" />, 
          title: 'Analytics', 
          desc: 'Placement insights & reports', 
          color: '#8B5CF6'
        }
      ]
    },
    employer: {
      title: 'Employers',
      desc: 'Independent recruitment management solutions',
      cards: [
        { 
          icon: <GraduationCap className="w-10 h-10" />, 
          title: 'On-Campus', 
          desc: 'Manage campus recruitment', 
          color: '#8B5CF6'
        },
        { 
          icon: <Network className="w-10 h-10" />, 
          title: 'Off-Campus', 
          desc: 'Coordinate hiring drives', 
          color: '#F472B6'
        },
        { 
          icon: <TargetIcon className="w-10 h-10" />, 
          title: 'Pool-Campus', 
          desc: 'Multi-location recruitment', 
          color: '#60A5FA'
        },
        { 
          icon: <UserCheck className="w-10 h-10" />, 
          title: 'Workforce Solution', 
          desc: 'End-to-end hiring support', 
          color: '#10B981'
        },
        { 
          icon: <TrendingUp className="w-10 h-10" />, 
          title: 'Training Management', 
          desc: 'Training program management', 
          color: '#F59E0B'
        },
        { 
          icon: <ShieldCheck className="w-10 h-10" />, 
          title: 'Brand Representation', 
          desc: 'Company brand management', 
          color: '#8B5CF6'
        }
      ]
    }
  };

  // Floating animation for cursor
  const cursorStyle = {
    left: `${cursorPosition.x}px`,
    top: `${cursorPosition.y}px`,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      </div>

      {/* Interactive cursor element */}
      <div 
        className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-purple-200/20 to-pink-200/20 blur-3xl pointer-events-none transition-all duration-100 ease-out z-0"
        style={cursorStyle}
      />

      {/* Floating UI Elements - Dashboard Components */}
      {/* <div className="fixed top-20 left-10 z-10">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-white/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                <Grid className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="h-2 w-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-1"></div>
                <div className="h-1 w-12 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="fixed bottom-20 right-10 z-10">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-white/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="h-2 w-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mb-1"></div>
                <div className="h-1 w-14 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="relative z-20">
        {/* Modern Glass Navigation */}
        <header className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[92%] max-w-6xl bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl z-50">
          <div className="px-8 py-4 flex justify-between items-center">
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-white to-gray-50 p-2 rounded-xl shadow-lg border border-white/60">
                  <Rocket className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                RawRecruit
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-8">
              {['Services', 'How It Works', 'Features', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="relative text-gray-700 hover:text-purple-600 transition-all duration-300 font-medium group py-2"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              
              <button
                onClick={handleGetStarted}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg">
                  <span className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            </nav>

            <button
              className="md:hidden p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden px-8 pb-6 animate-slideDown">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-xl">
                <div className="flex flex-col gap-4">
                  {['Services', 'How It Works', 'Features', 'About'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(' ', '-')}`}
                      className="text-gray-700 hover:text-purple-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                  <button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-2"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <div className="pt-32">
          <section 
            ref={heroRef}
            id="hero" 
            className="relative px-6 py-20"
          >
            {/* Hero Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative">
              <div className="text-center mb-20">
                {/* Interactive Tag */}
                <div className="inline-flex items-center gap-2 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-lg">
                      <span className="flex items-center gap-2">
                        <Lightning className="w-4 h-4" />
                        Recruitment Revolutionized
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                    Campus Recruitment
                  </span>
                  <br />
                  <span className="text-gray-800">At Affordable Excellence</span>
                </h1>
                
                <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
                  Connecting colleges and companies for fresher recruitment through 
                  innovative, technology-driven hiring solutions
                </p>

                {/* Interactive CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleGetStarted}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                      <span className="flex items-center gap-3">
                        Start Your Journey
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </div>
                  </button>
                  
                  
                </div>

                {/* Stats Preview */}
                <div className="flex justify-center gap-8 mt-16 opacity-80">
                  {['500+ Colleges', '1K+ Companies', '95% Satisfaction'].map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="text-gray-600 font-medium">{stat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Cards - Modern Floating Design */}
              <div id="services" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {heroCards.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCardClick(card.title)}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="relative group cursor-pointer"
                    style={{
                      animationDelay: `${idx * 150}ms`,
                    }}
                  >
                    {/* Card Background with Depth */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-white/40 shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500"></div>
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${card.gradient.replace('from-', 'bg-gradient-to-br from-')}`}></div>
                    
                    {/* Card Content */}
                    <div className="relative p-8">
                      {/* Icon with Floating Effect */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className={`relative w-16 h-16 rounded-xl p-4 shadow-lg ${card.accentColor} bg-opacity-10 backdrop-blur-sm border border-white/20 flex items-center justify-center`}>
                          <div className="text-white">
                            {card.icon}
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-white transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 mb-6 group-hover:text-white/80 transition-colors duration-300">
                        {card.description}
                      </p>
                      
                      {/* Features */}
                      <ul className="space-y-3 mb-6">
                        {card.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-3 text-sm">
                            <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-600 group-hover:text-white/90 transition-colors duration-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Interactive Indicator */}
                      <div className="flex items-center justify-between">
                        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-white/30 to-white/50 group-hover:w-16 transition-all duration-300"></div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transform group-hover:translate-x-2 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works - Modern Dashboard Layout */}
          <section 
            ref={howItWorksRef}
            id="how-it-works" 
            className="relative px-6 py-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                    <Layout className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Workflow</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  How <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">RawRecruit</span> Works
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Simple, efficient workflow designed for modern recruitment
                </p>
              </div>

              {/* Dashboard Style Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    type: 'colleges',
                    icon: <GraduationCap className="w-8 h-8" />,
                    title: 'For Colleges',
                    steps: [
                      'Register your college and create a profile',
                      'View hiring requests from companies',
                      'Post your own hiring opportunities',
                      'Request training and branding services'
                    ],
                    color: '#8B5CF6'
                  },
                  {
                    type: 'companies',
                    icon: <Building2 className="w-8 h-8" />,
                    title: 'For Companies',
                    steps: [
                      'Register your company and set up profile',
                      'Browse college hiring requests',
                      'Post on-campus and pool campus opportunities',
                      'Access workforce and training solutions'
                    ],
                    color: '#EC4899'
                  },
                  {
                    type: 'employers',
                    icon: <Briefcase className="w-8 h-8" />,
                    title: 'For Employers',
                    steps: [
                      'Create employer profile independently',
                      'Manage all recruitment activities',
                      'Work on behalf of companies',
                      'Handle company acceptance and coordination'
                    ],
                    color: '#3B82F6'
                  }
                ].map((section, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleRoleSelect(section.type)}
                    className="relative group cursor-pointer"
                  >
                    {/* Card with Glass Morphism */}
                    <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl p-8 h-full transform group-hover:-translate-y-2 transition-all duration-500">
                      {/* Top Accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
                      
                      {/* Icon */}
                      <div className="mb-6">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white to-gray-50 p-3 shadow-lg border border-white/60">
                          <div className="text-purple-600">
                            {section.icon}
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        {section.title}
                      </h3>
                      
                      <ul className="space-y-4">
                        {section.steps.map((step, stepIdx) => (
                          <li key={stepIdx} className="flex items-start gap-3 group/item">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center text-sm font-semibold text-purple-600 transform group-hover/item:scale-110 transition-transform duration-300">
                              {stepIdx + 1}
                            </div>
                            <span className="text-gray-600 leading-relaxed pt-0.5">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Interactive Footer */}
                      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm text-gray-500">Learn more</span>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Shadow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Dashboard */}
          <section id="features" className="relative">
            {/* Companies Section */}
            <div 
              ref={companyServicesRef}
              className="relative w-full py-20"
            >
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                  <div>
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">For Companies</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                      Tailored Recruitment Solutions
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      {services.company.desc}
                    </p>
                    <button
                      onClick={() => handleRoleSelect('company')}
                      className="group inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 text-gray-700 px-6 py-3 rounded-xl font-medium hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <span>Explore Company Features</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Dashboard Grid */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl blur-3xl"></div>
                    <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4">
                      {services.company.cards.map((service, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleServiceCardClick('company', service.title)}
                          className="relative group cursor-pointer"
                        >
                          <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-lg transform group-hover:-translate-y-1 transition-all duration-300">
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-50 p-2.5 mb-3 shadow-sm border border-white/60">
                              <div style={{ color: service.color }}>
                                {service.icon}
                              </div>
                            </div>
                            
                            {/* Content */}
                            <h3 className="text-sm font-bold text-gray-800 mb-1">
                              {service.title}
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {service.desc}
                            </p>
                            
                            {/* Hover Indicator */}
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                                <ChevronRight className="w-3 h-3 text-gray-600" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Glow Effect */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colleges Section */}
            <div 
              ref={collegeServicesRef}
              className="relative w-full py-20"
            >
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                  <div className="order-2 lg:order-1">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-3xl blur-3xl"></div>
                      <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4">
                        {services.college.cards.map((service, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleServiceCardClick('college', service.title)}
                            className="relative group cursor-pointer"
                          >
                            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-lg transform group-hover:-translate-y-1 transition-all duration-300">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-50 p-2.5 mb-3 shadow-sm border border-white/60">
                                <div style={{ color: service.color }}>
                                  {service.icon}
                                </div>
                              </div>
                              <h3 className="text-sm font-bold text-gray-800 mb-1">
                                {service.title}
                              </h3>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {service.desc}
                              </p>
                              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
                                  <ChevronRight className="w-3 h-3 text-gray-600" />
                                </div>
                              </div>
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-1 lg:order-2">
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100">
                        <GraduationCap className="w-6 h-6 text-pink-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">For Colleges</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                      Student Placement Excellence
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      {services.college.desc}
                    </p>
                    <button
                      onClick={() => handleRoleSelect('college')}
                      className="group inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 text-gray-700 px-6 py-3 rounded-xl font-medium hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <span>Explore College Features</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Employers Section */}
            <div 
              ref={employerServicesRef}
              className="relative w-full py-20"
            >
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">For Employers</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                      Recruitment Management Suite
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      {services.employer.desc}
                    </p>
                    <button
                      onClick={() => handleRoleSelect('employer')}
                      className="group inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 text-gray-700 px-6 py-3 rounded-xl font-medium hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <span>Explore Employer Features</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl blur-3xl"></div>
                    <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4">
                      {services.employer.cards.map((service, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleServiceCardClick('employer', service.title)}
                          className="relative group cursor-pointer"
                        >
                          <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-lg transform group-hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-50 p-2.5 mb-3 shadow-sm border border-white/60">
                              <div style={{ color: service.color }}>
                                {service.icon}
                              </div>
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 mb-1">
                              {service.title}
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {service.desc}
                            </p>
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                                <ChevronRight className="w-3 h-3 text-gray-600" />
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Dashboard */}
          <section 
            ref={statsRef}
            id="about" 
            className="relative px-6 py-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                    <Trophy className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Our Impact</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Driving Excellence in <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Campus Recruitment</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Building a strong network to empower the next generation of talent
                </p>
              </div>

              {/* Stats Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                {[
                  { number: '500+', label: 'Partner Colleges', color: '#8B5CF6' },
                  { number: '1000+', label: 'Companies', color: '#EC4899' },
                  { number: '50K+', label: 'Students Placed', color: '#3B82F6' },
                  { number: '95%', label: 'Satisfaction Rate', color: '#10B981' }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="relative group"
                  >
                    {/* Glass Card */}
                    <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-white/40 shadow-2xl transform group-hover:-translate-y-2 transition-all duration-500">
                      {/* Animated Background */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ 
                          background: `linear-gradient(135deg, ${stat.color}15 0%, transparent 100%)`
                        }}
                      />
                      
                      {/* Content */}
                      <div className="relative">
                        {/* Icon Placeholder */}
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white to-gray-50 p-3 mb-4 shadow-sm border border-white/60">
                          <div className="w-full h-full rounded-lg"
                            style={{ 
                              background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}40 100%)`
                            }}
                          />
                        </div>
                        
                        {/* Number */}
                        <div className="text-3xl font-bold mb-2"
                          style={{ color: stat.color }}
                        >
                          {stat.number}
                        </div>
                        
                        {/* Label */}
                        <div className="text-lg font-semibold text-gray-700 mb-2">
                          {stat.label}
                        </div>
                        
                        {/* Progress Indicator */}
                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700 group-hover:w-full"
                            style={{ 
                              width: idx === 3 ? '95%' : '85%',
                              background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500"
                      style={{ 
                        background: `radial-gradient(circle at center, ${stat.color}30 0%, transparent 70%)`
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Partners Dashboard */}
              <div className="relative">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Trusted By</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Industry <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Leaders</span>
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Collaborating with top companies to create opportunities
                  </p>
                </div>

                {/* Partners Grid */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl"></div>
                  <div className="relative grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[
                      'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Adobe',
                      'Tesla', 'Intel', 'Oracle', 'IBM', 'Cisco', 'Salesforce'
                    ].map((company, idx) => (
                      <div
                        key={idx}
                        className="relative group"
                      >
                        <div className="relative bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/40 shadow-lg transform group-hover:-translate-y-1 transition-all duration-300">
                          {/* Company Logo Placeholder */}
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 mx-auto mb-3 flex items-center justify-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
                              {company.charAt(0)}
                            </div>
                          </div>
                          
                          {/* Company Name */}
                          <div className="text-center">
                            <div className="text-sm font-semibold text-gray-700 mb-1">
                              {company}
                            </div>
                            <div className="text-xs text-gray-500">
                              Partner
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover Effect */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ 
                            background: `linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)`
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer 
            ref={footerRef}
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-6"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div>
                  <button 
                    onClick={handleLogoClick}
                    className="flex items-center gap-3 mb-6 group"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-xl shadow-lg border border-gray-700/60">
                        <Rocket className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" />
                      </div>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                      RawRecruit
                    </span>
                  </button>
                  <p className="text-gray-400 mb-6">
                    Transforming campus recruitment through innovation and excellence.
                  </p>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center">
                      <Linkedin className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {[
                  { title: 'Product', links: ['Features', 'Solutions', 'Demo'] },
                  { title: 'Company', links: ['About', 'Careers'] },
                  { title: 'Support', links: ['Help Center', 'Contact', 'Privacy & Terms'] }
                ].map((column, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg font-bold mb-6 text-gray-200">{column.title}</h3>
                    <ul className="space-y-3">
                      {column.links.map((link) => (
                        <li key={link}>
                          <button
                            onClick={() => setIsLegalModalOpen(true)}
                            className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-left"
                          >
                            {link}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800/50 pt-8 text-center text-gray-400">
                <p>© {new Date().getFullYear()} RawRecruit. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Floating Action Menu */}
      {isEditing && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <Palette className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-800">Customize Layout</span>
              </div>
              <div className="space-y-3">
                {['Grid View', 'Compact', 'Spacious', 'Dashboard'].map((option) => (
                  <button
                    key={option}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 text-gray-700"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      <TermsModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Glass morphism effects */
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-dark {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Smooth transitions */
        * {
          transition-property: color, background-color, border-color, transform, box-shadow;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
        
        /* Scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8B5CF6, #EC4899);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7C3AED, #DB2777);
        }
      `}</style>
    </div>
  );
};

// Add missing Twitter icon component
const Twitter = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

export default App;