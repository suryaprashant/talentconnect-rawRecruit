import mongoose from "mongoose";
import dotenv from "dotenv";

import CollegeMaster from "../models/collegeMasterModel.js";
import { COLLEGE_ALIAS_MAP } from "../data/colleges.js";

dotenv.config();

const seedColleges = async () => {
  try {
    const colleges = Object.entries(
      COLLEGE_ALIAS_MAP
    ).map(([canonicalId, aliases]) => ({
      canonical_id: canonicalId,

      display_name:
        aliases[0]
          .split(" ")
          .map(
            word =>
              word.charAt(0).toUpperCase() +
              word.slice(1)
          )
          .join(" "),

      aliases,
    }));

    await mongoose.connect(
      process.env.DB_URL
    );

    await CollegeMaster.deleteMany({});

    await CollegeMaster.insertMany(
      colleges
    );

    console.log(
      `Inserted ${colleges.length} colleges`
    );

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedColleges();