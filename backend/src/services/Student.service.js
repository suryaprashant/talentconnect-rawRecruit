import StudentOverview from '../models/Student.js'

export async function getStudentService(studentId) {
    try {
        const StudentData = await StudentOverview.findById(studentId);
        return { success: true, data: StudentData };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function checkStudentService(studentId) {
    try {
        const student = await StudentOverview.exists({ _id: studentId });
        console.log(student);
        if (student) return true;
        return false;

    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}