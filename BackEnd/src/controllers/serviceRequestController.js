import { createServiceRequest, createSeviceRegisterRequest } from "../services/serviceRequestService.js";


// College Campus Placement
export const createOnCampusPlacementRequest = async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const serviceType = "On-Campus";
        const savedRequest = await createServiceRequest(req.user, req.body, serviceType);
        console.log("Saved Request:", savedRequest);
        res.status(201).json({ message: "Campus Branding request created successfully", request: savedRequest });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// College Pool Campus request
export const PoolCampusRequest = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const serviceType = "Pool-Campus";
        const savedRequest = await createServiceRequest(req.user, req.body, serviceType);
        console.log("Saved Request:", savedRequest);
        res.status(201).json({ message: "Pool Campus request created successfully", request: savedRequest });
    }

    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// college student training request
export const StudentTrainingRequest = async (req, res) => {
    try {
        const serviceType = "Student-Training";
        const savedRequest = await createServiceRequest(req.user, req.body, serviceType);
        res.status(201).json({ message: "Student Training request created successfully", request: savedRequest });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// college Seminar request
export const CollegeSeminarRequest = async (req, res) => {
    try {
        const serviceType = "College-Seminar";
        const savedRequest = await createServiceRequest(req.user, req.body, serviceType);
        res.status(201).json({ message: "College Seminar request created successfully", request: savedRequest });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};



//   =====>>> Company Side <<<<===== 

// Request Info 
export const createWorkforceRequest = async (req, res) => {
    try {
        const serviceType = "Workforce-Request";
        const savedRequest = await createServiceRequest(req.user, req.body, serviceType);
        res.status(201).json({ message: "Workforce request created successfully", request: savedRequest });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createEmployeeTrainingRequest = async (req, res) => {
    try {
        const serviceType = "Employee-Training";
        const savedRequest = await createServiceRequest(req.user, req.body, serviceType);
        res.status(201).json({ message: "Employee Training request created successfully", request: savedRequest });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createBrandingRequest = async (req, res) => {
    try {
        const serviceType = "Branding-Request";
        const savedRequest = await createServiceRequest(req.user, req.body, serviceType);
        res.status(201).json({ message: "Branding request created successfully", request: savedRequest });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Registration Info 

export const createEmployeeTrainingRegistration = async (req, res) => {
    try {
        const serviceType = "Employee-Training-Registration";
        const savedRequest = await createSeviceRegisterRequest(req.user, req.body, serviceType);
        res.status(201).json({ message: "Employee Training Registration created successfully", request: savedRequest });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

};

export const createBrandingRegistration = async (req, res) => {
    try {
        const serviceType = "Branding-Registration";
        const savedRequest = await createSeviceRegisterRequest(req.user, req.body, serviceType);
        res.status(201).json({ message: "Branding Registration created successfully", request: savedRequest });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// ======>> Student Side <<<<====== 

export const createStudentMockInterviewRequest = async (req, res) => {
    try {
        const serviceType = "Mock-Interview";
        const savedRequest = await createServiceRequest(req.user, req.body, serviceType);
        res.status(201).json({ message: "Mock Interview request created successfully", request: savedRequest });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createStudentCounsellingRequest = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const serviceType = "Counselling";
        
        const savedRequest = await createServiceRequest(req.user, req.body, serviceType);
        console.log("Saved Request:", savedRequest);
        res.status(201).json({ message: "Student Counselling request created successfully", request: savedRequest });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
