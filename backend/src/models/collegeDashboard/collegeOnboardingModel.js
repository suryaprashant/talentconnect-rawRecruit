import mongoose from 'mongoose';

const onboardingSchema = new mongoose.Schema({
  collegeUniversityDetails: {
    collegeName: String,
    state: String,
    city: String,
    country: String,
    pincode: String
  },
  placementCoordinatorDetails: {
    coordinatorName: String,
    designation: String,
    officialEmail: String,
    officialMobile: String,
    linkedinUrl: String
  },
  placementRecruitmentDetails: {
    programsOffered: [String],
    popularCoursesForRecruitment: [String],
    preferredHiringCompanies: [String],
    recruitmentServicesRequired: [String],
    collegeBrochureUrl: String
  },
  profileAchievements: {
    collegeWebsite: String,
    linkedinProfile: String
  },
  workshops: [
    {
      workshopName: String,
      startDate: Date,
      endDate: Date,
      description: String
    }
  ],
  volunteering: [
    {
      eventName: String,
      startDate: Date,
      endDate: Date,
      description: String
    }
  ],
  awards: [
    {
      awardTitle: String,
      startDate: Date,
      endDate: Date,
      awardingOrganization: String
    }
  ]
}, { timestamps: true });

export default mongoose.model('CollegeOnboarding', onboardingSchema);
