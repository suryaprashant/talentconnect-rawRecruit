// /// controllers/authentication/LinkedInAuth.js
// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// export const handleLinkedInCallback = async (req, res) => {
//   try {
//     const { code, state } = req.query;

//     // Step 6: Exchange code for access token
//     const tokenResponse = await axios.post(
//       'https://www.linkedin.com/oauth/v2/accessToken',
//       null,
//       {
//         params: {
//           grant_type: 'authorization_code',
//           code,
//           redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
//           client_id: process.env.LINKEDIN_CLIENT_ID,
//           client_secret: process.env.LINKEDIN_CLIENT_SECRET,
//         },
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       }
//     );

//     const accessToken = tokenResponse.data.access_token;

//     // Step 7: Use token to fetch user's profile
//     const [profileRes, emailRes] = await Promise.all([
//       axios.get('https://api.linkedin.com/v2/me', {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }),
//       axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }),
//     ]);

//     const linkedInId = profileRes.data.id;
//     const firstName = profileRes.data.localizedFirstName;
//     const lastName = profileRes.data.localizedLastName;
//     const email = emailRes.data.elements[0]['handle~'].emailAddress;

//     // Example logic: You can create or fetch user from DB here
//     // const existingUser = await User.findOne({ email });
//     // if (existingUser) {
//     //   // login
//     // } else {
//     //   // create and then login
//     // }

//     return res.status(200).json({
//       success: true,
//       message: 'LinkedIn login successful',
//       user: {
//         email,
//         firstName,
//         lastName,
//         linkedInId,
//       },
//     });
//   } catch (error) {
//     console.error('LinkedIn OAuth Error:', error?.response?.data || error.message);
//     return res.status(500).json({
//       success: false,
//       message: 'LinkedIn authentication failed',
//     });
//   }
// };


// import { handleLinkedInAuth } from '../../services/LinkedinAuth.service.js';
// import jwt from 'jsonwebtoken';

// export const linkedInAuth = async (req, res) => {
//   const { code, userType } = req.body;

//   if (!code) {
//     return res.status(400).json({ success: false, message: 'Authorization code is missing.' });
//   }

//   try {
//     const { user, isNewUser } = await handleLinkedInAuth(code, userType);

//     const token = jwt.sign(
//       { id: user._id, email: user.email, userType: user.userType },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     // Send response
//     res.status(isNewUser ? 201 : 200).json({
//       success: true,
//       isNewUser,
//       user: {
//         _id: user._id,
//         email: user.email,
//         name: user.name,
//         userType: user.userType,
//         profileImage: user.profileImage,
//       },
//       token,
//     });

//   } catch (error) {
//     console.error('LinkedIn Auth Error:', error.message || error);
//     res.status(500).json({ success: false, message: 'LinkedIn authentication failed.' });
//   }
// };



import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Auth from '../../models/auth.js';

// Helper to generate random string
const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('');
};

export const redirectToLinkedIn = (req, res) => {
  const { userType } = req.query;
  if (!userType) {
    return res.status(400).json({ message: 'userType is required for LinkedIn signup.' });
  }

  const state = generateRandomString(16);
  const combinedState = `${state}_${userType}`;

  const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI)}&state=${combinedState}&scope=openid%20profile%20email`;

  res.redirect(linkedInAuthUrl);
};

export const handleLinkedInCallback = async (req, res) => {
  const { code, state, error, error_description } = req.query;

  if (error) {
    return res.status(400).json({ message: `LinkedIn authentication failed: ${error_description || error}` });
  }

  const [originalState, userType] = state.split('_');

  try {
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
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

//     let user = await Auth.findOne({ linkedinId });
//     let isNewUser = false;

//     if (!user) {
//       user = await Auth.findOne({ email });
//       if (user) {
//         user.linkedinId = linkedinId;
//         user.name = user.name || name;
//         user.profileImage = user.profileImage || profileImage;
//         await user.save();
//       } else {
//         user = new Auth({ linkedinId, email, name, profileImage, userType, isNewUser: true });
//         await user.save();
//         isNewUser = true;
//       }
//     } else {
//       user.email = email;
//       user.name = name;
//       user.profileImage = profileImage;
//       user.userType = user.userType || userType;
//       await user.save();
//     }

//     const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1d' });

//     const redirectUrl = `${process.env.Frontend_URL}/signup-success?token=${token}&isNewUser=${isNewUser}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || '')}&userType=${user.userType}&profileImage=${encodeURIComponent(user.profileImage || '')}`;

//       console.log('Redirecting to frontend URL:', redirectUrl); 

//     res.redirect(redirectUrl);
//   } catch (err) {
//     const errorMsg = encodeURIComponent(err.response?.data?.message || 'LinkedIn auth failed on server.');
//     res.redirect(`${process.env.VITE_Frontend_URL}/signup?error=${errorMsg}`);
//   }
// };
  let user = await Auth.findOne({ linkedinId });
    let isNewUser = false;

    if (!user) {
      user = await Auth.findOne({ email });
      if (user) {
        user.linkedinId = linkedinId;
        user.name = user.name || name;
        user.profileImage = user.profileImage || profileImage;
        await user.save();
        isNewUser = false; // User existed via email, not new
      } else {
        user = new Auth({ linkedinId, email, name, profileImage, userType, isNewUser: true });
        await user.save();
        isNewUser = true; // First-time signup
      }
    } else {
      isNewUser = false; // User already exists via LinkedIn
    }

    const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Define routes based on userType and isNewUser
    const onboardingRoutes = {
      candidate: '/student-form',
      fresher: '/student-form',
      professional: '/student-form',
      company: '/company-form',
      college: '/college-onboarding',
      employer: '/onboardingflowForm'
    };

    const dashboardRoutes = {
      student: '/home',
      fresher: '/fresherhome',
      professional: '/Profhome',
      company: '/home',
      college: '/home',
      employer: '/home'
    };

    // Determine the target route
    const targetRoute = isNewUser 
      ? onboardingRoutes[user.userType] || '/onboarding' 
      : dashboardRoutes[user.userType] || '/home';

    // Redirect directly to the target route with token (no intermediate /signup-success)
    const redirectUrl = `${process.env.Frontend_URL}${targetRoute}?token=${token}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || '')}&userType=${user.userType}&profileImage=${encodeURIComponent(user.profileImage || '')}`;

    console.log('Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);

  } catch (err) {
    const errorMsg = encodeURIComponent(err.response?.data?.message || 'LinkedIn auth failed on server.');
    res.redirect(`${process.env.Frontend_URL}/signup?error=${errorMsg}`);
  }
};