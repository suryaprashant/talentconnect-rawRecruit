import Onboarding from "../models/studentonboardingModel.js";
import { createNotification } from "./notificationService.js";

const MILESTONES = [1, 5, 10, 25, 50];

export const handleReferralMilestone =
  async (referrerAuthId) => {
    const onboarding =
      await Onboarding.findOne({
        userId: referrerAuthId,
      });

    if (!onboarding) return;

    const count =
      onboarding.totalCandidatesReferred || 0;

    if (!MILESTONES.includes(count)) {
      return;
    }

    if (
      onboarding.referralMilestonesAchieved?.includes(
        count
      )
    ) {
      return;
    }

    await createNotification({
      recipientId: referrerAuthId,
      senderId: referrerAuthId,
      type: "REFERRAL_MILESTONE_REACHED",
      message:
        count === 1
          ? "🎉 You referred your first candidate to a company!"
          : `🎉 You have referred ${count} candidates to companies!`,
    });

    await Onboarding.updateOne(
      {
        userId: referrerAuthId,
      },
      {
        $addToSet: {
          referralMilestonesAchieved:
            count,
        },
      }
    );
  };