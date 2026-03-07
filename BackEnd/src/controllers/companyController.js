import CompanyMasterData from "../models/companyMasterData.js";
import { createProfileService } from "../services/companyService.js";

export async function createCompanyProfile(req, res) {
    try {
        const response = await createProfileService(req.body);
        res.status(201).json({ msg: "Profile Created!" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }

}

export const getCompanyMasterData = async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ msg: "Type is required" });
  }

  try {
    const data = await CompanyMasterData.find({
      type,
      isActive: true,
    }).sort({ value: 1 });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Company Master Data Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const createCompanyMasterData = async (req, res) => {
  const { type, value, parent } = req.body;
  const userId = req.user._id;

  if (!type || !value) {
    return res.status(400).json({ msg: "Type and value are required" });
  }

  try {
    const existing = await CompanyMasterData.findOne({
      type,
      value: { $regex: `^${value}$`, $options: "i" },
      parent: parent || null,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        data: existing,
      });
    }

    const newEntry = await CompanyMasterData.create({
      type,
      value,
      parent: parent || null,
      isCustom: true,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      data: newEntry,
    });
  } catch (error) {
    console.error("Create Company Master Data Error:", error);

    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        msg: "Value already exists",
      });
    }

    res.status(500).json({ msg: "Internal server error" });
  }
};