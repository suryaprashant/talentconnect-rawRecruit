// import { OAuth2Client } from 'google-auth-library';
// import jwt from 'jsonwebtoken';
// import Auth from '../../models/auth.js';

// const client = new OAuth2Client({
//   clientId: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// });

// export const googleAuth = async (req, res) => {
//   try {
//     const { code, userType } = req.body;

//     if (!code) {
//       return res.status(400).json({ message: 'Authorization code is required' });
//     }

//     // Exchange auth code for tokens
//     const { tokens } = await client.getToken({
//       code,
//       redirect_uri: 'postmessage'
//     });

//     // Verify ID token
//     const ticket = await client.verifyIdToken({
//       idToken: tokens.id_token,
//       audience: process.env.GOOGLE_CLIENT_ID
//     });

//     const payload = ticket.getPayload();
//     const { email, name, picture } = payload;

//     let user = await Auth.findOne({ email });
//     const existingUser = user;

//     if (!user) {
//       // New user - create with provided userType
//       if (!userType) {
//         return res.status(400).json({ 
//           message: 'User type is required for new registrations. Sign up first with google' 
//         });
//       }

//       user = new Auth({
//         name,
//         email,
//         profileImage: picture,
//         authProvider: 'google',
//         userType
//       });
//       await user.save();
//     }
//      else {
//         // If user exists but userType is not set (e.g., legacy data or incomplete registration), set it
//         // based on the selectedRole from frontend. This might be optional based on your data integrity.
//         if (!user.userType && userType) {
//             user.userType = userType;
//             await user.save();
//         }
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email, userType: user.userType },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // Set HTTP-only cookie
//     res.cookie('authToken', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//     });

//     // Return user data and indicate if it's a new user
//     res.status(200).json({
//       success: true,
//       isNewUser: Boolean(!existingUser), // Check if userType wasn't set before
//       user: {
//         _id: user._id,
//         email: user.email,
//         name: user.name,
//         userType: user.userType,
//         profileImage: user.profileImage
//       }
//     });

//   } catch (error) {
//     console.error('Google Auth Error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Google authentication failed',
//       error: error.message 
//     });
//   }
// };


import { handleGoogleAuth } from '../../services/GoogleAuth.service.js';

export const googleAuth = async (req, res) => {
  try {
    const { code, userType } = req.body;

    const { token, user, isNewUser } = await handleGoogleAuth(code, userType);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      isNewUser,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(error.status || 500).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message,
    });
  }
};
