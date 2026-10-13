import express from "express";
import OnboardingModel from "../models/studentonboardingModel.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { query, location, experience, salary } = req.query;

    const mongoQuery = {};

    // Full text search on name, skills, jobRoles, industry
    if (query) {
      mongoQuery.$or = [
        { name: new RegExp(query, "i") },
        { skills: { $regex: query, $options: "i" } },
        { jobRoles: { $regex: query, $options: "i" } },
        { industry: { $regex: query, $options: "i" } },
      ];
    }

    // Location filter
    if (location) {
      mongoQuery.locations = { $regex: location, $options: "i" };
    }

    // Experience filter (if numeric field exists, e.g. years)
    if (experience) {
      mongoQuery["experiences"] = {
        $elemMatch: { description: { $regex: experience, $options: "i" } },
      };
    }

    // Salary filter (assuming `expectedSalaryAmount` is numeric)
    if (salary) {
      const [min, max] = salary.split("-").map(Number);
      mongoQuery.expectedSalaryAmount = { $gte: min, $lte: max };
    }

    const results = await OnboardingModel.find(mongoQuery).limit(50);
    console.log("Search results:", results);
    res.json({ success: true, results });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;