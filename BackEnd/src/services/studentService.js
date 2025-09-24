import OnboardingModel from '../models/studentonboardingModel.js'

export async function getStudentService(studentId) {
    try {
        const StudentData = await OnboardingModel.find({ userId: studentId }).lean();
        return { success: true, data: StudentData };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function getCandidatEmail(studentId) {
    try {
        const student = await OnboardingModel.findOne({ _id: studentId }).lean();
        return { success: true, email: student.email };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function checkStudentService(studentId) {
    try {
        const student = await OnboardingModel.exists({ userId: studentId });
        // console.log(student);
        if (student) return true;
        return false;

    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}