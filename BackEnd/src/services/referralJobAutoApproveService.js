/**
 * referralJobAutoApproveService.js
 *
 * Auto-approve / auto-reject engine for referral job postings.
 *
 * Groups:
 *   1 — Job field completeness (jobTitle, companyName, skills, description, salary, endDate)
 *   2 — Poster profile completeness (profileType, experience, currentCompany, email, skills)
 *   3 — Company existence in CompanyMaster + job↔poster company name match
 *   4 — LinkedIn URL validity
 *
 * Returns:
 *   {
 *     approvalStatus : "Approved" | "Rejected" | "Pending",
 *     autoApproveReasons : string[],   // human-readable, stored on the job doc
 *     hardReject : boolean,
 *     flagged    : boolean,
 *   }
 *
 * Decision rule:
 *   hardReject === true  → "Rejected"
 *   hardReject === false && flagged === true → "Pending"  (needs human review)
 *   hardReject === false && flagged === false → "Approved"
 */

import CompanyMaster from "../models/companyMasterModel.js";

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function normalize(str) {
  return str?.trim().toLowerCase() ?? "";
}

// ---------------------------------------------------------------------------
// main export
// ---------------------------------------------------------------------------

/**
 * @param {object} job    — plain job document (lean or Mongoose doc) from jobPostingsModel
 * @param {object} poster — plain poster profile from studentonboardingModel,
 *                          already populated (fetch with all needed fields before calling)
 *
 * NOTE: call this ONLY after you have confirmed `poster` is non-null.
 * If `job.candidatePosted` is null/undefined, set hardReject = true upstream
 * and skip this function entirely (per spec Group 2 check #0).
 */
export async function runAutoApproveChecks(job, poster) {
  const reasons = [];
  let hardReject = false;
  let flagged = false;

  // -------------------------------------------------------------------------
  // GROUP 1 — Job field checks
  // -------------------------------------------------------------------------

  // 1-1. jobTitle — ARRAY, required:true only guarantees field exists, not non-empty
  if (
    !Array.isArray(job.jobTitle) ||
    job.jobTitle.length === 0 ||
    !job.jobTitle[0]?.trim()
  ) {
    reasons.push("Job has no title");
    hardReject = true;
  }

  // 1-2. companyName
  if (!job.companyName?.trim()) {
    reasons.push("Job has no company name");
    hardReject = true;
  }

  // 1-3. skills[]
  if (!Array.isArray(job.skills) || job.skills.length === 0) {
    reasons.push("Job has no skills listed");
    hardReject = true;
  }

  // 1-4. description — minimum 50 characters
  if (
    typeof job.description !== "string" ||
    job.description.trim().length < 50
  ) {
    reasons.push(
      "Job description is missing or too short (minimum 50 characters)"
    );
    hardReject = true;
  }

  // 1-5. packageDetails.totalCTC — flag (not hard reject)
  const ctc = job.packageDetails?.totalCTC;
  if (ctc === undefined || ctc === null || ctc <= 0) {
    reasons.push("Job has no salary/CTC information provided");
    flagged = true;
  } else if (ctc > 10_000_000) {
    reasons.push("Job's salary/CTC appears unrealistically high");
    flagged = true;
  }

  // 1-6. endDate — real Date field, compare directly
  if (!job.endDate || job.endDate <= new Date()) {
    reasons.push("Job has no valid end date or end date is in the past");
    hardReject = true;
  }

  // -------------------------------------------------------------------------
  // GROUP 2 — Poster profile completeness
  // (poster is guaranteed non-null by the caller; see Group 2 check #0 note above)
  // -------------------------------------------------------------------------

  // 2-1. profileType must be "professional"
  if (poster.profileType !== "professional") {
    reasons.push(
      "Poster is not a professional (student/fresher cannot post referral jobs)"
    );
    hardReject = true;
  }

  // 2-2. totalYearsOfExperience — use parseFloat (values like "1.5" are valid)
  const yoe = parseFloat(poster.totalYearsOfExperience);
  if (isNaN(yoe) || yoe <= 0) {
    reasons.push("Poster has no valid work experience listed");
    hardReject = true;
  }

  // 2-3. currentCompany
  if (!poster.currentCompany?.trim()) {
    reasons.push("Poster has no current company listed");
    hardReject = true;
  }

  // 2-4. experiences[] — strict: at least one entry with a real company field
  if (
    !Array.isArray(poster.experiences) ||
    !poster.experiences.some((e) => e.company?.trim())
  ) {
    reasons.push(
      "Poster profile has no meaningful experience entries (all blank or missing)"
    );
    hardReject = true;
  }

  // 2-5. companyEmail — flag
  if (!poster.companyEmail?.trim()) {
    reasons.push("Poster has no company email on file");
    flagged = true;
  }

  // 2-6. emailVerified — flag
  if (poster.emailVerified !== true) {
    reasons.push("Poster's company email is not verified");
    flagged = true;
  }

  // 2-7. skills — need at least 3 — flag
  if (!Array.isArray(poster.skills) || poster.skills.length < 3) {
    reasons.push("Poster profile has fewer than 3 skills listed");
    flagged = true;
  }

  // -------------------------------------------------------------------------
  // GROUP 3 — Company existence in CompanyMaster + job↔poster name match
  // -------------------------------------------------------------------------

  if (poster.currentCompany_master_id) {
    // Has a normalized master reference — verify it still resolves
    const company = await CompanyMaster.findById(
      poster.currentCompany_master_id
    )
      .select("_id")
      .lean();

    if (!company) {
      reasons.push(
        "Poster's linked company record could not be found in CompanyMaster"
      );
      flagged = true;
    }
    // else: company verified — no flag
  } else if (poster.currentCompany?.trim()) {
    // Free-text name present but never normalized/backfilled
    reasons.push(
      `Company "${poster.currentCompany}" not found in CompanyMaster (not yet normalized)`
    );
    flagged = true;
  }
  // else: no company info at all — already hard-rejected by Group 2 check #3; skip

  // Job companyName vs poster currentCompany — exact match after normalize (v1)
  if (job.companyName?.trim() && poster.currentCompany?.trim()) {
    if (normalize(job.companyName) !== normalize(poster.currentCompany)) {
      reasons.push(
        `Job company "${job.companyName}" does not match poster's current company "${poster.currentCompany}"`
      );
      flagged = true;
    }
  }

  // -------------------------------------------------------------------------
  // GROUP 4 — LinkedIn URL
  // -------------------------------------------------------------------------

  const linkedin = poster.linkedin?.trim();
  if (!linkedin) {
    reasons.push("Poster has no LinkedIn URL");
    hardReject = true;
  } else if (!/linkedin\.com\/(in|pub)\/[a-zA-Z0-9\-]+/.test(linkedin)) {
    reasons.push("Poster's LinkedIn URL is not a valid format");
    hardReject = true;
  } else if (/linkedin\.com\/in\/(user|profile|name)$/i.test(linkedin)) {
    reasons.push("Poster's LinkedIn URL appears to be a placeholder");
    hardReject = true;
  }

  // -------------------------------------------------------------------------
  // Decision
  // -------------------------------------------------------------------------

  let approvalStatus;
  if (hardReject) {
    approvalStatus = "Rejected";
  } else if (flagged) {
    approvalStatus = "Pending"; // flags need human review but don't auto-reject
  } else {
    approvalStatus = "Approved";
  }

  return { approvalStatus, autoApproveReasons: reasons, hardReject, flagged };
}
