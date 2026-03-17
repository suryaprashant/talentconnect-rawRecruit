import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { deleteAccountApi } from "@/lib/User_AxiosInstance";
import { useNavigate } from "react-router-dom";
//import { toast } from "react-toastify";
import toast from "react-hot-toast";

const DeleteAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
const handleDelete = async () => {
  console.log('Inside handleDelete - Started'); // 1. Check if this logs
  setLoading(true);
  try {
    console.log('Attempting API call...'); // 2. Check if this logs
    const data = await deleteAccountApi(email, password);
    console.log("API Success:", data);
    
    toast.success(data.message || "Success");
    navigate("/");
  } catch (error) {
    console.log("CATCH TRIGGERED:", error); // 3. This will tell you the real reason
    toast.error(error.response?.data?.message || "Error");
  } finally {
    setLoading(false);
  }
};

  const confirmDelete = (e) => {
  e.preventDefault();
  console.log("confirm");

  toast.custom((t) => (
    <div className="bg-white p-4 rounded-lg shadow-lg border">
      <p className="mb-4 font-medium text-gray-800">
        Are you sure? This action is permanent.
      </p>

      <div className="flex gap-3 justify-end">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
          onClick={() => {
            handleDelete();
            toast.dismiss(t.id);
          }}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  ));
};
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-red-500 p-3 rounded-xl">
              <AlertTriangle className="text-white w-6 h-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Delete Your Account</h1>
          <p className="text-gray-500 text-sm mt-2">
            Please enter your credentials to confirm permanent deletion.
          </p>
        </div>

        <form  className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <button
          type="button"
           onClick={confirmDelete}
            disabled={loading}
            className={`w-full font-semibold py-3 rounded-lg transition ${
              loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {loading ? "Processing..." : "Delete My Account"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm font-medium text-red-600 mt-4 italic">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default DeleteAccount;