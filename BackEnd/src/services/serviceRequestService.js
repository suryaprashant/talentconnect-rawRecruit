import ServiceRequest from "../models/serviceRequestsModel.js";

// get total service request count
export const getTotalServiceRequestCount = async (filter = {}) => {
  try {
    return await ServiceRequest.countDocuments(filter);
  } catch (error) {
    console.error("Error in getTotalServiceRequestCount:", error);
    throw error;
  }
};

// get all service requests
export const getAll = async () => {
  try {
    return await ServiceRequest.find();
  } catch (error) {
    console.error("Error in getAll:", error);
    throw error;
  }
};

// create a service for the request from the service request
export const createServiceRequest = async (user , data , serviceRequestType) => {
    const {date, time , message , category,
      counsellingType, skillset} = data;

  //  console.log("User in service:", user , user._id , user.userType);

    if ((!user || !user._id) && !user.userType) {
        throw new Error("User id or role is missing");
    }

    if (!date || !time || !message){
        throw new Error("Date, time and message are required");
    }

    if(!serviceRequestType){
        throw new Error("Service request type is required");
    }

    const newRequest = new ServiceRequest({
        requester: {
            id: user._id,
            role: user.userType
        },
        serviceRequestType,
        date,
        time,
        message,
        category,
        counsellingType,
        skillset: skillset || []
    });
    await newRequest.save();
    return newRequest;

}

export const createSeviceRegisterRequest = async (user , data , serviceRequestType) => {
    const { numOfEmployees, typeOfSkill, modeOfTraining, evaluationBasedOn, numOfHoursPerDay} = data;
   
    if ((!user || !user._id) && !user.userType) {
        throw new Error("User id or role is missing");
    }
    if(!serviceRequestType){
        throw new Error("Service request type is required");
    }
    if (!numOfEmployees || !typeOfSkill || !modeOfTraining || !evaluationBasedOn || !numOfHoursPerDay){
        throw new Error("All fields are required");
    }

    const newRequest = new ServiceRequest({
        requester: {
            id: user._id,
            role: user.userType
        },
        serviceRequestType,
        numOfEmployees,
        typeOfSkill: typeOfSkill || [],
        modeOfTraining,
        evaluationBasedOn,
        numOfHoursPerDay
    });
    await newRequest.save();
    return newRequest;
}

// onboarding support request
export const createOnboardingRequestService = async (data) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      date,
      time,
      category,
    } = data;

    //  Basic validation (can move to Joi/Zod later)
    if (!name || !email || !phone) {
      throw new Error("Name, email and phone are required");
    }

    const newRequest = await ServiceRequest.create({
      serviceRequestType: "onboarding-support",

      requester: {
        role: "guest",
        
      },
      name,
      email,
      phone,
      message,
      date,
      time,
      category,

      status: "pending",
    });

    return newRequest;
  } catch (error) {
    throw error;
  }
};