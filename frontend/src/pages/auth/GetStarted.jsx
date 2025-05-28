import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const roles = [
  {
    key: 'candidate',
    icon: '👨‍🎓',
    title: 'Candidate',
    description:
      'Looking for job opportunities, internships, or placements? Register to explore careers and connect with top employers.',
  },
  {
    key: 'college',
    icon: '🏛️',
    title: 'College',
    description:
      'Representing an educational institution? Register as a college to manage placement drives, invite employers, and track student hiring.',
  },
  {
    key: 'company',
    icon: '🏢',
    title: 'Company',
    description:
      'Need to hire talent? Register as a company to post job openings, manage applications, and connect with students from top colleges.',
  },
  {
    key: 'employer',
    icon: '👔',
    title: 'Employer',
    description:
      'Seeking skilled professionals? Register as an employer to access a pool of qualified candidates and streamline your hiring process.',
  },
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const handleContinue = () => {
    if (selectedRole) {
      localStorage.setItem('selectedRole', selectedRole);
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12 px-4">
      {/* Logo */}
      <div className="w-full max-w-5xl mb-6">
        <h1 className="text-xl font-bold italic">Logo</h1>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-center">Get Started with TalentConnects</h1>
      <p className="text-gray-600 text-center mb-10 max-w-2xl">
        Get started by selecting the user type that best describes you. This helps us personalize your experience.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {roles.map(({ key, icon, title, description }) => (
          <div
            key={key}
            onClick={() => setSelectedRole(key)}
            className={`cursor-pointer border rounded-lg p-6 flex flex-col bg-white hover:shadow-md transition-shadow ${
              selectedRole === key ? 'border-black' : 'border-gray-200'
            }`}
          >
            <div className="text-3xl mb-4">{icon}</div>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600 flex-grow">{description}</p>
            <div className="flex justify-end mt-4 text-blue-600 font-medium hover:text-blue-800">
              {selectedRole === key ? 'Selected ✓' : 'Continue →'}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedRole}
        className="mt-10 bg-black text-white px-6 py-3 rounded disabled:opacity-50"
      >
        Continue
      </button>

      <footer className="mt-20 text-gray-500 text-sm text-center">
        © 2025 TalentConnects
      </footer>
    </div>
  );
};

export default RoleSelection;