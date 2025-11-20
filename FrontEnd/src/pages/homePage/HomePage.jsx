import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, Briefcase, GraduationCap, Target, TrendingUp, Award, Calendar, Lightbulb, UserCheck, Menu, X } from 'lucide-react';

const App = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      icon: <GraduationCap className="w-6 h-6" />,
      bgColor: 'bg-[#E8E8E8]'
    },
    {
      title: 'Pool-Campus',
      description: 'Multi-college recruitment opportunities',
      icon: <Users className="w-6 h-6" />,
      bgColor: 'bg-[#D4FF00]'
    },
    {
      title: 'Off-Campus',
      description: 'Flexible hiring solutions',
      icon: <Building2 className="w-6 h-6" />,
      bgColor: 'bg-[#1A1A1A] text-white'
    }
  ];

  const services = {
    company: [
      { icon: <GraduationCap className="w-8 h-8" />, title: 'On-Campus', desc: 'Direct campus recruitment' },
      { icon: <Users className="w-8 h-8" />, title: 'Off-Campus', desc: 'Open recruitment drives' },
      { icon: <Target className="w-8 h-8" />, title: 'Pool-Campus', desc: 'Multi-college hiring' },
      { icon: <UserCheck className="w-8 h-8" />, title: 'Workforce Solution', desc: 'Complete hiring solutions' },
      { icon: <TrendingUp className="w-8 h-8" />, title: 'Employee Training', desc: 'Skill development programs' },
      { icon: <Award className="w-8 h-8" />, title: 'Branding', desc: 'Employer brand building' }
    ],
    college: [
      { icon: <GraduationCap className="w-8 h-8" />, title: 'On-Campus', desc: 'Host campus drives' },
      { icon: <Users className="w-8 h-8" />, title: 'Pool-Campus', desc: 'Collaborative hiring events' },
      { icon: <TrendingUp className="w-8 h-8" />, title: 'Request Student Training', desc: 'Upskill your students' },
      { icon: <Calendar className="w-8 h-8" />, title: 'Seminar', desc: 'Industry expert sessions' },
      { icon: <Award className="w-8 h-8" />, title: 'Campus Branding', desc: 'Enhance college reputation' },
    ],
    employer: [
      { icon: <GraduationCap className="w-8 h-8" />, title: 'On-Campus', desc: 'Manage campus recruitment' },
      { icon: <Users className="w-8 h-8" />, title: 'Off-Campus', desc: 'Coordinate hiring drives' },
      { icon: <Target className="w-8 h-8" />, title: 'Pool-Campus', desc: 'Multi-location recruitment' },
      { icon: <UserCheck className="w-8 h-8" />, title: 'Workforce Solution', desc: 'End-to-end hiring support' },
      { icon: <TrendingUp className="w-8 h-8" />, title: 'Employee Training', desc: 'Training program management' },
      { icon: <Award className="w-8 h-8" />, title: 'Branding', desc: 'Company brand representation' }
    ]
  };

  const howItWorks = [
    {
      type: 'colleges',
      icon: <GraduationCap className="w-8 h-8 text-[#1A1A1A]" />,
      title: 'For Colleges',
      steps: [
        'Register your college and create a profile',
        'View hiring requests from companies',
        'Post your own hiring opportunities',
        'Request training and branding services'
      ]
    },
    {
      type: 'companies',
      icon: <Building2 className="w-8 h-8 text-[#1A1A1A]" />,
      title: 'For Companies',
      steps: [
        'Register your company and set up profile',
        'Browse college hiring requests',
        'Post on-campus and pool campus opportunities',
        'Access workforce and training solutions'
      ]
    },
    {
      type: 'employers',
      icon: <Briefcase className="w-8 h-8 text-[#1A1A1A]" />,
      title: 'For Employers',
      steps: [
        'Create employer profile independently',
        'Manage all recruitment activities',
        'Work on behalf of companies',
        'Handle company acceptance and coordination'
      ]
    }
  ];

  const stats = [
    { number: '500+', label: 'Partner Colleges', desc: 'Colleges trust our platform' },
    { number: '1000+', label: 'Companies', desc: 'Active recruiters on platform' },
    { number: '50K+', label: 'Students Placed', desc: 'Successful placements yearly' },
    { number: '95%', label: 'Satisfaction Rate', desc: 'Client satisfaction score' }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
    
      <header className="bg-[#1A1A1A] text-white py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">RawRecruit</div>


          <nav className="hidden md:flex gap-8 items-center">
            <a href="#services" className="hover:text-[#D4FF00] transition text-sm">Services</a>
            <a href="#about" className="hover:text-[#D4FF00] transition text-sm">About</a>
            <a href="#how-it-works" className="hover:text-[#D4FF00] transition text-sm">How It Works</a>
            <a href="#features" className="hover:text-[#D4FF00] transition text-sm">Features</a>
          </nav>

          <button 
            onClick={handleGetStarted}
            className="hidden md:block bg-[#D4FF00] text-[#1A1A1A] px-6 py-2 rounded-full font-semibold hover:bg-[#C5F000] transition"
          >
            Get Started
          </button>

      
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

      
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <a href="#services" className="hover:text-[#D4FF00] transition">Services</a>
            <a href="#about" className="hover:text-[#D4FF00] transition">About</a>
            <a href="#how-it-works" className="hover:text-[#D4FF00] transition">How It Works</a>
            <a href="#features" className="hover:text-[#D4FF00] transition">Features</a>
            <button 
              onClick={handleGetStarted}
              className="bg-[#D4FF00] text-[#1A1A1A] px-6 py-2 rounded-full font-semibold hover:bg-[#C5F000] transition text-left"
            >
              Get Started
            </button>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section id="features" className="bg-[#F5F5F5] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-[#D4FF00] text-[#1A1A1A] px-4 py-2 rounded-full text-sm font-semibold inline-block mb-6">
              Recruitment Made Simple
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-[#1A1A1A] mb-6">
              Campus recruitment at<br />affordable excellence
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-2xl mx-auto">
              Connecting colleges and companies for fresher recruitment and career-building through innovative hiring solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {heroCards.map((card, idx) => (
              <div
                key={idx}
                onClick={ ()=> handleCardClick(card.title)}
                className={`${card.bgColor} p-8 rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer`}
              >
                <div className="mb-4">{card.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                <p className={card.bgColor.includes('1A1A1A') ? 'text-gray-300' : 'text-[#6B6B6B]'}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={handleGetStarted}
              className="bg-[#D4FF00] text-[#1A1A1A] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#C5F000] transition shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-[#D4E8E8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
              How RawRecruit Works
            </h2>
            <p className="text-[#6B6B6B] text-lg">
              Simple, efficient, and designed for results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((section, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition"
              >
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                  {section.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">{section.title}</h3>
                <ul className="space-y-4">
                  {section.steps.map((step, stepIdx) => (
                    <li key={stepIdx} className="flex items-start gap-3">
                      <div className="bg-[#D4FF00] text-[#1A1A1A] w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">
                        {stepIdx + 1}
                      </div>
                      <span className="text-[#6B6B6B]">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          {/* Companies Section */}
          <div className="mb-20">
            <div className="bg-[#D4E8E8] rounded-3xl p-8 md:p-12 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                    Browse our set of services and offerings
                  </h2>
                  <p className="text-[#6B6B6B] mb-6">
                    We offer a variety of tools and resources to help you manage your recruitment more efficiently
                  </p>
                  <button 
                    onClick={() => handleRoleSelect('company')}
                    className="bg-[#D4FF00] text-[#1A1A1A] px-6 py-3 rounded-full font-bold hover:bg-[#C5F000] transition inline-flex items-center gap-3 shadow-md"
                  >
                    Learn More
                    <span className="bg-[#1A1A1A] text-white w-8 h-8 rounded-full flex items-center justify-center">
                      →
                    </span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {services.company.map((service, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                    >
                      <div className="bg-[#D4E89E] w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-[#1A1A1A]">
                        {service.icon}
                      </div>
                      <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">{service.title}</h3>
                      <p className="text-xs text-[#6B6B6B]">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">For Companies</h3>
                <p className="text-[#6B6B6B] text-sm">Complete recruitment solutions for your organization</p>
              </div>
            </div>
          </div>

          {/* Colleges Section */}
          <div className="mb-20">
            <div className="bg-[#D4E8E8] rounded-3xl p-8 md:p-12 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                    Browse our set of services and offerings
                  </h2>
                  <p className="text-[#6B6B6B] mb-6">
                    We offer a variety of tools and resources to help you manage your recruitment more efficiently
                  </p>
                  <button 
                    onClick={() => handleRoleSelect('college')}
                    className="bg-[#D4FF00] text-[#1A1A1A] px-6 py-3 rounded-full font-bold hover:bg-[#C5F000] transition inline-flex items-center gap-3 shadow-md"
                  >
                    Learn More
                    <span className="bg-[#1A1A1A] text-white w-8 h-8 rounded-full flex items-center justify-center">
                      →
                    </span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {services.college.map((service, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                    >
                      <div className="bg-[#D4E89E] w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-[#1A1A1A]">
                        {service.icon}
                      </div>
                      <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">{service.title}</h3>
                      <p className="text-xs text-[#6B6B6B]">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">For Colleges</h3>
                <p className="text-[#6B6B6B] text-sm">Enhance placement opportunities for your students</p>
              </div>
            </div>
          </div>

          {/* Employers Section */}
          <div>
            <div className="bg-[#D4E8E8] rounded-3xl p-8 md:p-12 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                    Browse our set of services and offerings
                  </h2>
                  <p className="text-[#6B6B6B] mb-6">
                    We offer a variety of tools and resources to help you manage your recruitment more efficiently
                  </p>
                  <button 
                    onClick={() => handleRoleSelect('employer')}
                    className="bg-[#D4FF00] text-[#1A1A1A] px-6 py-3 rounded-full font-bold hover:bg-[#C5F000] transition inline-flex items-center gap-3 shadow-md"
                  >
                    Learn More
                    <span className="bg-[#1A1A1A] text-white w-8 h-8 rounded-full flex items-center justify-center">
                      →
                    </span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {services.employer.map((service, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                    >
                      <div className="bg-[#D4E89E] w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-[#1A1A1A]">
                        {service.icon}
                      </div>
                      <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">{service.title}</h3>
                      <p className="text-xs text-[#6B6B6B]">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">For Employers</h3>
                <p className="text-[#6B6B6B] text-sm">Independent recruitment management solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transform CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A1A] text-white p-12 md:p-16 rounded-3xl text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Campus Hiring?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of colleges and companies already using RawRecruit
            </p>
            <button 
              onClick={handleGetStarted}
              className="bg-[#D4FF00] text-[#1A1A1A] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#C5F000] transition shadow-lg"
            >
              Join Now
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="about" className="py-20 px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-[#D4FF00] text-[#1A1A1A] px-4 py-2 rounded-full text-sm font-semibold inline-block mb-6">
              Our Impact
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
              Our mission is excellence
            </h2>
            <p className="text-[#6B6B6B] text-lg max-w-2xl mx-auto">
              Building a strong network of colleges and companies to empower the next generation of talent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition"
              >
                <div className="text-5xl font-bold text-[#1A1A1A] mb-3">{stat.number}</div>
                <div className="text-xl font-semibold text-[#1A1A1A] mb-2">{stat.label}</div>
                <p className="text-[#6B6B6B]">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#1A1A1A] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-3xl font-bold mb-4">RawRecruit</div>
          <p className="text-gray-400 mb-8">
            Transforming campus recruitment for a better future
          </p>
          <div className="flex justify-center gap-8 mb-8">
            <a href="#about" className="text-gray-400 hover:text-[#D4FF00] transition">About</a>
            <a href="#services" className="text-gray-400 hover:text-[#D4FF00] transition">Services</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-[#D4FF00] transition">How It Works</a>
            <a href="#features" className="text-gray-400 hover:text-[#D4FF00] transition">Features</a>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 RawRecruit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;