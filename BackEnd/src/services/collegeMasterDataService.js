import CollegeMasterData from "../models/collegeMasterData.js";


export const createCollegeMasterData = async ({ type, value }) => {
  if (!type || !value) {
    throw new Error("Type and value are required");
  }

  // Trim value to avoid duplicate issues with spaces
  const trimmedValue = value.trim();

  // Check duplicate
  const existing = await CollegeMasterData.findOne({
    type,
    value: trimmedValue,
  });

  if (existing) {
    throw new Error("This value already exists");
  }

  const masterData = await CollegeMasterData.create({
    type,
    value: trimmedValue,
  });

  return masterData;
};


// GET BY TYPE

export const getCollegeMasterDataByType = async (type) => {
  if (!type) {
    throw new Error("Type is required");
  }

  const data = await CollegeMasterData.find({
    type,
    isActive: true,
  }).sort({ value: 1 });

  return data;
};