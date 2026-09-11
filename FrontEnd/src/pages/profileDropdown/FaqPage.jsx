import { useState } from 'react';
import { Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const companyFaqs = [
  {
    id: 1,
    question: "How do companies get started on RawRecruit?",
    answer:
      "Create a company account, complete your profile, and choose hiring channels like On-Campus, Pool-Campus, or Off-Campus to start recruiting fresh talent."
  },
  {
    id: 2,
    question: "What hiring channels are available for companies?",
    answer:
      "Companies can hire through On-Campus drives, Pool-Campus hiring across colleges, and Off-Campus job postings for wider reach."
  },
  {
    id: 3,
    question: "Can we manage applications in one place?",
    answer:
      "Yes. RawRecruit provides centralized application tracking, shortlisting, and hiring status updates across all hiring channels."
  },
  {
    id: 4,
    question: "Do you support workforce and training services?",
    answer:
      "Yes. Companies can request workforce solutions, employee training, and employer branding services through the platform."
  },
  {
    id: 5,
    question: "How can companies contact support?",
    answer:
      "You can reach our support team via in-platform chat or by submitting a support request from your dashboard."
  },
  {
    id: 6,
    question: "Is RawRecruit suitable for fresher hiring in India?",
    answer:
      "Yes. RawRecruit is designed specifically for India’s campus recruitment and fresher hiring ecosystem."
  }
];

const collegeFaqs = [
  {
    id: 1,
    question: "How can colleges register on RawRecruit?",
    answer:
      "Colleges can sign up, create a placement profile, and start coordinating with companies for On-Campus and Pool-Campus recruitment."
  },
  {
    id: 2,
    question: "Can colleges post hiring opportunities?",
    answer:
      "Yes. Colleges can post On-Campus and Pool-Campus hiring opportunities visible to registered companies."
  },
  {
    id: 3,
    question: "How does RawRecruit help improve placements?",
    answer:
      "RawRecruit streamlines employer coordination, provides placement visibility, and supports student readiness through training and seminars."
  },
  {
    id: 4,
    question: "Are student training and seminars available?",
    answer:
      "Yes. Colleges can request student training programs, expert seminars, and campus branding support."
  },
  {
    id: 5,
    question: "Can colleges track placement activity?",
    answer:
      "Yes. Placement teams can monitor hiring requests, student participation, and overall placement progress."
  },
  {
    id: 6,
    question: "How do colleges connect with employers?",
    answer:
      "Colleges can communicate directly with companies through the platform for coordination and recruitment planning."
  }
];

const candidateFaqs = [
  {
    id: 1,
    question: "How do I create a candidate account?",
    answer:
      "Sign up using email or social login, complete your profile, and start exploring fresher jobs and opportunities."
  },
  {
    id: 2,
    question: "What job opportunities are available?",
    answer:
      "Candidates can apply for Off-Campus jobs and participate in campus drives through their college when available."
  },
  {
    id: 3,
    question: "Can I track my job applications?",
    answer:
      "Yes. You can track application status, shortlisting updates, and next steps directly from your dashboard."
  },
  {
    id: 4,
    question: "Does RawRecruit offer career support?",
    answer:
      "Yes. Candidates can access career counselling, training programs, mock interviews, and career planning services."
  },
  {
    id: 5,
    question: "Are mock interviews and guidance available?",
    answer:
      "Yes. Mock interviews and guidance sessions help you prepare for real interview scenarios and improve performance."
  },
  {
    id: 6,
    question: "How can I contact support?",
    answer:
      "You can reach support through in-app chat or submit a request from your dashboard."
  }
];


const FAQPage = () => {
  const navigate = useNavigate() ;

  const { user, loading } = useAuth();

  if (loading) return null; // or spinner

  const role = user?.userType;
 const roleFaqMap = {
    company: companyFaqs,
    employer: companyFaqs,
    college: collegeFaqs,
    student: candidateFaqs,
    fresher: candidateFaqs,
  };

  const faqs = roleFaqMap[role] || candidateFaqs;

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">FAQs</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Frequently asked questions about our services and platform.
          </p>
        </div>

        {/* FAQ Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start mb-4">
                <div className="bg-black p-2 rounded mr-3">
                  <Box className="text-white" size={20} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">{faq.question}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            If you need more help, our support team is here for you.
          </p>
          <button
            onClick={() => navigate('/ContactUs')}
            className="border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 font-medium py-2 px-6"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;