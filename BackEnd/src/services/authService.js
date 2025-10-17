import Auth from '../models/authModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET;


//admin fetching 

// Total number of all users
export const getUserCount = async () => {
  return await Auth.countDocuments();
};

// Total number of companies
export const getCompanyCount = async () => {
  return await Auth.countDocuments({ userType: 'company' });
};

// Total number of colleges
export const getCollegeCount = async () => {
  return await Auth.countDocuments({ userType: 'college' });
};

// Total number of candidates (students / freshers / professionals etc.)
export const getCandidateCount = async () => {
  return await Auth.countDocuments({ 
    userType: { 
      $in: ['candidate', 'student', 'fresher', 'professional', 'employer'] 
    } 
  });
};

export const getStatusCountByUserType = async (userType = null) => {
  try {
    const baseFilter = userType ? { userType } : {};

    const [total, active, pending, blocked] = await Promise.all([
      Auth.countDocuments(baseFilter),
      Auth.countDocuments({ ...baseFilter, status: 'active' }),
      Auth.countDocuments({ ...baseFilter, status: 'pending' }),
      Auth.countDocuments({ ...baseFilter, status: 'blocked' }),
    ]);

    return { total, active, pending, blocked };
  } catch (error) {
    console.error(`Error getting status counts for ${userType || 'all'}:`, error.message);
    throw new Error('Failed to get status counts');
  }
};
// Example: Get recent users (instead of recent activity from other models)
// export const getRecentActivity = async () => {
//   return await Auth.find()
//     .sort({ createdAt: -1 })
//     .limit(5)
//     .select("name email userType createdAt");
// };






export async function getAuthUser(attribute) {
    try {
        const user = await Auth.findOne({ attribute }).lean();
        return { success: true, data: user };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function updateAuthUserService(userId, data) {
    try {
        const user = await Auth.findByIdAndUpdate(userId,data,{ new: true }).select("-password");
        return user;
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


// Signup service
export const registerUser = async ({ email, password, userType }) => {
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Auth.create({
        email,
        password: hashedPassword,
        userType
    });

    return newUser;
};

// login service
export const loginUser = async ({ email, password }) => {
    const user = await Auth.findOne({ email });
    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401; // 401 Unauthorized
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }
    return user;
};


export const generateToken = ({ userId, email, userType }) => {
    return jwt.sign(
        { userId, email, userType },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
};

export const generateLinkedInAuthUrl = ({ userType }) => {
    const state = generateRandomString(16);
    // Combine state and userType to pass it through the OAuth flow
    const combinedState = `${state}_${userType}`;

    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI)}&state=${combinedState}&scope=openid%20profile%20email`;

    return linkedInAuthUrl;
};


export const handleLinkedInLogin = async ({ code, state }) => {
    const [originalState, userType] = state.split('_');

    const tokenResponse = await axios.post(process.env.LINKEDIN_URL, null, {
        params: {
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const accessToken = tokenResponse.data.access_token;


    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = profileResponse.data;


    const linkedinId = profile.sub;
    const email = profile.email;
    const name = profile.name || `${profile.given_name} ${profile.family_name}`;
    const profileImage = profile.picture;


    const { user, isNewUser } = await upsertLinkedInAuthUser({ linkedinId, email, name, profileImage, userType });

    return { user, isNewUser };
};


const resetTokens = {};

export const requestPasswordReset = async ({ email }) => {
    const user = await Auth.findOne({ email });
    if (!user) {
        const error = new Error('User with that email does not exist.');
        error.statusCode = 404;
        throw error;
    }
    const token = crypto.randomBytes(32).toString('hex');

    resetTokens[token] = { email, expires: Date.now() + 15 * 60 * 1000 };

    const resetLink = `${process.env.Frontend_URL}/reset-password/${token}`;

    await sendEmail(
        email,
        'Password Reset Link',
        `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`
    );
};


export const performPasswordReset = async ({ token, newPassword }) => {

    const tokenData = resetTokens[token];
    if (!tokenData || tokenData.expires < Date.now()) {
        const error = new Error('Token is invalid or has expired.');
        error.statusCode = 400;
        throw error;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Auth.findOneAndUpdate({ email: tokenData.email }, { password: hashedPassword });

    delete resetTokens[token];
};


// get the cout of all users
export const getTotalUsersCount = async (filter = {}) => {
  try {
    const count = await Auth.countDocuments(filter);
    return { success: true, count };
  } catch (error) {
    console.error("Error in getTotalUsersCount:", error.message);
    throw new Error("Failed to get total users count");
  }
}
