import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, Briefcase, GraduationCap, Target,
  TrendingUp, Award, Calendar, Lightbulb, UserCheck,
  Menu, X, ChevronRight, CheckCircle, Star, Sparkles,
  ArrowRight, Users2, TargetIcon, Zap, Globe, Shield,
  BarChart3, HeartHandshake, Rocket
} from 'lucide-react';

const App = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const handleGetStarted = () => {
    navigate('/userselection');
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
      { icon: <GraduationCap className="w-10 h-10" />, title: 'On-Campus', desc: 'Direct campus recruitment', color: '#667eea' },
      { icon: <Users className="w-10 h-10" />, title: 'Off-Campus', desc: 'Open recruitment drives', color: '#f5576c' },
      { icon: <Target className="w-10 h-10" />, title: 'Pool-Campus', desc: 'Multi-college hiring', color: '#4facfe' },
      { icon: <UserCheck className="w-10 h-10" />, title: 'Workforce Solution', desc: 'Complete hiring solutions', color: '#5d9cec' },
      { icon: <TrendingUp className="w-10 h-10" />, title: 'Employee Training', desc: 'Skill development programs', color: '#ff9a9e' },
      { icon: <Award className="w-10 h-10" />, title: 'Branding', desc: 'Employer brand building', color: '#a18cd1' }
    ],
    college: [
      { icon: <GraduationCap className="w-10 h-10" />, title: 'On-Campus', desc: 'Host campus drives', color: '#667eea' },
      { icon: <Users className="w-10 h-10" />, title: 'Pool-Campus', desc: 'Collaborative hiring events', color: '#f5576c' },
      { icon: <TrendingUp className="w-10 h-10" />, title: 'Student Training', desc: 'Upskill your students', color: '#4facfe' },
      { icon: <Calendar className="w-10 h-10" />, title: 'Seminar', desc: 'Industry expert sessions', color: '#5d9cec' },
      { icon: <Award className="w-10 h-10" />, title: 'Campus Branding', desc: 'Enhance college reputation', color: '#a18cd1' },
      { icon: <Zap className="w-10 h-10" />, title: 'Analytics', desc: 'Placement insights & reports', color: '#ff9a9e' }
    ],
    employer: [
      { icon: <GraduationCap className="w-10 h-10" />, title: 'On-Campus', desc: 'Manage campus recruitment', color: '#667eea' },
      { icon: <Users className="w-10 h-10" />, title: 'Off-Campus', desc: 'Coordinate hiring drives', color: '#f5576c' },
      { icon: <TargetIcon className="w-10 h-10" />, title: 'Pool-Campus', desc: 'Multi-location recruitment', color: '#4facfe' },
      { icon: <UserCheck className="w-10 h-10" />, title: 'Workforce Solution', desc: 'End-to-end hiring support', color: '#5d9cec' },
      { icon: <TrendingUp className="w-10 h-10" />, title: 'Training Management', desc: 'Training program management', color: '#ff9a9e' },
      { icon: <Shield className="w-10 h-10" />, title: 'Brand Representation', desc: 'Company brand management', color: '#a18cd1' }
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

  const features = [
    { icon: <Zap className="w-6 h-6" />, text: 'Streamlined Process' },
    { icon: <Shield className="w-6 h-6" />, text: 'Secure Platform' },
    { icon: <BarChart3 className="w-6 h-6" />, text: 'Advanced Analytics' },
    { icon: <HeartHandshake className="w-6 h-6" />, text: 'Dedicated Support' }
  ];

  const stats = [
    { number: '500+', label: 'Partner Colleges', icon: <GraduationCap className="w-6 h-6" />, color: '#667eea' },
    { number: '1000+', label: 'Companies', icon: <Building2 className="w-6 h-6" />, color: '#f5576c' },
    { number: '50K+', label: 'Students Placed', icon: <Users2 className="w-6 h-6" />, color: '#4facfe' },
    { number: '95%', label: 'Satisfaction Rate', icon: <Star className="w-6 h-6" />, color: '#ffd700' }
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'HR Director, TechCorp', text: 'RawRecruit transformed our campus hiring process. Highly recommended!' },
    { name: 'Dr. Michael Chen', role: 'Placement Officer, State University', text: 'The platform has significantly increased our placement rates.' },
    { name: 'David Wilson', role: 'Recruitment Manager', text: 'Efficient, reliable, and cost-effective solution for all hiring needs.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Rocket className="w-8 h-8 text-[#667eea]" />
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-[#f5576c]" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              RawRecruit
            </span>
          </div>

          <nav className="hidden md:flex gap-8 items-center">
            {['Services', 'How It Works', 'Features', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-700 hover:text-[#667eea] transition-all duration-300 font-medium hover:scale-105"
              >
                {item}
              </a>
            ))}
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
            >
              Get Started
            </button>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 animate-slideDown">
            {['Services', 'How It Works', 'Features', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-700 hover:text-[#667eea] transition py-2 px-4 rounded-lg hover:bg-gray-50"
              >
                {item}
              </a>
            ))}
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-3 rounded-full font-semibold mt-2"
            >
              Get Started
            </button>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section id="features" className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Sparkles className="w-4 h-4" />
              Recruitment Revolutionized
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f5576c] bg-clip-text text-transparent">
                Campus Recruitment
              </span>
              <br />
              <span className="text-gray-800">At Affordable Excellence</span>
            </h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-10">
              Connecting colleges and companies for fresher recruitment and career-building through innovative hiring solutions
            </p>

            {/* <div className="flex flex-wrap justify-center gap-4 mb-12">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <div className="text-[#667eea]">{feature.icon}</div>
                  <span className="text-gray-700 font-medium">{feature.text}</span>
                </div>
              ))}
            </div> */}

            <button
              onClick={handleGetStarted}
              className="group bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center gap-3"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {heroCards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => handleCardClick(card.title)}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-gray-100 group overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${card.gradient}" />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} p-3 mb-6 text-white shadow-lg`}>
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{card.title}</h3>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <ul className="space-y-2 mb-6">
                  {card.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className={`${card.accentColor} w-12 h-1 rounded-full transition-all duration-500 ${hoveredCard === idx ? 'w-24' : ''}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              How <span className="text-[#667eea]">RawRecruit</span> Works
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Simple, efficient, and designed for results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((section, idx) => (
              <div
                key={idx}
                className="relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                <div className="absolute -top-6 left-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} p-4 text-white shadow-xl`}>
                    {section.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-8 pt-6">{section.title}</h3>
                <ul className="space-y-5">
                  {section.steps.map((step, stepIdx) => (
                    <li key={stepIdx} className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${section.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {stepIdx + 1}
                      </div>
                      <span className="text-gray-600 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {[
            { key: 'company', title: 'For Companies', desc: 'Complete recruitment solutions for your organization' },
            { key: 'college', title: 'For Colleges', desc: 'Enhance placement opportunities for your students' },
            { key: 'employer', title: 'For Employers', desc: 'Independent recruitment management solutions' }
          ].map((section) => (
            <div key={section.key} className="mb-20 last:mb-0">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
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
                      className="group bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center gap-3"
                    >
                      Explore {section.title.split(' ').pop()} Features
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {services[section.key].map((service, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                      >
                        <div
                          className="w-14 h-14 rounded-xl p-3 mb-4 text-white shadow-md"
                          style={{ background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)` }}
                        >
                          {service.icon}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{service.desc}</p>
                        <div className="h-1 w-8 bg-gray-200 rounded-full mt-4 group-hover:w-full transition-all duration-300" />
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
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-md">
              <Sparkles className="w-4 h-4" />
              Our Impact
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our mission is <span className="text-[#667eea]">excellence</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Building a strong network of colleges and companies to empower the next generation of talent
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
              >
                {/* Decorative accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ backgroundColor: stat.color }}
                />

                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${stat.color}20`,
                      boxShadow: `0 4px 12px ${stat.color}20`
                    }}
                  >
                    <div style={{ color: stat.color }}>{stat.icon}</div>
                  </div>
                  <div className="text-4xl font-bold text-gray-800">{stat.number}</div>
                </div>

                <div className="text-lg font-semibold text-gray-700 mb-2">{stat.label}</div>

                {/* Subtle description that appears on hover */}
                <div className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {idx === 0 && "Colleges trust our platform"}
                  {idx === 1 && "Active recruiters on platform"}
                  {idx === 2 && "Successful placements yearly"}
                  {idx === 3 && "Client satisfaction score"}
                </div>

                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-20 px-6 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Trusted by <span className="text-[#667eea]">Industry Leaders</span>
            </h2>
            <p className="text-gray-600 text-xl">See what our partners say about us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6 text-lg">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-gray-800">{testimonial.name}</div>
                  <div className="text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Final CTA */}
      {/* <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f5576c]" />
            <div className="relative z-10 p-12 md:p-16 text-center text-white">
              <Sparkles className="w-12 h-12 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Hiring Experience?
              </h2>
              <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                Join thousands of successful colleges and companies already achieving remarkable results with RawRecruit
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleGetStarted}
                  className="bg-white text-[#667eea] px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
                >
                  Start Free Trial
                </button>
                <button 
                  onClick={() => navigate('/demo')}
                  className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all"
                >
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Rocket className="w-8 h-8 text-[#667eea]" />
                <span className="text-2xl font-bold">RawRecruit</span>
              </div>
              <p className="text-gray-400 mb-6">
                Transforming campus recruitment through innovation and excellence.
              </p>
              <div className="flex gap-4">
                {[Users, Building2, GraduationCap, Briefcase].map((Icon, idx) => (
                  <div key={idx} className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Solutions', 'Pricing', 'Demo'] },
              { title: 'Company', links: ['About', 'Careers', 'Press', 'Blog'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Privacy', 'Terms'] }
            ].map((column, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-bold mb-6">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} RawRecruit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;