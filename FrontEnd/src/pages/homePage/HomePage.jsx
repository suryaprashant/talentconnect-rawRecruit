import React, { useState, useEffect, useRef } from 'react';
import "../homePage/../../pages/../../src/App.css"
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
import { PrivacyModal } from '@/components/onboarding/PrivacyModal';
import { ContactModal } from '@/components/onboarding/ContactModal';
import { HelpCenterModal } from '@/components/onboarding/HelpModal';
import { CareersModal } from '@/components/onboarding/CareerModal';
import { AboutModal } from '@/components/onboarding/AboutModal';
import { DemoModal } from '@/components/onboarding/DemoModal';
import { SolutionsModal } from '@/components/onboarding/SolutionModal';
import { FeaturesModal } from '@/components/onboarding/FeatureModal';
import heroImage from "../../assets/RR-Tagline.png";
import bgImage from "../../assets/bgImage.png";

const App = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [isSolutionsModalOpen, setIsSolutionsModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isCareersModalOpen, setIsCareersModalOpen] = useState(false);
  const [isHelpCenterModalOpen, setIsHelpCenterModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const openModal = (section) => {
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSection(null);
  };

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
    // const hiringRoutes = {
    //   'On-Campus Recruitment': '/hiring-channels/on-campus-hiring',
    //   'Pool-Campus Recruitment': '/hiring-channels/pool-campus-hiring',
    //   'Off-Campus Recruitment': '/hiring-channels/off-campus-hiring'
    // };

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
      title: 'On-Campus Recruitment',
      description: '', // Empty description
      icon: <GraduationCap className="w-8 h-8" />,
      gradient: 'from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9]',
      accentColor: 'bg-[#7C3AED]',
      features: [
        'Targeted hiring within a single college',
        'Posted by colleges and companies',
        'Structured placement drives',
        'Ideal for focused fresher recruitment'
      ]
    },
    {
      title: 'Pool-Campus Recruitment',
      description: '', // Empty description
      icon: <Users2 className="w-8 h-8" />,
      gradient: 'from-[#F472B6] via-[#EC4899] to-[#DB2777]',
      accentColor: 'bg-[#EC4899]',
      features: [
        'Multi-college hiring through shared drives',
        'Posted by colleges and companies',
        'Wider talent reach',
        'Cost-effective fresher hiring'
      ]
    },
    {
      title: 'Off-Campus Recruitment',
      description: '', // Empty description
      icon: <Globe className="w-8 h-8" />,
      gradient: 'from-[#60A5FA] via-[#3B82F6] to-[#1D4ED8]',
      accentColor: 'bg-[#3B82F6]',
      features: [
        'Open hiring beyond campus boundaries',
        'Posted only by companies',
        'Nationwide fresher jobs',
        'Flexible entry-level recruitment'
      ]
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
        }
        // { 
        //   icon: <PieChart className="w-10 h-10" />, 
        //   title: 'Analytics', 
        //   desc: 'Placement insights & reports', 
        //   color: '#8B5CF6'
        // }
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

  // Twitter icon component
  const Twitter = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );

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

      {/* Main Content */}
      <div className="relative z-20">
        {/* Modern Glass Navigation */}
        <header className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[92%] max-w-6xl bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl z-50">
          <div className="px-8 py-3 flex justify-between items-center">
            {/* Simple logo without any effects */}
            <button 
              onClick={handleLogoClick}
              className="focus:outline-none"
            >
              <img 
                src={heroImage} 
                alt="RawRecruit Logo" 
                className="h-16 w-auto object-contain"
              />
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
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-blue-600 group-hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg">
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
        <div className="pt-20">
          <section ref={heroRef} id="hero" className="relative px-6">
            {/* Wrapper for hero + stats only */}
            <div className="relative">
              {/* Background for the top portion only - INSIDE the wrapper */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                {/* Your background image with proper sizing - adjusted to start higher */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center top',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'white',
                  }}
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-transparent" />
                {/* Subtle colored tint */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10" />
                
                {/* Hero Background Elements - keep these */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto relative">
                <div className="text-center mb-20 pt-12 pb-24">
                  {/* Interactive Tag */}
                  <div className="inline-flex items-center gap-2 mb-8 mt-8">
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
                      Next-Generation Campus
                    </span>
                    <br />
                    <span className="text-gray-800">
                      Recruitment Platform
                    </span>
                  </h1>

                  {/* SEO H2 – hidden visually but readable by search engines */}
                  <h2 className="sr-only">
                    Connecting companies and colleges through data-driven recruitment and
                    career-building solutions for freshers
                  </h2>

                  <p 
                    className="text-black text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
                    style={{
                      WebkitTextStroke: '0.3px #FFFFFF',
                      paintOrder: 'stroke fill'
                    }}
                  >
                    RawRecruit connects colleges, companies, and freshers through a modern
                    campus recruitment platform focused on efficient entry-level hiring,
                    seamless fresher recruitment, and sustainable career growth powered
                    by technology.
                  </p>

                  {/* Interactive CTA */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={handleGetStarted}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-blue-600 group-hover:to-purple-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                        <span className="flex items-center gap-3">
                          Start Your Journey
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Stats Preview - Black Text Only */}
  <div className='text-center mx-auto'>               
<div className="marquee-wrapper mt-10">
  <div className="marquee">
    <div className="marquee-content">
      <TickerItem text="50+ Colleges" />
      <TickerItem text="100+ Companies" />
      <TickerItem text="95% Satisfaction" />

      {/* duplicate same items immediately */}
      <TickerItem text="50+ Colleges" />
      <TickerItem text="100+ Companies" />
      <TickerItem text="95% Satisfaction" />
    </div>
  </div>
</div>
</div> 




                </div>
              </div>
            </div>

            {/* Hero Cards - Modern Dashboard Style */}
<div id="services" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
  {heroCards.map((card, idx) => {
    // Create unique gradient colors for each card
    const gradientColors = [
      { from: '#8B5CF6', via: '#7C3AED', to: '#6D28D9', bg: '#8B5CF6', dark: '#4C1D95' }, // Purple
      { from: '#C026D3', via: '#952e8f', to: '#6D28D9', bg: '#952e8f', dark: '#952e8f' }, // Magenta/Purple
      { from: '#60A5FA', via: '#3B82F6', to: '#1D4ED8', bg: '#60A5FA', dark: '#1E3A8A' }  // Blue
    ];
    
    const colors = gradientColors[idx];
    
    return (
      <div
        key={idx}
        onClick={() => handleCardClick(card.title)}
        onMouseEnter={(e) => {
          setHoveredCard(idx);
          // Enhanced hover animations
          const cardElement = e.currentTarget;
          cardElement.style.transform = 'translateY(-12px) translateZ(30px)';
          cardElement.style.boxShadow = `
            0 25px 50px -12px ${colors.from}40,
            0 10px 30px -5px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.2)
          `;
          
          // Animate floating elements
          const floatingElements = cardElement.querySelectorAll('.floating-element');
          floatingElements.forEach((el, i) => {
            el.style.animation = `floatElement 2s ease-in-out ${i * 0.2}s infinite`;
          });
          
          // Pulse glow effect
          const glowElement = cardElement.querySelector('.card-glow');
          if (glowElement) {
            glowElement.style.opacity = '0.6';
            glowElement.style.animation = 'pulseGlow 1.5s ease-in-out infinite';
          }
        }}
        onMouseLeave={(e) => {
          setHoveredCard(null);
          const cardElement = e.currentTarget;
          cardElement.style.transform = 'translateY(0) translateZ(0)';
          cardElement.style.boxShadow = '';
          
          // Reset floating elements
          const floatingElements = cardElement.querySelectorAll('.floating-element');
          floatingElements.forEach(el => {
            el.style.animation = '';
          });
          
          // Reset glow
          const glowElement = cardElement.querySelector('.card-glow');
          if (glowElement) {
            glowElement.style.opacity = '0';
            glowElement.style.animation = '';
          }
        }}
        className="relative group cursor-pointer perspective-1000 h-full"
        style={{
          animationDelay: `${idx * 150}ms`,
          animation: `slideUp 0.6s ease-out forwards ${idx * 150}ms, floatCard${idx + 1} 4s ease-in-out infinite ${idx * 0.3}s`,
          opacity: 0,
          transformStyle: 'preserve-3d',
          willChange: 'transform, box-shadow',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Card Glow Effect */}
        <div 
          className="card-glow absolute -inset-4 rounded-3xl opacity-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${colors.from}30 0%, transparent 70%)`,
            filter: 'blur(20px)',
            zIndex: 0,
          }}
        />
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, ${colors.from}20 1px, transparent 1px),
                                linear-gradient(to bottom, ${colors.from}20 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }} />
          </div>
          
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="floating-element absolute w-2 h-2 rounded-full"
              style={{
                background: colors.from,
                left: `${15 + i * 10}%`,
                top: `${20 + i * 8}%`,
                opacity: 0.1,
                animation: `floatParticle 3s ease-in-out ${i * 0.4}s infinite`,
              }}
            />
          ))}
        </div>
        
        {/* Card Container with Glass Morphism - FLEX COLUMN */}
        <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl overflow-hidden z-10 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-gray-900 group-hover:to-gray-800 group-hover:border-gray-700/40 h-full flex flex-col">
          {/* Top Accent Bar - Only visible normally, hidden on hover */}
          <div 
            className="h-1.5 w-full rounded-t-3xl transition-all duration-500 group-hover:h-0 group-hover:opacity-0 flex-shrink-0"
            style={{
              background: `linear-gradient(90deg, ${colors.from}, ${colors.via}, ${colors.to})`,
            }}
          />
          
          {/* Card Content - FLEXIBLE HEIGHT */}
          <div className="relative p-8 flex-grow flex flex-col">
            {/* Color overlay on hover - Takes full card */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${colors.dark}ee, ${colors.dark}cc)`,
              }}
            />
            
            <div className="relative flex-grow flex flex-col">
              {/* Icon Container with Floating Effect */}
              <div className="relative mb-8 flex-shrink-0">
                {/* Icon Background Glow */}
                <div 
                  className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${colors.from}40 0%, transparent 70%)`,
                    filter: 'blur(15px)',
                  }}
                />
                
                {/* Icon Container */}
                <div className="relative">
                  {/* Icon Background - White normally, stays white on hover */}
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg border border-white/60 flex items-center justify-center group-hover:border-white/80">
                    {/* Inner Glow */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${colors.from}30, ${colors.to}30)`,
                      }}
                    />
                    
                    {/* Icon */}
                    <div 
                      className="relative transform transition-transform duration-500 group-hover:scale-110"
                      style={{ color: colors.from }}
                    >
                      {card.icon}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Title with Gradient - White text on hover */}
              <div className="mb-4 flex-shrink-0">
                <h3 className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent group-hover:text-white transition-all duration-500">
                    {card.title}
                  </span>
                  {/* Animated underline - Only appears on hover */}
                  <div 
                    className="h-0.5 w-0 group-hover:w-full transition-all duration-700 mt-1"
                    style={{
                      background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                    }}
                  />
                </h3>
              </div>
              
              {/* Features List with Animated Indicators - FLEXIBLE CONTENT */}
              <ul className="space-y-4 mb-6 flex-grow"> {/* Changed from mb-4 to mb-6 for more space after features */}
                {card.features.map((feature, fIdx) => (
                  <li 
                    key={fIdx}
                    className="flex items-start gap-3 group/item"
                    style={{ animationDelay: `${fIdx * 100}ms` }}
                  >
                    {/* Animated Check Circle */}
                    <div className="relative flex-shrink-0 mt-1">
                      {/* Pulse Ring */}
                      <div 
                        className="absolute -inset-1 rounded-full opacity-0 group-hover/item:opacity-30 transition-opacity duration-300"
                        style={{
                          background: colors.from,
                          animation: 'pulseRing 2s ease-in-out infinite',
                        }}
                      />
                      
                      {/* Check Circle - White on hover */}
                      <div 
                        className="relative w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover/item:scale-110 group-hover/item:-translate-y-0.5 group-hover:bg-white group-hover:border group-hover:border-white/60"
                        style={{
                          background: `linear-gradient(135deg, ${colors.from}, ${colors.via})`,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-white group-hover:text-gray-700 transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {/* Feature Text - White text on hover */}
                    <span className="text-sm text-gray-600 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              {/* REMOVED: Interactive Bottom Section with Arrow */}
              {/* This entire section has been removed */}
              
              {/* REMOVED: <div className="pt-2 border-t border-gray-100/50 group-hover:border-gray-700/50 transition-colors duration-500 flex-shrink-0">
                Animated Arrow
                <div className="flex items-center justify-end">
                  <div className="relative">
                    Arrow Trail
                    <div className="absolute -left-8 w-0 h-0.5 rounded-full group-hover:w-8 transition-all duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${colors.from})`,
                      }}
                    />
                    
                    Arrow - White on hover
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100/60 flex items-center justify-center shadow-sm group-hover:bg-white group-hover:border-white/80 group-hover:shadow-md transition-all duration-300 group-hover:translate-x-2">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          
          {/* Edge Highlights for 3D Effect - Darker on hover */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:via-gray-700/50 flex-shrink-0" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-gray-700/30 flex-shrink-0" />
        </div>
        
        {/* Floating Shadow */}
        <div className="absolute -bottom-4 left-4 right-4 h-4 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            background: colors.from,
            filter: 'blur(15px)',
            transform: 'translateZ(-20px)',
          }}
        />
      </div>
    );
  })}
</div>
          </section>

          <style jsx>{`
            @keyframes compact-scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-33.333%);
              }
            }
            
            .animate-compact-scroll {
              animation: compact-scroll 15s linear infinite;
              display: flex;
            }
          `}</style>
        </div>

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
      <p className="text-gray-600 text-lg max-w-3xl mx-auto">
        A unified campus recruitment platform designed for colleges, companies, and employers. 
        Streamline your fresher hiring process with our comprehensive campus recruitment solutions.
      </p>
    </div>

    {/* Dashboard Style Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          type: 'colleges',
          icon: <GraduationCap className="w-8 h-8" />,
          title: 'For Colleges (TPOs)',
          steps: [
            'Register your college on a centralized campus recruitment platform',
            'Discover on-campus and pool-campus hiring requests from companies',
            'Publish on-campus and pool-campus recruitment opportunities',
            'Access student training, seminars, and institutional branding services'
          ],
          color: '#8B5CF6',
          seoValue: 'Targets campus recruitment for colleges, TPO placement platform, on-campus recruitment',
          description: 'Colleges can connect directly with companies, post hiring requests, and access training services.'
        },
        {
          type: 'companies',
          icon: <Building2 className="w-8 h-8" />,
          title: 'For Companies (HR & Hiring Managers)',
          steps: [
            'Create a company profile to manage fresher hiring at scale',
            'Explore college-led on-campus and pool-campus recruitment opportunities',
            'Post on-campus, pool-campus, and off-campus hiring requirements',
            'Access workforce solutions and employee training programs'
          ],
          color: '#EC4899',
          seoValue: 'Targets fresher recruitment platform, campus hiring solutions, entry-level hiring',
          description: 'Companies can find qualified candidates from colleges and post various campus recruitment opportunities.'
        },
        {
          type: 'employers',
          icon: <Briefcase className="w-8 h-8" />,
          title: 'For Employers (Staffing & Hiring Partners)',
          steps: [
            'Set up an independent employer profile',
            'Manage end-to-end campus and off-campus recruitment activities',
            'Coordinate hiring on behalf of multiple companies',
            'Handle company approvals, scheduling, and recruitment operations'
          ],
          color: '#3B82F6',
          seoValue: 'Targets recruitment management, employer hiring solutions, campus hiring coordination',
          description: 'Employers can work independently or on behalf of companies to manage recruitment processes.'
        }
      ].map((section, idx) => (
        <div
          key={idx}
          onClick={() => handleRoleSelect(section.type)}
          className="relative group cursor-pointer perspective-1000"
        >
          {/* Card with Glass Morphism - More expressive gradient on hover */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-7 h-full transform transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:border-white/60 group-hover:bg-gradient-to-br group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-blue-500/10">
            {/* Animated Top Accent - More expressive */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-500 group-hover:h-2 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"></div>
            
            {/* Icon with enhanced hover effect - Further reduced margin */}
            <div className="relative mb-3"> {/* Changed from mb-4 to mb-3 */}
              {/* Glow effect on hover */}
              <div className="absolute -inset-3 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, ${section.color}30 0%, transparent 70%)`,
                  filter: 'blur(10px)',
                }}
              />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-white to-gray-50 p-2.5 shadow-lg border border-white/60 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                <div 
                  className="transition-transform duration-300 group-hover:scale-110"
                  style={{ color: section.color }}
                >
                  {section.icon}
                </div>
              </div>
            </div>
            
            {/* Enhanced title hover effect - Further reduced margin */}
            <h3 className="text-xl font-bold text-gray-800 mb-3 transform transition-all duration-300 group-hover:translate-x-2 group-hover:text-gray-900">
              {section.title}
            </h3>
            
            <ul className="space-y-2.5 mb-4"> {/* Reduced space-y-3 to space-y-2.5 and mb-6 to mb-4 */}
              {section.steps.map((step, stepIdx) => (
                <li 
                  key={stepIdx} 
                  className="flex items-start gap-2.5 group/item transform transition-all duration-300 hover:translate-x-1"
                >
                  {/* Enhanced number badge - Smaller */}
                  <div 
                    className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-white to-gray-50 flex items-center justify-center text-xs font-semibold shadow-sm border border-white/40 transform transition-all duration-300 group-hover/item:scale-110 group-hover/item:-translate-y-0.5 group-hover/item:shadow-md"
                    style={{ color: section.color }}
                  >
                    {stepIdx + 1}
                  </div>
                  <span className="text-gray-600 text-sm leading-relaxed pt-0.5 group-hover:text-gray-800 transition-colors duration-300">
                    {step}
                  </span>
                </li>
              ))}
            </ul>
            
            {/* Reduced spacing further - Minimal padding */}
            <div className="pt-2 border-t border-gray-100/30 group-hover:border-gray-200/70 transition-colors duration-300 flex items-center justify-end">
              {/* Enhanced arrow container - Smaller */}
              <div className="relative overflow-hidden">
                {/* Animated slide trail */}
                <div 
                  className="absolute -left-4 w-0 h-0.5 rounded-full group-hover:w-6 transition-all duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${section.color})`,
                  }}
                />
                {/* Arrow button - Smaller */}
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white to-gray-50 flex items-center justify-center shadow-sm border border-gray-100/60 transform transition-all duration-300 group-hover:scale-110 group-hover:translate-x-2 group-hover:shadow-md">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
                </div>
              </div>
            </div>
            
            {/* Edge highlights for 3D effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          
          {/* Enhanced floating shadow */}
          <div className="absolute -bottom-3 left-3 right-3 h-4 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{
              background: `linear-gradient(90deg, ${section.color}40, ${section.type === 'colleges' ? '#C084FC' : section.type === 'companies' ? '#F472B6' : '#60A5FA'}40)`,
              filter: 'blur(15px)',
            }}
          ></div>
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
            className={`relative w-full py-20 transition-all duration-1000 ${activeSection === 'companies' ? '' : ''}`}
          >
            {/* Enhanced Background with curved corners - Brighter colors */}
            <div 
              className={`absolute inset-0 mx-6 rounded-3xl transition-all duration-1000 ${
                activeSection === 'companies' 
                  ? 'bg-gradient-to-b from-purple-500/15 via-indigo-500/15 to-purple-500/10 opacity-100' 
                  : 'opacity-0'
              }`}
            />
            
            {/* Subtle border highlight for active section */}
            <div 
              className={`absolute inset-0 mx-6 rounded-3xl transition-all duration-1000 ${
                activeSection === 'companies' 
                  ? 'border-2 border-purple-400/20 opacity-100' 
                  : 'opacity-0 border-0'
              }`}
            />
            
            <div className="relative max-w-7xl mx-auto px-6 z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <div className="inline-flex items-center gap-4 mb-4">
  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 shadow-lg">
    <Building2 className="w-10 h-10 text-purple-700" />
  </div>
  <span className="text-3xl font-extrabold text-gray-800 uppercase tracking-wide">
    For Companies
  </span>
</div>
<h2 className="text-2xl font-semibold text-gray-700 mb-6">
  Tailored Recruitment Solutions
</h2>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    {services.company.desc}
                  </p>
                  <button
                    onClick={() => handleRoleSelect('company')}
                    className="group relative text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden"
                  >
                    {/* Base layer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300" />
                    
                    {/* Hover color layer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-indigo-400/30 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                    
                    <span className="relative flex items-center gap-3">
                      Explore Company Features
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </button>
                </div>

                {/* Dashboard Grid - Fixed uniform card sizes */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-3xl blur-3xl"></div>
                  <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4">
                    {services.company.cards.map((service, idx) => {
                      // Function to generate darker pastel shade of icon color
                      const getDarkerPastelColor = (hexColor) => {
                        // Convert hex to RGB
                        const hex = hexColor.replace('#', '');
                        const r = parseInt(hex.substr(0, 2), 16);
                        const g = parseInt(hex.substr(2, 2), 16);
                        const b = parseInt(hex.substr(4, 2), 16);
                        
                        // Create darker pastel version (reduce lightness)
                        const darkenFactor = 0.7; // Make it 30% darker
                        const dr = Math.floor(r * darkenFactor);
                        const dg = Math.floor(g * darkenFactor);
                        const db = Math.floor(b * darkenFactor);
                        
                        // Increase saturation slightly for pastel effect
                        const sr = Math.min(255, dr + 40);
                        const sg = Math.min(255, dg + 40);
                        const sb = Math.min(255, db + 40);
                        
                        return `rgb(${sr}, ${sg}, ${sb})`;
                      };
                      
                      const darkerPastelColor = getDarkerPastelColor(service.color);
                      
                      return (
                        <div
                          key={idx}
                          onClick={() => handleServiceCardClick('company', service.title)}
                          className="relative group cursor-pointer min-h-[180px]"
                        >
                          {/* Card with darker pastel hover color change */}
                          <div 
                            className="relative bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-lg transform group-hover:-translate-y-2 transition-all duration-300 h-full group-hover:shadow-2xl overflow-hidden"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)'
                            }}
                          >
                            {/* Darker pastel color overlay on hover - using service.color */}
                            <div 
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: `linear-gradient(135deg, ${darkerPastelColor}, ${darkerPastelColor})`,
                              }}
                            />
                            
                            {/* Icon - Centered in box */}
                            <div className="relative z-10 w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-50 p-2.5 mb-3 shadow-sm border border-white/60 flex items-center justify-center group-hover:bg-white/20">
                              <div className="flex items-center justify-center w-full h-full">
                                <div 
                                  className="transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
                                  style={{ color: service.color }}
                                >
                                  {service.icon}
                                </div>
                              </div>
                            </div>
                            
                            {/* Content - Text changes to SHARP WHITE on hover */}
                            <div className="relative z-10">
                              <h3 
                                className="text-sm font-bold text-gray-800 mb-1 transition-all duration-300 group-hover:text-white group-hover:font-bold"
                              >
                                {service.title}
                              </h3>
                              <p 
                                className="text-xs leading-relaxed text-gray-600 transition-all duration-300 group-hover:text-white"
                              >
                                {service.desc}
                              </p>
                            </div>
                            
                            {/* Hover Indicator - Color matched */}
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                              <div className="w-6 h-6 rounded-lg bg-white/90 flex items-center justify-center border border-white/60 shadow-lg backdrop-blur-sm group-hover:bg-white/20">
                                <ChevronRight 
                                  className="w-3 h-3 transition-all duration-300 group-hover:scale-110 group-hover:text-white"
                                  style={{ color: service.color }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Glow Effect - Enhanced on hover */}
                          <div 
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"
                            style={{
                              background: `radial-gradient(circle at center, ${service.color}40 0%, transparent 70%)`,
                            }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colleges Section */}
<div 
  ref={collegeServicesRef}
  className={`relative w-full py-20 transition-all duration-1000 ${activeSection === 'colleges' ? '' : ''}`}
>
  {/* Enhanced Background with curved corners - Brighter colors */}
  <div 
    className={`absolute inset-0 mx-6 rounded-3xl transition-all duration-1000 ${
      activeSection === 'colleges' 
        ? 'bg-gradient-to-b from-pink-500/15 via-rose-500/15 to-pink-500/10 opacity-100' 
        : 'opacity-0'
    }`}
  />
  
  {/* Subtle border highlight for active section */}
  <div 
    className={`absolute inset-0 mx-6 rounded-3xl transition-all duration-1000 ${
      activeSection === 'colleges' 
        ? 'border-2 border-pink-400/20 opacity-100' 
        : 'opacity-0 border-0'
    }`}
  />
  
  <div className="relative max-w-7xl mx-auto px-6 z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
      <div className="order-2 lg:order-1">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 rounded-3xl blur-3xl"></div>
          <div className="relative">
            {/* First row - 3 cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {services.college.cards.slice(0, 3).map((service, idx) => {
                // Function to generate darker pastel shade of icon color
                const getDarkerPastelColor = (hexColor) => {
                  const hex = hexColor.replace('#', '');
                  const r = parseInt(hex.substr(0, 2), 16);
                  const g = parseInt(hex.substr(2, 2), 16);
                  const b = parseInt(hex.substr(4, 2), 16);
                  
                  const darkenFactor = 0.7;
                  const dr = Math.floor(r * darkenFactor);
                  const dg = Math.floor(g * darkenFactor);
                  const db = Math.floor(b * darkenFactor);
                  
                  const sr = Math.min(255, dr + 40);
                  const sg = Math.min(255, dg + 40);
                  const sb = Math.min(255, db + 40);
                  
                  return `rgb(${sr}, ${sg}, ${sb})`;
                };
                
                const darkerPastelColor = getDarkerPastelColor(service.color);
                
                return (
                  <div
                    key={idx}
                    onClick={() => handleServiceCardClick('college', service.title)}
                    className="relative group cursor-pointer min-h-[180px]"
                  >
                    <div 
                      className="relative bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-lg transform group-hover:-translate-y-2 transition-all duration-300 h-full group-hover:shadow-2xl overflow-hidden"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      {/* Darker pastel color overlay on hover */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${darkerPastelColor}, ${darkerPastelColor})`,
                        }}
                      />
                      
                      {/* Icon container - unchanged */}
                      <div className="relative z-10 w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-50 p-2.5 mb-3 shadow-sm border border-white/60 flex items-center justify-center group-hover:bg-white/20">
                        <div className="flex items-center justify-center w-full h-full">
                          <div 
                            className="transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
                            style={{ color: service.color }}
                          >
                            {service.icon}
                          </div>
                        </div>
                      </div>
                      
                      {/* Content with SHARP WHITE text on hover */}
                      <div className="relative z-10">
                        <h3 
                          className="text-sm font-bold text-gray-800 mb-1 transition-all duration-300 group-hover:text-white group-hover:font-bold"
                        >
                          {service.title}
                        </h3>
                        <p 
                          className="text-xs leading-relaxed text-gray-600 transition-all duration-300 group-hover:text-white"
                        >
                          {service.desc}
                        </p>
                      </div>
                      
                      {/* Hover Indicator */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <div className="w-6 h-6 rounded-lg bg-white/90 flex items-center justify-center border border-white/60 shadow-lg backdrop-blur-sm group-hover:bg-white/20">
                          <ChevronRight 
                            className="w-3 h-3 transition-all duration-300 group-hover:scale-110 group-hover:text-white"
                            style={{ color: service.color }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Glow Effect */}
                    <div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at center, ${service.color}50 0%, transparent 70%)`,
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
            
            {/* Second row - 2 cards, centered */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {services.college.cards.slice(3, 5).map((service, idx) => {
                  // Function to generate darker pastel shade of icon color
                  const getDarkerPastelColor = (hexColor) => {
                    const hex = hexColor.replace('#', '');
                    const r = parseInt(hex.substr(0, 2), 16);
                    const g = parseInt(hex.substr(2, 2), 16);
                    const b = parseInt(hex.substr(4, 2), 16);
                    
                    const darkenFactor = 0.7;
                    const dr = Math.floor(r * darkenFactor);
                    const dg = Math.floor(g * darkenFactor);
                    const db = Math.floor(b * darkenFactor);
                    
                    const sr = Math.min(255, dr + 40);
                    const sg = Math.min(255, dg + 40);
                    const sb = Math.min(255, db + 40);
                    
                    return `rgb(${sr}, ${sg}, ${sb})`;
                  };
                  
                  const darkerPastelColor = getDarkerPastelColor(service.color);
                  
                  return (
                    <div
                      key={idx + 3}
                      onClick={() => handleServiceCardClick('college', service.title)}
                      className="relative group cursor-pointer min-h-[180px]"
                    >
                      <div 
                        className="relative bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-lg transform group-hover:-translate-y-2 transition-all duration-300 h-full group-hover:shadow-2xl overflow-hidden"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        {/* Darker pastel color overlay on hover */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${darkerPastelColor}, ${darkerPastelColor})`,
                          }}
                        />
                        
                        {/* Icon container - unchanged */}
                        <div className="relative z-10 w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-50 p-2.5 mb-3 shadow-sm border border-white/60 flex items-center justify-center group-hover:bg-white/20">
                          <div className="flex items-center justify-center w-full h-full">
                            <div 
                              className="transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
                              style={{ color: service.color }}
                            >
                              {service.icon}
                            </div>
                          </div>
                        </div>
                        
                        {/* Content with SHARP WHITE text on hover */}
                        <div className="relative z-10">
                          <h3 
                            className="text-sm font-bold text-gray-800 mb-1 transition-all duration-300 group-hover:text-white group-hover:font-bold"
                          >
                            {service.title}
                          </h3>
                          <p 
                            className="text-xs leading-relaxed text-gray-600 transition-all duration-300 group-hover:text-white"
                          >
                            {service.desc}
                          </p>
                        </div>
                        
                        {/* Hover Indicator */}
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                          <div className="w-6 h-6 rounded-lg bg-white/90 flex items-center justify-center border border-white/60 shadow-lg backdrop-blur-sm group-hover:bg-white/20">
                            <ChevronRight 
                              className="w-3 h-3 transition-all duration-300 group-hover:scale-110 group-hover:text-white"
                              style={{ color: service.color }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Glow Effect */}
                      <div 
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, ${service.color}50 0%, transparent 70%)`,
                        }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="order-1 lg:order-2">
        <div className="inline-flex items-center gap-4 mb-4">
  <div className="p-3 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 shadow-lg">
    <GraduationCap className="w-10 h-10 text-pink-700" />
  </div>
  <span className="text-3xl font-extrabold text-gray-800 uppercase tracking-wide">
    For Colleges
  </span>
</div>
<h2 className="text-2xl font-semibold text-gray-700 mb-6">
  Student Placement Excellence
</h2>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          {services.college.desc}
        </p>
        <button
          onClick={() => handleRoleSelect('college')}
          className="group relative text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden"
        >
          {/* Base layer - Pink to Magenta */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-fuchsia-600 transition-all duration-300" />
          
          {/* Hover color layer - Brighter pink/magenta */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-fuchsia-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-fuchsia-400/30 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
          
          <span className="relative flex items-center gap-3">
            Explore College Features
            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </span>
        </button>
      </div>
    </div>
  </div>
</div>

          {/* Employers Section */}
          <div 
            ref={employerServicesRef}
            className={`relative w-full py-20 transition-all duration-1000 ${activeSection === 'employers' ? '' : ''}`}
          >
            {/* Enhanced Background with curved corners - Brighter colors */}
            <div 
              className={`absolute inset-0 mx-6 rounded-3xl transition-all duration-1000 ${
                activeSection === 'employers' 
                  ? 'bg-gradient-to-b from-blue-500/15 via-cyan-500/15 to-blue-500/10 opacity-100' 
                  : 'opacity-0'
              }`}
            />
            
            {/* Subtle border highlight for active section */}
            <div 
              className={`absolute inset-0 mx-6 rounded-3xl transition-all duration-1000 ${
                activeSection === 'employers' 
                  ? 'border-2 border-blue-400/20 opacity-100' 
                  : 'opacity-0 border-0'
              }`}
            />
            
            <div className="relative max-w-7xl mx-auto px-6 z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-4 mb-4">
  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 shadow-lg">
    <Briefcase className="w-10 h-10 text-blue-700" />
  </div>
  <span className="text-3xl font-extrabold text-gray-800 uppercase tracking-wide">
    For Employers
  </span>
</div>
<h2 className="text-2xl font-semibold text-gray-700 mb-6">
  Recruitment Management Suite
</h2>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    {services.employer.desc}
                  </p>
                  <button
                    onClick={() => handleRoleSelect('employer')}
                    className="group relative text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden"
                  >
                    {/* Base layer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300" />
                    
                    {/* Hover color layer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                    
                    <span className="relative flex items-center gap-3">
                      Explore Employer Features
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl blur-3xl"></div>
                  <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4">
                    {services.employer.cards.map((service, idx) => {
                      // Function to generate darker pastel shade of icon color
                      const getDarkerPastelColor = (hexColor) => {
                        const hex = hexColor.replace('#', '');
                        const r = parseInt(hex.substr(0, 2), 16);
                        const g = parseInt(hex.substr(2, 2), 16);
                        const b = parseInt(hex.substr(4, 2), 16);
                        
                        const darkenFactor = 0.7;
                        const dr = Math.floor(r * darkenFactor);
                        const dg = Math.floor(g * darkenFactor);
                        const db = Math.floor(b * darkenFactor);
                        
                        const sr = Math.min(255, dr + 40);
                        const sg = Math.min(255, dg + 40);
                        const sb = Math.min(255, db + 40);
                        
                        return `rgb(${sr}, ${sg}, ${sb})`;
                      };
                      
                      const darkerPastelColor = getDarkerPastelColor(service.color);
                      
                      return (
                        <div
                          key={idx}
                          onClick={() => handleServiceCardClick('employer', service.title)}
                          className="relative group cursor-pointer min-h-[180px]"
                        >
                          <div 
                            className="relative bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-lg transform group-hover:-translate-y-2 transition-all duration-300 h-full group-hover:shadow-2xl overflow-hidden"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)'
                            }}
                          >
                            {/* Darker pastel color overlay on hover */}
                            <div 
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: `linear-gradient(135deg, ${darkerPastelColor}, ${darkerPastelColor})`,
                              }}
                            />
                            
                            {/* Icon container - unchanged */}
                            <div className="relative z-10 w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-50 p-2.5 mb-3 shadow-sm border border-white/60 flex items-center justify-center group-hover:bg-white/20">
                              <div className="flex items-center justify-center w-full h-full">
                                <div 
                                  className="transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
                                  style={{ color: service.color }}
                                >
                                  {service.icon}
                                </div>
                              </div>
                            </div>
                            
                            {/* Content with SHARP WHITE text on hover */}
                            <div className="relative z-10">
                              <h3 
                                className="text-sm font-bold text-gray-800 mb-1 transition-all duration-300 group-hover:text-white group-hover:font-bold"
                              >
                                {service.title}
                              </h3>
                              <p 
                                className="text-xs leading-relaxed text-gray-600 transition-all duration-300 group-hover:text-white"
                              >
                                {service.desc}
                              </p>
                            </div>
                            
                            {/* Hover Indicator */}
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                              <div className="w-6 h-6 rounded-lg bg-white/90 flex items-center justify-center border border-white/60 shadow-lg backdrop-blur-sm group-hover:bg-white/20">
                                <ChevronRight 
                                  className="w-3 h-3 transition-all duration-300 group-hover:scale-110 group-hover:text-white"
                                  style={{ color: service.color }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Glow Effect */}
                          <div 
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"
                            style={{
                              background: `radial-gradient(circle at center, ${service.color}50 0%, transparent 70%)`,
                            }}
                          ></div>
                        </div>
                      );
                    })}
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
                { 
                  number: '50+', 
                  label: 'Partner Colleges', 
                  color: '#8B5CF6', // Purple
                  pastelColor: '#DDD6FE', // Purple pastel
                  icon: <GraduationCap className="w-8 h-8" />
                },
                { 
                  number: '100+', 
                  label: 'Companies', 
                  color: '#EC4899', // Pink
                  pastelColor: '#FBCFE8', // Pink pastel
                  icon: <Building2 className="w-8 h-8" />
                },
                { 
                  number: '3K+', 
                  label: 'Students Placed', 
                  color: '#3B82F6', // Blue
                  pastelColor: '#BFDBFE', // Blue pastel
                  icon: <Users className="w-8 h-8" />
                },
                { 
                  number: '95%', 
                  label: 'Satisfaction Rate', 
                  color: '#10B981', // Emerald
                  pastelColor: '#A7F3D0', // Emerald pastel
                  icon: <Star className="w-8 h-8" />
                }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="relative group cursor-pointer"
                >
                  {/* Glass Card - White normally, pastel on hover */}
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/60 shadow-2xl transform group-hover:-translate-y-2 transition-all duration-500 group-hover:shadow-3xl overflow-hidden">
                    {/* Pastel color overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ 
                        backgroundColor: stat.pastelColor,
                      }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon with hover effect */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white to-gray-50 p-3 mb-4 shadow-sm border border-white/60 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:scale-110 group-hover:shadow-lg group-hover:border-white/80">
                        <div 
                          className="transition-all duration-300 group-hover:scale-110"
                          style={{ color: stat.color }}
                        >
                          {stat.icon}
                        </div>
                      </div>
                      
                      {/* Number - changes to darker shade on hover */}
                      <div className="text-3xl font-bold mb-2 transition-colors duration-300"
                        style={{ color: stat.color }}
                      >
                        <span className="group-hover:text-gray-800 transition-colors duration-300">
                          {stat.number}
                        </span>
                      </div>
                      
                      {/* Label - changes to darker on hover */}
                      <div className="text-lg font-semibold mb-2 transition-colors duration-300 text-gray-700 group-hover:text-gray-900">
                        {stat.label}
                      </div>
                      
                      {/* Progress Indicator with hover animation */}
                      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden group-hover:bg-white/50 transition-colors duration-300">
                        <div className="h-full rounded-full transition-all duration-700 group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-600"
                          style={{ 
                            width: idx === 3 ? '95%' : '85%',
                            background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                            transition: 'all 0.7s ease'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Glow Effect - Subtler on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"
                    style={{ 
                      background: `radial-gradient(circle at center, ${stat.color}20 0%, transparent 70%)`
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Partners Dashboard */}
<div className="relative py-12">
  <div className="text-center mb-12">
    <div className="inline-flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
        <Users className="w-6 h-6 text-blue-600" />
      </div>
      <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Trusted By</span>
    </div>
    <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
      Industry <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Leaders</span>
    </h3>
    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
      Collaborating with top companies to create opportunities
    </p>
  </div>

  {/* Company Logos Marquee - Moving Right to Left (Changed from Left to Right) */}
  <div className="relative mb-16">
    <h4 className="text-xl font-bold text-gray-800 mb-8 text-center">Top Companies</h4>
    <div className="relative overflow-hidden py-4">
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
      
      <div className="flex space-x-16 animate-marquee-right">
        {/* First set of company logos */}
        <div className="flex items-center space-x-16 flex-none">
          {/* Google */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">Google</span>
          </div>
          
          {/* Microsoft */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg viewBox="0 0 23 23" className="w-full h-full">
                <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
                <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
                <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
                <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">Microsoft</span>
          </div>
          
          {/* Amazon */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M10.922 16.226c.094.065.209.1.327.1h.011a.596.596 0 0 0 .333-.112l7.104-4.482c.33-.207.527-.572.527-.964V6.308c0-.392-.197-.757-.527-.964l-7.104-4.482a1.15 1.15 0 0 0-1.215 0L3.724 5.344c-.33.207-.527.572-.527.964v4.482c0 .392.197.757.527.964l7.104 4.482c.158.1.342.151.527.151a1.15 1.15 0 0 0 .667-.2zm-.667-1.108L3.29 10.755V6.308l7.045-4.443 7.045 4.443v4.447l-7.045 4.443z" fill="#FF9900"/>
                <path d="M17.35 9.948l-3.898 2.459a.592.592 0 0 1-.327.1h-.011a.596.596 0 0 1-.333-.112l-3.898-2.447a.602.602 0 0 1-.21-.819.602.602 0 0 1 .819-.21l3.577 2.246 3.577-2.255a.602.602 0 0 1 .819.21.602.602 0 0 1-.21.819z" fill="#000"/>
                <path d="M17.35 12.006l-3.898 2.459a.592.592 0 0 1-.327.1h-.011a.596.596 0 0 1-.333-.112l-3.898-2.447a.602.602 0 0 1-.21-.819.602.602 0 0 1 .819-.21l3.577 2.246 3.577-2.255a.602.602 0 0 1 .819.21.602.602 0 0 1-.21.819z" fill="#000"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">Amazon</span>
          </div>
          
          {/* Meta */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z" fill="#1877F2"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">Meta</span>
          </div>
          
          {/* Apple */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M14.94,5.19A4.38,4.38,0,0,0,16,2,4.44,4.44,0,0,0,13,3.52,4.17,4.17,0,0,0,12,6.61,3.69,3.69,0,0,0,14.94,5.19Zm2.52,7.44a4.51,4.51,0,0,1,2.16-3.81,4.66,4.66,0,0,0-3.66-2c-1.56-.16-3,.91-3.83.91s-2-.89-3.3-.87A4.92,4.92,0,0,0,4.69,9.39C2.93,12.45,4.24,17,6,19.47,6.8,20.68,7.8,22.05,9.12,22s1.75-.76,3.28-.76,2,.76,3.3.73,2.22-1.24,3.06-2.45a11,11,0,0,0,1.38-2.85A4.41,4.41,0,0,1,17.46,12.63Z" fill="#000"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">Apple</span>
          </div>
          
          {/* Adobe */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M13.966 22.874l-2.757-6.724H5.092l5.403-13.149 8.488-.001-5.431 13.15 2.758 6.724h-2.335z" fill="#ED2224"/>
                <path d="M18.984 2.999H5.092l-4.094 9.946 7.921 9.929h13.892l4.094-9.946-7.921-9.929z" fill="#FF7C00"/>
                <path d="M10.495 16.149l-2.757 6.724h13.892l2.758-6.724H10.495z" fill="#FFD800"/>
                <path d="M10.495 16.149l2.758-6.724 2.758 6.724H10.495z" fill="#00A8E2"/>
                <path d="M18.984 2.999l-5.403 13.15h-6.117l5.403-13.15h6.117z" fill="#2EA968"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">Adobe</span>
          </div>
        </div>
        
        {/* Duplicate set for seamless looping */}
        <div className="flex items-center space-x-16 flex-none">
          {/* Google */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">Google</span>
          </div>
          
          {/* Microsoft */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg viewBox="0 0 23 23" className="w-full h-full">
                <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
                <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
                <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
                <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">Microsoft</span>
          </div>
          
          {/* Amazon */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M10.922 16.226c.094.065.209.1.327.1h.011a.596.596 0 0 0 .333-.112l7.104-4.482c.33-.207.527-.572.527-.964V6.308c0-.392-.197-.757-.527-.964l-7.104-4.482a1.15 1.15 0 0 0-1.215 0L3.724 5.344c-.33.207-.527.572-.527.964v4.482c0 .392.197.757.527.964l7.104 4.482c.158.1.342.151.527.151a1.15 1.15 0 0 0 .667-.2zm-.667-1.108L3.29 10.755V6.308l7.045-4.443 7.045 4.443v4.447l-7.045 4.443z" fill="#FF9900"/>
                <path d="M17.35 9.948l-3.898 2.459a.592.592 0 0 1-.327.1h-.011a.596.596 0 0 1-.333-.112l-3.898-2.447a.602.602 0 0 1-.21-.819.602.602 0 0 1 .819-.21l3.577 2.246 3.577-2.255a.602.602 0 0 1 .819.21.602.602 0 0 1-.21.819z" fill="#000"/>
                <path d="M17.35 12.006l-3.898 2.459a.592.592 0 0 1-.327.1h-.011a.596.596 0 0 1-.333-.112l-3.898-2.447a.602.602 0 0 1-.21-.819.602.602 0 0 1 .819-.21l3.577 2.246 3.577-2.255a.602.602 0 0 1 .819.21.602.602 0 0 1-.21.819z" fill="#000"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">Amazon</span>
          </div>
          
          {/* Meta */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z" fill="#1877F2"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">Meta</span>
          </div>
          
          {/* Apple */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M14.94,5.19A4.38,4.38,0,0,0,16,2,4.44,4.44,0,0,0,13,3.52,4.17,4.17,0,0,0,12,6.61,3.69,3.69,0,0,0,14.94,5.19Zm2.52,7.44a4.51,4.51,0,0,1,2.16-3.81,4.66,4.66,0,0,0-3.66-2c-1.56-.16-3,.91-3.83.91s-2-.89-3.3-.87A4.92,4.92,0,0,0,4.69,9.39C2.93,12.45,4.24,17,6,19.47,6.8,20.68,7.8,22.05,9.12,22s1.75-.76,3.28-.76,2,.76,3.3.73,2.22-1.24,3.06-2.45a11,11,0,0,0,1.38-2.85A4.41,4.41,0,0,1,17.46,12.63Z" fill="#000"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">Apple</span>
          </div>
          
          {/* Adobe */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M13.966 22.874l-2.757-6.724H5.092l5.403-13.149 8.488-.001-5.431 13.15 2.758 6.724h-2.335z" fill="#ED2224"/>
                <path d="M18.984 2.999H5.092l-4.094 9.946 7.921 9.929h13.892l4.094-9.946-7.921-9.929z" fill="#FF7C00"/>
                <path d="M10.495 16.149l-2.757 6.724h13.892l2.758-6.724H10.495z" fill="#FFD800"/>
                <path d="M10.495 16.149l2.758-6.724 2.758 6.724H10.495z" fill="#00A8E2"/>
                <path d="M18.984 2.999l-5.403 13.15h-6.117l5.403-13.15h6.117z" fill="#2EA968"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">Adobe</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* College Logos Marquee - Moving Left to Right (Changed from Right to Left) */}
  <div className="relative">
    <h4 className="text-xl font-bold text-gray-800 mb-8 text-center">Top Colleges</h4>
    <div className="relative overflow-hidden py-4">
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
      
      <div className="flex space-x-16 animate-marquee-left">
        {/* First set of college logos */}
        <div className="flex items-center space-x-16 flex-none">
          {/* IIT Bombay */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-red-800">IIT</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">IIT Bombay</span>
          </div>
          
          {/* IIT Delhi */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-blue-800">IIT</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">IIT Delhi</span>
          </div>
          
          {/* IIT Madras */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-orange-600">IIT</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">IIT Madras</span>
          </div>
          
          {/* IIT Kharagpur */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-purple-700">IIT</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">IIT Kharagpur</span>
          </div>
          
          {/* BITS Pilani */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-blue-900">BITS</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">BITS Pilani</span>
          </div>
          
          {/* NIT Trichy */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-teal-700">NIT</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">NIT Trichy</span>
          </div>
          
          {/* IIM Ahmedabad */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-red-700">IIM</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">IIM Ahmedabad</span>
          </div>
          
          {/* IIM Bangalore */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-green-800">IIM</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">IIM Bangalore</span>
          </div>
        </div>
        
        {/* Duplicate set for seamless looping */}
        <div className="flex items-center space-x-16 flex-none">
          {/* IIT Bombay */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-red-800">IIT</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">IIT Bombay</span>
          </div>
          
          {/* IIT Delhi */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-blue-800">IIT</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">IIT Delhi</span>
          </div>
          
          {/* IIT Madras */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-orange-600">IIT</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">IIT Madras</span>
          </div>
          
          {/* IIT Kharagpur */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-purple-700">IIT</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">IIT Kharagpur</span>
          </div>
          
          {/* BITS Pilani */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-blue-900">BITS</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">BITS Pilani</span>
          </div>
          
          {/* NIT Trichy */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-teal-700">NIT</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">NIT Trichy</span>
          </div>
          
          {/* IIM Ahmedabad */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-red-700">IIM</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">IIM Ahmedabad</span>
          </div>
          
          {/* IIM Bangalore */}
          <div className="flex flex-col items-center justify-center group cursor-pointer w-32">
            <div className="w-20 h-20 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div className="text-3xl font-bold text-green-800">IIM</div>
            </div>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">IIM Bangalore</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Add CSS animations for marquee */}
  <style jsx>{`
    @keyframes marquee-left {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    
    @keyframes marquee-right {
      0% {
        transform: translateX(-50%);
      }
      100% {
        transform: translateX(0);
      }
    }
    
    .animate-marquee-left {
      animation: marquee-left 30s linear infinite;
      display: flex;
      width: max-content;
    }
    
    .animate-marquee-right {
      animation: marquee-right 30s linear infinite;
      display: flex;
      width: max-content;
    }
  `}</style>
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
                    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-xl shadow-lg border border-gray-700/60 group-hover:shadow-xl transition-shadow duration-300">
                      <Rocket className="w-6 h-6 text-transparent fill-[url(#gradient)] group-hover:fill-[url(#gradient-hover)]" />
                      <svg className="absolute w-0 h-0">
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                          <linearGradient id="gradient-hover" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#c084fc" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 group-hover:from-blue-500 group-hover:via-purple-600 group-hover:to-indigo-500 bg-clip-text text-transparent transition-all duration-300">
                    RawRecruit
                  </span>
                </button>
                <p className="text-gray-400 mb-6">
                  Transforming campus recruitment through innovation and excellence.
                </p>
                <div className="flex gap-3">
                  <button 
  onClick={() => window.open("https://www.linkedin.com/company/talentsconnectss/", "_blank")}
  className="w-8 h-8 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center hover:bg-gray-700/50 transition-colors"
>
  <Linkedin className="w-4 h-4 text-gray-400" />
</button>
                  {/* <button className="w-8 h-8 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center hover:bg-gray-700/50 transition-colors">
                    <Twitter className="w-4 h-4 text-gray-400" />
                  </button> */}
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="text-lg font-bold mb-6 text-gray-200">Product</h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => setIsFeaturesModalOpen(true)}
                      className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-left"
                    >
                      Features
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setIsSolutionsModalOpen(true)}
                      className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-left"
                    >
                      Solutions
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setIsDemoModalOpen(true)}
                      className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-left"
                    >
                      Demo
                    </button>
                  </li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-lg font-bold mb-6 text-gray-200">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => setIsAboutModalOpen(true)}
                      className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-left"
                    >
                      About
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setIsCareersModalOpen(true)}
                      className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-left"
                    >
                      Careers
                    </button>
                  </li>
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="text-lg font-bold mb-6 text-gray-200">Support</h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => setIsHelpCenterModalOpen(true)}
                      className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-left"
                    >
                      Help Center
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-left"
                    >
                      Contact
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-left"
                    >
                      Terms
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setIsPrivacyModalOpen(true)}
                      className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-left"
                    >
                      Privacy
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800/50 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} RawRecruit. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Modals for each footer link */}
        <FeaturesModal
          isOpen={isFeaturesModalOpen}
          onClose={() => setIsFeaturesModalOpen(false)}
        />

        <SolutionsModal
          isOpen={isSolutionsModalOpen}
          onClose={() => setIsSolutionsModalOpen(false)}
        />

        <DemoModal
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
        />

        <AboutModal
          isOpen={isAboutModalOpen}
          onClose={() => setIsAboutModalOpen(false)}
        />

        <CareersModal
          isOpen={isCareersModalOpen}
          onClose={() => setIsCareersModalOpen(false)}
        />

        <HelpCenterModal
          isOpen={isHelpCenterModalOpen}
          onClose={() => setIsHelpCenterModalOpen(false)}
        />

        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />

        <PrivacyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />

        {/* Keep existing Terms Modal for "Privacy & Terms" link */}
        <TermsModal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
        />
      </div>

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

export default App;

const TickerItem = ({ text }) => (
  <div className="marquee-item">
    <div style={{
      width: "8px",
      height: "8px",
      background: "black",
      borderRadius: "50%"
    }} />
    <span style={{ fontWeight: 600 }}>
      {text}
    </span>
  </div>
);

