import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, Briefcase, GraduationCap, Target,
  TrendingUp, Award, Calendar, Lightbulb, UserCheck,
  Menu, X, ChevronRight, CheckCircle, Star, Sparkles,
  ArrowRight, Users2, TargetIcon, Zap, Globe, Shield,
  BarChart3, HeartHandshake, Rocket
} from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa';
import { TermsModal } from '@/components/onboarding/Terms&conditionModal';

const App = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

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
    company: [
      { 
        icon: <GraduationCap className="w-10 h-10" />, 
        title: 'On-Campus', 
        desc: 'Direct campus recruitment', 
        color: '#667eea',
        route: '/services/company/on-campus'
      },
      { 
        icon: <Users className="w-10 h-10" />, 
        title: 'Off-Campus', 
        desc: 'Open recruitment drives', 
        color: '#f5576c',
        route: '/services/company/off-campus'
      },
      { 
        icon: <Target className="w-10 h-10" />, 
        title: 'Pool-Campus', 
        desc: 'Multi-college hiring', 
        color: '#4facfe',
        route: '/services/company/pool-campus'
      },
      { 
        icon: <UserCheck className="w-10 h-10" />, 
        title: 'Workforce Solution', 
        desc: 'Complete hiring solutions', 
        color: '#5d9cec',
        route: '/services/company/workforce'
      },
      { 
        icon: <TrendingUp className="w-10 h-10" />, 
        title: 'Employee Training', 
        desc: 'Skill development programs', 
        color: '#ff9a9e',
        route: '/services/company/training'
      },
      { 
        icon: <Award className="w-10 h-10" />, 
        title: 'Branding', 
        desc: 'Employer brand building', 
        color: '#a18cd1',
        route: '/services/company/branding'
      }
    ],
    college: [
      { 
        icon: <GraduationCap className="w-10 h-10" />, 
        title: 'On-Campus', 
        desc: 'Host campus drives', 
        color: '#667eea',
        route: '/services/college/on-campus'
      },
      { 
        icon: <Users className="w-10 h-10" />, 
        title: 'Pool-Campus', 
        desc: 'Collaborative hiring events', 
        color: '#f5576c',
        route: '/services/college/pool-campus'
      },
      { 
        icon: <TrendingUp className="w-10 h-10" />, 
        title: 'Student Training', 
        desc: 'Upskill your students', 
        color: '#4facfe',
        route: '/services/college/training'
      },
      { 
        icon: <Calendar className="w-10 h-10" />, 
        title: 'Seminar', 
        desc: 'Industry expert sessions', 
        color: '#5d9cec',
        route: '/services/college/seminar'
      },
      { 
        icon: <Award className="w-10 h-10" />, 
        title: 'Campus Branding', 
        desc: 'Enhance college reputation', 
        color: '#a18cd1',
        route: '/services/college/branding'
      },
      { 
        icon: <Zap className="w-10 h-10" />, 
        title: 'Analytics', 
        desc: 'Placement insights & reports', 
        color: '#ff9a9e',
        route: '/services/college/analytics'
      }
    ],
    employer: [
      { 
        icon: <GraduationCap className="w-10 h-10" />, 
        title: 'On-Campus', 
        desc: 'Manage campus recruitment', 
        color: '#667eea',
        route: '/services/employer/on-campus'
      },
      { 
        icon: <Users className="w-10 h-10" />, 
        title: 'Off-Campus', 
        desc: 'Coordinate hiring drives', 
        color: '#f5576c',
        route: '/services/employer/off-campus'
      },
      { 
        icon: <TargetIcon className="w-10 h-10" />, 
        title: 'Pool-Campus', 
        desc: 'Multi-location recruitment', 
        color: '#4facfe',
        route: '/services/employer/pool-campus'
      },
      { 
        icon: <UserCheck className="w-10 h-10" />, 
        title: 'Workforce Solution', 
        desc: 'End-to-end hiring support', 
        color: '#5d9cec',
        route: '/services/employer/workforce'
      },
      { 
        icon: <TrendingUp className="w-10 h-10" />, 
        title: 'Training Management', 
        desc: 'Training program management', 
        color: '#ff9a9e',
        route: '/services/employer/training'
      },
      { 
        icon: <Shield className="w-10 h-10" />, 
        title: 'Brand Representation', 
        desc: 'Company brand management', 
        color: '#a18cd1',
        route: '/services/employer/branding'
      }
    ]
  };

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
      color: 'from-[#667eea] to-[#764ba2]'
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
      color: 'from-[#f093fb] to-[#f5576c]'
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
      color: 'from-[#4facfe] to-[#00f2fe]'
    }
  ];

  const stats = [
    { number: '500+', label: 'Partner Colleges', icon: <GraduationCap className="w-6 h-6" />, color: '#667eea' },
    { number: '1000+', label: 'Companies', icon: <Building2 className="w-6 h-6" />, color: '#f5576c' },
    { number: '50K+', label: 'Students Placed', icon: <Users2 className="w-6 h-6" />, color: '#4facfe' },
    { number: '95%', label: 'Satisfaction Rate', icon: <Star className="w-6 h-6" />, color: '#ffd700' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-200 py-4 px-6 sticky top-0 z-50 shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <Rocket className="w-8 h-8 text-[#667eea] transform group-hover:rotate-12 transition-transform duration-500" />
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-[#f5576c] group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
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

          <div id="services" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto scroll-mt-24">
            {heroCards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => handleCardClick(card.title)}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 border border-gray-100 group overflow-hidden animate-slideUp`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="absolute -inset-0.5 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-white/10 group-hover:via-white/5 group-hover:to-white/20 blur-sm transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} p-3 mb-6 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                  {card.icon}
                </div>
                <h3 className="relative text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">{card.title}</h3>
                <p className="relative text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">{card.description}</p>
                <ul className="relative space-y-2 mb-6">
                  {card.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 transform group-hover:scale-110 transition-transform duration-300" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className={`relative ${card.accentColor} w-12 h-1 rounded-full transform transition-all duration-500 ${hoveredCard === idx ? 'w-24 scale-110' : ''}`} />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              How <span className="text-[#667eea] animate-pulse-slow">RawRecruit</span> Works
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Simple, efficient, and designed for results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((section, idx) => (
              <div
                key={idx}
                onClick={() => handleRoleSelect(section.type)}
                className="relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer transform hover:-translate-y-2 group animate-slideUp"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="absolute -top-6 left-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} p-4 text-white shadow-xl transform group-hover:scale-110 transition-transform duration-500`}>
                    {section.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-8 pt-6 group-hover:text-gray-900 transition-colors duration-300">{section.title}</h3>
                <ul className="space-y-5">
                  {section.steps.map((step, stepIdx) => (
                    <li key={stepIdx} className="flex items-start gap-4 group/item">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${section.color} flex items-center justify-center text-white font-bold text-sm transform group-hover/item:scale-110 transition-transform duration-300`}>
                        {stepIdx + 1}
                      </div>
                      <span className="text-gray-600 leading-relaxed group-hover/item:text-gray-800 transition-colors duration-300">{step}</span>
                    </li>
                  ))}
                </ul>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="w-6 h-6 text-gray-400 transform group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {[
            { key: 'company', title: 'For Companies', desc: 'Complete recruitment solutions for your organization' },
            { key: 'college', title: 'For Colleges', desc: 'Enhance placement opportunities for your students' },
            { key: 'employer', title: 'For Employers', desc: 'Independent recruitment management solutions' }
          ].map((section, sectionIdx) => (
            <div key={section.key} className="mb-20 last:mb-0 animate-fadeIn" style={{ animationDelay: `${sectionIdx * 100}ms` }}>
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-10">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                      Tailored Solutions for {section.title.split(' ').pop()}
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      We provide specialized tools and resources designed to optimize your recruitment and placement processes.
                    </p>
                    <button
                      onClick={() => handleRoleSelect(section.key)}
                      className="group relative bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-4 rounded-full font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-[#764ba2] to-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative flex items-center gap-3">
                        Explore {section.title.split(' ').pop()} Features
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {services[section.key].map((service, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleServiceCardClick(section.key, service.title)}
                        className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer transform hover:-translate-y-2 animate-slideUp"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-white/20 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                        <div
                          className="relative w-14 h-14 rounded-xl p-3 mb-4 text-white shadow-md transform group-hover:scale-110 transition-transform duration-500"
                          style={{ background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)` }}
                        >
                          {service.icon}
                        </div>
                        <h3 className="relative text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">{service.title}</h3>
                        <p className="relative text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{service.desc}</p>
                        <div className="relative h-1 w-8 bg-gray-200 rounded-full mt-4 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 animate-shimmer"></div>
                          <div className="h-full w-0 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full group-hover:w-full transition-all duration-500"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center pt-8 border-t border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{section.title}</h3>
                  <p className="text-gray-600">{section.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="about" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeIn">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group transform hover:-translate-y-1 animate-slideUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transform group-hover:scale-x-110 transition-transform duration-500"
                  style={{ backgroundColor: stat.color }}
                />

                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                    style={{
                      backgroundColor: `${stat.color}20`,
                      boxShadow: `0 4px 12px ${stat.color}20`
                    }}
                  >
                    <div className="transform group-hover:scale-110 transition-transform duration-300" style={{ color: stat.color }}>{stat.icon}</div>
                  </div>
                  <div className="text-4xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">{stat.number}</div>
                </div>

                <div className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">{stat.label}</div>

                <div className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all duration-300">
                  {idx === 0 && "Colleges trust our platform"}
                  {idx === 1 && "Active recruiters on platform"}
                  {idx === 2 && "Successful placements yearly"}
                  {idx === 3 && "Client satisfaction score"}
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <button 
                onClick={handleLogoClick}
                className="flex items-center gap-2 mb-6 cursor-pointer group"
              >
                <Rocket className="w-8 h-8 text-[#667eea] transform group-hover:-translate-y-1 transition-transform duration-300" />
                <span className="text-2xl font-bold group-hover:opacity-80 transition-opacity duration-300">RawRecruit</span>
              </button>
              <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                Transforming campus recruitment through innovation and excellence.
              </p>
              <div className="flex gap-4">
                {[FaLinkedinIn].map((Icon, idx) => (
                  <div 
                    key={idx} 
                    className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <Icon className="w-5 h-5 transform hover:scale-110 transition-transform duration-300" />
                  </div>
                ))}
              </div>
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
      `}</style>
    </div>
  );
};

export default App;