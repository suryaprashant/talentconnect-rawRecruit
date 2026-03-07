import SkillsModel from '../models/skillsModel.js';

// GET all skills
export const getAllSkills = async (req, res) => {
    try {
        const skills = await SkillsModel.find();
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: "Error fetching skills", error: error.message });
    }
};

// POST a new skill
// POST a new skill
export const addSkill = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !skills.trim()) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    // normalize ONCE
    const normalizedSkill = skills.trim().toLowerCase();

    // exact match (FAST + SAFE)
    const existing = await SkillsModel.findOne({
      skills: normalizedSkill
    });

    if (existing) {
      return res.status(409).json({
        message: "Skill already exists"
      });
    }

    const newSkill = new SkillsModel({
      skills: normalizedSkill
    });

    const saved = await newSkill.save();
    res.status(201).json(saved);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Skill already exists" });
    }

    res.status(500).json({
      message: "Error adding skill",
      error: error.message
    });
  }
};

export const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await SkillsModel.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Skill not found" });
        
        res.status(200).json({ message: "Skill deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting skill", error: error.message });
    }
};