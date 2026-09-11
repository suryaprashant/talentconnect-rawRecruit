import mongoose from "mongoose";
import dotenv from "dotenv";

import CompanyMaster from "../models/companyMasterModel.js";
import { COMPANY_ALIAS_MAP } from "../data/companies.js";

dotenv.config();

const seed = async () => {
  try {

    const companies = Object.entries(
      COMPANY_ALIAS_MAP
    ).map(([canonicalId, aliases]) => ({
      canonical_id: canonicalId,

      display_name: aliases[0]
        .split(" ")
        .map(
          word =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" "),

      aliases,
    }));

     await mongoose.connect(process.env.DB_URL);

    await CompanyMaster.deleteMany({});

    await CompanyMaster.insertMany(
      companies
    );

    console.log(
      `Inserted ${companies.length} companies`
    );

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();