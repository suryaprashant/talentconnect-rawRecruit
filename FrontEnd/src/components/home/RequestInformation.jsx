import { motion } from "framer-motion";
import { Building2, GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "For Companies",
    icon: Building2,
    items: [
      {
        title: "Workforce Solutions",
        desc: "Hire freshers through campus and off-campus hiring.",
        link: "/service-request/workforce-solution",
      },
      {
        title: "Employee Training",
        desc: "Upskill your workforce with industry-focused programs.",
        link: "/service-request/employee-training",
      },
      {
        title: "Employer Branding",
        desc: "Build your presence across India's top colleges.",
        link: "/service-request/branding",
      },
      {
        title: "On-Campus Recruitment",
        desc: "Hire top college talent through structured campus drives.",
        link: "/hiring-channels/on-campus-hiring",
      },
      {
        title: "Pool-Campus Recruitment",
        desc: "Multi-college fresher hiring through shared campus recruitment drives.",
        link: "/hiring-channels/pool-campus-hiring",
      },
      {
        title: "Off-Campus Recruitment",
        desc: "Flexible fresher hiring beyond campuses through open recruitment channels.",
        link: "/hiring-channels/off-campus-hiring",
      },
      {
        title: "Create Internship Opportunity",
        desc: "Post a new internship opportunity and connect with talented students. Fill in the details below to create your internship listing.",
        link: "/hiring-channels/post-an-internship",
      },
    ],
  },
  {
    title: "For Colleges",
    icon: GraduationCap,
    items: [
      {
        title: "Campus Placement",
        desc: "Connect students with verified recruiters.",
        link: "/service-request/campus-placement",
      },
      {
        title: "Pool Campus",
        desc: "Conduct shared hiring drives with partner colleges.",
        link: "/service-request/poolcampus-placement",
      },
      {
        title: "Training Programs",
        desc: "Industry-ready skill development initiatives.",
        link: "/service-request/student-training-programs",
      },
      {
        title: "Seminars",
        desc: "Expert talks and career awareness sessions.",
        link: "/service-request/seminars",
      },
      {
        title: "College Branding",
        desc: "Increase visibility among recruiters.",
        link: "/service-request/campus-branding",
      },
    ],
  },
  {
    title: "For Employers",
    icon: Briefcase,
    items: [
      {
        title: "Workforce Solutions",
        desc: "Hire experienced professionals faster.",
        link: "/service-request/workforce-solution",
      },
      {
        title: "Employee Training",
        desc: "Continuous learning for your teams.",
        link: "/service-request/employee-training",
      },
      {
        title: "Employer Branding",
        desc: "Strengthen your employer brand.",
        link: "/service-request/branding",
      },
      {
        title: "On-Campus Recruitment",
        desc: "Hire top college talent through structured campus drives.",
        link: "/hiring-channels/on-campus-hiring/employer",
      },
      {
        title: "Pool-Campus Recruitment",
        desc: "Multi-college fresher hiring through shared campus recruitment drives.",
        link: "/hiring-channels/pool-campus-hiring/employer",
      },
      {
        title: "Off-Campus Recruitment",
        desc: "Flexible fresher hiring beyond campuses through open recruitment channels.",
        link: "/hiring-channels/off-campus-hiring/employer",
      },
      {
        title: "Create Internship Opportunity",
        desc: "Post a new internship opportunity and connect with talented students. Fill in the details below to create your internship listing.",
        link: "/hiring-channels/post-an-internship/employer",
      },
    ],
  },
];

export default function RequestInformation() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-bold">Request Information</h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Learn more about RawRecruit's solutions for companies, colleges and
            employers.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition"
              >
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primaryBrand/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primaryBrand" />
                    </div>

                    <h3 className="text-xl font-semibold">{section.title}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {section.items.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => navigate(item.link)}
                      className="group w-full text-left border rounded-2xl p-4 hover:border-primaryBrand hover:bg-primaryBrand/5 transition"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>

                          <p className="text-sm text-gray-500 mt-1">
                            {item.desc}
                          </p>
                        </div>

                        <ArrowRight className="w-5 h-5 text-primaryBrand group-hover:translate-x-1 transition" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
