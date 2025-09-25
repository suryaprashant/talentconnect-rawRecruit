import React, { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator"; // Assuming this component exists
import { UploadIcon } from "lucide-react"; // Assuming you have lucide-react installed

export const StepOne = ({ onNext, onCancel, onChange }) => {
  // State from both files combined
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // The complete handleFileChange function with API logic
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsLoading(true);
    setMessage("Parsing your resume... Please wait.");

    const data = new FormData();
    // 'resume' must match the key your backend expects
    data.append('resume', selectedFile); 

    try {
      // Fetch call to your backend endpoint
      const response = await fetch(`${import.meta.env.VITE_Backend_URL}/api/upload/resume`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume. Please try again.');
      }

      const parsedData = await response.json();
      
      // Update the parent component's state with the parsed data
      onChange(parsedData);
      
      setMessage(`Success! Data has been extracted.`);
      setIsLoading(false);
      
      // Automatically move to the next step after a short delay
      setTimeout(() => {
        onNext();
      }, 1000);

    } catch (error) {
      console.error("Error uploading resume:", error);
      setMessage(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={1} totalSteps={6} />

      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <div className="w-full text-black max-md:max-w-full">
          <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
            Upload Your Resume to Auto-Fill Your Details
          </h2>
          <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
            Save time by uploading your resume. We'll extract key details to
            pre-fill your onboarding form. You can review and edit before
            submitting.
          </p>
        </div>

        <div className="w-full text-base font-normal mt-8 max-md:max-w-full">
          <div className="w-full max-md:max-w-full">
            <label className="text-black max-md:max-w-full block">
              Upload Resume
            </label>
            <label className="items-center flex min-h-12 w-full gap-2 text-[#666] mt-2 p-3 max-md:max-w-full border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
              <span className="self-stretch flex-1 shrink basis-[0%] my-auto">
                {file ? file.name : "Upload PDF"}
              </span>
              <UploadIcon className="self-stretch w-6 shrink-0 h-6 my-auto" />
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading} 
              />
            </label>
            {/* Display feedback messages to the user */}
            {message && <p className="text-sm mt-2">{message}</p>}
          </div>

          <div className="flex min-h-12 w-full gap-2.5 whitespace-nowrap mt-6 max-md:max-w-full">
            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="self-stretch gap-2 text-black px-6 py-3 max-md:px-5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onNext}
                className="self-stretch bg-black gap-2 text-white px-6 py-3 max-md:px-5 cursor-pointer disabled:bg-gray-400"
                disabled={isLoading || !file} 
              >
                {isLoading ? "Processing..." : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};