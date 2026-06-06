import CollegeMaster from "../models/collegeMasterModel.js";
import CompanyMaster from "../models/companyMasterModel.js";
import { normalizeText } from "../utils/normalizeText.js";

export const resolveCollege =
  async (rawInput) => {

    if (!rawInput) {
      return null;
    }

    const normalized =
      normalizeText(rawInput);

    const match =
      await CollegeMaster.findOne({
        aliases: normalized,
      }).lean();

    if (!match) {
      return null;
    }

    return {
      masterId: match._id,

      canonicalId:
        match.canonical_id,

      displayName:
        match.display_name,
    };
  };


export const resolveCompany =
  async (rawInput) => {

    if (!rawInput) {
      return null;
    }

    const normalized =
      normalizeText(rawInput);

    const match =
      await CompanyMaster.findOne({
        aliases: normalized,
      }).lean();

    if (!match) {
      return null;
    }

    return {
      masterId: match._id,

      canonicalId:
        match.canonical_id,

      displayName:
        match.display_name,
    };
  };