import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    tags: "",
  });

  const [image, setImage] = useState(null);

  //  Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_Backend_URL}/api/blogs`
      );
      setBlogs(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load blogs ❌");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  //  Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //  Submit (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("author", form.author);
      formData.append("tags", form.tags);

      if (image) {
        formData.append("image", image);
      }

      if (editingBlog) {
        await axios.put(
          `${import.meta.env.VITE_Backend_URL}/api/blogs/${editingBlog._id}`,
          formData
        );
        alert("Blog updated successfully ✅");
      } else {
        await axios.post(`${import.meta.env.VITE_Backend_URL}/api/blogs`, formData);
        alert("Blog created successfully 🎉");
      }

      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    }
  };

  //  Delete blog
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_Backend_URL}/api/blogs/${id}`);
      alert("Blog deleted successfully 🗑️");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };

  //  Edit click
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      tags: blog.tags?.join(",") || "",
    });
  };

  //  Reset
  const resetForm = () => {
    setEditingBlog(null);
    setForm({
      title: "",
      content: "",
      author: "",
      tags: "",
    });
    setImage(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {editingBlog ? "Edit Blog" : "Create Blog"}
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8 space-y-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="w-full border p-3 rounded h-32"
          required
        />

        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {/* Image Upload */}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-[#143694] text-white px-6 py-2 rounded"
          >
            {editingBlog ? "Update Blog" : "Create Blog"}
          </button>

          {editingBlog && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Blog List */}
      <h2 className="text-xl font-semibold mb-4">All Blogs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border rounded-xl p-4 shadow-sm bg-white"
          >
            {blog.coverImage && (
              <img
                src={blog.coverImage}
                alt="blog"
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            <h3 className="font-bold text-lg">{blog.title}</h3>

            <p className="text-gray-600 text-sm mb-1">
              {blog.author}
            </p>

            {/*  Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {blog.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-700 line-clamp-3 mt-2">
              {blog.content}
            </p>

            {/*  Actions */}
            <div className="mt-3 flex justify-between items-center">
              <button
                onClick={() => handleEdit(blog)}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(blog._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogs;