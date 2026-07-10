// import { requestPasswordReset, performPasswordReset } from "../../services/authService.js";

import {
  resetPasswordService,
  validateResetTokenService,
  requestPasswordResetService,
} from "../../services/authService.js";

// export const sendResetLink = async (req, res) => {
//     try {
//         const { email } = req.body;
//         await requestPasswordReset({ email });
//         res.status(200).json({ message: 'If a user with that email exists, a reset link has been sent.' });
//     } catch (error) {
//         console.error("sendResetLink Error:", error);
//         res.status(200).json({ message: 'If a user with that email exists, a reset link has been sent.' });
//     }
// };
// export const resetPassword = async (req, res) => {
//     try {
//         const { token } = req.params;
//         const { newPassword } = req.body;
//         await performPasswordReset({ token, newPassword });
//         res.status(200).json({ message: 'Password has been successfully reset.' });
//     } catch (error) {
//         console.error("resetPassword Error:", error);
//         res.status(error.statusCode || 500).json({ message: error.message || 'Failed to reset password.' });
//     }
// };

export const requestPasswordReset = async (req, res) => {
  try {
    const { email, isreferd } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const result = await requestPasswordResetService({ email,isreferd });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    const result = await validateResetTokenService({ token });

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
      email: result.email,
    });
  } catch (error) {
    console.error("Validate token error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const result = await resetPasswordService({ token, newPassword });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Reset password error:", error);

    let statusCode = 500;
    let message = error.message || "Internal server error";

    if (
      error.message.includes("Invalid or expired") ||
      error.message.includes("Token and new password")
    ) {
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
};
