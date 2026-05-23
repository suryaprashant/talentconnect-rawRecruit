import RelevancyWeights from "../models/Relevancyweightsmodel.js";
import RelevancyWeightsProfessional from "../models/RelevancyweightsProfessionalmodel.js";

const WEIGHT_KEYS = [
  "skills",
  "jobRoles",
  "experience",
  "noticePeriod",
  "noticePeriodDays",
  "cgpa",
  "batchYear",
  "location",
  "degree",
  "stream",
  "salary",
];

const DEFAULTS_STUDENT = {
  skills:           38,
  jobRoles:          7,
  experience:        4,
  noticePeriod:      2,
  noticePeriodDays:  2,
  cgpa:              6,
  batchYear:         5,
  location:          4,
  degree:           13,
  stream:           16,
  salary:            3,
};

const DEFAULTS_PROFESSIONAL = {
  skills:           40,
  jobRoles:         13,
  experience:        9,
  noticePeriod:      4,
  noticePeriodDays:  3,
  cgpa:              0,
  batchYear:         0,
  location:          4,
  degree:            9,
  stream:           13,
  salary:            5,
};

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/**
 * Build and validate incoming weights from req.body.
 * Returns { incoming } on success, or sends a 400 response and returns null.
 */
const parseIncomingWeights = (req, res) => {
  const incoming = {};

  for (const key of WEIGHT_KEYS) {
    if (req.body[key] !== undefined) {
      const val = Number(req.body[key]);
      if (isNaN(val) || val < 0) {
        res.status(400).json({
          success: false,
          error: `Invalid value for "${key}": must be a non-negative number.`,
        });
        return null;
      }
      incoming[key] = val;
    }
  }

  if (Object.keys(incoming).length === 0) {
    res.status(400).json({
      success: false,
      error: `No valid weight keys provided. Accepted keys: ${WEIGHT_KEYS.join(", ")}`,
    });
    return null;
  }

  return incoming;
};

/**
 * Merge incoming weights with current DB values (or defaults),
 * validate sum === 100, and upsert the record.
 */
const mergeAndSave = async (res, Model, defaults, adminId, incoming) => {
  const current = await Model.findOne();
  const currentValues = current ? current.toObject() : { ...defaults };

  const merged = { ...currentValues, ...incoming };

  const total = WEIGHT_KEYS.reduce((sum, k) => sum + (merged[k] || 0), 0);
  if (total !== 100) {
    return res.status(400).json({
      success: false,
      error: `Weights must sum to 100. Current sum after update: ${total}. Adjust values accordingly.`,
      currentMergedValues: merged,
    });
  }

  const updated = await Model.findOneAndUpdate(
    {},
    { ...merged, lastUpdatedBy: adminId },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return updated;
};

// ---------------------------------------------------------------------------
// Student controllers
// ---------------------------------------------------------------------------

export const getRelevancyWeights = async (req, res) => {
  try {
    const config = await RelevancyWeights.findOne().lean();

    const data = {};
    for (const key of WEIGHT_KEYS) {
      data[key] = config?.[key] ?? DEFAULTS_STUDENT[key];
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[RelevancyWeights Student] GET Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const updateRelevancyWeights = async (req, res) => {
  try {
    const adminId = req.user?._id;

    const incoming = parseIncomingWeights(req, res);
    if (!incoming) return; // response already sent

    const updated = await mergeAndSave(
      res,
      RelevancyWeights,
      DEFAULTS_STUDENT,
      adminId,
      incoming
    );
    if (!updated) return; // sum-validation response already sent

    console.log(`\x1b[32m[RelevancyWeights Student] Updated by admin ${adminId}\x1b[0m`, updated);

    return res.status(200).json({
      success: true,
      message: "Student relevancy weights updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("[RelevancyWeights Student] PATCH Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// ---------------------------------------------------------------------------
// Professional controllers
// ---------------------------------------------------------------------------

export const getRelevancyWeightsProfessional = async (req, res) => {
  try {
    const config = await RelevancyWeightsProfessional.findOne().lean();

    const data = {};
    for (const key of WEIGHT_KEYS) {
      data[key] = config?.[key] ?? DEFAULTS_PROFESSIONAL[key];
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[RelevancyWeights Professional] GET Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const updateRelevancyWeightsProfessional = async (req, res) => {
  try {
    const adminId = req.user?._id;

    const incoming = parseIncomingWeights(req, res);
    if (!incoming) return; // response already sent

    const updated = await mergeAndSave(
      res,
      RelevancyWeightsProfessional,
      DEFAULTS_PROFESSIONAL,
      adminId,
      incoming
    );
    if (!updated) return; // sum-validation response already sent

    console.log(`\x1b[32m[RelevancyWeights Professional] Updated by admin ${adminId}\x1b[0m`, updated);

    return res.status(200).json({
      success: true,
      message: "Professional relevancy weights updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("[RelevancyWeights Professional] PATCH Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};