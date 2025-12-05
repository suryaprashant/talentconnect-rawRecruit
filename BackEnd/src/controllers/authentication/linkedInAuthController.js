import {
  generateLinkedInAuthUrl,
  handleLinkedInLogin,
  generateToken,
} from "../../services/authService.js";

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

    // Validate state (should match a session value)
    if (!req.session || req.session.state !== state) {
      const errorMsg = encodeURIComponent("Invalid state parameter.");
      return res.redirect(
        `${process.env.Frontend_URL}/signup?error=${errorMsg}`
      );
    }

    if (error) {
      const errorMsg = encodeURIComponent(
        `LinkedIn authentication failed: ${error_description || error}`
      );
      return res.redirect(
        `${process.env.Frontend_URL}/signup?error=${errorMsg}`
      );
    }

    if (!code || !state) {
      const errorMsg = encodeURIComponent("Missing authentication parameters");
      return res.redirect(
        `${process.env.Frontend_URL}/signup?error=${errorMsg}`
      );
    }

    const { user, isNewUser } = await handleLinkedInLogin({ code, state });

    // Ensure user data is valid
    if (!user || !user._id || !user.email || !user.userType) {
      const errorMsg = encodeURIComponent("Invalid user data from LinkedIn.");
      return res.redirect(
        `${process.env.Frontend_URL}/signup?error=${errorMsg}`
      );
    }

    const token = generateToken({
      userId: user._id,
      email: user.email,
      userType: user.userType,
    });

    const onboardingRoutes = {
      candidate: "/student-form",
      fresher: "/student-form",
      professional: "/student-form",
      company: "/company-form",
      college: "/college-onboarding",
      employer: "/onboardingflowForm",
    };

    const dashboardRoutes = {
      student: "/home",
      fresher: "/fresherhome",
      professional: "/Profhome",
      company: "/home",
      college: "/home",
      employer: "/home",
    };

    const targetRoute = isNewUser
      ? onboardingRoutes[user.userType] || "/onboarding"
      : dashboardRoutes[user.userType] || "/home";

    const redirectUrl = `${
      process.env.Frontend_URL
    }${targetRoute}?token=${token}&email=${encodeURIComponent(
      user.email
    )}&name=${encodeURIComponent(user.name || "")}&userType=${
      user.userType
    }&profileImage=${encodeURIComponent(user.profileImage || "")}`;

    return res.redirect(redirectUrl);
  } catch (err) {
    console.error(
      "LinkedIn callback error:",
      err.response?.data || err.message
    );
    const errorMsg = encodeURIComponent(
      err.response?.data?.message || "LinkedIn auth failed on server."
    );
    return res.redirect(`${process.env.Frontend_URL}/signup?error=${errorMsg}`);
  }
};
