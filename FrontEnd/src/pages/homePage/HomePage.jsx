import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, Briefcase, GraduationCap, Target,
  TrendingUp, Award, Calendar, Lightbulb, UserCheck,
  Menu, X, ChevronRight, CheckCircle, Star, Sparkles,
  ArrowRight, Users2, TargetIcon, Zap, Globe, Shield,
  BarChart3, HeartHandshake, Rocket, PieChart, BookOpen,
  MessageSquare, Network, ShieldCheck, Trophy, Clock,
  Coffee, Linkedin
} from 'lucide-react';
import { TermsModal } from '@/components/onboarding/Terms&conditionModal';

const App = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState(null);

  // Refs for sections
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const companyServicesRef = useRef(null);
  const collegeServicesRef = useRef(null);
  const employerServicesRef = useRef(null);
  const statsRef = useRef(null);
  const footerRef = useRef(null);

  // Track scroll position for color changes
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
      // Get all section elements
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
          
          // Calculate how much of the section is visible (0 to 1)
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(windowHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const sectionVisibility = visibleHeight / Math.min(windowHeight, rect.height);
          
          // Find the most visible section (the one that just started appearing)
          if (sectionVisibility > 0.2 && sectionVisibility > maxVisibility) {
            maxVisibility = sectionVisibility;
            currentActive = section.id;
          }
        }
      }
      
      setActiveSection(currentActive);
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if sections are in view - more sensitive detection
  const isSectionInView = (ref, threshold = 0.3) => {
    if (!ref.current) return false;
    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Check if the section is starting to appear (top is near viewport)
    return (
      rect.top <= windowHeight * (1 - threshold) && 
      rect.bottom >= 0
    );
  };

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
      gradient: 'from-[#667eea] to-[#764ba2]',
      accentColor: 'bg-[#764ba2]',
      features: ['Direct access', 'Live interactions', 'Customized tests']
    },
    {
      title: 'Pool-Campus',
      description: 'Multi-college recruitment opportunities',
      icon: <Users2 className="w-8 h-8" />,
      gradient: 'from-[#f093fb] to-[#f5576c]',
      accentColor: 'bg-[#f5576c]',
      features: ['Multiple colleges', 'Centralized process', 'Cost-effective']
    },
    {
      title: 'Off-Campus',
      description: 'Flexible hiring solutions',
      icon: <Globe className="w-8 h-8" />,
      gradient: 'from-[#4facfe] to-[#00f2fe]',
      accentColor: 'bg-[#00f2fe]',
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
          color: '#667eea'
        },
        { 
          icon: <Users className="w-10 h-10" />, 
          title: 'Off-Campus', 
          desc: 'Open recruitment drives', 
          color: '#f5576c'
        },
        { 
          icon: <Target className="w-10 h-10" />, 
          title: 'Pool-Campus', 
          desc: 'Multi-college hiring', 
          color: '#4facfe'
        },
        { 
          icon: <UserCheck className="w-10 h-10" />, 
          title: 'Workforce Solution', 
          desc: 'Complete hiring solutions', 
          color: '#5d9cec'
        },
        { 
          icon: <TrendingUp className="w-10 h-10" />, 
          title: 'Employee Training', 
          desc: 'Skill development programs', 
          color: '#ff9a9e'
        },
        { 
          icon: <Award className="w-10 h-10" />, 
          title: 'Branding', 
          desc: 'Employer brand building', 
          color: '#a18cd1'
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
          color: '#667eea'
        },
        { 
          icon: <Users className="w-10 h-10" />, 
          title: 'Pool-Campus', 
          desc: 'Collaborative hiring events', 
          color: '#f5576c'
        },
        { 
          icon: <BookOpen className="w-10 h-10" />, 
          title: 'Student Training', 
          desc: 'Upskill your students', 
          color: '#4facfe'
        },
        { 
          icon: <MessageSquare className="w-10 h-10" />, 
          title: 'Seminar', 
          desc: 'Industry expert sessions', 
          color: '#5d9cec'
        },
        { 
          icon: <Award className="w-10 h-10" />, 
          title: 'Campus Branding', 
          desc: 'Enhance college reputation', 
          color: '#a18cd1'
        },
        { 
          icon: <PieChart className="w-10 h-10" />, 
          title: 'Analytics', 
          desc: 'Placement insights & reports', 
          color: '#ff9a9e'
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
          color: '#667eea'
        },
        { 
          icon: <Network className="w-10 h-10" />, 
          title: 'Off-Campus', 
          desc: 'Coordinate hiring drives', 
          color: '#f5576c'
        },
        { 
          icon: <TargetIcon className="w-10 h-10" />, 
          title: 'Pool-Campus', 
          desc: 'Multi-location recruitment', 
          color: '#4facfe'
        },
        { 
          icon: <UserCheck className="w-10 h-10" />, 
          title: 'Workforce Solution', 
          desc: 'End-to-end hiring support', 
          color: '#5d9cec'
        },
        { 
          icon: <TrendingUp className="w-10 h-10" />, 
          title: 'Training Management', 
          desc: 'Training program management', 
          color: '#ff9a9e'
        },
        { 
          icon: <ShieldCheck className="w-10 h-10" />, 
          title: 'Brand Representation', 
          desc: 'Company brand management', 
          color: '#a18cd1'
        }
      ]
    }
  };

  // How It Works sections with square cards
  const howItWorks = [
    {
      type: 'colleges',
      icon: <GraduationCap className="w-12 h-12" />,
      title: 'For Colleges',
      steps: [
        'Register your college and create a profile',
        'View hiring requests from companies',
        'Post your own hiring opportunities',
        'Request training and branding services'
      ],
      color: '#667eea',
      hoverColor: '#4a5fc1'
    },
    {
      type: 'companies',
      icon: <Building2 className="w-12 h-12" />,
      title: 'For Companies',
      steps: [
        'Register your company and set up profile',
        'Browse college hiring requests',
        'Post on-campus and pool campus opportunities',
        'Access workforce and training solutions'
      ],
      color: '#f5576c',
      hoverColor: '#d43a4f'
    },
    {
      type: 'employers',
      icon: <Briefcase className="w-12 h-12" />,
      title: 'For Employers',
      steps: [
        'Create employer profile independently',
        'Manage all recruitment activities',
        'Work on behalf of companies',
        'Handle company acceptance and coordination'
      ],
      color: '#4facfe',
      hoverColor: '#3d9be9'
    }
  ];

  // Stats data with better icons
  const stats = [
    { number: '500+', label: 'Partner Colleges', icon: <GraduationCap className="w-8 h-8" />, color: '#667eea', hoverColor: '#4a5fc1' },
    { number: '1000+', label: 'Companies', icon: <Building2 className="w-8 h-8" />, color: '#f5576c', hoverColor: '#d43a4f' },
    { number: '50K+', label: 'Students Placed', icon: <Users2 className="w-8 h-8" />, color: '#4facfe', hoverColor: '#3d9be9' },
    { number: '95%', label: 'Satisfaction Rate', icon: <Trophy className="w-8 h-8" />, color: '#ffd700', hoverColor: '#e6c200' }
  ];

  // Floating animation for service cards
  const getFloatStyle = (index) => {
    const floatAnimations = [
      'enhancedFloat1',
      'enhancedFloat2', 
      'enhancedFloat3',
      'enhancedFloat1',
      'enhancedFloat2',
      'enhancedFloat3'
    ];
    
    return {
      animation: `${floatAnimations[index]} 4s ease-in-out infinite`,
      animationDelay: `${index * 0.3}s`,
      transform: 'translateZ(0)' // Hardware acceleration
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Fixed Navigation */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200 py-4 px-6 fixed top-0 left-0 right-0 z-50 shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <Rocket className="w-8 h-8 text-[#667eea] transform group-hover:rotate-12 transition-transform duration-500 animate-float1" />
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-[#f5576c] group-hover:scale-110 transition-transform duration-500 animate-spin-slow" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 animate-gradient">
              RawRecruit
            </span>
          </button>

          <nav className="hidden md:flex gap-8 items-center">
            {['Services', 'How It Works', 'Features', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="relative text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            <button
              onClick={handleGetStarted}
              className="relative bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#764ba2] to-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 animate-slideDown">
            {['Services', 'How It Works', 'Features', 'About'].map((item, idx) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-700 hover:text-[#667eea] transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-50 transform hover:translate-x-2"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {item}
              </a>
            ))}
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-3 rounded-full font-semibold mt-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Get Started
            </button>
          </nav>
        )}
      </header>

      {/* Add padding for fixed header */}
      <div className="pt-20">
        
        {/* Hero Section */}
        <section id="hero" className="relative overflow-hidden py-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 animate-pulse-slow" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 animate-fadeIn">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300 animate-bounce-subtle">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                Recruitment Revolutionized
              </span>
              <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-tight animate-slideUp">
                <span className="bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f5576c] bg-clip-text text-transparent animate-gradient">
                  Campus Recruitment
                </span>
                <br />
                <span className="text-gray-800">At Affordable Excellence</span>
              </h1>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-10 animate-slideUp" style={{ animationDelay: '100ms' }}>
                Connecting colleges and companies for fresher recruitment and career-building through innovative hiring solutions
              </p>

              <button
                onClick={handleGetStarted}
                className="group relative bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-xl overflow-hidden animate-slideUp"
                style={{ animationDelay: '200ms' }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#764ba2] to-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-3">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </button>
            </div>

            {/* Hero Cards with improved spacing */}
<div id="services" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto scroll-mt-24">
  {heroCards.map((card, idx) => {
    // Helper function to get colors with dark hover variants
    const getCardColors = (gradient) => {
      const colorMap = {
        'from-[#667eea] to-[#764ba2]': { 
          // Original colors
          from: '#667eea', 
          to: '#764ba2',
          // Card background color on hover (darker purple)
          cardHoverBg: '#5c3a7d',
          // Icon color on hover (original purple)
          iconHoverColor: '#764ba2',
          // Text colors on hover
          titleHoverColor: '#ffffff',
          descHoverColor: 'rgba(255, 255, 255, 0.85)',
          featureHoverColor: 'rgba(255, 255, 255, 0.9)',
          // Checkmark color on hover
          checkHoverColor: '#ffffff',
          // Bottom line color on hover
          bottomLineHoverColor: '#ffffff'
        },
        'from-[#f093fb] to-[#f5576c]': { 
          from: '#f093fb', 
          to: '#9a2ca0',
          // Darker pink/red for hover
          cardHoverBg: '#952e8f',
          // Icon color on hover (original pink)
          iconHoverColor: '#f5576c',
          titleHoverColor: '#ffffff',
          descHoverColor: 'rgba(255, 255, 255, 0.85)',
          featureHoverColor: 'rgba(255, 255, 255, 0.9)',
          checkHoverColor: '#ffffff',
          bottomLineHoverColor: '#ffffff'
        },
        'from-[#4facfe] to-[#00f2fe]': { 
          from: '#4facfe', 
          to: '#00f2fe',
          // Darker blue for hover
          cardHoverBg: '#0073cf',
          // Icon color on hover (original blue)
          iconHoverColor: '#00f2fe',
          titleHoverColor: '#ffffff',
          descHoverColor: 'rgba(255, 255, 255, 0.85)',
          featureHoverColor: 'rgba(255, 255, 255, 0.9)',
          checkHoverColor: '#ffffff',
          bottomLineHoverColor: '#ffffff'
        },
      };
      return colorMap[gradient] || colorMap['from-[#667eea] to-[#764ba2]'];
    };

    const colors = getCardColors(card.gradient);

    return (
      <div
        key={idx}
        onClick={() => handleCardClick(card.title)}
        onMouseEnter={() => {
          setHoveredCard(idx);
          // Start zoom animation on hover
          const element = document.getElementById(`hero-card-${idx}`);
          if (element) {
            const iconElement = element.querySelector('.hero-card-icon');
            if (iconElement) {
              // Start continuous zoom animation
              iconElement.style.animation = 'zoomInOut 1.5s ease-in-out infinite';
              // Remove floating animation when zooming
              iconElement.classList.remove('animate-float1');
            }
          }
        }}
        onMouseLeave={() => {
          setHoveredCard(null);
          // Stop zoom animation, resume floating
          const element = document.getElementById(`hero-card-${idx}`);
          if (element) {
            const iconElement = element.querySelector('.hero-card-icon');
            if (iconElement) {
              iconElement.style.animation = '';
              // Add back floating animation
              iconElement.classList.add('animate-float1');
            }
          }
        }}
        id={`hero-card-${idx}`}
        className="relative p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 group overflow-hidden animate-slideUp bg-white"
        style={{ 
          animationDelay: `${idx * 150}ms`,
          animation: `float${idx % 3 + 1} 3s ease-in-out infinite ${idx * 0.2}s, slideUp 0.6s ease-out forwards ${idx * 150}ms`,
          opacity: 0,
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.4s ease',
        }}
      >
        {/* Hover overlay for card background - stays visible when hovered */}
        <div 
          className="absolute inset-0 rounded-2xl transition-all duration-400 opacity-0 group-hover:opacity-100"
          style={{
            backgroundColor: colors.cardHoverBg
          }}
        />
        
        {/* Card content */}
        <div className="relative z-10">
          {/* Icon - Use the original icon as is, will be styled via CSS */}
          <div 
            className={`hero-card-icon relative w-16 h-16 rounded-2xl p-3 mb-6 shadow-lg transition-all duration-500 animate-float1`}
            style={{ 
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.4s ease'
            }}
          >
            {/* Use the original icon component */}
            {React.cloneElement(card.icon, {
              className: `${card.icon.props.className || ''} transition-colors duration-400`,
              style: { 
                ...card.icon.props.style,
                color: '#ffffff' // Always white by default
              }
            })}
          </div>
          
          {/* Title - changes to white on hover */}
          <h3 
            className="text-2xl font-bold mb-3 transition-colors duration-400 text-gray-800 group-hover:text-white"
          >
            {card.title}
          </h3>
          
          {/* Description - changes to light white on hover */}
          <p 
            className="mb-6 transition-colors duration-400 text-gray-600 group-hover:text-white/85"
          >
            {card.description}
          </p>
          
          {/* Features list with white checkmarks on hover */}
          <ul className="space-y-3 mb-6">
            {card.features.map((feature, fIdx) => (
              <li key={fIdx} className="flex items-center gap-2 text-sm transition-colors duration-400 text-gray-500 group-hover:text-white/90">
                <CheckCircle className="w-4 h-4 text-green-500 transition-colors duration-400 group-hover:text-white transform group-hover:scale-110" />
                {feature}
              </li>
            ))}
          </ul>
          
          {/* Bottom line - changes to white on hover */}
          <div 
            className="relative h-1 rounded-full transition-all duration-500 w-12 group-hover:w-24 group-hover:scale-110"
            style={{
              background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
              transition: 'all 0.5s ease, background-color 0.4s ease'
            }}
          />
        </div>
        
        {/* Bottom accent line - white on hover */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
          style={{
            background: colors.bottomLineHoverColor
          }}
        ></div>
      </div>
    );
  })}
</div>
          </div>
        </section>

        {/* How It Works Section - Only active section has color */}
<section 
  ref={howItWorksRef}
  id="how-it-works" 
  className={`relative py-20 transition-all duration-1000 ${activeSection === 'how-it-works' ? 'bg-gradient-to-b from-[#667eea]/10 via-[#764ba2]/10 to-[#764ba2]/5' : 'bg-gradient-to-b from-white to-gray-50'}`}
>
  {/* Entry Animation Overlay - Only shows when active */}
  <div className={`absolute inset-0 overflow-hidden ${activeSection === 'how-it-works' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
    <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-floatFromTopLeft" />
    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#764ba2]/20 to-[#f5576c]/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-floatFromTopRight" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#4facfe]/20 to-[#00f2fe]/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 animate-floatFromBottomLeft" />
    <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#f5576c]/20 to-[#4facfe]/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-floatFromBottomRight" />
  </div>

  <div className="max-w-7xl mx-auto px-6 relative z-10">
    <div className={`text-center mb-16 animate-fadeIn ${activeSection === 'how-it-works' ? 'text-gray-800' : ''}`}>
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        How <span className="text-[#764ba2] animate-pulse-slow">RawRecruit</span> Works
      </h2>
      <p className="text-gray-600 text-xl max-w-2xl mx-auto">
        Simple, efficient, and designed for results
      </p>
    </div>

    {/* Square Cards with enhanced hover effects */}
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
          color: '#7A00D5',
          hoverColor: '#7A00D5'
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
          color: '#EF4444',
          hoverColor: '#EF4444'
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
          color: '#3B82F6',
          hoverColor: '#3B82F6'
        }
      ].map((section, idx) => (
        <div
          key={idx}
          onClick={() => handleRoleSelect(section.type)}
          onMouseEnter={(e) => {
            // Enhanced 3D effect with multiple shadow layers
            e.currentTarget.style.transform = 'translateY(-8px) translateZ(20px)';
            
            // Stack multiple shadows for true 3D effect
            e.currentTarget.style.boxShadow = `
              0 10px 30px -5px rgba(0, 0, 0, 0.1),
              0 25px 50px -12px ${section.color}40,
              inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
              0 0 0 4px ${section.color}15
            `;
            
            // Perfect border alignment - exactly at edges with 4px width
            e.currentTarget.style.borderLeft = `4px solid ${section.hoverColor}`;
            e.currentTarget.style.borderBottom = `4px solid ${section.hoverColor}`;
            
            // Start motion graphic animation
            const iconElement = e.currentTarget.querySelector('.section-icon');
            if (iconElement) {
              iconElement.style.animation = 'iconBounce 1.2s ease-in-out infinite';
            }
          }}
          onMouseLeave={(e) => {
            // Reset transformations
            e.currentTarget.style.transform = 'translateY(0) translateZ(0)';
            e.currentTarget.style.boxShadow = '';
            
            // Reset borders to transparent with 4px width
            e.currentTarget.style.borderLeft = '4px solid transparent';
            e.currentTarget.style.borderBottom = '4px solid transparent';
            
            // Stop motion graphic animation
            const iconElement = e.currentTarget.querySelector('.section-icon');
            if (iconElement) {
              iconElement.style.animation = 'float1 3s ease-in-out infinite';
              iconElement.style.animationDelay = `${idx * 0.2}s`;
            }
          }}
          className="relative bg-white p-8 rounded-2xl shadow-xl transition-all duration-500 cursor-pointer group animate-slideUp"
          style={{ 
            animationDelay: `${idx * 150}ms`,
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            // Initial borders (transparent with 4px width for perfect alignment)
            borderLeft: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            borderRight: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s ease, box-shadow 0.5s ease',
            willChange: 'transform, box-shadow',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            // Ensure card maintains exact size
            height: '100%'
          }}
        >
          {/* Enhanced Icon with floating animation and bounce on hover */}
          <div className="absolute -top-6 left-8">
            <div 
              className="section-icon w-16 h-16 rounded-2xl p-4 text-white shadow-xl flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${section.color}, ${section.hoverColor})`,
                animation: 'float1 3s ease-in-out infinite',
                animationDelay: `${idx * 0.2}s`,
                transition: 'all 0.5s ease'
              }}
            >
              {/* Use the original icon */}
              {React.cloneElement(section.icon, {
                className: `${section.icon.props.className || ''} transition-colors duration-300`,
                style: { 
                  ...section.icon.props.style,
                  color: '#ffffff'
                }
              })}
            </div>
          </div>
          
          {/* Card content - No text color change on hover */}
          <div className="pt-10">
            <h3 
              className="text-2xl font-bold mb-6 pt-4 text-gray-800 transition-colors duration-300"
            >
              {section.title}
            </h3>
            <ul className="space-y-4">
              {section.steps.map((step, stepIdx) => (
                <li key={stepIdx} className="flex items-start gap-4 group/item hover:translate-x-2 transition-all duration-300">
                  <div 
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transform transition-all duration-300 group-hover/item:scale-125 group-hover/item:-translate-y-1"
                    style={{ 
                      background: section.color,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    {stepIdx + 1}
                  </div>
                  <span 
                    className="text-gray-600 leading-relaxed transition-colors duration-300 group-hover/item:text-gray-800"
                  >
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Enhanced 3D effect layers */}
          
          {/* Inner glow layer for depth */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${section.color}08, ${section.color}02)`,
              boxShadow: `inset 0 0 40px ${section.color}05`,
              border: `1px solid ${section.color}10`
            }}
          />
          
          {/* Edge highlight for 3D effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
            style={{
              boxShadow: `inset 0 -2px 0 0 ${section.color}30, inset 2px 0 0 0 ${section.color}30`
            }}
          />
          
          {/* Bottom accent glow - enhanced for 3D */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${section.hoverColor}, transparent)`,
              filter: 'blur(2px)'
            }}
          />
          
          {/* Chevron indicator */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ChevronRight 
              className="w-6 h-6 text-gray-400 transform group-hover:translate-x-2 group-hover:text-gray-600 transition-all duration-300"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* Services Section - Only active section has color */}
<section id="features" className="relative">
  {/* Companies Section */}
  <div 
    ref={companyServicesRef}
    className={`relative w-full py-20 transition-all duration-1000 ${activeSection === 'companies' ? '' : ''}`}
  >
    {/* Background with curved corners - Only shows when active */}
    <div 
      className={`absolute inset-0 mx-6 rounded-3xl transition-all duration-1000 ${activeSection === 'companies' ? 'bg-gradient-to-b from-[#667eea]/15 via-[#764ba2]/10 to-[#667eea]/5 opacity-100' : 'opacity-0'}`}
    />
    
    {/* Entry Animation for Companies - Only shows when active */}
    <div className={`absolute inset-0 overflow-hidden mx-6 rounded-3xl ${activeSection === 'companies' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 rounded-full blur-3xl animate-floatFromLeft" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-l from-[#764ba2]/20 to-[#f5576c]/20 rounded-full blur-3xl animate-floatFromRight" />
    </div>
    
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Tailored Solutions for Companies
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {services.company.desc}
          </p>
          <button
            onClick={() => handleRoleSelect('company')}
            className="group relative bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-4 rounded-full font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden"
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-[#764ba2] to-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                animation: 'buttonPulse 2s ease-in-out infinite',
                background: `linear-gradient(45deg, #667eea, #764ba2, #667eea)`,
                backgroundSize: '200% 200%'
              }}
            />
            <span className="relative flex items-center gap-3">
              Explore Company Features
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 animate-moveRight" />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative">
          {services.company.cards.map((service, idx) => {
            // Function to get darker shade of a color
            const getDarkerColor = (color) => {
              if (!color) return '#5c3a7d';
              
              // For hex colors, make them darker by 20%
              if (color.startsWith('#')) {
                // Simple darkening function
                const hex = color.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                
                // Darken by 20%
                const darken = 0.8;
                const dr = Math.floor(r * darken);
                const dg = Math.floor(g * darken);
                const db = Math.floor(b * darken);
                
                return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
              }
              
              return color;
            };

            const darkerColor = getDarkerColor(service.color);

            return (
              <div
                key={idx}
                onClick={() => handleServiceCardClick('company', service.title)}
                onMouseEnter={(e) => {
                  // Change card background to darker color (unique for each card)
                  e.currentTarget.style.backgroundColor = darkerColor;
                  // Change icon box to white
                  const iconBox = e.currentTarget.querySelector('.service-icon-box');
                  if (iconBox) {
                    iconBox.style.background = '#ffffff';
                    // Change icon color to darker color
                    const iconSvg = iconBox.querySelector('svg');
                    if (iconSvg) {
                      iconSvg.style.color = darkerColor;
                      iconSvg.style.fill = darkerColor;
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  // Reset card background
                  e.currentTarget.style.backgroundColor = 'white';
                  // Reset icon box
                  const iconBox = e.currentTarget.querySelector('.service-icon-box');
                  if (iconBox) {
                    iconBox.style.background = `linear-gradient(135deg, ${service.color}, ${service.color}dd)`;
                    // Reset icon color to white
                    const iconSvg = iconBox.querySelector('svg');
                    if (iconSvg) {
                      iconSvg.style.color = '#ffffff';
                      iconSvg.style.fill = '#ffffff';
                    }
                  }
                }}
                className="relative bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer overflow-hidden"
                style={{ transition: 'all 0.4s ease' }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: `linear-gradient(135deg, ${service.color}20, transparent)`
                  }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="service-icon-box w-12 h-12 rounded-xl p-3 mb-3 text-white shadow-md mx-auto flex items-center justify-center transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.4s ease'
                    }}
                  >
                    <div className="flex items-center justify-center">
                      {service.icon}
                    </div>
                  </div>
                  
                  <h3 className="relative text-sm font-bold text-gray-800 mb-1 text-center group-hover:text-white transition-colors duration-300 z-10">
                    {service.title}
                  </h3>
                  <p className="relative text-xs text-gray-600 leading-relaxed text-center group-hover:text-white/90 transition-colors duration-300 z-10">
                    {service.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>

  {/* Colleges Section */}
  <div 
    ref={collegeServicesRef}
    className={`relative w-full py-20 transition-all duration-1000 ${activeSection === 'colleges' ? '' : ''}`}
  >
    {/* Background with curved corners - Only shows when active */}
    <div 
      className={`absolute inset-0 mx-6 rounded-3xl transition-all duration-1000 ${activeSection === 'colleges' ? 'bg-gradient-to-b from-[#f093fb]/15 via-[#f5576c]/10 to-[#f093fb]/5 opacity-100' : 'opacity-0'}`}
    />
    
    {/* Entry Animation for Colleges - Only shows when active */}
    <div className={`absolute inset-0 overflow-hidden mx-6 rounded-3xl ${activeSection === 'colleges' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      <div className="absolute top-1/3 left-20 w-80 h-80 bg-gradient-to-r from-[#f093fb]/20 to-[#f5576c]/20 rounded-full blur-3xl animate-floatFromLeft" />
      <div className="absolute bottom-1/3 right-20 w-80 h-80 bg-gradient-to-l from-[#f5576c]/20 to-[#667eea]/20 rounded-full blur-3xl animate-floatFromRight" />
    </div>
    
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Tailored Solutions for Colleges
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {services.college.desc}
          </p>
          <button
            onClick={() => handleRoleSelect('college')}
            className="group relative bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-4 rounded-full font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden"
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-[#764ba2] to-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                animation: 'buttonPulse 2s ease-in-out infinite',
                background: `linear-gradient(45deg, #667eea, #764ba2, #667eea)`,
                backgroundSize: '200% 200%'
              }}
            />
            <span className="relative flex items-center gap-3">
              Explore College Features
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 animate-moveRight" />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative">
          {services.college.cards.map((service, idx) => {
            // Function to get darker shade of a color
            const getDarkerColor = (color) => {
              if (!color) return '#5c3a7d';
              
              // For hex colors, make them darker by 20%
              if (color.startsWith('#')) {
                // Simple darkening function
                const hex = color.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                
                // Darken by 20%
                const darken = 0.8;
                const dr = Math.floor(r * darken);
                const dg = Math.floor(g * darken);
                const db = Math.floor(b * darken);
                
                return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
              }
              
              return color;
            };

            const darkerColor = getDarkerColor(service.color);

            return (
              <div
                key={idx}
                onClick={() => handleServiceCardClick('college', service.title)}
                onMouseEnter={(e) => {
                  // Change card background to darker color (unique for each card)
                  e.currentTarget.style.backgroundColor = darkerColor;
                  // Change icon box to white
                  const iconBox = e.currentTarget.querySelector('.service-icon-box');
                  if (iconBox) {
                    iconBox.style.background = '#ffffff';
                    // Change icon color to darker color
                    const iconSvg = iconBox.querySelector('svg');
                    if (iconSvg) {
                      iconSvg.style.color = darkerColor;
                      iconSvg.style.fill = darkerColor;
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  // Reset card background
                  e.currentTarget.style.backgroundColor = 'white';
                  // Reset icon box
                  const iconBox = e.currentTarget.querySelector('.service-icon-box');
                  if (iconBox) {
                    iconBox.style.background = `linear-gradient(135deg, ${service.color}, ${service.color}dd)`;
                    // Reset icon color to white
                    const iconSvg = iconBox.querySelector('svg');
                    if (iconSvg) {
                      iconSvg.style.color = '#ffffff';
                      iconSvg.style.fill = '#ffffff';
                    }
                  }
                }}
                className="relative bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer overflow-hidden"
                style={{ transition: 'all 0.4s ease' }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: `linear-gradient(135deg, ${service.color}20, transparent)`
                  }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="service-icon-box w-12 h-12 rounded-xl p-3 mb-3 text-white shadow-md mx-auto flex items-center justify-center transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.4s ease'
                    }}
                  >
                    <div className="flex items-center justify-center">
                      {service.icon}
                    </div>
                  </div>
                  
                  <h3 className="relative text-sm font-bold text-gray-800 mb-1 text-center group-hover:text-white transition-colors duration-300 z-10">
                    {service.title}
                  </h3>
                  <p className="relative text-xs text-gray-600 leading-relaxed text-center group-hover:text-white/90 transition-colors duration-300 z-10">
                    {service.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>

  {/* Employers Section */}
  <div 
    ref={employerServicesRef}
    className={`relative w-full py-20 transition-all duration-1000 ${activeSection === 'employers' ? '' : ''}`}
  >
    {/* Background with curved corners - Only shows when active */}
    <div 
      className={`absolute inset-0 mx-6 rounded-3xl transition-all duration-1000 ${activeSection === 'employers' ? 'bg-gradient-to-b from-[#4facfe]/15 via-[#00f2fe]/10 to-[#4facfe]/5 opacity-100' : 'opacity-0'}`}
    />
    
    {/* Entry Animation for Employers - Only shows when active */}
    <div className={`absolute inset-0 overflow-hidden mx-6 rounded-3xl ${activeSection === 'employers' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-[#4facfe]/20 to-[#00f2fe]/20 rounded-full blur-3xl animate-floatFromLeft" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-l from-[#00f2fe]/20 to-[#3d9be9]/20 rounded-full blur-3xl animate-floatFromRight" />
    </div>
    
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Tailored Solutions for Employers
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {services.employer.desc}
          </p>
          <button
            onClick={() => handleRoleSelect('employer')}
            className="group relative bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-4 rounded-full font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden"
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-[#764ba2] to-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                animation: 'buttonPulse 2s ease-in-out infinite',
                background: `linear-gradient(45deg, #667eea, #764ba2, #667eea)`,
                backgroundSize: '200% 200%'
              }}
            />
            <span className="relative flex items-center gap-3">
              Explore Employer Features
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 animate-moveRight" />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative">
          {services.employer.cards.map((service, idx) => {
            // Function to get darker shade of a color
            const getDarkerColor = (color) => {
              if (!color) return '#5c3a7d';
              
              // For hex colors, make them darker by 20%
              if (color.startsWith('#')) {
                // Simple darkening function
                const hex = color.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                
                // Darken by 20%
                const darken = 0.8;
                const dr = Math.floor(r * darken);
                const dg = Math.floor(g * darken);
                const db = Math.floor(b * darken);
                
                return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
              }
              
              return color;
            };

            const darkerColor = getDarkerColor(service.color);

            return (
              <div
                key={idx}
                onClick={() => handleServiceCardClick('employer', service.title)}
                onMouseEnter={(e) => {
                  // Change card background to darker color (unique for each card)
                  e.currentTarget.style.backgroundColor = darkerColor;
                  // Change icon box to white
                  const iconBox = e.currentTarget.querySelector('.service-icon-box');
                  if (iconBox) {
                    iconBox.style.background = '#ffffff';
                    // Change icon color to darker color
                    const iconSvg = iconBox.querySelector('svg');
                    if (iconSvg) {
                      iconSvg.style.color = darkerColor;
                      iconSvg.style.fill = darkerColor;
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  // Reset card background
                  e.currentTarget.style.backgroundColor = 'white';
                  // Reset icon box
                  const iconBox = e.currentTarget.querySelector('.service-icon-box');
                  if (iconBox) {
                    iconBox.style.background = `linear-gradient(135deg, ${service.color}, ${service.color}dd)`;
                    // Reset icon color to white
                    const iconSvg = iconBox.querySelector('svg');
                    if (iconSvg) {
                      iconSvg.style.color = '#ffffff';
                      iconSvg.style.fill = '#ffffff';
                    }
                  }
                }}
                className="relative bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer overflow-hidden"
                style={{ transition: 'all 0.4s ease' }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: `linear-gradient(135deg, ${service.color}20, transparent)`
                  }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="service-icon-box w-12 h-12 rounded-xl p-3 mb-3 text-white shadow-md mx-auto flex items-center justify-center transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.4s ease'
                    }}
                  >
                    <div className="flex items-center justify-center">
                      {service.icon}
                    </div>
                  </div>
                  
                  <h3 className="relative text-sm font-bold text-gray-800 mb-1 text-center group-hover:text-white transition-colors duration-300 z-10">
                    {service.title}
                  </h3>
                  <p className="relative text-xs text-gray-600 leading-relaxed text-center group-hover:text-white/90 transition-colors duration-300 z-10">
                    {service.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
</section>

        {/* Stats Section - Only active section has color */}
<section 
  ref={statsRef}
  id="about" 
  className={`relative py-20 transition-all duration-1000 ${activeSection === 'stats' ? 'bg-gradient-to-b from-[#8A2BE2]/15 via-[#4A6FA5]/15 to-[#FF69B4]/10' : 'bg-gradient-to-b from-white to-gray-50'}`}
>
  {/* Entry Animation for Stats Section - Only shows when active */}
  <div className={`absolute inset-0 overflow-hidden ${activeSection === 'stats' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-[#8A2BE2]/20 via-[#4A6FA5]/20 to-[#FF69B4]/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-radiate" />
    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-[#FF69B4]/20 via-[#8A2BE2]/20 to-[#4A6FA5]/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-radiateDelay" />
  </div>

  <div className="max-w-7xl mx-auto px-6 relative z-10">
    <div className={`text-center mb-16 animate-fadeIn ${activeSection === 'stats' ? 'text-gray-800' : ''}`}>
      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-md transform hover:scale-105 transition-transform duration-300">
        <Sparkles className="w-4 h-4 animate-spin-slow" />
        Our Impact
      </span>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
        Our mission is <span className="text-[#667eea] animate-pulse-slow">excellence</span>
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Building a strong network of colleges and companies to empower the next generation of talent
      </p>
    </div>

    {/* Square Stats Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
      {[
        { number: '500+', label: 'Partner Colleges', icon: <GraduationCap className="w-8 h-8" />, color: '#667eea', hoverColor: '#4a5fc1' },
        { number: '1000+', label: 'Companies', icon: <Building2 className="w-8 h-8" />, color: '#f5576c', hoverColor: '#d43a4f' },
        { number: '50K+', label: 'Students Placed', icon: <Users2 className="w-8 h-8" />, color: '#4facfe', hoverColor: '#3d9be9' },
        { number: '95%', label: 'Satisfaction Rate', icon: <Trophy className="w-8 h-8" />, color: '#ff1694', hoverColor: '#f61491' }
      ].map((stat, idx) => (
        <div
          key={idx}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${stat.color}15`;
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = `0 20px 40px ${stat.color}30, 0 4px 20px rgba(0, 0, 0, 0.15)`;
            e.currentTarget.style.borderColor = `${stat.color}40`;
            e.currentTarget.querySelector('.stat-number').style.color = stat.hoverColor;
            e.currentTarget.querySelector('.stat-label').style.color = stat.hoverColor;
            const iconContainer = e.currentTarget.querySelector('.stat-icon-container');
            if (iconContainer) {
              iconContainer.style.backgroundColor = 'white'; // Changed to white on hover
              iconContainer.style.boxShadow = `0 8px 25px ${stat.color}40, 0 4px 12px ${stat.color}30`;
              iconContainer.style.transform = 'translateZ(20px) scale(1.1)';
            }
            const iconElement = e.currentTarget.querySelector('.stat-icon');
            if (iconElement) {
              iconElement.style.color = stat.hoverColor; // Icon color changes to hover color
              iconElement.style.animation = 'continuousRotate 2.5s ease-in-out infinite';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '';
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.querySelector('.stat-number').style.color = stat.color;
            e.currentTarget.querySelector('.stat-label').style.color = '#374151';
            const iconContainer = e.currentTarget.querySelector('.stat-icon-container');
            if (iconContainer) {
              iconContainer.style.backgroundColor = `${stat.color}20`;
              iconContainer.style.boxShadow = `0 4px 12px ${stat.color}20`;
              iconContainer.style.transform = '';
            }
            const iconElement = e.currentTarget.querySelector('.stat-icon');
            if (iconElement) {
              iconElement.style.color = stat.color;
              iconElement.style.animation = '';
            }
          }}
          className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 animate-slideUp group"
          style={{ 
            animationDelay: `${idx * 100}ms`,
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid transparent',
            transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            willChange: 'transform, box-shadow',
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d'
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl transition-all duration-500 group-hover:scale-x-105 group-hover:scale-y-125 group-hover:translateY(-2px)"
            style={{ 
              backgroundColor: stat.color,
              transform: 'scaleX(1) scaleY(1)',
              transformOrigin: 'center',
              zIndex: 2
            }}
          />

          {/* 3D effect layers */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${stat.color}15 0%, transparent 60%), linear-gradient(225deg, ${stat.color}10 0%, transparent 60%)`,
              transform: 'translateZ(10px)',
              zIndex: 1
            }}
          />

          <div className="relative z-10 mb-4">
            <div
              className="p-3 rounded-xl transition-all duration-500 stat-icon-container"
              style={{
                backgroundColor: `${stat.color}20`,
                boxShadow: `0 4px 12px ${stat.color}20`,
                transformStyle: 'preserve-3d',
                transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <div 
                className="transform transition-transform duration-300 stat-icon"
                style={{ color: stat.color }}
              >
                {stat.icon}
              </div>
            </div>
          </div>

          <div className="relative z-10 text-3xl font-bold mb-2 stat-number transition-colors duration-500" style={{ color: stat.color }}>
            {stat.number}
          </div>

          <div className="relative z-10 text-lg font-semibold text-gray-700 mb-2 stat-label transition-colors duration-500">
            {stat.label}
          </div>
          
          {/* 3D glow effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${stat.color}30 0%, transparent 70%), radial-gradient(circle at 70% 70%, ${stat.color}20 0%, transparent 70%)`,
              filter: 'blur(8px)',
              transform: 'translateZ(-10px)',
              zIndex: 0
            }}
          />
        </div>
      ))}
    </div>

    {/* Our Partners Marquee Section */}
    <div className="relative py-10">
      <div className="text-center mb-10">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Our Trusted <span className="text-[#667eea]">Partners</span>
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Collaborating with industry leaders to create opportunities
        </p>
      </div>

      <div className="relative overflow-hidden">
        {/* Gradient overlays for smooth edges - using the new purple-blue-pink gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#8A2BE2]/15 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FF69B4]/10 to-transparent z-10" />
        
        <div className="flex space-x-12 animate-marquee">
          {/* First set of company logos with names */}
          <div className="flex items-center space-x-12 flex-none">
            {/* Google */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Google</span>
            </div>
            
            {/* Microsoft */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 23 23" fill="none">
                  <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
                  <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
                  <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
                  <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Microsoft</span>
            </div>
            
            {/* Amazon */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M10.922 16.226c.094.065.209.1.327.1h.011a.596.596 0 0 0 .333-.112l7.104-4.482c.33-.207.527-.572.527-.964V6.308c0-.392-.197-.757-.527-.964l-7.104-4.482a1.15 1.15 0 0 0-1.215 0L3.724 5.344c-.33.207-.527.572-.527.964v4.482c0 .392.197.757.527.964l7.104 4.482c.158.1.342.151.527.151a1.15 1.15 0 0 0 .667-.2zm-.667-1.108L3.29 10.755V6.308l7.045-4.443 7.045 4.443v4.447l-7.045 4.443z" fill="#FF9900"/>
                  <path d="M17.35 9.948l-3.898 2.459a.592.592 0 0 1-.327.1h-.011a.596.596 0 0 1-.333-.112l-3.898-2.447a.602.602 0 0 1-.21-.819.602.602 0 0 1 .819-.21l3.577 2.246 3.577-2.255a.602.602 0 0 1 .819.21.602.602 0 0 1-.21.819z" fill="#000"/>
                  <path d="M17.35 12.006l-3.898 2.459a.592.592 0 0 1-.327.1h-.011a.596.596 0 0 1-.333-.112l-3.898-2.447a.602.602 0 0 1-.21-.819.602.602 0 0 1 .819-.21l3.577 2.246 3.577-2.255a.602.602 0 0 1 .819.21.602.602 0 0 1-.21.819z" fill="#000"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Amazon</span>
            </div>
            
            {/* Meta */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z" fill="#1877F2"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Meta</span>
            </div>
            
            {/* Apple */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#000"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Apple</span>
            </div>

            {/* Adobe */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M13.966 22.874l-2.757-6.724H5.092l5.403-13.149 8.488-.001-5.431 13.15 2.758 6.724h-2.335z" fill="#ED2224"/>
                  <path d="M18.984 2.999H5.092l-4.094 9.946 7.921 9.929h13.892l4.094-9.946-7.921-9.929z" fill="#FF7C00"/>
                  <path d="M10.495 16.149l-2.757 6.724h13.892l2.758-6.724H10.495z" fill="#FFD800"/>
                  <path d="M10.495 16.149l2.758-6.724 2.758 6.724H10.495z" fill="#00A8E2"/>
                  <path d="M18.984 2.999l-5.403 13.15h-6.117l5.403-13.15h6.117z" fill="#2EA968"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Adobe</span>
            </div>

            {/* Tesla */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5.362l-11 5.638v6l11 5.638 11-5.638v-6l-11-5.638zm0 2.724l8.188 4.188-8.188 4.188-8.188-4.188L12 8.086zm-9 8.188v-3.566l7.188 3.682v3.682l-7.188-3.682zm18 0l-7.188 3.682v-3.682l7.188-3.682v3.566z" fill="#E31937"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Tesla</span>
            </div>

            {/* Intel */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M9.9 20.5v-7.8H2.1v7.8h7.8zm0-9.9V2.8H2.1v7.8h7.8zm9.9 9.9v-7.8h-7.8v7.8h7.8zm0-9.9V2.8h-7.8v7.8h7.8z" fill="#0071C5"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Intel</span>
            </div>
          </div>
          
          {/* Duplicate set for seamless looping */}
          <div className="flex items-center space-x-12 flex-none">
            {/* Google */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Google</span>
            </div>
            
            {/* Microsoft */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 23 23" fill="none">
                  <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
                  <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
                  <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
                  <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Microsoft</span>
            </div>
            
            {/* Amazon */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M10.922 16.226c.094.065.209.1.327.1h.011a.596.596 0 0 0 .333-.112l7.104-4.482c.33-.207.527-.572.527-.964V6.308c0-.392-.197-.757-.527-.964l-7.104-4.482a1.15 1.15 0 0 0-1.215 0L3.724 5.344c-.33.207-.527.572-.527.964v4.482c0 .392.197.757.527.964l7.104 4.482c.158.1.342.151.527.151a1.15 1.15 0 0 0 .667-.2zm-.667-1.108L3.29 10.755V6.308l7.045-4.443 7.045 4.443v4.447l-7.045 4.443z" fill="#FF9900"/>
                  <path d="M17.35 9.948l-3.898 2.459a.592.592 0 0 1-.327.1h-.011a.596.596 0 0 1-.333-.112l-3.898-2.447a.602.602 0 0 1-.21-.819.602.602 0 0 1 .819-.21l3.577 2.246 3.577-2.255a.602.602 0 0 1 .819.21.602.602 0 0 1-.21.819z" fill="#000"/>
                  <path d="M17.35 12.006l-3.898 2.459a.592.592 0 0 1-.327.1h-.011a.596.596 0 0 1-.333-.112l-3.898-2.447a.602.602 0 0 1-.21-.819.602.602 0 0 1 .819-.21l3.577 2.246 3.577-2.255a.602.602 0 0 1 .819.21.602.602 0 0 1-.21.819z" fill="#000"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Amazon</span>
            </div>
            
            {/* Meta */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z" fill="#1877F2"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Meta</span>
            </div>
            
            {/* Apple */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#000"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Apple</span>
            </div>

            {/* Adobe */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M13.966 22.874l-2.757-6.724H5.092l5.403-13.149 8.488-.001-5.431 13.15 2.758 6.724h-2.335z" fill="#ED2224"/>
                  <path d="M18.984 2.999H5.092l-4.094 9.946 7.921 9.929h13.892l4.094-9.946-7.921-9.929z" fill="#FF7C00"/>
                  <path d="M10.495 16.149l-2.757 6.724h13.892l2.758-6.724H10.495z" fill="#FFD800"/>
                  <path d="M10.495 16.149l2.758-6.724 2.758 6.724H10.495z" fill="#00A8E2"/>
                  <path d="M18.984 2.999l-5.403 13.15h-6.117l5.403-13.15h6.117z" fill="#2EA968"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Adobe</span>
            </div>

            {/* Tesla */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5.362l-11 5.638v6l11 5.638 11-5.638v-6l-11-5.638zm0 2.724l8.188 4.188-8.188 4.188-8.188-4.188L12 8.086zm-9 8.188v-3.566l7.188 3.682v3.682l-7.188-3.682zm18 0l-7.188 3.682v-3.682l7.188-3.682v3.566z" fill="#E31937"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Tesla</span>
            </div>

            {/* Intel */}
            <div className="flex flex-col items-center justify-center w-32">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M9.9 20.5v-7.8H2.1v7.8h7.8zm0-9.9V2.8H2.1v7.8h7.8zm9.9 9.9v-7.8h-7.8v7.8h7.8zm0-9.9V2.8h-7.8v7.8h7.8z" fill="#0071C5"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Intel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* Footer with Animation */}
        <footer 
          ref={footerRef}
          className={`bg-gray-900 text-white py-16 px-6 transition-all duration-1000 ${isSectionInView(footerRef) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <button 
                  onClick={handleLogoClick}
                  className="flex items-center gap-2 mb-6 cursor-pointer group"
                >
                  <Rocket className="w-8 h-8 text-[#667eea] transform group-hover:-translate-y-1 transition-transform duration-300 animate-float1" />
                  <span className="text-2xl font-bold group-hover:opacity-80 transition-opacity duration-300">RawRecruit</span>
                </button>
                <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                  Transforming campus recruitment through innovation and excellence.
                </p>
              </div>

              {[
                { title: 'Product', links: ['Features', 'Solutions', 'Demo'] },
                { title: 'Company', links: ['About', 'Careers'] },
                { title: 'Support', links: ['Help Center', 'Contact', 'Privacy & Terms'] }
              ].map((column, idx) => (
                <div key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 100}ms` }}>
                  <h3 className="text-lg font-bold mb-6">{column.title}</h3>
                  <ul className="space-y-3">
                    {column.links.map((link, linkIdx) => (
                      <li key={link} style={{ transitionDelay: `${linkIdx * 50}ms` }}>
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

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 animate-fadeIn">
              <p>© {new Date().getFullYear()} RawRecruit. All rights reserved.</p>
            </div>
          </div>
        </footer>
        
      </div>

      {/* Terms & Privacy Modal */}
      <TermsModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
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
        
        /* Floating animations */
        @keyframes float1 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes float2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-8px) translateX(4px);
          }
          66% {
            transform: translateY(4px) translateX(-4px);
          }
        }
        
        @keyframes float3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-6px) translateX(-2px);
          }
          50% {
            transform: translateY(6px) translateX(2px);
          }
          75% {
            transform: translateY(-3px) translateX(4px);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .animate-float1 {
          animation: float1 3s ease-in-out infinite;
        }
        
        .animate-float2 {
          animation: float2 4s ease-in-out infinite;
        }
        
        .animate-float3 {
          animation: float3 5s ease-in-out infinite;
        }
        
        /* Card hover effects */
        #services > div {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        #services > div:hover {
          background-color: var(--hover-color, #667eea15) !important;
        }
        
        /* Icon rotation animation */
        @keyframes continuousRotate {
          from {
            transform: rotate(0deg) scale(1.1);
          }
          to {
            transform: rotate(360deg) scale(1.1);
          }
        }
        
        @keyframes float1 {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }
        
        /* Entry Animations */
        @keyframes floatFromTopLeft {
          0% {
            transform: translateX(-100%) translateY(-100%) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(-50%) translateY(-50%) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes floatFromTopRight {
          0% {
            transform: translateX(100%) translateY(-100%) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(50%) translateY(-50%) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes floatFromBottomLeft {
          0% {
            transform: translateX(-100%) translateY(100%) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(-50%) translateY(50%) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes floatFromBottomRight {
          0% {
            transform: translateX(100%) translateY(100%) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(50%) translateY(50%) scale(1);
            opacity: 0;
          }
        }
        
        .animate-floatFromTopLeft {
          animation: floatFromTopLeft 2s ease-out;
        }
        
        .animate-floatFromTopRight {
          animation: floatFromTopRight 2s ease-out 0.2s;
        }
        
        .animate-floatFromBottomLeft {
          animation: floatFromBottomLeft 2s ease-out 0.4s;
        }
        
        .animate-floatFromBottomRight {
          animation: floatFromBottomRight 2s ease-out 0.6s;
        }
        
        @keyframes buttonPulse {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes moveRight {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }
        
        .animate-moveRight {
          animation: moveRight 1.5s ease-in-out infinite;
        }
        
        /* Enhanced floating animations for cards */
        @keyframes enhancedFloat1 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-8px) rotate(1deg);
          }
          66% {
            transform: translateY(4px) rotate(-1deg);
          }
        }
        
        @keyframes enhancedFloat2 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-6px) rotate(-1deg);
          }
          50% {
            transform: translateY(6px) rotate(1deg);
          }
          75% {
            transform: translateY(-3px) rotate(0.5deg);
          }
        }
        
        @keyframes enhancedFloat3 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          20% {
            transform: translateY(-7px) rotate(0.5deg);
          }
          40% {
            transform: translateY(5px) rotate(-0.5deg);
          }
          60% {
            transform: translateY(-3px) rotate(0.3deg);
          }
          80% {
            transform: translateY(4px) rotate(-0.3deg);
          }
        }
        
        /* Entry animations for full-width sections */
        @keyframes floatFromLeft {
          0% {
            transform: translateX(-100%) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes floatFromRight {
          0% {
            transform: translateX(100%) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 0;
          }
        }
        
        .animate-floatFromLeft {
          animation: floatFromLeft 1.5s ease-out;
        }
        
        .animate-floatFromRight {
          animation: floatFromRight 1.5s ease-out 0.3s;
        }
        
        /* Radiating animation for stats section */
        @keyframes radiate {
          0% {
            transform: translateX(-50%) translateY(-50%) scale(0);
            opacity: 0.8;
          }
          100% {
            transform: translateX(-50%) translateY(-50%) scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes radiateDelay {
          0% {
            transform: translateX(-50%) translateY(-50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translateX(-50%) translateY(-50%) scale(1.8);
            opacity: 0;
          }
        }
        
        .animate-radiate {
          animation: radiate 2s ease-out;
        }
        
        .animate-radiateDelay {
          animation: radiateDelay 2s ease-out 0.5s;
        }

        @keyframes zoomInOut {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

/* Icon styling */
.hero-card-icon svg {
  color: #ffffff !important; /* Always white normally */
  fill: #ffffff !important;
  transition: color 0.4s ease, fill 0.4s ease !important;
}

/* Icon on hover - becomes card colored */
.group:hover .hero-card-icon {
  animation: zoomInOut 1.5s ease-in-out infinite !important;
  background: white !important;
}

.group:hover .hero-card-icon svg {
  color: var(--icon-hover-color) !important;
  fill: var(--icon-hover-color) !important;
}

/* Set hover colors for each card type */
[style*="background-color: #5c3a7d"]:hover .hero-card-icon svg {
  color: #764ba2 !important; /* Purple card icon color */
  fill: #764ba2 !important;
}

[style*="background-color: #d92d49"]:hover .hero-card-icon svg {
  color: #f5576c !important; /* Pink card icon color */
  fill: #f5576c !important;
}

[style*="background-color: #0e8cfb"]:hover .hero-card-icon svg {
  color: #00f2fe !important; /* Blue card icon color */
  fill: #00f2fe !important;
}

/* Ensure hover overlay stays visible */
.group:hover > div:first-child {
  opacity: 1 !important;
}

        /* Icon bounce animation - matches the previous example */
@keyframes iconBounce {
  0%, 100% {
    transform: translateY(0) scale(1.05);
  }
  25% {
    transform: translateY(-6px) scale(1.08);
  }
  50% {
    transform: translateY(0) scale(1.05);
  }
  75% {
    transform: translateY(-3px) scale(1.06);
  }
}

/* Float animation */
@keyframes float1 {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Enhanced hover for list items */
.group/item:hover {
  transform: translateX(8px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.group/item:hover .number-circle {
  transform: scale(1.2) translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.group/item:hover .step-text {
  color: #1f2937 !important;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

        @keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  animation: marquee 25s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}

/* 3D hover effect for stats cards */
@keyframes continuousRotate {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(5deg) scale(1.05);
  }
  50% {
    transform: rotate(0deg) scale(1.1);
  }
  75% {
    transform: rotate(-5deg) scale(1.05);
  }
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideUp {
  animation: slideUp 0.6s ease-out forwards;
}

        /* Add to the existing style jsx block at the end of the component */

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  /* Adjust padding for fixed header */
  .pt-20 {
    padding-top: 80px;
  }
  
  /* Hero Section */
  #hero {
    padding: 40px 16px;
  }
  
  #hero h1 {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  #hero p {
    font-size: 1rem;
    padding: 0 16px;
  }
  
  /* Hero Cards */
  #services {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 16px;
  }
  
  /* How It Works Section */
  #how-it-works {
    padding: 40px 16px;
  }
  
  #how-it-works .grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  /* Services Section */
  #features > div {
    padding: 40px 16px;
  }
  
  #features .grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  #features .grid.grid-cols-2\:lg\:grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  #features .max-w-7xl .grid {
    padding: 0 16px;
  }
  
  /* Background adjustments for mobile */
  #features > div .absolute.mx-6 {
    margin: 0 16px;
    border-radius: 20px;
  }
  
  /* Stats Section */
  #about {
    padding: 40px 16px;
  }
  
  #about .grid.grid-cols-2\:md\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  /* Partners Section */
  #about .relative.overflow-hidden {
    padding: 0 16px;
  }
  
  #about .flex.space-x-12 {
    gap: 24px;
  }
  
  #about .flex.space-x-12 > div {
    width: 120px;
  }
  
  #about .flex.space-x-12 > div .w-20 {
    width: 48px;
    height: 48px;
  }
  
  /* Navigation */
  nav.hidden.md\:flex {
    display: none;
  }
  
  header .max-w-7xl {
    padding: 0 16px;
  }
  
  /* Footer */
  footer {
    padding: 40px 16px;
  }
  
  footer .grid.grid-cols-1\:md\:grid-cols-4 {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  /* Adjust text sizes for mobile */
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-3xl {
    font-size: 1.75rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  /* Button sizes */
  button.px-8.py-4 {
    padding: 12px 24px;
  }
  
  button.px-10.py-4 {
    padding: 12px 20px;
  }
  
  /* Card adjustments */
  .p-8 {
    padding: 24px;
  }
  
  .p-4 {
    padding: 16px;
  }
  
  .rounded-2xl {
    border-radius: 16px;
  }
  
  /* Marquee speed adjustment for mobile */
  .animate-marquee {
    animation-duration: 40s;
  }
  
  /* Reduce floating animations on mobile */
  .animate-float1,
  .animate-float2,
  .animate-float3 {
    animation: none;
  }
}

@media (max-width: 480px) {
  /* Extra small devices */
  #hero h1 {
    font-size: 2rem;
  }
  
  #services {
    gap: 16px;
  }
  
  #features .grid.grid-cols-2\:lg\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  #about .grid.grid-cols-2\:md\:grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  #about .flex.space-x-12 > div {
    width: 100px;
  }
  
  /* Reduce spacing */
  .gap-8 {
    gap: 16px;
  }
  
  .gap-6 {
    gap: 12px;
  }
  
  /* Smaller icons */
  .w-16.h-16 {
    width: 48px;
    height: 48px;
  }
  
  .w-12.h-12 {
    width: 32px;
    height: 32px;
  }
  
  .w-10.h-10 {
    width: 24px;
    height: 24px;
  }
  
  .w-8.h-8 {
    width: 20px;
    height: 20px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  /* Tablet styles */
  #hero h1 {
    font-size: 3.5rem;
  }
  
  #services {
    gap: 24px;
  }
  
  #features .grid.grid-cols-2\:lg\:grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  #about .grid.grid-cols-2\:md\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Adjust container padding */
  .max-w-7xl {
    padding: 0 32px;
  }
  
  /* Adjust floating animations */
  .animate-float1,
  .animate-float2,
  .animate-float3 {
    animation-duration: 4s;
  }
}

/* Touch device optimizations */
@media (hover: none) {
  /* Reduce hover effects on touch devices */
  .group:hover {
    transform: none !important;
  }
  
  .group-hover\:shadow-2xl {
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow) !important;
  }
  
  .group-hover\:scale-105 {
    transform: scale(1) !important;
  }
  
  .group-hover\:-translate-y-3 {
    transform: translateY(0) !important;
  }
  
  /* Disable complex animations on touch devices */
  .animate-marquee {
    animation: none;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
  }
  
  .animate-marquee::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
}

/* Prevent horizontal overflow */
html, body {
  max-width: 100%;
  overflow-x: hidden;
}

/* Ensure images and SVGs are responsive */
img, svg {
  max-width: 100%;
  height: auto;
}

/* Improve touch targets */
button, a, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}

/* Adjust font sizes for readability on mobile */
@media (max-width: 768px) {
  body {
    font-size: 16px;
    line-height: 1.5;
  }
  
  h1, h2, h3 {
    line-height: 1.3;
  }
}

/* Fix for iOS Safari */
@supports (-webkit-touch-callout: none) {
  .min-h-screen {
    min-height: -webkit-fill-available;
  }
}
      `}</style>
    </div>
  );
};

export default App;