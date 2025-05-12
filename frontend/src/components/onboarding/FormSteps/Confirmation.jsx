import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Confirmation = ({ onSubmit, onCancel }) => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setAgreed(!agreed);
  };

  const handleSubmit = () => {
    // Call the onSubmit prop if it exists
    if (onSubmit) {
      onSubmit();
    }
    // Then navigate to welcome page
    navigate('/welcome');
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[1144px] my-auto pb-6 max-md:max-w-full">
      <div className="flex min-h-6 w-full items-stretch gap-[15px] justify-center flex-wrap mt-5 max-md:max-w-full">
        <div className="flex items-center gap-2.5 justify-center h-full w-6">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={handleCheckboxChange}
            className="w-6 h-6 cursor-pointer"
          />
        </div>
        <label
          htmlFor="terms"
          className="self-stretch min-w-60 min-h-6 gap-2.5 text-base text-black font-normal text-center my-auto cursor-pointer"
        >
          I agree to the Terms & Conditions and Privacy Policy.
        </label>
      </div>
      <div className="self-center flex items-center gap-4 text-base font-normal mt-6">
        <div className="self-stretch flex min-w-60 gap-4 my-auto">
          <button
            onClick={onCancel}
            className="self-stretch gap-2 border rounded-md text-black whitespace-nowrap px-6 py-3 max-md:px-5 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!agreed}
            className={`self-stretch gap-2 text-white px-6 border rounded-md py-3 max-md:px-5 cursor-pointer ${
              agreed ? "bg-black" : "bg-gray-400"
            }`}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};