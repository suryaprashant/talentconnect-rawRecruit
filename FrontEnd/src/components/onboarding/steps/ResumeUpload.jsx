import React from "react";
import { FaUpload, FaFilePdf } from "react-icons/fa";

export default function ResumeUpload({ formData, handleInputChange, disabled = false }) {
  const fileName = formData?.resume?.name || null;

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">Resume</h3>
          <p className="text-sm text-gray-600">
            Upload a PDF resume to auto-fill profile fields.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 cursor-pointer">
          <span className="sr-only">Upload resume</span>
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            onChange={handleInputChange}
            disabled={disabled}
            className="hidden"
          />
          <span className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
            <FaUpload />
            Choose PDF
          </span>
        </label>
      </div>

      {fileName && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          <FaFilePdf className="text-red-600" />
          <span className="truncate">{fileName}</span>
        </div>
      )}
    </div>
  );
}
