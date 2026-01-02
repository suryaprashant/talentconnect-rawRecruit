import { useState } from 'react';
import { 
  Target,
  TrendingUp,
  Award,
  Users,
  Plus,
  MessageCircle,
  BookOpen,
  Briefcase,
  CheckCircle,
  Sparkles,
  Book,
  Lightbulb,
  HelpCircle
} from 'lucide-react';

function FresherCareerCraft() {
  // Service cards data - Square cards with matching style
  const [features, setFeatures] = useState([
    {
      id: 1,
      title: "Personalized Career Path",
      description: "Get a customized career roadmap based on your skills, interests, and goals. Our experts analyze your profile and create a tailored plan that aligns with industry trends and your personal aspirations.",
      icon: <Target className="h-6 w-6" />
    },
    {
      id: 2,
      title: "Skill Development Plans",
      description: "Structured learning paths to develop in-demand skills for your chosen career. Access curated resources, courses, and practice materials to build the exact skills employers are looking for.",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      id: 3,
      title: "Industry Mentorship",
      description: "Connect with experienced professionals for guidance and career advice. Get one-on-one mentorship sessions, networking opportunities, and insider insights into your chosen industry.",
      icon: <Users className="h-6 w-6" />
    },
  ]);

  const addFeature = () => {
    const newFeature = {
      id: features.length + 1,
      title: 'Interview Preparation',
      description: 'Comprehensive interview training with mock sessions and feedback. Practice with real interview questions, receive detailed feedback, and improve your interview techniques.',
      icon: <MessageCircle className="h-6 w-6" />
    };
    setFeatures([...features, newFeature]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col py-8">
        {/* Header - Matching the example style */}
        <header className="mb-8 pt-2 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
              <Briefcase className="h-6 w-6 text-[#667eea]" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Craft Your Perfect Career Path
            </h1>
          </div>
          <p className="text-sm text-gray-600 mt-4 max-w-2xl mx-auto">
            Our Career Craft program helps you build a successful career path through personalized guidance, skill development, and industry connections.
          </p>
        </header>

        {/* Services Section - Square Cards matching the example */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="group relative bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow p-6 hover:shadow-md transition-all duration-200 flex flex-col h-96"
              >
                {/* Purple hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/0 to-[#764ba2]/0 group-hover:from-[#667eea]/5 group-hover:to-[#764ba2]/5 rounded-lg transition-all duration-300"></div>
                
                {/* Purple border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#667eea]/20 rounded-lg transition-all duration-300"></div>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mb-4">
                    <div className="text-[#667eea]">
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed flex-grow overflow-y-auto">
                    {feature.description}
                  </p>

                  <div className="mt-4">
                    <button className="text-[#667eea] font-medium hover:text-[#764ba2] transition-colors duration-200 text-sm">
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add Feature Button - Centered */}
        <div className="text-center mb-10">
          <button
            onClick={addFeature}
            className="inline-flex items-center bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 px-6 py-3 rounded-lg font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Discover More Features
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Click to explore additional career development tools
          </p>
        </div>
      </div>
    </div>
  );
}

export default FresherCareerCraft;