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
        threshold: 0.4,
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        distance: 100,
      }
    );

    companyFuse = new Fuse(
      companies,
      {
        keys: ["aliases"],
        threshold: 0.4,
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        distance: 100,
      }
    );
  };

export const getCollegeFuse =
  () => collegeFuse;

export const getCompanyFuse =
  () => companyFuse;