import axios from 'axios';

const axiosClient = axios.create();

axiosClient.defaults.baseURL = import.meta.env.VITE_Backend_URL;

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

// default 10sec
axiosClient.defaults.timeout = 10000;
// in case of tokens
axiosClient.defaults.withCredentials = true;
export function getPendingReferralJobs (){
  return axiosClient.get('/api/admin/dashboard/referral-jobs/pending')
}
export function getAcceptedReferralJobs (){
  return axiosClient.get('/api/admin/dashboard/referral-jobs/accepted')
}

export function getCompanyPostingForOncampus() {
  return axiosClient.get(`/api/student-dashboard/on-campus/college`)
    .then(response => response)
    .catch(error => error);
}
// Add this to your API exports
export function updateReferralStatus(jobId, status, adminComment) {
return axiosClient.patch(`/api/admin/dashboard/referral-jobs/${jobId}/approval`, {
    approvalStatus: status
  });
}
// Add this to your API exports file
export function updateReferralApplicationStatus(applicationId, action,adminComment,rating) {
  // Matches controller: const { action } = req.body;
  // Matches controller: const { applicationId } = req.params;
  return axiosClient.patch(`/api/admin/dashboard/referral-applications/${applicationId}`, {
    action: action,
    adminComment:adminComment,
    rating // Must be "Approved" or "Rejected"
  });
}

export function getApplicationForReferral(jobId){
    return axiosClient.get(`/api/admin/dashboard/referral-applications?jobId=${jobId}`)
}