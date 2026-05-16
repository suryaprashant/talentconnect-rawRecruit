import Resume from "../models/resumeModel.js";
import {
  fetchAllResumeService,
  saveParsedResumeService,
} from "../services/resumeService.js";
import { calculateMatchScore } from "../utils/weightedResumeSearch.js";
import { parseResumeWithPython } from "../services/resumeParserService.js";
import cloudinary from "../../config/cloudinary.js";
import OnboardingModel from "../models/studentonboardingModel.js"
import parsedResumeModel from "../models/parsedResumeModel.js";
/*export const uploadResume = async (req, res) => {
  try {
    // --- All Pre-checks are here in the controller ---
    console.log("Resume upload request received by controller.");
    if (!req.file) {
      return res.status(400).json({ message: "No resume file was uploaded." });
    }

    // Call the service to do the hard work
    const extractedData = await parseResume(req.file.buffer);
    
    // Send the successful response
    res.status(200).json(extractedData);

  } catch (error) {
    console.error("Error in uploadResume controller:", error.message);
    res.status(500).json({ message: "Server error during resume parsing." });
  }
};*/

// In resumeController.js - Update Cloudinary upload
{/*export const uploadResume = async (req, res) => {
  try {
    console.log("I m Back");
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized: user not authenticated"
      });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }

    const userId = req.user?._id;
    
    // Convert to base64
    const base64Data = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64Data}`;

    // Upload with CORRECT settings for PDF
    const cloudinaryResult = await cloudinary.uploader.upload(dataURI, {
      folder: "rawrecruit/resumes",
      resource_type: "raw", 
      allowed_formats: [
      "pdf",
      "doc",
      "docx",
      "ppt",
      "pptx",
      "xls",
      "xlsx",
      "txt",
      "zip",
    ], // ← CHANGE from "raw" to "auto"
      public_id: `resume_${userId}_${Date.now()}`,  // ← ADD .pdf extension
      transformation: [
        { flags: "attachment" }  // Force download
      ]
    });

    const extractedData = await parseResume(req.file.buffer);

    //save DB 
     await OnboardingModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          resume: cloudinaryResult.secure_url
        }
      },
      { upsert: true, new: true }
    );
    const onboardingDoc = await OnboardingModel.findOne({ userId }).select("resume");

    console.log("✅ Resume stored in DB:", onboardingDoc?.resume);


    res.status(200).json({
      resumeUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      parsedData: extractedData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Resume upload failed" });
  }
};*/}

  //python parse resume call
  export const uploadResume = async (req, res) => {
    try {
      console.log("📄 Resume upload started");

      if (!req.user || !req.user._id) {
        return res.status(401).json({
          message: "Unauthorized: user not authenticated"
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No resume uploaded"
        });
      }

      const userId = req.user._id;

      // Convert buffer → base64 for Cloudinary
      const base64Data = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${base64Data}`;

      // Upload Resume to Cloudinary
      const cloudinaryResult = await cloudinary.uploader.upload(dataURI, {
        folder: "rawrecruit/resumes",
        resource_type: "raw",
        allowed_formats: ["pdf", "doc", "docx"],
        public_id: `resume_${userId}_${Date.now()}`,
        transformation: [{ flags: "attachment" }]
      });

      console.log("☁️ Resume uploaded to Cloudinary");

      // ✅ ALWAYS SAVE RESUME URL
      await OnboardingModel.findOneAndUpdate(
        { userId },
        {
          $set: {
            resume: cloudinaryResult.secure_url
          }
        },
        { upsert: true, new: true }
      );

      console.log("✅ Resume URL saved in onboarding");

      let parsedData = null;

      // 🔥 PARSER SHOULD NOT BREAK UPLOAD FLOW
      try {

        parsedData = await parseResumeWithPython(
          req.file.buffer,
          req.file.originalname
        );

        console.log("🤖 Resume parsed successfully");

        // Save parsed data
        await parsedResumeModel.findOneAndUpdate(
          { userId },
          {
            $set: {
              userId,
              resumeUrl: cloudinaryResult.secure_url,
              parsedData
            }
          },
          {
            upsert: true,
            new: true
          }
        );

        console.log("✅ Parsed data stored");

      } catch (parserErr) {

        console.error("❌ Resume parsing failed:", parserErr);

      }

      // ✅ Upload succeeds even if parser fails
      res.status(200).json({
        success: true,
        resumeUrl: cloudinaryResult.secure_url,
        parsedData
      });

    } catch (err) {

      console.error("❌ Resume upload failed:", err);

      res.status(500).json({
        success: false,
        message: "Resume upload failed"
      });

    }
  };

export const getParsedResume = async (req, res) => {
  try {

    const userId = req.user._id;

    const parsed = await parsedResumeModel.findOne({ userId });

    res.json({
      success: true,
      data: parsed?.parsedData || null
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch parsed resume"
    });

  }
};

export async function resumeSearch(req, res) {
  // reqbody jobdesc.
  // if(!req.body) return res.status(404).json({msg:"No job description"});
  const { query, location, experience, salary } = req.query;
  try {
    // resume
    const response = await fetchAllResumeService(experience);
    // console.log(response);
    // perform weighted search
    let preferedResume;
    if (response.success) {
      preferedResume = calculateMatchScore(
        response.data,
        query,
        location,
        experience,
        salary
      );
      return res.status(200).json(preferedResume);
    }

    // res.status(200).json(response.data);
    res.status(204).json({ msg: "No matching resume" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getUserResume = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    console.log("Fetching resume for user:", userId);
    
    // Check Resume collection
    const resume = await Resume.findOne({ userId: userId });
    
    if (!resume || !resume.resumeFile || !resume.resumeFile.url) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }
    
    let resumeUrl = resume.resumeFile.url;
    
    // Ensure URL ends with .pdf for Cloudinary
    if (resumeUrl.includes("cloudinary.com") && !resumeUrl.includes(".pdf")) {
      resumeUrl = resumeUrl + ".pdf";
      console.log("Added .pdf extension to URL");
    }
    
    res.json({
      success: true,
      data: {
        resumeUrl: resumeUrl,
        fileName: resume.resumeFile.fileName || "resume.pdf",
        userId: userId
      }
    });
    
  } catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resume"
    });
  }
};

export const serveResume = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    console.log("Serving resume for user:", userId);
    
    // Find the resume
    const resume = await Resume.findOne({ userId: userId });
    
    if (!resume) {
      return res.status(404).json({ error: "Resume not found in database" });
    }
    
    if (!resume.resumeFile || !resume.resumeFile.url) {
      return res.status(404).json({ error: "No resume URL found" });
    }
    
    const cloudinaryUrl = resume.resumeFile.url;
    console.log("Fetching from Cloudinary:", cloudinaryUrl);
    
    // Fetch from Cloudinary
    const response = await fetch(cloudinaryUrl);
    
    if (!response.ok) {
      throw new Error(`Cloudinary returned ${response.status}`);
    }
    
    // Get the PDF data
    const pdfBuffer = await response.arrayBuffer();
    
    // Set headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${resume.resumeFile.fileName || 'resume.pdf'}"`);
    res.setHeader('Content-Length', pdfBuffer.byteLength);
    
    // Send the PDF
    res.end(Buffer.from(pdfBuffer));
    
  } catch (error) {
    console.error("Serve error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const viewResumeAsPdf = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    console.log("Viewing resume as PDF for user:", userId);
    
    // Find resume
    const resume = await Resume.findOne({ userId });
    
    if (!resume || !resume.resumeFile?.url) {
      return res.status(404).json({ error: "Resume not found" });
    }
    
    const cloudinaryUrl = resume.resumeFile.url;
    console.log("Fetching from:", cloudinaryUrl);
    
    // Fetch from Cloudinary
    const response = await fetch(cloudinaryUrl);
    
    if (!response.ok) {
      throw new Error(`Cloudinary error: ${response.status}`);
    }
    
    // Get the file data
    const fileBuffer = await response.arrayBuffer();
    
    // Set PDF headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${resume.resumeFile.fileName || 'resume.pdf'}"`);
    res.setHeader('Content-Length', fileBuffer.byteLength);
    
    // Send as PDF
    res.send(Buffer.from(fileBuffer));
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to serve resume as PDF" });
  }
};

