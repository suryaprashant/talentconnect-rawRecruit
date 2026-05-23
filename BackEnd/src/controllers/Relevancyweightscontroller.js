import RelevancyWeights from "../models/Relevancyweightsmodel.js";


const WEIGHT_KEYS = ['skills','jobRoles','experience','noticePeriod','noticePeriodDays','cgpa','batchYear','location','degree','stream','salary'];


const DEFAULTS = {
  skills: 26,
  jobRoles: 16,
  experience: 14,
  noticePeriod: 5,
  noticePeriodDays: 3,
  cgpa: 2,
  batchYear: 7,
  location: 8,
  degree: 7,
  stream: 5,
  salary: 7,
};

export const getRelevancyWeights = async (req, res) => {
  try {
    let config = await RelevancyWeights.findOne().lean();

    // Build a clean response using only valid weight keys,
    // falling back to DEFAULTS for any missing field
    const data = {};
    for (const key of WEIGHT_KEYS) {
      data[key] = config?.[key] ?? DEFAULTS[key];
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[RelevancyWeights] GET Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


export const updateRelevancyWeights = async (req, res) => {
  try {
    const adminId = req.user?._id;

    
    const incoming = {};
    for (const key of WEIGHT_KEYS) {
      if (req.body[key] !== undefined) {
        const val = Number(req.body[key]);
        if (isNaN(val) || val < 0) {
          return res.status(400).json({
            success: false,
            error: `Invalid value for "${key}": must be a non-negative number.`,
          });
        }
        incoming[key] = val;
      }
    }

    if (Object.keys(incoming).length === 0) {
      return res.status(400).json({
        success: false,
        error: `No valid weight keys provided. Accepted keys: ${WEIGHT_KEYS.join(", ")}`,
      });
    }

    // --- 2. Fetch current config (or use defaults) ---
    let current = await RelevancyWeights.findOne();
    const currentValues = current
      ? current.toObject()
      : {
          
  skills: 26,
  jobRoles: 16,
  experience: 14,
  noticePeriod: 5,
  noticePeriodDays: 3,
  cgpa: 2,
  batchYear: 7,
  location: 8,
  degree: 7,
  stream: 5,
  salary: 7,

        };

    
    const merged = { ...currentValues, ...incoming };

 
    const total = WEIGHT_KEYS.reduce((sum, k) => sum + (merged[k] || 0), 0);
    if (total !== 100) {
      return res.status(400).json({
        success: false,
        error: `Weights must sum to 100. Current sum after update: ${total}. Adjust values accordingly.`,
        currentMergedValues: merged,
      });
    }

  
    const updated = await RelevancyWeights.findOneAndUpdate(
      {}, 
      { ...merged, lastUpdatedBy: adminId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`\x1b[32m[RelevancyWeights] Updated by admin ${adminId}\x1b[0m`, merged);

    return res.status(200).json({
      success: true,
      message: "Relevancy weights updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("[RelevancyWeights] PATCH Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};