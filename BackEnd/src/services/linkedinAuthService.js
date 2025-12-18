// BackEnd/src/services/linkedinAuthService.js
import axios from "axios";
import Auth from "../models/authModel.js";

const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";

function requiredEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function normalizeUserType(t) {
  const v = (t || "").toString().trim().toLowerCase();
  const allowed = new Set(["candidate", "student", "fresher", "professional", "company", "college", "employer"]);
  return allowed.has(v) ? v : null;
}

function normalizePicture(picture) {
  if (!picture) return null;
  if (typeof picture === "string") return picture;

  // defensive: sometimes picture is an object
  if (typeof picture === "object") {
    if (typeof picture.url === "string") return picture.url;
    if (typeof picture.profilePictureUrl === "string") return picture.profilePictureUrl;
  }
  return null;
}

export async function handleLinkedInAuth(code, requestedUserType) {
  const userType = normalizeUserType(requestedUserType);

  if (!code) {
    const e = new Error("LINKEDIN_MISSING_CODE");
    e.statusCode = 400;
    throw e;
  }

  const redirectUri = requiredEnv("LINKEDIN_REDIRECT_URI");
  const clientId = requiredEnv("LINKEDIN_CLIENT_ID");
  const clientSecret = requiredEnv("LINKEDIN_CLIENT_SECRET");

  // 1) Exchange code -> access token
  const tokenResponse = await axios.post(
    LINKEDIN_TOKEN_URL,
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 15000 }
  );

  const accessToken = tokenResponse?.data?.access_token;
  if (!accessToken) {
    const e = new Error("LINKEDIN_MISSING_ACCESS_TOKEN");
    e.statusCode = 502;
    throw e;
  }

  // 2) Fetch userinfo
  const profileResponse = await axios.get(LINKEDIN_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: 15000,
  });

  const profile = profileResponse?.data || {};
  const email = profile.email;
  const name = (profile.name || `${profile.given_name || ""} ${profile.family_name || ""}`.trim() || "LinkedIn User").trim();
  const pictureUrl = normalizePicture(profile.picture);

  if (!email) {
    const e = new Error("LINKEDIN_NO_EMAIL");
    e.statusCode = 400;
    throw e;
  }

  // 3) Upsert by email
  let user = await Auth.findOne({ email });
  let isNewUser = false;

  if (!user) {
    // NEW USER: create with requested role
    user = new Auth({
      email,
      name,
      profileImage: pictureUrl,
      userType: userType || "candidate",
      authProvider: "linkedin",
      isNewUser: true,
      onboardingCompleted: false,
      linkedInProfile: {
        firstName: profile.given_name || "",
        lastName: profile.family_name || "",
        headline: profile.headline || "",
        profilePictureUrl: pictureUrl || "",
        email,
        location: profile.locale?.country || profile.location || "",
      },
    });

    await user.save();
    isNewUser = true;
    return { user, isNewUser };
  }

  // EXISTING USER
  user.authProvider = "linkedin";
  if (!user.name) user.name = name;

  // Always update picture if we got a valid URL and current is missing/garbage
  if (pictureUrl && (!user.profileImage || user.profileImage === "undefined" || user.profileImage === "[object Object]")) {
    user.profileImage = pictureUrl;
  }

  // OPTION 1 (recommended): throw error if role mismatch
  if (userType && user.userType && user.userType !== userType) {
    const e = new Error(`ACCOUNT_ROLE_MISMATCH:${user.userType}`);
    e.statusCode = 409;
    throw e;
  }

  // If role is empty, set it (shouldn't happen, but defensive)
  if (!user.userType && userType) user.userType = userType;

  // Always refresh linkedin snapshot
  user.linkedInProfile = {
    firstName: profile.given_name || user.linkedInProfile?.firstName || "",
    lastName: profile.family_name || user.linkedInProfile?.lastName || "",
    headline: profile.headline || user.linkedInProfile?.headline || "",
    profilePictureUrl: user.profileImage || pictureUrl || "",
    email: user.email,
    location: profile.locale?.country || profile.location || user.linkedInProfile?.location || "",
  };

  await user.save();
  return { user, isNewUser };
}
