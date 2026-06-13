import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Hiring freshers is essential for building a strong workforce, but the traditional hiring process can be slow and inefficient. Companies often spend weeks coordinating with colleges, reviewing resumes, and scheduling campus drives. This delay increases hiring costs and reduces productivity.

  Today, companies need a faster and more structured way to recruit entry-level talent. That is where RawRecruit comes in.

  RawRecruit enables companies to run On-Campus, Pool-Campus, Off-Campus, and Internship hiring from one unified platform. Instead of managing multiple tools and communication channels, recruiters can control the entire hiring process in a single system.

  Step 1: Create Your Company Account
  Sign up on RawRecruit and complete your company profile. Provide details such as company name, hiring locations, job roles, salary package, and number of students to hire.

  Step 2: Choose the Right Hiring Channel
  Select the appropriate hiring mode: On-Campus Hiring, Pool-Campus Hiring, Off-Campus Hiring, or Internship Hiring.

  Step 3: Access Verified Student Data
  Recruiters can view student branch, academic performance, skills, and eligibility criteria to shortlist candidates quickly.

  Step 4: Schedule and Conduct Campus Drives
  Manage drive dates, interview schedules, and candidate selection directly through the platform.

  Step 5: Track Hiring Progress
  Monitor applications, shortlisted candidates, and final selections from a single dashboard.

  Companies choose RawRecruit because it simplifies campus hiring, reduces recruitment time, and improves hiring decisions.
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
  For colleges, placements are one of the most important indicators of success. Students and parents evaluate institutions based on placement performance.

  Many colleges face challenges in connecting with employers and organizing placement drives efficiently. Manual communication and scattered data often reduce placement opportunities.

  RawRecruit helps colleges connect with employers and manage placements through a centralized platform.

  Step 1: Register Your College and Upload Student Data
  Add student profiles, course details, academic performance, skills, and placement eligibility.

  Step 2: Post On-Campus and Pool-Campus Placement Requests
  Include details such as number of eligible students, minimum expected salary, tentative drive date, last date to apply, and facilities provided for the drive.

  Step 3: Connect Directly with Hiring Companies
  Invite companies, share student data, and coordinate placement drives through the platform.

  Step 4: Manage Placement Drives Efficiently
  Track student participation, interview schedules, and final selections in one system.

  Step 5: Monitor Placement Performance
  Analyze company participation, student selection rates, and placement success metrics.

  With structured systems like RawRecruit, colleges can improve placement outcomes and strengthen their reputation.
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

  // ⚪ Empty
  // if (!blogs.length) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-[#6E6E6E]">
  //       No blogs available
  //     </div>
  //   );
  // }

  return (
    <>
        <Helmet prioritizeSeoTags>
          {/* Title */}
          <title key="blog-title">
           Career Blogs | Internships & Fresher Jobs | RawRecruit
          </title>

          {/* Meta Description */}
          <meta
            key="blog-description"
            name="description"
            content="Read career blogs on campus hiring, internships, referral jobs, and fresher job opportunities in India. Learn how to get hired faster."
          />

          {/* Canonical */}
          <link key="blog-canonical" rel="canonical" href="https://rawrecruit.in/blogs" />

          {/* Open Graph */}
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
          {/* Twitter */}
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
          <h1 className="text-3xl font-bold text-[#373737] mb-6">
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
                    className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                    {/* Cover Image */}
                    {blog.coverImage && (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-[250px] object-cover"
                      />
                    )}

                    {/* Content */}
                    <div className="p-6 space-y-4">
                    
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-[#373737]">
                        {blog.title}
                    </h2>

                    {/* Meta */}
                    <div className="flex justify-between text-sm text-[#6E6E6E]">
                        <span>By {blog.author}</span>
                        <span>{formattedDate}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
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

                    {/* Content Preview */}
                    <p className="text-[#373737] leading-relaxed line-clamp-3">
                        {blog.content}
                    </p>

                    {/* CTA */}
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="mt-3 text-[#4F0DCE] font-semibold"
                    >
                      Read More →
                    </button>
                    </div>
                </div>
                );
            })}
        </div>
        </div>
        <Footer />
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
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
              >
                ✕
              </button>

              {/* Cover Image */}
              {selectedBlog.coverImage && (
                <img
                  src={selectedBlog.coverImage}
                  alt={selectedBlog.title}
                  className="w-full h-[250px] object-cover rounded-t-2xl"
                />
              )}

              <div className="p-6 space-y-4">
                
                {/* Title */}
                <h2 className="text-2xl font-bold text-[#373737]">
                  {selectedBlog.title}
                </h2>

                {/* Meta */}
                <div className="flex justify-between text-sm text-[#6E6E6E]">
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

                {/* Full Content */}
                <p className="text-[#373737] leading-relaxed whitespace-pre-line">
                  {selectedBlog.content}
                </p>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default BlogPage;