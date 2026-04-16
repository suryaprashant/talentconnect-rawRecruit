import React from 'react';
import ServiceCard from './ServiceCard';
import { Brain, Users, Target } from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Skill-Based",
    description: "Prioritize what matters most-skills. Identify the right candidates through assessments, portfolio, or hands-on challenges, not just resumes and academic scores.",
    icon: Brain
  },
  {
    id: 2,
    title: "Intern-to-Hire",
    description: "Run Internship programs designed to convert top performers into full-time employees. Reduce hiring risks and build a strong talent pipeline with real time evaluation.",
    icon: Users
  },
  {
    id: 3,
    title: "Targeted Outreach",
    description: "Launch focused hiring campaigns based on job roles experiences or location. Get curated candidates pools and personalized engagement strategies that align with your goals.",
    icon: Target
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col py-4">
        
        {/* Header */}
        <header className="mb-8 pt-2">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg">
              <Brain className="h-6 w-6 text-[#143694]" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
              OffCampus Access: Hire Beyond Boundaries
            </h1>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4 max-w-xl mx-auto">
            Reach top talent across cities, domains, and institutions—without stepping on campus. OffCampus Access connects companies with graduates and job seekers beyond traditional campuses, offering flexible, efficient, skill-based hiring at scale.
          </p>
        </header>

        {/* Services - Square Cards */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceData.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="group relative bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow p-6 hover:shadow-md transition-all duration-200 flex flex-col h-96" // Fixed height for square shape
                >
                  {/* Purple hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/0 to-[#1e4ed8]/0 group-hover:from-[#143694]/5 group-hover:to-[#1e4ed8]/5 rounded-lg transition-all duration-300"></div>
                  
                  {/* Purple border on hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#143694]/20 rounded-lg transition-all duration-300"></div>
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mb-4">
                      <IconComponent className="h-5 w-5 text-[#143694]" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-grow overflow-y-auto">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            onClick={onRequestInfoClick}
            className="bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg transition-all text-base"
          >
            Register Now
          </button>
          <button
            onClick={onRegisterClick}
            className="bg-gray-800 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-gray-900 transition-colors text-base"
          >
            Request Info
          </button>
        </section>

      </div>
    </div>
  );
}