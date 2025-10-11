import { requestPasswordReset, performPasswordReset } from "../../services/authService.js";


export const sendResetLink = async (req, res) => {
    try {
        const { email } = req.body;
        await requestPasswordReset({ email });      
        res.status(200).json({ message: 'If a user with that email exists, a reset link has been sent.' });
    } catch (error) {
        console.error("sendResetLink Error:", error);
        res.status(200).json({ message: 'If a user with that email exists, a reset link has been sent.' });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        await performPasswordReset({ token, newPassword });
        res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (error) {
        console.error("resetPassword Error:", error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Failed to reset password.' });
    }
};