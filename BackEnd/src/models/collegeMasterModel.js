import mongoose from "mongoose";

const collegeMasterSchema = new mongoose.Schema(
  {
    canonical_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    display_name: {
      type: String,
      required: true,
      trim: true,
    },

    short_name: String,

    type: {
      type: String,
      default: "other",
    },

    tier: {
      type: Number,
      default: 3,
    },

    country: {
      type: String,
      default: "India",
    },

    state: String,
    city: String,

    aliases: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    search_tokens: [String],
  },
  {
    timestamps: true,
    collection: "colleges_master",
  }
);

collegeMasterSchema.index({ aliases: 1 });

export default mongoose.model(
  "CollegeMaster",
  collegeMasterSchema
);