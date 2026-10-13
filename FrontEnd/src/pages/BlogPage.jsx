import React, { useEffect, useState } from "react";
import axios from "../lib/axiosInstance";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Helmet } from "react-helmet-async";

const BlogPage = () => {
  const isPrerender =
    typeof navigator !== "undefined" &&
    navigator.userAgent === "ReactSnap";
  
  const fallbackBlogs = [
    {
      _id: "1",
      title: "How to Hire Freshers Faster Using RawRecruit: A Step-by-Step Guide for Companies",
      author: "RawRecruit Team",
      createdAt: new Date().toISOString(),
      tags: ["Hiring", "Freshers", "Recruitment"],
      coverImage: "",
      content: `
        <h1>How to Hire Freshers Faster Using RawRecruit</h1>
        <p>Hiring freshers is essential for building a strong workforce, but the traditional hiring process can be slow and inefficient. Companies often spend weeks coordinating with colleges, reviewing resumes, and scheduling campus drives. This delay increases hiring costs and reduces productivity.</p>
        <p>Today, companies need a faster and more structured way to recruit entry-level talent. That is where RawRecruit comes in.</p>
        <p>RawRecruit enables companies to run On-Campus, Pool-Campus, Off-Campus, and Internship hiring from one unified platform. Instead of managing multiple tools and communication channels, recruiters can control the entire hiring process in a single system.</p>
        <h2>Step 1: Create Your Company Account</h2>
        <p>Sign up on RawRecruit and complete your company profile. Provide details such as company name, hiring locations, job roles, salary package, and number of students to hire.</p>
        <h2>Step 2: Choose the Right Hiring Channel</h2>
        <p>Select the appropriate hiring mode: On-Campus Hiring, Pool-Campus Hiring, Off-Campus Hiring, or Internship Hiring.</p>
        <h2>Step 3: Access Verified Student Data</h2>
        <p>Recruiters can view student branch, academic performance, skills, and eligibility criteria to shortlist candidates quickly.</p>
        <h2>Step 4: Schedule and Conduct Campus Drives</h2>
        <p>Manage drive dates, interview schedules, and candidate selection directly through the platform.</p>
        <h2>Step 5: Track Hiring Progress</h2>
        <p>Monitor applications, shortlisted candidates, and final selections from a single dashboard.</p>
        <p>Companies choose RawRecruit because it simplifies campus hiring, reduces recruitment time, and improves hiring decisions.</p>
      `,
    },
    {
      _id: "2",
      title: "How Colleges Can Connect with Employers and Improve Placements Using RawRecruit",
      author: "RawRecruit Team",
      createdAt: new Date().toISOString(),
      tags: ["Placements", "Colleges", "Recruitment"],
      coverImage: "",
      content: `
        <h1>How Colleges Can Connect with Employers and Improve Placements Using RawRecruit</h1>
        <p>For colleges, placements are one of the most important indicators of success. Students and parents evaluate institutions based on placement performance.</p>
        <p>Many colleges face challenges in connecting with employers and organizing placement drives efficiently. Manual communication and scattered data often reduce placement opportunities.</p>
        <p>RawRecruit helps colleges connect with employers and manage placements through a centralized platform.</p>
        <h2>Step 1: Register Your College and Upload Student Data</h2>
        <p>Add student profiles, course details, academic performance, skills, and placement eligibility.</p>
        <h2>Step 2: Post On-Campus and Pool-Campus Placement Requests</h2>
        <p>Include details such as number of eligible students, minimum expected salary, tentative drive date, last date to apply, and facilities provided for the drive.</p>
        <h2>Step 3: Connect Directly with Hiring Companies</h2>
        <p>Invite companies, share student data, and coordinate placement drives through the platform.</p>
        <h2>Step 4: Manage Placement Drives Efficiently</h2>
        <p>Track student participation, interview schedules, and final selections in one system.</p>
        <h2>Step 5: Monitor Placement Performance</h2>
        <p>Analyze company participation, student selection rates, and placement success metrics.</p>
        <p>With structured systems like RawRecruit, colleges can improve placement outcomes and strengthen their reputation.</p>
      `,
    },
  ];

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (isPrerender) {
          setBlogs(fallbackBlogs);
          setLoading(false);
          return;
        }
        const backendUrl = import.meta.env.VITE_Backend_URL;
        const res = await axios.get(`${backendUrl}/api/blogs`);
        setBlogs(res.data.data || []);
      } catch (err) {
        console.error(err);
        setBlogs(fallbackBlogs);
        setError("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (selectedBlog) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
    };
  }, [selectedBlog]);

  // Helper function to strip HTML tags for preview
  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // 🟡 Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#373737]">
        Loading blogs...
      </div>
    );
  }

  // 🔴 Error
  if (error && !blogs.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Showing latest career insights...
      </div>
    );
  }

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title key="blog-title">
          Career Blogs | Internships & Fresher Jobs | RawRecruit
        </title>
        <meta
          key="blog-description"
          name="description"
          content="Read career blogs on campus hiring, internships, referral jobs, and fresher job opportunities in India. Learn how to get hired faster."
        />
        <link key="blog-canonical" rel="canonical" href="https://rawrecruit.in/blogs" />
        <meta
          key="blog-og:title"
          property="og:title"
          content="Career Blogs | Campus Hiring, Internships & Fresher Jobs | RawRecruit"
        />
        <meta
          key="blog-og:description"
          property="og:description"
          content="Explore blogs on campus hiring, internships, and referral jobs for students in India."
        />
        <meta key="blog-og:url" property="og:url" content="https://rawrecruit.in/blogs" />
        <meta key="blog-og:type" property="og:type" content="website" />
        <meta
          key="blog-og:image"
          property="og:image"
          content="https://rawrecruit.in/logo1.png"
        />
        <meta key="blog-twitter:card" name="twitter:card" content="summary_large_image" />
        <meta
          key="blog-twitter:title"
          name="twitter:title"
          content="Career Blogs | Campus Hiring, Internships & Fresher Jobs | RawRecruit"
        />
        <meta
          key="blog-twitter:description"
          name="twitter:description"
          content="Learn about internships, referral jobs, and fresher hiring in India."
        />
        <meta
          key="blog-twitter:image"
          name="twitter:image"
          content="https://rawrecruit.in/logo1.png"
        />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-[#F2F2F2] py-10 px-4">
        <h1 className="text-3xl font-bold text-[#373737] mb-6 text-center">
          Career Blogs on Hiring, Internships & Fresher Jobs
        </h1>
        
        <div className="max-w-5xl mx-auto space-y-8">
          {blogs
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((blog) => {
              const formattedDate = new Date(blog.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              );

              return (
                <div
                  key={blog._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Cover Image */}
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-[250px] object-cover"
                      loading="lazy"
                    />
                  )}

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-[#373737] hover:text-[#4F0DCE] transition-colors">
                      {blog.title}
                    </h2>

                    {/* Meta */}
                    <div className="flex flex-wrap justify-between text-sm text-[#6E6E6E]">
                      <span>By {blog.author}</span>
                      <span>{formattedDate}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(blog?.tags)
                        ? blog.tags.flatMap(tag => tag.split(","))
                        : []
                      ).map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-sm bg-[#7765DA] text-white rounded-full"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Content Preview - Strip HTML tags for clean preview */}
                    <p className="text-[#373737] leading-relaxed line-clamp-3">
                      {stripHtml(blog.content)}
                    </p>

                    {/* CTA */}
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="mt-3 text-[#4F0DCE] font-semibold hover:text-[#7765DA] transition-colors inline-flex items-center gap-2"
                    >
                      Read More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      
      <Footer />

      {/* Modal */}
      {selectedBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="sticky top-3 float-right m-3 z-10 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-gray-100 rounded-full text-gray-500 hover:text-black text-lg transition-colors shadow-sm"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Cover Image */}
            {selectedBlog.coverImage && (
              <img
                src={selectedBlog.coverImage}
                alt={selectedBlog.title}
                className="w-full h-[250px] object-cover"
                loading="lazy"
              />
            )}

            <div className="p-6 pt-0 space-y-4">
              {/* Title */}
              <h2 className="text-2xl font-bold text-[#373737] mt-4">
                {selectedBlog.title}
              </h2>

              {/* Meta */}
              <div className="flex flex-wrap justify-between text-sm text-[#6E6E6E]">
                <span>By {selectedBlog.author}</span>
                <span>
                  {new Date(selectedBlog.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(selectedBlog?.tags)
                  ? selectedBlog.tags.flatMap(tag => tag.split(","))
                  : []
                ).map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-[#7765DA] text-white rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>

              {/* Full Content - Render HTML properly */}
              <div 
                className="prose prose-lg max-w-none text-[#373737] leading-relaxed blog-content"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />

              {/* Optional: Add a divider and read more CTA */}
              <div className="pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="text-[#4F0DCE] font-semibold hover:text-[#7765DA] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add some custom CSS for blog content styling */}
      <style jsx>{`
        .blog-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #373737;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .blog-content h2 {
          font-size: 1.875rem;
          font-weight: 600;
          color: #373737;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #373737;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .blog-content p {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #4a4a4a;
          margin-bottom: 1rem;
        }
        .blog-content strong {
          font-weight: 600;
          color: #373737;
        }
        .blog-content ul, .blog-content ol {
          margin-top: 0.75rem;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        .blog-content a {
          color: #4F0DCE;
          text-decoration: underline;
        }
        .blog-content a:hover {
          color: #7765DA;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        .blog-content blockquote {
          border-left: 4px solid #7765DA;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #4a4a4a;
          font-style: italic;
        }
      `}</style>
    </>
  );
};

export default BlogPage;