// src/services/jobNotificationService.js

import OnboardingModel from "../models/studentonboardingModel.js";
import { JobPostingTable } from "../models/jobPostingsModel.js";
import Notification from "../models/notificationModel.js";

import {
  fetchWeights,
  fetchThreshold,
  scoreJob,
} from "../utils/relevancyEngine.js";

import { createNotification } from "./notificationService.js";

export const processJobNotificationService = async (jobId) => {
  try {
    console.log(`🚀 Starting notification processing for job ${jobId}`);

    const job = await JobPostingTable.findById(jobId)
      .populate("candidatePosted")
      .lean();

    if (!job) {
      console.log(`❌ Job not found: ${jobId}`);
      return;
    }

    const thresholdConfig = await fetchThreshold();
    const visibilityThreshold = thresholdConfig.value;

    const studentWeights = await fetchWeights("student");
    const professionalWeights = await fetchWeights("professional");

    const candidates = await OnboardingModel.find({
        profileType: {
          $in: ["student", "fresher", "professional"],
        },
      })
      .select(
        `
        userId
        profileType
        name
        email
        skills
        jobRoles
        educations
        locations
        experiences
        currentCompany
        noticePeriod
        servingNoticePeriod
        noticePeriodStartDate
        totalYearsOfExperience
        expectedSalaryAmount
        `
      )
      .lean();

    console.log(
      `📊 Processing ${candidates.length} candidates against job ${jobId}`
    );

    let matchedCount = 0;
    let notifiedCount = 0;

    for (const candidate of candidates) {
      console.log(
        "POSTED BY:",
        job.postedByUser?.toString()
      );

      console.log(
        "CANDIDATE USER:",
        candidate.userId?.toString()
      );

      console.log(
        "CANDIDATE NAME:",
        candidate.name
      );
      try {

        // Skip invalid profiles
        if (!candidate.userId) {
          continue;
        }

        // Skip job poster
        if (
          candidate.userId?.toString() ===
          job.postedByUser?.toString()
        ) {
          continue;
        }

        const weights =
          candidate.profileType === "professional"
            ? professionalWeights
            : studentWeights;

        const scoredJob = scoreJob(
          job,
          candidate,
          weights,
          0,
          "Notification Match"
        );

        if (
          scoredJob.matchScore < visibilityThreshold
        ) {
          continue;
        }

        matchedCount++;

        // Prevent duplicate notifications
        const existingNotification =
          await Notification.findOne({
            recipientId: candidate.userId,
            referenceId: job._id,
            type: "NEW_MATCHING_REFERRAL_JOB",
          });

        if (existingNotification) {
          continue;
        }

        await createNotification({
          recipientId: candidate.userId,
          senderId: job.postedByUser,
          type: "NEW_MATCHING_REFERRAL_JOB",
          message: `New referral opportunity matches your profile (${scoredJob.matchScore}% match)`,
          referenceId: job._id,
          jobId: job._id,
          jobType: "Referral",
        });

        notifiedCount++;

        console.log(
          `✅ Notification sent to ${candidate.email} | Match Score: ${scoredJob.matchScore}%`
        );
      } catch (candidateError) {
        console.error(
          `❌ Error processing candidate ${candidate?.userId}:`,
          candidateError.message
        );
      }
    }

    console.log(`
==================================================
🎉 Job Notification Worker Completed
Job ID: ${jobId}
Threshold: ${visibilityThreshold}%
Matched Candidates: ${matchedCount}
Notifications Sent: ${notifiedCount}
==================================================
`);

    return {
      success: true,
      matchedCount,
      notifiedCount,
    };
  } catch (error) {
    console.error(
      "❌ processJobNotificationService failed:",
      error
    );
    throw error;
  }
};