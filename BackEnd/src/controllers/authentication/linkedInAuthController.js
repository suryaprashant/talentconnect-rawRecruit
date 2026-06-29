import {
  generateLinkedInAuthUrl,
  handleLinkedInLogin,
} from "../../services/authService.js";
import { createUserSession } from "../../services/sessionService.js";
export const redirectToLinkedIn = (req, res) => {
  try {
    const { userType } = req.query;

    // Validate userType
    const validUserTypes = [
      "candidate",
      "fresher",
      "professional",
      "company",
      "college",
      "employer",
    ];
    if (!userType || !validUserTypes.includes(userType)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing userType for LinkedIn signup." });
    }

    const linkedInAuthUrl = generateLinkedInAuthUrl({ userType });
        console.log("LinkedIn Auth URL:", linkedInAuthUrl);
    return res.redirect(linkedInAuthUrl);
  } catch (error) {
    console.error("Error redirecting to LinkedIn:", error);
    return res
      .status(500)
      .send("An error occurred while redirecting to LinkedIn.");
  }
};



 

export const handleLinkedInCallback = async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    // const FRONTEND_URLS = process.env.FRONTEND_URLS || "http://localhost:5173";
    const FRONTEND_URLS =
      (process.env.FRONTEND_URLS || "http://localhost:5173")
        .split(",")[0]
        .trim();
    // Handle user cancellation or LinkedIn errors
    if (error) {
      return res.redirect(`${FRONTEND_URLS}/signup?error=${encodeURIComponent(error_description || error)}`);
    }

    // Call your handleLinkedInLogin service (which fetches profile & upserts user)
    const { user, isNewUser } = await handleLinkedInLogin({ code, state });

    const { accessToken } = await createUserSession({
      user,
      req,
      res,
    });
    // Redirect to Frontend with query params so your React useEffect can save data
    const redirectUrl =
      `${FRONTEND_URLS}/signup?` +
      new URLSearchParams({
        token: accessToken,
        userId: user._id.toString(),
        email: user.email,
        name: user.name || "",
        userType: user.userType,
        profileImage: user.profileImage || "",
        onboardingCompleted: (!!user.onboardingCompleted).toString(),
      }).toString();

    return res.redirect(redirectUrl);

  } catch (err) {
    console.error("LinkedIn Callback Controller Error:", err);
    const errorMsg = encodeURIComponent("Authentication failed. Please try again.");
    return res.redirect(`${process.env.FRONTEND_URLS}/signup?error=${errorMsg}`);
  }
};