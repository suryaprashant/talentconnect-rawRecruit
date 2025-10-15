import ServiceRequest from "../models/serviceRequestsModel.js";

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
