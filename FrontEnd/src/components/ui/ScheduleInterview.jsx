import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { scheduleInterview } from '../../lib/Company_AxiosInstance';

const InterviewSchedulerPopup = ({ setToggleScheduleInterviewPopup, applicantId, applicantType, jobRole }) => {
  const [form, setForm] = useState({
    date: '',
    time: '',
    message: '',
    meetLink: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await scheduleInterview(applicantId, applicantType, jobRole, form);
      if (response?.data?.success === true) toast.success("Interview Scheduled!");
      else toast.error(response.response?.data?.msg);
    } catch (error) {
      toast.error('Something went wrong!')
    }

    setTimeout(() => {
      setToggleScheduleInterviewPopup(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={() => setToggleScheduleInterviewPopup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          aria-label="Close"
        >&times;</button>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Schedule Interview
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex space-x-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={form.date}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={form.time}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Meet Link</label>
            <input
              type="url"
              name="meetLink"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={form.meetLink}
              onChange={handleChange}
              placeholder="https://meet..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message (optional)</label>
            <textarea
              name="message"
              rows="3"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={form.message}
              onChange={handleChange}
              placeholder="Add notes or agenda"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 mt-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterviewSchedulerPopup;
