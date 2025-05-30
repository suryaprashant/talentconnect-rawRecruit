
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import FormProvider from "./pages/Fresher/onbordingForms/FormContext";
import { AppProvider } from "./pages/Fresher/EditAndReview/AppContext";
// Layout
import Layout from "./components/layout/Layout";

// Pages - Auth
import RoleSelection from "./pages/auth/GetStarted";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";


// Pages - Dashboard
import Dashboard from "./pages/Students/Dashboard";
import Profile from "./pages/Students/Profile";
import SavedJobs from "./pages/Students/SavedJobs";
import StudentDashboard from "./pages/Students/StudentDashboard";
import ServiceRequests from "./pages/Students/ServiceRequests";
import ApplicationStatus from "./pages/Students/ApplicationStatus";
import JobSearch from "./pages/Students/JobSearch";
import Settings from "./pages/Setting";
import NotFound from "./pages/NotFound";

// company
import CompanyRegistration from "./components/company/Editform/CompanyRegistration";
import HiringPreferences from "./components/company/Editform/HiringPreferences";
import CompanyVerification from "./components/company/Editform/CompanyVerification";
import ReviewDetails from "./components/company/Editform/ReviewDetails";
import EmployerIntroduction from "./components/company/Editform/EmployerIntroduction";

import CompanyProfile from "./pages/Company/Dashboard/CompanyProfile";

import FormContainer from "./components/company/FormContainer";

// COllege 
import OnboardingFlow from "./pages/college/onboardingForm/OnboardingFlow";
import CollegeProfile from "./pages/college/dashboard/CollegeProfile";
import EditOnboardingFlow from "./pages/college/EditForm/EditOnboardingFlow";

import CollegeDetailsPage from "./pages/Company/EmployerDashboard/CollegeDetailPage";
import CollegeListingPage from "./pages/Company/EmployerDashboard/CollegeListingPage";


import Index from "./pages/Index";


import WelcomePage from "./components/onboarding/EditFormStep/ReviewEdit";
import { EditStepOne } from "./components/onboarding/EditFormStep/EditStepOne";
import { EditStepTwo } from "./components/onboarding/EditFormStep/EditStepTwo";
import { EditStepThree } from "./components/onboarding/EditFormStep/EditStepThree";
import { EditStepFour } from "./components/onboarding/EditFormStep/EditStepFour";
import { EditStepFive } from "./components/onboarding/EditFormStep/EditStepFive";
import { Confirmation } from "./components/onboarding/EditFormStep/confirmEdit";



// Fresher 
import formRoutes from "./pages/Fresher/onbordingForms/route"
import EditRoutes from "./pages/Fresher/EditAndReview/route"
import OffCampus from "./pages/Company/HiringChannels/OffCampusHiring/OffCapus";
import PoolCampus from "./pages/Company/HiringChannels/PoolCampusHiring/PoolCampus";
import PostIntership from "./pages/Company/HiringChannels/PostInternship/CreateIntership";
import JobRoutes from "./components/Student/SavedJob/JobRoutes";
import ContactUs from "./pages/contact/ContactUs";
import NotificationSettings from "./pages/ProfileDropdown/Notification";
import FAQPage from "./pages/ProfileDropdown/FaqPage";
import ResumeApp from "./components/company/EmployerDashboard/ResumeSearch/ResumeApp";

import Hackathon from "./pages/Students/StudentDashboard/Hackathon/Hackthon";
import Detail from "./pages/Students/StudentDashboard/Hackathon/Detail";
import JobListings from "./pages/Students/StudentDashboard/JobListing/JobListings";
import JobDetails from "./pages/Students/StudentDashboard/JobListing/JobDetails";
import OffCampusJobListings from "./pages/Students/StudentDashboard/OffCampusListing/offCampusJobListing";
import OffCampusJobDetail from "./pages/Students/StudentDashboard/OffCampusListing/OffCampusJobDetail";
import JobTracker from "./components/Student/ApplicationStatus/JobListings/JobTracker";
import InterviewScheduler from "./components/company/Interview/InterviewSchedule";
// import JobManagement from "./pages/college/JobManagement/OnCampusListing/OnCampusJobManagement";
import ShortlistedDrives from "./components/company/ShortlistedCollege/OnCampusListing/ShortlistedDrives";
import ShortlistedDrivesPage from "./pages/Company/ShortlistedCollege/OnCampusListing/ShortlistedDrivesPage";
import DriveDetailPage from "./pages/Company/ShortlistedCollege/OnCampusListing/DriveDetailPage";
import OffCampusListingPage from "./pages/Company/ShortlistedCollege/OffCampusListing/OffCampusListingPage";
import JobListingPage from "./pages/Company/ShortlistedCollege/JobListing/JoblistingPage";
import PoolCampusShortlistDrive from "./pages/Company/ShortlistedCollege/PoolCampusListing/PoolCampusShortlistDrive";
import PoolCampusDetailPage from "./pages/Company/ShortlistedCollege/PoolCampusListing/PoolCampusDetailPage";
import AcceptedShortlistDrive from "./pages/Company/AcceptedCollegeOrCandidate/OnCampus/AcceptedShortlistDrive";
import AcceptedDriveDetail from "./pages/Company/AcceptedCollegeOrCandidate/OnCampus/AcceptedDriveDetail";
import AcceptedPoolShortlist from "./pages/Company/AcceptedCollegeOrCandidate/PoolCampus/AcceptedPoolShortlist";
import AcceptedPoolDriveDetail from "./pages/Company/AcceptedCollegeOrCandidate/PoolCampus/AcceptedPoolDriveDetail";
import AcceptedJobList from "./pages/Company/AcceptedCollegeOrCandidate/JobListings/AcceptedJobList";
import JobManagement from "./pages/Company/JobManagement/OnCampusListing/OnCampusJobManagement";
import AcceptedOffCampusList from "./pages/Company/AcceptedCollegeOrCandidate/OffCampus/AcceptedOffCampusList";
import PoolCampusJobManagement from "./pages/Company/JobManagement/PoolCampusListing/PoolCampusJobManagement";
import OffCampusJobManagement from "./pages/Company/JobManagement/OffCampusListing/OffCampusJobmanagement";

import JobManagements from "./pages/college/ManageApplication/CampusPlacement/JobManagement";
import JobDetail from "./pages/college/ManageApplication/CampusPlacement/JobDetail";
import { JobProvider } from "./context/College/JobManagement/JobContext";
import { ApplicationProvider } from "./context/College/Registered/ApplicationContext";
import ApplicationsPage from "./pages/college/Registered/Oncampus/ApplicationPage";
import PoolApplicationDetailPage from "./pages/college/Registered/Poolcampus/PoolApplicationDetailPage";
import InternApplicationsPage from "./pages/college/Registered/Internship/InternApplicationPage";
import InternDetailPage from "./pages/college/Registered/Internship/InternDetailPage";
import PoolApplicationsPage from "./pages/college/Registered/Poolcampus/PoolApplication";
import ApplicationDetailPage from "./pages/college/Registered/Oncampus/ApplicationDetailPage";
import JobsListingPage from "./pages/college/CollegeDashboard/OnCampusOpportunity/JobListingPage";
import JobDetailPage from "./pages/college/CollegeDashboard/OnCampusOpportunity/JobDetailPage";
import InternJobsListingPage from "./pages/college/CollegeDashboard/IntershipOpportunity/InternJobListingPage";
import InternJobDetailPage from "./pages/college/CollegeDashboard/IntershipOpportunity/InternJobDetailPage";
import PoolJobListingPage from "./pages/college/CollegeDashboard/PoolCampusOpportunity/PoolJobListingPage";
import PoolJobDetailsPage from "./pages/college/CollegeDashboard/PoolCampusOpportunity/PoolJobDetailPage";
import InternJobListings from "./pages/Students/StudentDashboard/InternshipOpportunity/InternJobListing";
import InternJobDetails from "./pages/Students/StudentDashboard/InternshipOpportunity/InternJobDetails";
import CareerCraft from "./pages/Students/Service_request/CareerCraft";
import Counselling from "./pages/Students/Service_request/Counselling";
import MockInterview from "./pages/Students/Service_request/Mock_Interview";
import OffcampusStatus from "./components/Student/ApplicationStatus/OffCampusListing/OffcampusStatus";
import InternshipStatus from "./components/Student/ApplicationStatus/IntershipOpportunities/InternshipStatus";
import RefferralJobStatus from "./components/Student/ApplicationStatus/ReferralJobs/RefferralJobStatus";
import HackthonStatus from "./components/Student/ApplicationStatus/Hackthon/HackthonStatus";
import AIDrivenJob from "./components/Student/AIDrivenJobSearch/AIDrivenJob";
import Workforce from "./pages/Company/Service_request/workforceSolution/workforce";
import EmployeeTraining from "./pages/Company/Service_request/EmployeeTraining/EmployeeTraining";
import Branding from "./pages/Company/Service_request/Branding/Branding";
import OnCampusJobManagement from "./pages/Company/JobManagement/OnCampusListing/OnCampusJobManagement";
import JobListingJobManagement from "./pages/Company/JobManagement/JobListing/JobListingJobManagement";
import CampusPlacement from "./pages/college/ServiceRequest/CampusPlacement/CampusPlacement";
import StudentTraining from "./pages/college/ServiceRequest/StudentTraining/StudentTaining";
import Seminar from "./pages/college/ServiceRequest/Seminars/Seminar";
import JobManagementApplication from "./pages/college/ManageApplication/CampusPlacement/JobManagement";
import PostJob from "./pages/Company/HiringChannels/PostJob/CreateJob";
import OnCampusHiring from "./pages/Company/HiringChannels/OnCampusHiring/OnCampusHiring";
import PoolEmployeeListing from "./pages/Company/EmployerDashboard/PoolCampus/PoolEmployeeListing";
import PoolCampusEmployeeDash from "./pages/Company/EmployerDashboard/PoolCampus/PoolCampusEmployerDash";
// Create query client
const queryClient = new QueryClient();
function AppRoutes() {


  // const location = useLocation();
  // const [currentPage, setCurrentPage] = useState(1);
  
  // const nextPage = () => {
  //   setCurrentPage((prevPage) => {
  //     console.log("Next Page:", prevPage + 1); // Debugging
  //     return prevPage + 1;
  //   });
  // };

  // const prevPage = () => {
  //   setCurrentPage((prevPage) => {
  //     console.log("Prev Page:", prevPage - 1); // Debugging
  //     return prevPage - 1;
  //   }
  // );
  // };

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/mock" element={<PostIntership/>} />
      <Route path="/" element={<RoleSelection />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path='/student-form' element={<Index/>} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/step/1" element={<EditStepOne />} />
      <Route path="/step/2" element={<EditStepTwo />} />
      <Route path="/step/3" element={<EditStepThree />} />
      <Route path="/step/4" element={<EditStepFour />} />
      <Route path="/step/5" element={<EditStepFive />} />
      <Route path="/confirmation" element={<Confirmation />} />


      <Route path="/company-form" element={<FormContainer />} />
      <Route path="/company-onboarding/step-1" element={<ReviewDetails />} />
      <Route path="/company-onboarding/step-2" element={<EmployerIntroduction />} />
      <Route path="/company-onboarding/step-3" element={<CompanyRegistration />} />
      <Route path="/company-onboarding/step-4" element={<HiringPreferences />} />
      <Route path="/company-onboarding/step-5" element={<CompanyVerification />} />
       

      <Route path="/college-onboarding/*" element={<OnboardingFlow />} />
      <Route path="/college-edit/*" element={<EditOnboardingFlow />} />  



      {/* Student */}  
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/student-dashboard/job-listing" element={<JobListings />} />
              <Route path="/student-dashboard/job-listing/:jobId" element={<JobDetails />} />
              <Route path="/student-dashboard/internship-opportunities" element={<InternJobListings />} />
              <Route path="/student-dashboard/internship-opportunities/:jobId" element={<InternJobDetails />} />
              <Route path="/student-dashboard/off-campus-listings" element={<OffCampusJobListings />} />
              <Route path="/student-dashboard/off-campus-listings/:jobId" element={<OffCampusJobDetail/>} />
              <Route path="/student-dashboard/hackathon" element={<Hackathon/>} />
              <Route path="/student-dashboard/hackathon/:id" element={<Detail />} />
              {/* service request  */}
              <Route path ='service-request/career-craft' element={<CareerCraft/>}/>
              <Route path ='service-request/mock-interview' element={<MockInterview/>}/>
              <Route path ='service-request/counselling' element={<Counselling/>}/>
              {/* Application status  */}
              <Route path="/application-status/job-listing" element={<JobTracker/>} />
              <Route path="/application-status/off-campus-listing" element={<OffcampusStatus/>} />
              <Route path="/application-status/internship-opportunities" element={<InternshipStatus/>} />
              <Route path="/application-status/referral-jobs" element={<RefferralJobStatus/>} />
              <Route path="/application-status/hackathon" element={<HackthonStatus/>} />
              <Route path='/notifications' element={<NotificationSettings/>} />
              <Route path='/Faq' element={<FAQPage/>} />
               <Route path="/saved-jobs/*" element={<JobRoutes/>} />
              <Route path="/ai-driven-job-search" element={<AIDrivenJob/>} />
              <Route path="settings" element={<Settings />} />
              <Route path="ContactUs" element={<ContactUs/>} />
              <Route path="*" element={<NotFound />} />


              {/* Company  */}
              <Route path="home" element={<Dashboard />} />
              <Route path="/company-profile" element={<CompanyProfile />}/> 

              <Route path="/employer-dashboard/resume-search" element={<ResumeApp />} />
              <Route path="/interviews" element={<InterviewScheduler />} />

              <Route path="/employer-dashboard/on-campus-request" element={<CollegeListingPage />} />
              <Route path="/employer-dashboard/on-campus-request/:id" element={<CollegeDetailsPage />} />

              <Route path="/employer-dashboard/pool-campus-requests" element={<PoolEmployeeListing/>} />
              <Route path="/employer-dashboard/pool-campus-requests/:id" element={<PoolCampusEmployeeDash />} />

              {/* service request  */}
              <Route path="/service-request/workforce-solution" element={<Workforce/>} />
              <Route path="/service-request/employee-training" element={<EmployeeTraining/>} />
              <Route path="/service-request/branding" element={<Branding/>} />
              
                {/* Job Management   */}
             <Route path="/job-management/on-campus-listings" element={<OnCampusJobManagement/>} />
             <Route path="/job-management/pool-campus-listings" element={<PoolCampusJobManagement/>} />
             <Route path="/job-management/off-campus-listings" element={<OffCampusJobManagement/>} />
             <Route path="/job-management/job-listings" element={<JobListingJobManagement/>} />

              
              {/* Accepted college / candidates  */}
              <Route path="/accepted/on-campus-listings" element={<AcceptedShortlistDrive/>} />
              <Route path="/accepted/on-campus-listings/:driveId" element={<AcceptedDriveDetail/>} />

              <Route path="/accepted/pool-campus-listings" element={<AcceptedPoolShortlist/>} />
              <Route path="/accepted/pool-campus-listings/:driveId" element={<AcceptedPoolDriveDetail/>} />
    
              <Route path="/acceptedJobList" element={<AcceptedJobList/>} />
              <Route path="/accepted/off-campus-listings" element={<AcceptedOffCampusList/>} />

              
              {/* shortlisted candidate  */}
                  
              <Route path="/shortlisted/on-campus-listings" element={<ShortlistedDrivesPage/>} />
              <Route path="/shortlisted/on-campus-listings/:driveId" element={<DriveDetailPage/>} />
      
              <Route path="/shortlisted/pool-campus-listings" element={<PoolCampusShortlistDrive/>} />
              <Route path="/shortlisted/pool-campus-listings/:driveId" element={<PoolCampusDetailPage/>} />
      
              <Route path="/shortlisted/off-campus-listings" element={<OffCampusListingPage/>} />
              <Route path="/joblistingPage" element={<JobListingPage/>} />

              {/* Hiring Channel  */}
              
              <Route path='hiring-channels/post-a-job' element={<PostJob/>} />
              <Route path='hiring-channels/post-an-internship' element={<PostIntership/>} />
              <Route path='hiring-channels/on-campus-hiring' element={<OnCampusHiring/>} />
              <Route path='hiring-channels/pool-campus-hiring' element={<PoolCampus/>} />
              <Route path='hiring-channels/off-campus-hiring' element={<OffCampus/>} />


              
              {/* College  */}
              <Route path="home" element={<Dashboard />} />
              <Route path="college-profile" element={<CollegeProfile />} />

              {/* college Dashboard  */}

              <Route path="/college-dashboard/on-campus-opportunities" element={<JobsListingPage/>} />
              <Route path="/college-dashboard/on-campus-opportunities/:id" element={<JobDetailPage />} />
        
              <Route path="/college-dashboard/internship-opportunities" element={<InternJobsListingPage/>} />
              <Route path="/college-dashboard/internship-opportunities/:id" element={<InternJobDetailPage />} />
        
              <Route path="/college-dashboard/pool-campus-opportunities" element={<PoolJobListingPage />} />
              <Route path="/college-dashboard/pool-campus-opportunities/:id" element={<PoolJobDetailsPage />} />

              {/* service request  */}
              <Route path= 'service-request/campus-placement' element={<CampusPlacement/>} />
              <Route path= 'service-request/student-training-programs' element={<StudentTraining/>} />
              <Route path= 'service-request/seminars' element={<Seminar/>} />

              {/* job management  */}

              <Route path="/manage-application/campus-placement" element={<JobProvider><JobManagementApplication/> </JobProvider> }/>
              <Route path="/manage-application/campus-placement/:jobId" element={<JobProvider><JobDetail /> </JobProvider>}/>

              <Route path="/registered/on-campus-opportunities" element={
                <ApplicationProvider>
                  <ApplicationsPage />
                </ApplicationProvider>
              } />
              <Route path="/registered/on-campus-opportunities/:id" element={
                <ApplicationProvider>
                  <ApplicationDetailPage />
                </ApplicationProvider>
              } />
        
              <Route path="/registered/internship-opportunities" element={
                <ApplicationProvider>
                  <InternApplicationsPage />
                </ApplicationProvider>
              } />
              <Route path="/registered/internship-opportunities/:id" element={
                <ApplicationProvider>
                  <InternDetailPage />
                </ApplicationProvider>
              } />
              <Route path="/registered/pool-campus-opportunities" element={
                <ApplicationProvider>
                  <PoolApplicationsPage />
                </ApplicationProvider>
              } />
              <Route path="/registered/pool-campus-opportunities/:id" element={
                <ApplicationProvider>
                  <PoolApplicationDetailPage/>
                </ApplicationProvider>
              } />


            </Routes>
          </Layout>
        }
      />
  
       {/* fresher  */}
      <Route path="/fresher/*">
        {formRoutes.map((route, index) => (
          <Route
            key={`form-${index}`}
            index={route.index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>

      <Route path="/edit/*">
        {EditRoutes.map((route, index) => (
          <Route
            key={`form-${index}`}
            index={route.index}
            path={route.path}
            element={route.element}
          />
       ))}
      </Route>
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
  <TooltipProvider>
    <Toaster />
    <Sonner />
  
    <Router>
    <AppProvider>  {/* Global app state */}
          <FormProvider>  {/* Form-specific state */}
            <AppRoutes />
          </FormProvider>
        </AppProvider>
    </Router>
   
  </TooltipProvider>
</QueryClientProvider>
);

export default App;