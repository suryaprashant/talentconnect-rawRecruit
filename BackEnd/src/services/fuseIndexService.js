import Fuse from "fuse.js";

import CollegeMaster
  from "../models/collegeMasterModel.js";

import CompanyMaster
  from "../models/companyMasterModel.js";

let collegeFuse = null;
let companyFuse = null;

export const refreshFuseIndex =
  async () => {

    const colleges =
      await CollegeMaster.find()
        .lean();

    const companies =
      await CompanyMaster.find()
        .lean();

    collegeFuse = new Fuse(
      colleges,
      {
        keys: ["aliases"],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 3,
      }
    );

    companyFuse = new Fuse(
      companies,
      {
        keys: ["aliases"],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 3,
      }
    );
  };

export const getCollegeFuse =
  () => collegeFuse;

export const getCompanyFuse =
  () => companyFuse;