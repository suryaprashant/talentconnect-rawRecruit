// BackEnd/src/controllers/authentication/linkedInAuthController.js

import { generateLinkedInAuthUrl, generateToken } from "../../services/authService.js";
import { handleLinkedInAuth } from "../../services/linkedinAuthService.js";

function normalizeUserType(t) {
  const v = (t || "").toString().trim().toLowerCase();
  const allowed = new Set(["candidate", "student", "fresher", "professional", "company", "college", "employer"]);
  return allowed.has(v) ? v : null;
}

// Step 1: redirect user to LinkedIn
export const redirectToLinkedIn = (req, res) => {
  try {
    const userType = normalizeUserType(req.query.userType);
    if (!userType) {
      return res.status(400).json({ message: "Valid userType is required for LinkedIn auth." });
    }

    const linkedInAuthUrl = generateLinkedInAuthUrl({ userType });
    return res.redirect(linkedInAuthUrl);
  } catch (error) {
    console.error("Error redirecting to LinkedIn:", error);
    return res.status(500).send("An error occurred while redirecting to LinkedIn.");
  }
};

// Step 2: LinkedIn calls this with ?code=&state=
export const handleLinkedInCallback = async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    if (error) {
      const errorMsg = encodeURIComponent(`LinkedIn authentication failed: ${error_description || error}`);
      return res.redirect(`${process.env.FRONTEND_URL}/signup?error=${errorMsg}`);
    }

    if (!code || !state) {
      const errorMsg = encodeURIComponent("Missing authentication parameters");
      return res.redirect(`${process.env.FRONTEND_URL}/signup?error=${errorMsg}`);
    }

    // state format: <random>_<role>
    const rawState = decodeURIComponent(state);
    const requestedUserType = normalizeUserType(rawState.split("_").slice(-1)[0]);

    if (!requestedUserType) {
      const errorMsg = encodeURIComponent("Invalid role in LinkedIn state.");
      return res.redirect(`${process.env.FRONTEND_URL}/signup?error=${errorMsg}`);
    }

    // Service may throw ACCOUNT_ROLE_MISMATCH:<existingRole>
    const { user } = await handleLinkedInAuth(code, requestedUserType);

    const token = generateToken({
      userId: user._id,
      email: user.email,
      userType: user.userType,
    });

    const url = new URL(`${process.env.FRONTEND_URL}/signup`);
    url.searchParams.set("token", token);
    url.searchParams.set("userId", user._id.toString());
    url.searchParams.set("email", user.email || "");
    url.searchParams.set("name", user.name || "");
    url.searchParams.set("userType", user.userType || requestedUserType);
    url.searchParams.set("authProvider", user.authProvider || "linkedin");
    url.searchParams.set("onboardingCompleted", user.onboardingCompleted ? "true" : "false");

    if (typeof user.profileImage === "string" && user.profileImage) {
      url.searchParams.set("profileImage", user.profileImage);
    }

    return res.redirect(url.toString());
  } catch (err) {
    // Handle the explicit role mismatch thrown by linkedinAuthService.js
    if (err?.statusCode === 409 && String(err.message || "").startsWith("ACCOUNT_ROLE_MISMATCH:")) {
      const existingRole = err.message.split(":")[1] || "unknown";
      const errorMsg = encodeURIComponent(
        `This LinkedIn email is already registered as: ${existingRole}. Please log in with that role.`
      );
      return res.redirect(`${process.env.FRONTEND_URL}/signup?error=${errorMsg}`);
    }

    console.error("LinkedIn callback error:", err.response?.data || err.message);
    const errorMsg = encodeURIComponent("LinkedIn auth failed on server.");
    return res.redirect(`${process.env.FRONTEND_URL}/signup?error=${errorMsg}`);
  }
};
