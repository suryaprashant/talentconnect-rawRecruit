import ServiceRequest from "../models/serviceRequestModel.js";

export const getTotalServiceRequestCount = async (filter = {}) => {
  try {
    return await ServiceRequest.countDocuments(filter);
  } catch (error) {
    console.error("Error in getTotalServiceRequestCount:", error);
    throw error;
  }
};

export const getAll = async () => {
  try {
    return await ServiceRequest.find();
  } catch (error) {
    console.error("Error in getAll:", error);
    throw error;
  }
};
