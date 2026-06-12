import InterviewSchedule from "../models/InterviewSchedule.Model.js";

{/*export const getInterviews = async (req, res) => {
  try {
    const authId = req.user._id;
    const userType = req.user.userType;

    let query = {};

    if (userType === "company" || userType === "employer") {
      query.companyAuthId = authId;
    }

    if (userType === "college") {
      query.applicantAuthId = authId;
    }

    const interviews = await InterviewSchedule
      .find(query)
      .populate("jobId", "jobType")
      .sort({ date: -1, time: -1 });

    return res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    console.error("getInterviews error:", error);
    return res.status(500).json({ success: false });
  }
};*/}

export const getInterviews = async (req, res) => {
  try {
    const authId = req.user._id;
    const userType = req.user.userType;

    let query = {};

    /**
     * WHO CAN SEE WHICH INTERVIEWS
     */

    // 🏢 Company / Employer → interviews THEY scheduled
    if (userType === "company" || userType === "employer") {
      query.companyAuthId = authId;
    }

    // 🎓 College → interviews scheduled WITH that college
    else if (userType === "college") {
      query.applicantAuthId = authId;
      query.applicantType = "college";
    }

    // 👨‍🎓 Student / Fresher / Professional → only THEIR interviews
    else if (
      userType === "student" ||
      userType === "fresher" ||
      userType === "professional"
    ) {
      query.applicantAuthId = authId;
      query.applicantType = userType;
    }

    /**
     * FETCH INTERVIEWS
     */
    const interviews = await InterviewSchedule
      .find(query)
      .populate("jobId", "jobType title companyName") // safe
      .sort({ date: 1, time: 1 }); // upcoming first

    return res.status(200).json({
      success: true,
      data: interviews,
    });

  } catch (error) {
    console.error("getInterviews error:", error);
    return res.status(500).json({ success: false });
  }
};



export async function getCompanyInterviews(req, res) {
  try {
    const companyAuthId = req.user._id;

    const interviews = await InterviewSchedule.find({
      companyAuthId,
    })
      .populate("jobId", "jobTitle jobType")
      .sort({ date: 1, time: 1 });

    return res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    console.error("❌ getCompanyInterviews error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function getCollegeInterviews(req, res) {
  try {
    const collegeAuthId = req.user._id;

    const interviews = await InterviewSchedule.find({
      applicantAuthId: collegeAuthId,
      applicantType: "college",
    })
      .populate("jobId", "jobTitle jobType")
      .sort({ date: 1, time: 1 });

    return res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    console.error("❌ getCollegeInterviews error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function updateInterviewStatus(req, res) {
  try {
    const { interviewId } = req.params;
    const { status } = req.body;
    const userAuthId = req.user._id;

    if (!["Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const interview = await InterviewSchedule.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ msg: "Interview not found" });
    }

    // Only company can update status
    if (interview.companyAuthId.toString() !== userAuthId.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    interview.status = status;
    await interview.save();

    return res.status(200).json({
      success: true,
      msg: `Interview ${status}`,
    });
  } catch (error) {
    console.error("❌ updateInterviewStatus error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function getInterviewById(req, res) {
  try {
    const { interviewId } = req.params;
    const userAuthId = req.user._id;

    const interview = await InterviewSchedule.findById(interviewId)
      .populate("jobId", "jobTitle jobType");

    if (!interview) {
      return res.status(404).json({ msg: "Interview not found" });
    }

    // 🔐 Access control
    if (
      interview.companyAuthId.toString() !== userAuthId.toString() &&
      interview.applicantAuthId.toString() !== userAuthId.toString()
    ) {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    return res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error("❌ getInterviewById error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export const getUnreadInterviews = async (req, res) => {
  try {
    const authId = req.user._id;
    const userType = req.user.userType;

    let query = {
      readByApplicant: false,
    };

    /**
     * WHO CAN SEE WHICH UNREAD INTERVIEWS
     */

    // College
    if (userType === "college") {
      query.applicantAuthId = authId;
      query.applicantType = "college";
    }

    // Student / Fresher / Professional
    else if (
      userType === "student" ||
      userType === "fresher" ||
      userType === "professional"
    ) {
      query.applicantAuthId = authId;
      query.applicantType = userType;
    }

    // Companies don't have applicant notifications
    else {
      return res.status(403).json({
        success: false,
        message: "Unread interview notifications are only available for applicants.",
      });
    }

    const interviews = await InterviewSchedule.find(query)
      .populate("jobId", "jobType title companyName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    console.error("getUnreadInterviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread interviews",
    });
  }
};

export const markInterviewAsRead = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const authId = req.user._id;
    const userType = req.user.userType;

    const interview = await InterviewSchedule.findOneAndUpdate(
      {
        _id: interviewId,
        applicantAuthId: authId,
        applicantType: userType,
      },
      {
        $set: {
          readByApplicant: true,
        },
      },
      {
        new: true,
      }
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview marked as read",
      data: interview,
    });
  } catch (error) {
    console.error("markInterviewAsRead error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark interview as read",
    });
  }
};