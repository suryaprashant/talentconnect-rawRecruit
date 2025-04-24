import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema({
  workshopName: String,
  startDate: Date,
  endDate: Date,
  description: String,
});

const volunteeringSchema = new mongoose.Schema({
  eventName: String,
  startDate: Date,
  endDate: Date,
  description: String,
});

const awardSchema = new mongoose.Schema({
  awardTitle: String,
  startDate: Date,
  endDate: Date,
  awardingOrganization: String,
});

const collegeOverviewSchema = new mongoose.Schema({
  // Common fields (reused in both overview and profile)
  collegeName: String,
  establishedYear: Number,
  collegeWebsite: String,
  phoneNumber: String,
  alternatePhoneNumber: String,
  collegeLocation: String,
  pincode: String,
  collegeImage: String,
  backgroundImage: String,

  // Profile Fields
  about: String,

  universityDetailsDescription: String,
  placementCoordinatorDescription: String,
  placementRecruitmentDescription: String,

  coordinatorName: String,
  coordinatorImage: String,
  designation: String,
  officialEmail: String,
  officialContact: String,
  coordinatorLinkedIn: String,

  programsOffered: [String],
  popularCourses: [String],
  preferredHiringCompanies: [String],
  recruitmentServicesRequired: [String], // job fairs, internship support, company tie-ups, all

  collegeBrochure: String,

  collegeLinkedIn: String,

  workshopsAndTrainings: [workshopSchema],
  volunteeringActivities: [volunteeringSchema],
  awardsAndRecognitions: [awardSchema],
});

const CollegeOverview = mongoose.model('CollegeOverview', collegeOverviewSchema);
export default CollegeOverview;
