import {JobPostingTable} from '../models/jobPostingsModel.js';

export const createPostingService = async (postingData) => {
  try {
    const newPosting = new JobPostingTable(postingData);
    console.log("New Posting Data:", newPosting);
    const savedPosting = await newPosting.save();
    return savedPosting;
  } catch (error) {
   
    console.error("Error in createPostingService:", error.message);
    throw error;
  }
};
