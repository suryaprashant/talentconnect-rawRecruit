import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const backendUrl = import.meta.env.VITE_Backend_URL;

        const res = await axios.get(`${backendUrl}/api/blogs`);

        setBlogs(res.data.data || []);
      } catch (err) {
        console.error(err);
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
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // ⚪ Empty
  if (!blogs.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6E6E6E]">
        No blogs available
      </div>
    );
  }

  return (
    <>
        <Navbar />
        <div className="min-h-screen bg-[#F2F2F2] py-10 px-4">
        
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