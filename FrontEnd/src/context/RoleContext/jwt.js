export const getProfileTypeFromJWT = () => {
  try {
    const token =
      localStorage.getItem("accessToken") ||
      JSON.parse(localStorage.getItem("ChatAppUser") || "{}")?.token;

    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.userType || payload?.profileType || null;
  } catch (err) {
    return null;
  }
};
