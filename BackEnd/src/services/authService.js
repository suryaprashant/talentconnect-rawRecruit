import Auth from '../models/authModel.js';

export async function getAuthUser(attribute) {
    try {
        const user = await Auth.findOne({ attribute }).lean();
        return { success: true, data: user };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export const upsertLinkedInAuthUser = async ({ linkedinId, email, name, profileImage, userType }) => {
  let user = await Auth.findOne({ linkedinId });
  let isNewUser = false;

  if (!user) {
    user = await getAuthUser(email)?.data;
    if (user) {
      user.linkedinId = linkedinId;
      user.name = user.name || name;
      user.profileImage = user.profileImage || profileImage;
      await user.save();
      isNewUser = false;
    } else {
      user = new Auth({ linkedinId, email, name, profileImage, userType, isNewUser: true });
      await user.save();
      isNewUser = true;
    }
  } else {
    isNewUser = false;
  }

  return { user, isNewUser };
};
