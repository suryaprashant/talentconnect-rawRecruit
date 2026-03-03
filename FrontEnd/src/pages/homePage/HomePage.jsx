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
import h1 from "../../assets/ss-company-home--Q8hVb9h.png";
import h2 from "../../assets/ss-student-ClIhnGfc.png";
import h3 from "../../assets/ss-college-home-Ba2ok6X0.png";
import h4 from "../../assets/h4.png";
import h5 from "../../assets/h5.png";
import h6 from "../../assets/h6.png";
import h7 from "../../assets/h7.png";
import h8 from "../../assets/h8.png";
import h9 from "../../assets/h9.png";
import f0 from "../../assets/f0.png";
import f1 from "../../assets/f1.png";
import f2 from "../../assets/f2.png";
import f3 from "../../assets/f3.png";
import f4 from "../../assets/f4.png";
import f5 from "../../assets/f5.png";
import f6 from "../../assets/f6.png";
import { FeatureModal, FEATURE_MODAL_CONFIGS } from "../../components/ui/FeatureModal";

const App = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [activeCard, setActiveCard] = useState("dashboard");

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
  const [featureModalConfig, setFeatureModalConfig] = useState(null);

  const openFeatureModal = (title) => {
    setFeatureModalConfig({ title, ...FEATURE_MODAL_CONFIGS[title] });
  };

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

  const FeatureCard = ({
  image,
  imageBg,
  iconColor,
  iconBg,
  iconPath,
  iconSecondaryPath,
  iconType,
  title,
  description
}) => {

  const renderIcon = () => {
    if (iconType === "chart") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: iconColor }}>
          <line x1="18" x2="18" y1="20" y2="10" />
          <line x1="12" x2="12" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="14" />
        </svg>
      );
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: iconColor }}>
        <path d={iconPath} />
        {iconSecondaryPath && <path d={iconSecondaryPath} />}
      </svg>
    );
  };

  return (
    <div
      className="bg-white rounded-[14px] border border-border overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 mx-auto w-full max-w-[420px]"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ height: "165px", background: imageBg }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(transparent 35%, ${imageBg} 100%)`
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
          style={{ background: iconBg }}
        >
          {renderIcon()}
        </div>

        <h3 className="font-bold text-foreground mb-1 text-[15px]">
          {title}
        </h3>

        <p className="text-muted-foreground leading-relaxed text-[13px]">
          {description}
        </p>
      </div>
    </div>
  );
};

// StepCard Component
const StepCard = ({ stepNumber, arrowPosition, arrowColor, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      
      {/* Step Number Circle */}
      <div 
        className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center font-black text-white text-sm mb-6 shadow-lg"
        style={{ 
          background: stepNumber === "01" 
            ? 'linear-gradient(135deg, #7D3AE9, #9F6EF0)' 
            : stepNumber === "02"
            ? 'linear-gradient(135deg, #EE4499, #F472B7)'
            : 'linear-gradient(135deg, #327DF5, #6AA0FF)'
        }}
      >
        {stepNumber}
      </div>

      {/* Arrow Indicator (Desktop only) */}
      {arrowPosition && arrowColor && (
        <div 
          className="hidden md:block absolute"
          style={{ 
            top: '14px', 
            left: arrowPosition, 
            color: arrowColor, 
            opacity: 0.4 
          }}
        >
          <ArrowRightIcon />
        </div>
      )}

      {/* Card Content */}
      <div 
        className="w-full rounded-2xl border border-border p-7 hover:shadow-lg transition-all duration-300"
        style={{ background: 'white' }}
      >
        <h3 className="font-bold text-foreground mb-3 text-[17px]">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

// Arrow Icon Component
const ArrowRightIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

  // const getTabColor = (tabId) => {
  //   switch(tabId) {
  //     case "company": return "#7D3AE9";
  //     case "college": return "#EE4499";
  //     case "employer": return "#327DF5";
  //     case "candidate": return "#20C55D";
  //     default: return "#7D3AE9";
  //   }
  // };

  // const cardData = {
  //   company: [
  //     { 
  //       id: "dashboard", 
  //       title: "Dashboard Overview", 
  //       description: "View all recruitment activities", 
  //       step: "01",
  //       fullDescription: "Complete overview of all recruitment activities, metrics, and upcoming drives in one place.",
  //       image: f1,
  //       iconColor: "#7D3AE9",
  //       iconBg: "#F0EBFA",
  //       iconPath: "M3 12l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v10H3V12z",
  //     },
  //     { 
  //       id: "jobs", 
  //       title: "Job Postings", 
  //       description: "Manage job listings", 
  //       step: "02",
  //       fullDescription: "Create, edit, and manage job postings with detailed requirements and eligibility criteria.",
  //       image: f2,
  //       iconColor: "#7D3AE9",
  //       iconBg: "#F0EBFA",
  //       iconPath: "M20 7h-4.5A2.5 2.5 0 0 1 13 4.5V3M4 21h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8L9 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"
  //     },
  //     { 
  //       id: "requests", 
  //       title: "Campus Requests", 
  //       description: "Postings by college", 
  //       step: "03",
  //       fullDescription: "Review and manage campus requests from colleges, schedule drives, and coordinate with placement cells.",
  //       image: f5,
  //       iconColor: "#7D3AE9",
  //       iconBg: "#F0EBFA",
  //       iconPath: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 9l5 5 5-5M12 4v10"
  //     },
  //     { 
  //       id: "applications", 
  //       title: "Applications", 
  //       description: "Track candidate applications", 
  //       step: "04",
  //       fullDescription: "Track and manage all incoming applications, filter by criteria, and shortlist candidates.",
  //       image: f3,
  //       iconColor: "#7D3AE9",
  //       iconBg: "#F0EBFA",
  //       iconPath: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"
  //     },
  //     { 
  //       id: "interviews", 
  //       title: "Interviews", 
  //       description: "Schedule and manage interviews", 
  //       step: "05",
  //       fullDescription: "Schedule interviews, send invites, and track interview feedback and outcomes.",
  //       image: f4,
  //       iconColor: "#7D3AE9",
  //       iconBg: "#F0EBFA",
  //       iconPath: "M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9.5M16 2v4M3 10h18M8 2v4"
  //     },
  //     { 
  //       id: "messages", 
  //       title: "Messaging", 
  //       description: "Real time chats", 
  //       step: "06",
  //       fullDescription: "Real-time communication with colleges and candidates, with message history and notifications.",
  //       image: f6,
  //       iconColor: "#7D3AE9",
  //       iconBg: "#F0EBFA",
  //       iconPath: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
  //     },
  //   ],
  //   college: [
  //     { 
  //       id: "dashboard", 
  //       title: "College Dashboard", 
  //       description: "Placement cell overview", 
  //       step: "01",
  //       fullDescription: "Complete placement cell overview with drive schedules, student stats, and company partnerships.",
  //       image: f1,
  //       iconColor: "#EE4499",
  //       iconBg: "#FBEDF5",
  //       iconPath: "M3 12l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v10H3V12z",
  //     },
  //     { 
  //       id: "drives", 
  //       title: "Placement Drives", 
  //       description: "Manage campus drives", 
  //       step: "02",
  //       fullDescription: "Create and manage campus placement drives, invite companies, and track drive progress.",
  //       image: f2,
  //       iconColor: "#EE4499",
  //       iconBg: "#FBEDF5",
  //       iconPath: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-4H7v4M12 7v6M9 10h6"
  //     },
  //     { 
  //       id: "students", 
  //       title: "Student Management", 
  //       description: "Manage student profiles", 
  //       step: "03",
  //       fullDescription: "Manage student profiles, track eligibility, and maintain placement-ready candidate pools.",
  //       image: f3,
  //       iconColor: "#EE4499",
  //       iconBg: "#FBEDF5",
  //       iconPath: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
  //     },
  //     { 
  //       id: "companies", 
  //       title: "Company Relations", 
  //       description: "Partner companies", 
  //       step: "04",
  //       fullDescription: "Manage company partnerships, track engagement, and maintain relationships with recruiters.",
  //       image: f4,
  //       iconColor: "#EE4499",
  //       iconBg: "#FBEDF5",
  //       iconPath: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0"
  //     },
  //     { 
  //       id: "reports", 
  //       title: "Placement Reports", 
  //       description: "Track placement stats", 
  //       step: "05",
  //       fullDescription: "Generate placement reports, track metrics, and analyze placement performance over time.",
  //       image: f5,
  //       iconColor: "#EE4499",
  //       iconBg: "#FBEDF5",
  //       iconPath: "M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2M3 21h18M12 7v10M8 7v10M16 7v10"
  //     },
  //     { 
  //       id: "calendar", 
  //       title: "Event Calendar", 
  //       description: "Schedule placements", 
  //       step: "06",
  //       fullDescription: "Schedule placement events, interviews, and drive activities with calendar integration.",
  //       image: f6,
  //       iconColor: "#EE4499",
  //       iconBg: "#FBEDF5",
  //       iconPath: "M8 2v4M16 2v4M3 10h18M21 14v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"
  //     },
  //   ],
  //   employer: [
  //     { 
  //       id: "dashboard", 
  //       title: "Employer Dashboard", 
  //       description: "Complete hiring overview", 
  //       step: "01",
  //       fullDescription: "Complete hiring dashboard with job postings, candidate pipelines, and hiring metrics.",
  //       image: f1,
  //       iconColor: "#327DF5",
  //       iconBg: "#E9F0FB",
  //       iconPath: "M3 12l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v10H3V12z",
  //     },
  //     { 
  //       id: "postings", 
  //       title: "Job Postings", 
  //       description: "Create & manage jobs", 
  //       step: "02",
  //       fullDescription: "Create and manage job postings, set requirements, and track application volumes.",
  //       image: f2,
  //       iconColor: "#327DF5",
  //       iconBg: "#E9F0FB",
  //       iconPath: "M20 7h-4.5A2.5 2.5 0 0 1 13 4.5V3M4 21h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8L9 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"
  //     },
  //     { 
  //       id: "candidates", 
  //       title: "Candidate Search", 
  //       description: "Find matching profiles", 
  //       step: "03",
  //       fullDescription: "Search and filter candidate profiles, save searches, and shortlist potential hires.",
  //       image: f3,
  //       iconColor: "#327DF5",
  //       iconBg: "#E9F0FB",
  //       iconPath: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0"
  //     },
  //     { 
  //       id: "applications", 
  //       title: "Applications", 
  //       description: "Review applicants", 
  //       step: "04",
  //       fullDescription: "Review incoming applications, filter by criteria, and move candidates through pipeline.",
  //       image: f4,
  //       iconColor: "#327DF5",
  //       iconBg: "#E9F0FB",
  //       iconPath: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"
  //     },
  //     { 
  //       id: "interviews", 
  //       title: "Interviews", 
  //       description: "Schedule & track", 
  //       step: "05",
  //       fullDescription: "Schedule interviews, send calendar invites, and track interview feedback.",
  //       image: f5,
  //       iconColor: "#327DF5",
  //       iconBg: "#E9F0FB",
  //       iconPath: "M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9.5M16 2v4M3 10h18M8 2v4"
  //     },
  //     { 
  //       id: "offers", 
  //       title: "Offer Management", 
  //       description: "Send & track offers", 
  //       step: "06",
  //       fullDescription: "Create and send offer letters, track acceptance rates, and manage offer negotiations.",
  //       image: f6,
  //       iconColor: "#327DF5",
  //       iconBg: "#E9F0FB",
  //       iconPath: "M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9.5M9 12h6M12 9v6"
  //     },
  //   ],
  //   candidate: [
  //     { 
  //       id: "dashboard", 
  //       title: "Candidate Dashboard", 
  //       description: "Personalized overview", 
  //       step: "01",
  //       fullDescription: "Personalized dashboard with job recommendations, application status, and upcoming interviews.",
  //       image: f1,
  //       iconColor: "#20C55D",
  //       iconBg: "#EBFAF0",
  //       iconPath: "M3 12l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v10H3V12z",
  //     },
  //     { 
  //       id: "offcampus", 
  //       title: "Off-Campus Jobs", 
  //       description: "Browse off-campus openings", 
  //       step: "02",
  //       fullDescription: "Browse and apply to off-campus job openings from partner companies.",
  //       image: f2,
  //       iconColor: "#20C55D",
  //       iconBg: "#EBFAF0",
  //       iconPath: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20M12 2v20"
  //     },
  //     { 
  //       id: "internships", 
  //       title: "Internships", 
  //       description: "Find internship opportunities", 
  //       step: "03",
  //       fullDescription: "Discover and apply to internship opportunities matching your profile and interests.",
  //       image: f3,
  //       iconColor: "#20C55D",
  //       iconBg: "#EBFAF0",
  //       iconPath: "M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
  //     },
  //     { 
  //       id: "applications", 
  //       title: "My Applications", 
  //       description: "Track application status", 
  //       step: "04",
  //       fullDescription: "Track all your job applications, view status updates, and manage responses.",
  //       image: f4,
  //       iconColor: "#20C55D",
  //       iconBg: "#EBFAF0",
  //       iconPath: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"
  //     },
  //     { 
  //       id: "interviews", 
  //       title: "My Interviews", 
  //       description: "Upcoming interviews", 
  //       step: "05",
  //       fullDescription: "View and manage upcoming interviews, get reminders, and access interview details.",
  //       image: f5,
  //       iconColor: "#20C55D",
  //       iconBg: "#EBFAF0",
  //       iconPath: "M8 7h.01M12 7h.01M16 7h.01M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9.5M3 10h18"
  //     },
  //     { 
  //       id: "chats", 
  //       title: "Messages", 
  //       description: "Chat with recruiters", 
  //       step: "06",
  //       fullDescription: "Real-time chat with recruiters and placement coordinators, get updates and ask questions.",
  //       image: f6,
  //       iconColor: "#20C55D",
  //       iconBg: "#EBFAF0",
  //       iconPath: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
  //     },
  //   ],
  // };

  // const getImageForActiveCard = () => {
  //   const card = cardData[activeTab]?.find(c => c.id === activeCard);
  //   return card?.image || f1;
  // };

  // const getActiveTitle = () => {
  //   const card = cardData[activeTab]?.find(c => c.id === activeCard);
  //   return card?.title || "Dashboard";
  // };

  // const getActiveDescription = () => {
  //   const card = cardData[activeTab]?.find(c => c.id === activeCard);
  //   return card?.fullDescription || card?.description || "";
  // };

  // const renderStepCard = (card, isActive, tabColor, sectionTab) => {
  //   return (
  //     <button
  //       key={card.id}
  //       onClick={() => {
  //         setActiveTab(sectionTab);
  //         setActiveCard(card.id);
  //       }}
  //       className="text-left rounded-xl p-4 transition-all duration-300 border w-full hover:translate-x-1"
  //       style={{
  //         borderColor: isActive ? tabColor : 'transparent',
  //         backgroundColor: isActive ? `${tabColor}08` : 'transparent',
  //         boxShadow: isActive ? `0 4px 12px ${tabColor}20` : 'none',
  //       }}
  //     >
  //       <div className="flex items-start gap-3">
  //         <span 
  //           className="text-sm font-bold whitespace-nowrap mt-0.5"
  //           style={{ color: tabColor }}
  //         >
  //           {card.step}
  //         </span>
  //         <div className="flex-1">
  //           <h3 
  //             className="text-base font-semibold leading-tight"
  //             style={{ color: '#0f172a' }}
  //           >
  //             {card.title}
  //           </h3>
  //           {isActive && (
  //             <p className="text-sm leading-relaxed mt-2 text-muted-foreground">
  //               {card.fullDescription}
  //             </p>
  //           )}
  //         </div>
  //       </div>
  //     </button>
  //   );
  // };

  const getTabColor = (tabId) => {
    switch(tabId) {
      case "company": return "#7D3AE9";
      case "college": return "#EE4499";
      case "employer": return "#327DF5";
      case "candidate": return "#20C55D";
      default: return "#7D3AE9";
    }
  };

  const cardData = {
    company: [
      { 
        id: "dashboard", 
        title: "Dashboard Overview", 
        description: "View all recruitment activities", 
        fullDescription: "Complete overview of all recruitment activities, metrics, and upcoming drives in one place.",
        step: "01",
        image: h1,
        iconColor: "#7D3AE9",
        iconBg: "#F0EBFA",
        iconPath: "M3 12l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v10H3V12z",
      },
      { 
        id: "jobs", 
        title: "Job Postings", 
        description: "Manage job listings", 
        fullDescription: "Create, edit, and manage job postings with detailed requirements and eligibility criteria.",
        step: "02",
        image: f2,
        iconColor: "#7D3AE9",
        iconBg: "#F0EBFA",
        iconPath: "M20 7h-4.5A2.5 2.5 0 0 1 13 4.5V3M4 21h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8L9 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"
      },
      { 
        id: "requests", 
        title: "Campus Requests", 
        description: "Postings by college", 
        fullDescription: "Review and manage campus requests from colleges, schedule drives, and coordinate with placement cells.",
        step: "03",
        image: h4,
        iconColor: "#7D3AE9",
        iconBg: "#F0EBFA",
        iconPath: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 9l5 5 5-5M12 4v10"
      },
      { 
        id: "applications", 
        title: "Applications", 
        description: "Track candidate applications", 
        fullDescription: "Track and manage all incoming applications, filter by criteria, and shortlist candidates.",
        step: "04",
        image: f5,
        iconColor: "#7D3AE9",
        iconBg: "#F0EBFA",
        iconPath: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"
      },
      { 
        id: "interviews", 
        title: "Interviews", 
        description: "Schedule and manage interviews", 
        fullDescription: "Schedule interviews, send invites, and track interview feedback and outcomes.",
        step: "05",
        image: f4,
        iconColor: "#7D3AE9",
        iconBg: "#F0EBFA",
        iconPath: "M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9.5M16 2v4M3 10h18M8 2v4M12 14h.01M16 14h.01M20 14h.01M8 18h.01M12 18h.01M16 18h.01"
      },
      { 
        id: "messages", 
        title: "Messaging", 
        description: "Real time chats", 
        fullDescription: "Real-time communication with colleges and candidates, with message history and notifications.",
        step: "06",
        image: f6,
        iconColor: "#7D3AE9",
        iconBg: "#F0EBFA",
        iconPath: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      },
    ],
    college: [
      { 
        id: "dashboard", 
        title: "College Dashboard", 
        description: "Placement cell overview", 
        image: h3,
        iconColor: "#EE4499",
        iconBg: "#FBEDF5",
        iconPath: "M3 12l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v10H3V12z",
      },
      { 
        id: "drives", 
        title: "Placement Drives", 
        description: "Manage campus drives", 
        image: h5,
        iconColor: "#EE4499",
        iconBg: "#FBEDF5",
        iconPath: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-4H7v4M12 7v6M9 10h6"
      },
      { 
        id: "students", 
        title: "Student Management", 
        description: "Manage student profiles", 
        image: f4,
        iconColor: "#EE4499",
        iconBg: "#FBEDF5",
        iconPath: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      },
      { 
        id: "companies", 
        title: "Company Relations", 
        description: "Partner companies", 
        image: h6,
        iconColor: "#EE4499",
        iconBg: "#FBEDF5",
        iconPath: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0"
      },
      { 
        id: "reports", 
        title: "Placement Reports", 
        description: "Track placement stats", 
        image: f5,
        iconColor: "#EE4499",
        iconBg: "#FBEDF5",
        iconPath: "M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2M3 21h18M12 7v10M8 7v10M16 7v10"
      },
      { 
        id: "message", 
        title: "Messaging", 
        description: "Real time messaging", 
        image: f6,
        iconColor: "#EE4499",
        iconBg: "#FBEDF5",
        iconPath: "M8 2v4M16 2v4M3 10h18M21 14v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"
      },
    ],
    employer: [
      { 
        id: "dashboard", 
        title: "Employer Dashboard", 
        description: "Complete hiring overview", 
        image: h1,
        iconColor: "#327DF5",
        iconBg: "#E9F0FB",
        iconPath: "M3 12l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v10H3V12z",
      },
      { 
        id: "postings", 
        title: "Job Postings", 
        description: "Create & manage jobs", 
        image: f0,
        iconColor: "#327DF5",
        iconBg: "#E9F0FB",
        iconPath: "M20 7h-4.5A2.5 2.5 0 0 1 13 4.5V3M4 21h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8L9 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"
      },
      { 
        id: "candidates", 
        title: "Candidate Search", 
        description: "Find matching profiles", 
        image: f3,
        iconColor: "#327DF5",
        iconBg: "#E9F0FB",
        iconPath: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0"
      },
      { 
        id: "applications", 
        title: "Applications", 
        description: "Review applicants", 
        image: f5,
        iconColor: "#327DF5",
        iconBg: "#E9F0FB",
        iconPath: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"
      },
      { 
        id: "chat", 
        title: "Messaging", 
        description: "Real time messaging", 
        image: f6,
        iconColor: "#327DF5",
        iconBg: "#E9F0FB",
        iconPath: "M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9.5M16 2v4M3 10h18M8 2v4"
      },
      { 
        id: "offers", 
        title: "Offer Management", 
        description: "Send & track offers", 
        image: f4,
        iconColor: "#327DF5",
        iconBg: "#E9F0FB",
        iconPath: "M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9.5M9 12h6M12 9v6"
      },
    ],
    candidate: [
      { 
        id: "dashboard", 
        title: "Candidate Dashboard", 
        description: "Personalized overview", 
        image: h7,
        iconColor: "#20C55D",
        iconBg: "#EBFAF0",
        iconPath: "M3 12l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v10H3V12z",
      },
      { 
        id: "offcampus", 
        title: "Off-Campus Jobs", 
        description: "Browse off-campus openings", 
        image: h8,
        iconColor: "#20C55D",
        iconBg: "#EBFAF0",
        iconPath: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20M12 2v20"
      },
      { 
        id: "internships", 
        title: "Internships", 
        description: "Find internship opportunities", 
        image: h9,
        iconColor: "#20C55D",
        iconBg: "#EBFAF0",
        iconPath: "M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
      },
      { 
        id: "applications", 
        title: "My Applications", 
        description: "Track application status", 
        image: f4,
        iconColor: "#20C55D",
        iconBg: "#EBFAF0",
        iconPath: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"
      },
      { 
        id: "interviews", 
        title: "My Interviews", 
        description: "Upcoming interviews", 
        image: f5,
        iconColor: "#20C55D",
        iconBg: "#EBFAF0",
        iconPath: "M8 7h.01M12 7h.01M16 7h.01M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9.5M3 10h18"
      },
      { 
        id: "chats", 
        title: "Messages", 
        description: "Chat with recruiters", 
        image: f6,
        iconColor: "#20C55D",
        iconBg: "#EBFAF0",
        iconPath: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      },
    ],
  };

  const getImageForActiveCard = () => {
    const card = cardData[activeTab]?.find(c => c.id === activeCard);
    return card?.image || f1;
  };

  const getActiveTitle = () => {
    const card = cardData[activeTab]?.find(c => c.id === activeCard);
    return card?.title || "Dashboard";
  };

  // Style 1: Step Cards (for Company)
  const renderStepCard = (card, isActive, tabColor) => {
    return (
      <button
        key={card.id}
        onClick={() => {
          setActiveTab("company");
          setActiveCard(card.id);
        }}
        className="text-left rounded-xl p-4 transition-all duration-300 border w-full hover:translate-x-1"
        style={{
          borderColor: isActive ? tabColor : 'transparent',
          backgroundColor: isActive ? `${tabColor}08` : 'transparent',
          boxShadow: isActive ? `0 4px 12px ${tabColor}20` : 'none',
        }}
      >
        <div className="flex items-start gap-3">
          <span 
            className="text-sm font-bold whitespace-nowrap mt-0.5"
            style={{ color: tabColor }}
          >
            {card.step}
          </span>
          <div className="flex-1">
            <h3 
              className="text-base font-semibold leading-tight"
              style={{ color: '#0f172a' }}
            >
              {card.title}
            </h3>
            {isActive && (
              <p className="text-sm leading-relaxed mt-2 text-muted-foreground">
                {card.fullDescription}
              </p>
            )}
          </div>
        </div>
      </button>
    );
  };

  // Style 2: Square Cards (for College)
  const renderSquareCard = (card, isActive, tabColor) => {
    return (
      <div
        key={card.id}
        onClick={() => {
          setActiveTab("college");
          setActiveCard(card.id);
        }}
        className="bg-white rounded-xl border p-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col justify-start"
        style={{
          height: 'calc((450px - 12px) / 3)',
          borderColor: tabColor,
          backgroundColor: isActive ? tabColor : 'white',
          boxShadow: isActive ? `0 8px 20px -5px ${tabColor}30` : 'var(--shadow-sm)',
        }}
      >
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-all duration-300"
          style={{ background: isActive ? 'white' : card.iconBg }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ color: isActive ? tabColor : card.iconColor }}
          >
            <path d={card.iconPath}></path>
          </svg>
        </div>
        <h3 
          className="font-semibold text-xs mb-1 leading-tight transition-all duration-300"
          style={{ color: isActive ? 'white' : '#0f172a' }}
        >
          {card.title}
        </h3>
        <p 
          className="text-[10px] leading-tight line-clamp-2 transition-all duration-300"
          style={{ color: isActive ? 'rgba(255,255,255,0.9)' : '#64748b' }}
        >
          {card.description}
        </p>
      </div>
    );
  };

  // Style 3: Pill Card (for Employer & Candidate)
  const renderPillCard = (card, isActive, tabColor, section) => {
    return (
      <button
        key={card.id}
        onClick={() => {
          setActiveTab(section);
          setActiveCard(card.id);
        }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-1 whitespace-nowrap"
        style={{
          background: isActive ? tabColor : 'white',
          border: `1px solid ${tabColor}`,
          boxShadow: isActive ? `0 8px 20px -5px ${tabColor}40` : 'var(--shadow-sm)',
        }}
      >
        <div 
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: card.iconBg }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ color: card.iconColor }}
          >
            <path d={card.iconPath}></path>
          </svg>
        </div>
        <span 
          className="text-xs font-medium"
          style={{ color: isActive ? 'white' : '#1e293b' }}
        >
          {card.title}
        </span>
      </button>
    );
  };

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
        <header 
  className="fixed top-0 left-0 right-0 z-50"
  style={{ 
    height: '80px', 
    background: 'rgba(255, 255, 255, 0.85)', 
    backdropFilter: 'blur(16px)', 
    boxShadow: 'rgba(0, 0, 0, 0.04) 0px 2px 10px', 
    borderBottom: '1px solid rgba(225, 231, 239, 0.8)'
  }}
>
  <div className="container-xl h-full flex items-center justify-between px-16 md:px-18 lg:px-20">
    
    {/* Logo - With left spacing */}
    <button 
      onClick={handleLogoClick}
      className="flex items-center gap-3 flex-shrink-0 focus:outline-none ml-1 md:ml-0"
    >
      <img 
        src={heroImage} 
        alt="RawRecruit Logo" 
        className="h-14 w-auto object-contain"
      />
    </button>

    {/* Desktop Navigation - Hidden on mobile, shown on xl screens */}
    <nav className="hidden xl:flex items-center gap-1">
      {['Services', 'How It Works', 'Features', 'About'].map((item) => (
        <a
          key={item}
          href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
          className="px-4 py-2.5 text-[16px] font-medium text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50/60 transition-all duration-150"
        >
          {item}
        </a>
      ))}
    </nav>

    {/* Desktop Get Started Button - With right spacing */}
    <div className="hidden xl:flex items-center mr-1 md:mr-0">
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
    </div>

    {/* Mobile Menu Button - Shown only on smaller screens */}
    <button
      className="xl:hidden p-3 rounded-lg text-gray-600 hover:bg-purple-50 transition-colors mr-1 md:mr-0"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  </div>

  {/* Mobile Menu Dropdown */}
  {mobileMenuOpen && (
    <div className="xl:hidden absolute top-full left-0 right-0 mt-1 px-4 md:px-6 lg:px-8 animate-slideDown">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border border-white/40 shadow-xl mx-1 md:mx-0">
        <div className="flex flex-col gap-1">
          {['Services', 'How It Works', 'Features', 'About'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 py-3.5 px-4 text-[16px] rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          
          {/* Mobile Get Started Button - Original styling */}
          <button
            onClick={() => {
              handleGetStarted();
              setMobileMenuOpen(false);
            }}
            className="relative group w-full mt-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-blue-600 group-hover:to-purple-700 text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg w-full">
              <span className="flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
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
  {/* Hero Background Elements - keep these for visual interest */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
  </div>

  <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
    <div className="grid lg:grid-cols-2 gap-16 items-center">

      {/* ================= LEFT SIDE ================= */}
      <div>

        {/* Top Label */}
        <p className="text-sm tracking-widest text-purple-600 font-semibold mb-6">
          TRUSTED CAMPUS RECRUITMENT PLATFORM
        </p>

        {/* Heading */}
        <h1 className="text-5xl md:text-5xl font-bold leading-tight mb-8">
          <span className="text-[#0f172a]">
            The Operating System
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            for Campus Recruitment
          </span>
        </h1>

        {/* Paragraph */}
<p className="text-gray-600 text-lg leading-relaxed mb-4 max-w-[520px]">
  Connect Colleges, Companies, and Students in One Unified
  Recruitment Platform.
</p>

<p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-[520px]">
  Run On-Campus Drives, Pool Hiring, Off-Campus Hiring, and
  Internships — all from a single system.
</p>

        {/* Single CTA */}
        <button
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <span className="flex items-center gap-3">
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </span>
        </button>

        <div className="mt-14 flex items-center gap-4 max-w-5xl">

  <div className="flex items-center gap-3">
    <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-purple-500 text-purple-600 text-xs font-bold">
      ✓
    </div>
    <p className="text-gray-700 text-sm whitespace-nowrap">
      <span className="font-semibold text-gray-900">50+</span> Partner Colleges
    </p>
  </div>

  <div className="flex items-center gap-3">
    <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-purple-500 text-purple-600 text-xs font-bold">
      ✓
    </div>
    <p className="text-gray-700 text-sm whitespace-nowrap">
      <span className="font-semibold text-gray-900">100+</span> Companies
    </p>
  </div>

  <div className="flex items-center gap-3">
    <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-purple-500 text-purple-600 text-xs font-bold">
      ✓
    </div>
    <p className="text-gray-700 text-sm whitespace-nowrap">
      <span className="font-semibold text-gray-900">3,000+</span> Students Placed
    </p>
  </div>

  <div className="flex items-center gap-3">
    <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-purple-500 text-purple-600 text-xs font-bold">
      ✓
    </div>
    <p className="text-gray-700 text-sm whitespace-nowrap">
      <span className="font-semibold text-gray-900">95%</span> Satisfaction Rate
    </p>
  </div>

</div>

      </div>


      {/* ================= RIGHT SIDE ================= */}
      <div className="relative h-[550px] flex items-center justify-center">

  {/* H1 – Top Center */}
  <img
    src={h1}
    alt="Company Dashboard"
    className="absolute top-0 z-30 w-[90%] rounded-2xl shadow-2xl border border-gray-200 float-slow"
  />

  {/* H2 – Left Middle */}
  <img
    src={h2}
    alt="Student Dashboard"
    className="absolute top-48 left-0 z-20 w-[92%] rounded-2xl shadow-2xl border border-gray-200 float-slower"
  />

  {/* H3 – Bottom Right */}
  <img
    src={h3}
    alt="College Dashboard"
    className="absolute bottom-8 right-0 z-10 w-[92%] rounded-2xl shadow-2xl border border-gray-200 float-slowest"
  />

</div>

    </div>
  </div>
</div>

            {/* Partners Section */}
<div className="w-full overflow-hidden py-0">

  {/* Heading */}
  <div className="text-center mb-8">
    <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
      Trusted by Leading Institutions and Companies
    </span>
  </div>

  {/* ===== COMPANY MARQUEE ===== */}
  <div className="relative w-full overflow-hidden">
    <div className="marquee-container">
      {/* Removed white gradient overlays */}
      
      <div className="marquee">
        <div className="marquee-track">
          {[...Array(3)].map((_, loopIndex) => (
            <div key={loopIndex} className="marquee-content">
              {["Google", "Microsoft", "Amazon", "Meta", "Apple", "Adobe", "Netflix", "Salesforce"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 whitespace-nowrap mx-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-sm font-semibold">
                    {item.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>

  {/* ===== COLLEGE MARQUEE ===== */}
  <div className="relative w-full overflow-hidden mt-8">
    <div className="marquee-container">
      {/* Removed white gradient overlays */}
      
      <div className="marquee reverse">
        <div className="marquee-track">
          {[...Array(3)].map((_, loopIndex) => (
            <div key={loopIndex} className="marquee-content">
              {[
                "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kharagpur",
                "BITS Pilani", "NIT Trichy", "IIM Ahmedabad", "IIM Bangalore",
                "IIT Kanpur", "NIT Surathkal"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 whitespace-nowrap mx-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-sm font-semibold">
                    {item.split(' ').map(word => word.charAt(0)).join('')}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>

  {/* Animation Styles */}
  <style jsx>{`
    .marquee-container {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .marquee {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .marquee-track {
      display: flex;
      width: max-content;
      animation: scroll 35s linear infinite;
    }

    .marquee.reverse .marquee-track {
      animation: scroll-reverse 35s linear infinite;
    }

    .marquee-content {
      display: flex;
      gap: 0rem;
      padding-right: 0rem;
    }

    @keyframes scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-33.33%); }
    }

    @keyframes scroll-reverse {
      from { transform: translateX(-33.33%); }
      to { transform: translateX(0); }
    }
  `}</style>

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

        {/* Platform Overview */}
<section 
  ref={howItWorksRef}
  id="how-it-works" 
  className="relative px-6 py-20"
>
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-20">

  {/* Small Top Label */}
  <p className="text-sm font-semibold tracking-widest uppercase text-purple-600 mb-6">
    PLATFORM OVERVIEW
  </p>

  {/* Main Heading */}
  <h2 className="text-4xl md:text-4xl font-bold mb-6 leading-tight">
    <span className="text-[#0f172a]">
      One Platform.
    </span>{" "}
    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
      Three Powerful Interfaces.
    </span>
  </h2>

  {/* Sub Text */}
  <p className="text-gray-500 text-lg md:text-xl max-w-3xl mx-auto">
    Designed for Colleges, Companies, and Students
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

<section
        id="features"
        className="section-pad"
        style={{ background: "linear-gradient(180deg, #F6F3FC 0%, #F8FAFC 100%)" }}
      >
        <div className="container-xl">
          {/* Section Header */}
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-purple-600 mb-6">
              CORE FEATURES
            </p>
            <h2 className="font-bold text-foreground mb-4 text-[clamp(28px,4vw,40px)] leading-[1.2] tracking-[-0.02em] text-[#0f172a]">
              Everything Needed to Run{" "}
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">
                Campus Recruitment
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Proven tools for every stakeholder — built for real recruitment operations at scale.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

            <div className="cursor-pointer" onClick={() => openFeatureModal("On-Campus Recruitment")}>
              <FeatureCard
                image={f0} imageBg="#F0EBFA" iconColor="#7D3AE9" iconBg="#F0EBFA"
                iconPath="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
                iconSecondaryPath="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"
                title="On-Campus Recruitment"
                description="Colleges publish on-campus drives; companies discover and apply. Manage the entire drive lifecycle from a single dashboard."
              />
            </div>

            <div className="cursor-pointer" onClick={() => openFeatureModal("Pool Campus Recruitment")}>
              <FeatureCard
                image={f1} imageBg="#FBEDF5" iconColor="#EE4499" iconBg="#FBEDF5"
                iconPath="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                iconSecondaryPath="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                title="Pool Campus Recruitment"
                description="Run multi-college hiring drives. Pool multiple institutions and source from a wider talent pool efficiently."
              />
            </div>

            <div className="cursor-pointer" onClick={() => openFeatureModal("Off-Campus Recruitment")}>
              <FeatureCard
                image={f2} imageBg="#E9F0FB" iconColor="#327DF5" iconBg="#E9F0FB"
                iconPath="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20 M2 12h20"
                iconSecondaryPath="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                title="Off-Campus Recruitment"
                description="Post jobs visible to students across all partner colleges. Off-campus hiring made structured and trackable."
              />
            </div>

            <div className="cursor-pointer" onClick={() => openFeatureModal("Internship Management")}>
              <FeatureCard
                image={f4} imageBg="#EBFAF0" iconColor="#20C55D" iconBg="#EBFAF0"
                iconPath="M12 7v14 M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
                title="Internship Management"
                description="Post and manage internship opportunities. Students discover, apply, and track status — all in one place."
              />
            </div>

            <div className="cursor-pointer" onClick={() => openFeatureModal("Application Tracking System")}>
              <FeatureCard
                image={f5} imageBg="#FCF4E8" iconColor="#F49D25" iconBg="#FCF4E8"
                iconPath="M18 20V10 M12 20V4 M6 20V14"
                iconType="chart"
                title="Application Tracking System"
                description="Complete pipeline visibility — Applied, Shortlisted, Accepted, Rejected. Real-time status for every stakeholder."
              />
            </div>

            <div className="cursor-pointer" onClick={() => openFeatureModal("Real-time Messaging System")}>
              <FeatureCard
                image={f6} imageBg="#F0EBFA" iconColor="#7D3AE9" iconBg="#F0EBFA"
                iconPath="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                title="Real-time Messaging System"
                description="Built-in chat connects HR teams with colleges and students directly. No external tools needed."
              />
            </div>

          </div>
        </div>
      </section>
      

        {/* <section className="section-pad pt-20" style={{ background: 'linear-gradient(180deg, #F6F3FC 0%, #F8FAFC 100%)' }}>
      <div className="container-xl max-w-7xl mx-auto px-4">
        
        Section Header
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase text-purple-600 mb-6">
            HOW RAWRECRUIT WORKS
          </p>
          <h2 className="font-bold text-foreground mb-4 text-[clamp(28px,4vw,40px)] leading-[1.2] tracking-[-0.02em] text-[#0f172a]">
            Built for Real{" "}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">
              Recruitment Operations
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every interface purpose-built for its user.
          </p>
        </div>

        FOR COMPANIES SECTION
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">For Companies</h3>
          <div className="grid md:grid-cols-12 gap-6 items-start">
            Left Half - Step Cards
            <div className="md:col-span-4">
              <div className="flex flex-col gap-3">
                {cardData.company?.map((card) => {
                  const isActive = activeTab === "company" && activeCard === card.id;
                  return renderStepCard(card, isActive, getTabColor("company"), "company");
                })}
              </div>
            </div>

            Right Half - Image Display
            <div className="md:col-span-8">
              <div className="relative rounded-2xl overflow-hidden border border-border" style={{ boxShadow: 'var(--shadow-xl)' }}>
                MacOS-style window bar
                <div className="flex items-center gap-1.5 px-4" style={{ height: '36px', background: '#040f2a' }}>
                  <span className="w-3 h-3 rounded-full bg-red-500 opacity-80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500 opacity-80"></span>
                  <div className="ml-4 flex-1 max-w-xs rounded-md flex items-center px-3" style={{ height: '22px', background: '#061946' }}>
                    <span className="text-white/40 text-[10px] font-mono truncate">
                      rawrecruit.in — {activeTab === "company" ? getActiveTitle() : "Company Dashboard"}
                    </span>
                  </div>
                </div>

                Image Container
                <div className="relative overflow-hidden" style={{ maxHeight: '520px' }}>
                  <img 
                    src={activeTab === "company" ? getImageForActiveCard() : f1} 
                    alt="Company Dashboard" 
                    className="w-full h-auto object-top object-cover transition-all duration-300"
                    style={{ animation: 'fade-up 0.3s ease-out' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        FOR COLLEGES SECTION - Image Left, Cards Right
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">For Colleges</h3>
          <div className="grid md:grid-cols-12 gap-6 items-start">
            Left Half - Image Display
            <div className="md:col-span-8">
              <div className="relative rounded-2xl overflow-hidden border border-border" style={{ boxShadow: 'var(--shadow-xl)' }}>
                MacOS-style window bar
                <div className="flex items-center gap-1.5 px-4" style={{ height: '36px', background: '#040f2a' }}>
                  <span className="w-3 h-3 rounded-full bg-red-500 opacity-80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500 opacity-80"></span>
                  <div className="ml-4 flex-1 max-w-xs rounded-md flex items-center px-3" style={{ height: '22px', background: '#061946' }}>
                    <span className="text-white/40 text-[10px] font-mono truncate">
                      rawrecruit.in — {activeTab === "college" ? getActiveTitle() : "College Dashboard"}
                    </span>
                  </div>
                </div>

                Image Container
                <div className="relative overflow-hidden" style={{ maxHeight: '520px' }}>
                  <img 
                    src={activeTab === "college" ? getImageForActiveCard() : f1} 
                    alt="College Dashboard" 
                    className="w-full h-auto object-top object-cover transition-all duration-300"
                    style={{ animation: 'fade-up 0.3s ease-out' }}
                  />
                </div>
              </div>
            </div>

            Right Half - Step Cards
            <div className="md:col-span-4">
              <div className="flex flex-col gap-3">
                {cardData.college?.map((card) => {
                  const isActive = activeTab === "college" && activeCard === card.id;
                  return renderStepCard(card, isActive, getTabColor("college"), "college");
                })}
              </div>
            </div>
          </div>
        </div>

        FOR EMPLOYERS SECTION - Cards Left, Image Right
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">For Employers</h3>
          <div className="grid md:grid-cols-12 gap-6 items-start">
            Left Half - Step Cards
            <div className="md:col-span-4">
              <div className="flex flex-col gap-3">
                {cardData.employer?.map((card) => {
                  const isActive = activeTab === "employer" && activeCard === card.id;
                  return renderStepCard(card, isActive, getTabColor("employer"), "employer");
                })}
              </div>
            </div>

            Right Half - Image Display
            <div className="md:col-span-8">
              <div className="relative rounded-2xl overflow-hidden border border-border" style={{ boxShadow: 'var(--shadow-xl)' }}>
                MacOS-style window bar
                <div className="flex items-center gap-1.5 px-4" style={{ height: '36px', background: '#040f2a' }}>
                  <span className="w-3 h-3 rounded-full bg-red-500 opacity-80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500 opacity-80"></span>
                  <div className="ml-4 flex-1 max-w-xs rounded-md flex items-center px-3" style={{ height: '22px', background: '#061946' }}>
                    <span className="text-white/40 text-[10px] font-mono truncate">
                      rawrecruit.in — {activeTab === "employer" ? getActiveTitle() : "Employer Dashboard"}
                    </span>
                  </div>
                </div>

                Image Container
                <div className="relative overflow-hidden" style={{ maxHeight: '520px' }}>
                  <img 
                    src={activeTab === "employer" ? getImageForActiveCard() : f1} 
                    alt="Employer Dashboard" 
                    className="w-full h-auto object-top object-cover transition-all duration-300"
                    style={{ animation: 'fade-up 0.3s ease-out' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        FOR CANDIDATES SECTION - Image Left, Cards Right
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">For Candidates</h3>
          <div className="grid md:grid-cols-12 gap-6 items-start">
            Left Half - Image Display
            <div className="md:col-span-8">
              <div className="relative rounded-2xl overflow-hidden border border-border" style={{ boxShadow: 'var(--shadow-xl)' }}>
                MacOS-style window bar
                <div className="flex items-center gap-1.5 px-4" style={{ height: '36px', background: '#040f2a' }}>
                  <span className="w-3 h-3 rounded-full bg-red-500 opacity-80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500 opacity-80"></span>
                  <div className="ml-4 flex-1 max-w-xs rounded-md flex items-center px-3" style={{ height: '22px', background: '#061946' }}>
                    <span className="text-white/40 text-[10px] font-mono truncate">
                      rawrecruit.in — {activeTab === "candidate" ? getActiveTitle() : "Candidate Dashboard"}
                    </span>
                  </div>
                </div>

                Image Container
                <div className="relative overflow-hidden" style={{ maxHeight: '520px' }}>
                  <img 
                    src={activeTab === "candidate" ? getImageForActiveCard() : f1} 
                    alt="Candidate Dashboard" 
                    className="w-full h-auto object-top object-cover transition-all duration-300"
                    style={{ animation: 'fade-up 0.3s ease-out' }}
                  />
                </div>
              </div>
            </div>

            Right Half - Step Cards
            <div className="md:col-span-4">
              <div className="flex flex-col gap-3">
                {cardData.candidate?.map((card) => {
                  const isActive = activeTab === "candidate" && activeCard === card.id;
                  return renderStepCard(card, isActive, getTabColor("candidate"), "candidate");
                })}
              </div>
            </div>
          </div>
        </div>

        Animation Styles
        <style jsx>{`
          @keyframes fade-up {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </section> */}

    <section className="section-pad pt-20" style={{ background: 'linear-gradient(180deg, #F6F3FC 0%, #F8FAFC 100%)' }}>
      <div className="container-xl max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase text-purple-600 mb-6">
            HOW RAWRECRUIT WORKS
          </p>
          <h2 className="font-bold text-foreground mb-4 text-[clamp(28px,4vw,40px)] leading-[1.2] tracking-[-0.02em] text-[#0f172a]">
            Built for Real{" "}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">
              Recruitment Operations
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every interface purpose-built for its user.
          </p>
        </div>

        {/* FOR COMPANIES - Step Cards on Left */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">For Companies</h3>
          <div className="grid md:grid-cols-12 gap-6 items-start">
            {/* Left Half - Step Cards */}
            <div className="md:col-span-4">
              <div className="flex flex-col gap-2">
                {cardData.company?.map((card) => {
                  const isActive = activeTab === "company" && activeCard === card.id;
                  return renderStepCard(card, isActive, getTabColor("company"));
                })}
              </div>
            </div>

            {/* Right Half - Image Display */}
            <div className="md:col-span-8">
              <div
                className="relative rounded-2xl overflow-hidden border border-border cursor-pointer"
                style={{ boxShadow: "var(--shadow-xl)" }}
                onClick={() => openFeatureModal("How It Works - Companies")}
              >
                <div className="flex items-center gap-1.5 px-4" style={{ height: '36px', background: '#040f2a' }}>
                  <span className="w-3 h-3 rounded-full bg-red-500 opacity-80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500 opacity-80"></span>
                  <div className="ml-4 flex-1 max-w-xs rounded-md flex items-center px-3" style={{ height: '22px', background: '#061946' }}>
                    <span className="text-white/40 text-[10px] font-mono truncate">
                      rawrecruit.in — {activeTab === "company" ? getActiveTitle() : "Company Dashboard"}
                    </span>
                  </div>
                </div>
                <div className="relative overflow-hidden" style={{ maxHeight: '520px' }}>
                  <img 
                    src={activeTab === "company" ? getImageForActiveCard() : f1} 
                    alt="Company Dashboard" 
                    className="w-full h-auto object-top object-cover transition-all duration-300"
                    style={{ animation: 'fade-up 0.3s ease-out' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOR COLLEGES - Square Cards on Left */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">For Colleges</h3>
          <div className="grid md:grid-cols-12 gap-6 items-start">
            {/* Left Half - Square Cards */}
            <div className="md:col-span-4">
              <div className="grid grid-cols-2 gap-3 h-full max-h-[450px]">
                {cardData.college?.map((card) => {
                  const isActive = activeTab === "college" && activeCard === card.id;
                  return renderSquareCard(card, isActive, getTabColor("college"));
                })}
              </div>
            </div>

            {/* Right Half - Image Display */}
            <div className="md:col-span-8">
              <div
                className="relative rounded-2xl overflow-hidden border border-border cursor-pointer"
                style={{ boxShadow: "var(--shadow-xl)" }}
                onClick={() => openFeatureModal("How It Works - Colleges")}
              >
                <div className="flex items-center gap-1.5 px-4" style={{ height: '36px', background: '#040f2a' }}>
                  <span className="w-3 h-3 rounded-full bg-red-500 opacity-80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500 opacity-80"></span>
                  <div className="ml-4 flex-1 max-w-xs rounded-md flex items-center px-3" style={{ height: '22px', background: '#061946' }}>
                    <span className="text-white/40 text-[10px] font-mono truncate">
                      rawrecruit.in — {activeTab === "college" ? getActiveTitle() : "College Dashboard"}
                    </span>
                  </div>
                </div>
                <div className="relative overflow-hidden" style={{ maxHeight: '520px' }}>
                  <img 
                    src={activeTab === "college" ? getImageForActiveCard() : f1} 
                    alt="College Dashboard" 
                    className="w-full h-auto object-top object-cover transition-all duration-300"
                    style={{ animation: 'fade-up 0.3s ease-out' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOR EMPLOYERS - Pill Cards Row */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">For Employers</h3>
          <div className="flex flex-col items-center">
            {/* Pill cards row with arrows */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {cardData.employer?.map((card, index) => {
                const isActive = activeTab === "employer" && activeCard === card.id;
                return (
                  <div key={card.id} className="flex items-center">
                    {renderPillCard(card, isActive, getTabColor("employer"), "employer")}
                    {index < cardData.employer.length - 1 && (
                      <div className="mx-1 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Image Display */}
            <div
              className="relative rounded-2xl overflow-hidden border border-border w-full max-w-5xl mx-auto cursor-pointer"
              style={{ boxShadow: "var(--shadow-xl)" }}
              onClick={() => openFeatureModal("How It Works - Employers")}
            >
              <div className="flex items-center gap-1.5 px-4" style={{ height: '36px', background: '#040f2a' }}>
                <span className="w-3 h-3 rounded-full bg-red-500 opacity-80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500 opacity-80"></span>
                <div className="ml-4 flex-1 max-w-xs rounded-md flex items-center px-3" style={{ height: '22px', background: '#061946' }}>
                  <span className="text-white/40 text-[10px] font-mono truncate">
                    rawrecruit.in — {activeTab === "employer" ? getActiveTitle() : "Employer Dashboard"}
                  </span>
                </div>
              </div>
              <div className="relative overflow-hidden" style={{ maxHeight: '480px' }}>
                <img 
                  src={activeTab === "employer" ? getImageForActiveCard() : f1} 
                  alt="Employer Dashboard" 
                  className="w-full h-auto object-top object-cover transition-all duration-300"
                  style={{ animation: 'fade-up 0.3s ease-out' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOR CANDIDATES - Pill Cards Row */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">For Candidates</h3>
          <div className="flex flex-col items-center">
            {/* Pill cards row with arrows */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {cardData.candidate?.map((card, index) => {
                const isActive = activeTab === "candidate" && activeCard === card.id;
                return (
                  <div key={card.id} className="flex items-center">
                    {renderPillCard(card, isActive, getTabColor("candidate"), "candidate")}
                    {index < cardData.candidate.length - 1 && (
                      <div className="mx-1 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Image Display */}
            <div
              className="relative rounded-2xl overflow-hidden border border-border w-full max-w-5xl mx-auto cursor-pointer"
              style={{ boxShadow: "var(--shadow-xl)" }}
              onClick={() => openFeatureModal("How It Works - Candidates")}
            >
              <div className="flex items-center gap-1.5 px-4" style={{ height: '36px', background: '#040f2a' }}>
                <span className="w-3 h-3 rounded-full bg-red-500 opacity-80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500 opacity-80"></span>
                <div className="ml-4 flex-1 max-w-xs rounded-md flex items-center px-3" style={{ height: '22px', background: '#061946' }}>
                  <span className="text-white/40 text-[10px] font-mono truncate">
                    rawrecruit.in — {activeTab === "candidate" ? getActiveTitle() : "Candidate Dashboard"}
                  </span>
                </div>
              </div>
              <div className="relative overflow-hidden" style={{ maxHeight: '480px' }}>
                <img 
                  src={activeTab === "candidate" ? getImageForActiveCard() : f1} 
                  alt="Candidate Dashboard" 
                  className="w-full h-auto object-top object-cover transition-all duration-300"
                  style={{ animation: 'fade-up 0.3s ease-out' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Animation Styles */}
        <style jsx>{`
          @keyframes fade-up {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </section>

        <section className="section-pad pt-16 pb-24" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}>
  <div className="container-xl max-w-7xl mx-auto px-2">
    
    {/* Section Header */}
    <div className="text-center mb-14">
      <div 
        className="inline-block text-[13px] font-semibold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full border"
        style={{ 
          color: '#D3C2F0', 
          borderColor: 'rgba(125, 58, 233, 0.3)', 
          background: 'rgba(125, 58, 233, 0.1)' 
        }}
      >
        Platform Impact
      </div>
      <h2 
        className="font-bold text-white mb-3 text-[clamp(28px,4vw,40px)] leading-[1.2] tracking-[-0.02em]"
      >
        Numbers That Speak for Themselves
      </h2>
      <p style={{ color: '#8596AD', fontSize: '18px' }}>
        Trusted by institutions and companies across India.
      </p>
    </div>

    {/* Stats Grid - with slight side spacing */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
      
      {/* Colleges */}
      <div 
        className="rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 group"
        style={{ 
          padding: '40px 24px', 
          border: '1px solid rgba(125, 58, 233, 0.15)', 
          background: 'rgba(125, 58, 233, 0.06)',
        }}
      >
        <div 
          className="font-black mb-2 text-[clamp(36px,5vw,52px)] leading-[1.1]"
          style={{
            background: 'linear-gradient(135deg, #7D3AE9, #EE4499)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          50+
        </div>
        <div style={{ color: '#8596AD', fontSize: '14px', fontWeight: '500' }}>
          Colleges Onboarded
        </div>
      </div>

      {/* Companies */}
      <div 
        className="rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 group"
        style={{ 
          padding: '40px 24px', 
          border: '1px solid rgba(125, 58, 233, 0.15)', 
          background: 'rgba(125, 58, 233, 0.06)',
        }}
      >
        <div 
          className="font-black mb-2 text-[clamp(36px,5vw,52px)] leading-[1.1]"
          style={{
            background: 'linear-gradient(135deg, #7D3AE9, #EE4499)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          100+
        </div>
        <div style={{ color: '#8596AD', fontSize: '14px', fontWeight: '500' }}>
          Companies Hiring
        </div>
      </div>

      {/* Students */}
      <div 
        className="rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 group"
        style={{ 
          padding: '40px 24px', 
          border: '1px solid rgba(125, 58, 233, 0.15)', 
          background: 'rgba(125, 58, 233, 0.06)',
        }}
      >
        <div 
          className="font-black mb-2 text-[clamp(36px,5vw,52px)] leading-[1.1]"
          style={{
            background: 'linear-gradient(135deg, #7D3AE9, #EE4499)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          3,000+
        </div>
        <div style={{ color: '#8596AD', fontSize: '14px', fontWeight: '500' }}>
          Students Placed
        </div>
      </div>

      {/* Satisfaction */}
      <div 
        className="rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 group"
        style={{ 
          padding: '40px 24px', 
          border: '1px solid rgba(125, 58, 233, 0.15)', 
          background: 'rgba(125, 58, 233, 0.06)',
        }}
      >
        <div 
          className="font-black mb-2 text-[clamp(36px,5vw,52px)] leading-[1.1]"
          style={{
            background: 'linear-gradient(135deg, #7D3AE9, #EE4499)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          95%
        </div>
        <div style={{ color: '#8596AD', fontSize: '14px', fontWeight: '500' }}>
          Satisfaction Rate
        </div>
      </div>

    </div>
  </div>
</section>

        <section 
  className="section-pad pt-20 pb-28 relative overflow-hidden" 
  style={{ 
    background: 'linear-gradient(120deg, #7C3AED 0%, #9333EA 35%, #C026D3 70%, #EC4899 100%)'
  }}
>
  {/* Background decorative elements */}
  <div 
    className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl"
    style={{ 
      background: 'white', 
      transform: 'translate(-40%, -40%)'
    }}
  />
  <div 
    className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl"
    style={{ 
      background: 'white', 
      transform: 'translate(40%, 40%)'
    }}
  />
  
  <div className="container-xl relative z-10">
    <div className="relative text-center max-w-2xl mx-auto">
      
      {/* Eyebrow - Moved down with pt-20 on section */}
      <div 
        className="inline-block text-[12px] font-semibold uppercase tracking-widest mb-6 px-4 py-1.5 rounded-full border"
        style={{ 
          color: 'rgba(255, 255, 255, 0.9)', 
          borderColor: 'rgba(255, 255, 255, 0.3)', 
          background: 'rgba(255, 255, 255, 0.15)'
        }}
      >
        Get Started Today
      </div>
      
      {/* Heading */}
      <h2 
        className="font-bold text-white mb-5 text-[clamp(28px,5vw,46px)] leading-[1.15] tracking-[-0.02em]"
      >
        Start Hiring or Getting Hired Today
      </h2>
      
      {/* Description */}
      <p 
        className="mb-10 leading-relaxed mx-auto"
        style={{ 
          color: 'rgba(255, 255, 255, 0.82)', 
          fontSize: '18px', 
          maxWidth: '480px'
        }}
      >
        Join RawRecruit and transform campus recruitment. Onboarding support included.
      </p>
      
      {/* Single Button */}
      <div className="flex items-center justify-center">
        <button
          onClick={handleGetStarted}
          className="inline-flex items-center justify-center gap-2 text-[15px] px-10 py-3 rounded-xl font-medium transition-all duration-300 hover:-translate-y-1"
          style={{ 
            background: 'white',
            color: '#1e293b',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            minWidth: '200px',
            height: '50px'
          }}
        >
          Get Started
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>
      </div>
      
      {/* Footer text */}
      <p 
        className="mt-6 text-sm"
        style={{ color: 'rgba(255, 255, 255, 0.55)' }}
      >
        No credit card required. Onboarding support included.
      </p>
      
    </div>
  </div>
</section>
<FeatureModal config={featureModalConfig} onClose={() => setFeatureModalConfig(null)} />

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
                  Unified platform for campus recruitment connecting colleges, companies, and students.
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

        @keyframes floatSlow {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
}

.float-slow {
  animation: floatSlow 6s ease-in-out infinite;
}

.float-slower {
  animation: floatSlow 8s ease-in-out infinite;
}

.float-slowest {
  animation: floatSlow 10s ease-in-out infinite;
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