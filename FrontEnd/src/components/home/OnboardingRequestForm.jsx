import axios from "axios";
import { useState } from "react";

export default function OnboardingRequestForm({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: "",
    time: "",
    category: "onboarding-support",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const backendUrl = import.meta.env.VITE_Backend_URL;

      await axios.post(`${backendUrl}/api/servicerequests/onboarding-support`, {
        ...form,
      });

      alert("Request submitted successfully");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input name="name" placeholder="Name" required onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="email" placeholder="Email" required onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="phone" placeholder="Phone" required onChange={handleChange} className="w-full border p-2 rounded" />

      <textarea name="message" placeholder="Message" onChange={handleChange} className="w-full border p-2 rounded" />

      <div className="flex gap-2">
        <input type="date" name="date" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="time" placeholder="Time (e.g. 10:00 AM)" onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      {/* <input name="category" placeholder="Category" onChange={handleChange} className="w-full border p-2 rounded" /> */}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primaryBrand text-white py-2 rounded-lg"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}