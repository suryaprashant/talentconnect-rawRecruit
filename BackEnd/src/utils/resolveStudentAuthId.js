import Onboarding from "../models/studentonboardingModel.js"

export const resolveStudentAuthId = async (onboardingId) => {
  const onboarding = await Onboarding
    .findById(onboardingId)
    .select("userId profileType");

  if (!onboarding) return null;

  // Safety check – only student/fresher
  if (!["student", "fresher"].includes(onboarding.profileType)) {
    return null;
  }

  return onboarding.userId;
};