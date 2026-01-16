import { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Award,
  Star,
  CheckCircle,
  Users,
  Briefcase,
  Rocket
} from 'lucide-react';

function CareerCraft() {
  const [features, setFeatures] = useState([
    {
      id: 1,
      title: "Personalization",
      bullets: [
        "Build a customized career roadmap based on your interests and goals",
        "Identify strengths, gaps, and suitable career options",
        "Align academic choices with real-world job roles"
      ],
      icon: <Target className="h-6 w-6" />
    },
    {
      id: 2,
      title: "Skill Planning",
      bullets: [
        "Access structured skill development plans",
        "Focus on in-demand technical and professional skills",
        "Learn what employers expect at entry-level roles"
      ],
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      id: 3,
      title: "Mentorship",
      bullets: [
        "Connect with industry professionals and mentors",
        "Get practical advice on career decisions",
        "Gain insights into roles, industries, and growth paths"
      ],
      icon: <Award className="h-6 w-6" />
    }
  ]);

  const addFeature = () => {
    const newFeature = {
      id: features.length + 1,
      title: 'Interview Preparation',
      bullets: [
        'Practice with real interview questions and scenarios',
        'Receive detailed feedback on your performance',
        'Improve your communication and presentation skills'
      ],
      icon: <Rocket className="h-6 w-6" />
    };
    setFeatures([...features, newFeature]);
  };

  return (
    <>
      {/* Meta Title and Description */}
      <head>
        <title>Career Craft for Freshers | Build Your Career Path – RawRecruit</title>
        <meta 
          name="description" 
          content="Career Craft by RawRecruit helps freshers plan their career path with personalized guidance, skill development, and industry mentorship." 
        />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col py-8">
          {/* Header */}
          <header className="mb-10 pt-2 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
              Craft Your Career Path with Confidence
            </h1>
            <h2 className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-6">
              Personalized career planning for students and early professionals
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Career Craft is designed to help students and freshers move from uncertainty to clarity. Through structured guidance, skill planning, and mentorship, RawRecruit supports you in building a focused career path aligned with your strengths and market demand.
            </p>
          </header>

          {/* Feature Cards */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="group relative bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow p-6 hover:shadow-md transition-all duration-200 flex flex-col min-h-[320px]"
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

                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>

                    <ul className="space-y-3 flex-grow">
                      {feature.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#667eea] rounded-full mt-2 mr-3"></div>
                          <span className="text-gray-600 text-sm">{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      <button className="text-[#667eea] font-medium hover:text-[#764ba2] transition-colors duration-200 text-sm">
                        Learn More →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Add Feature Button */}
          <div className="text-center mb-10">
            <button
              onClick={addFeature}
              className="inline-flex items-center bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 px-6 py-3 rounded-lg font-medium"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Discover More Features
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Click to explore additional career development tools
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CareerCraft;