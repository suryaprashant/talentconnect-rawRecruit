// import { OAuth2Client } from 'google-auth-library';
// import jwt from 'jsonwebtoken';
// import Auth from '../../models/auth.js';

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const googleAuth = async (req, res) => {
//   try {
//     const { tokenId } = req.body;
//     const {userType} = req.body ;

//     if (!tokenId) {
//       return res.status(400).json({ message: 'Google tokenId is required' });
//     }

//     const ticket = await client.verifyIdToken({
//       idToken: tokenId,
//       audience: process.env.GOOGLE_CLIENT_ID
//     });

//     const payload = ticket.getPayload();

//     const { email, name } = payload;

//     // Check if user exists
//     let user = await Auth.findOne({ email });

//     if (!user) {
//       // Create new user (with no password)
//       user = new Auth({
//         name,
//         email,
      
//         authProvider: 'google',
//         userType
//       });

//       await user.save();
//     }
//      else if (!user.userType) {
//         // If user exists but doesn't have a userType, update it
//         user.userType = userType;
//         await user.save();
//     }

//     // Prevent Google-auth users from logging in with password
//     if (user.authProvider && user.authProvider !== 'google') {
//       return res.status(403).json({ message: `This email is registered with ${user.authProvider}. Please use that method.` });
//     }

//     // Create token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email, userType: user.userType },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(200).json({
//       message: 'Google login successful',
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         userType: user.userType
//       }
//     });
//   } catch (error) {
//     console.error('Google Auth Error:', error);
//     res.status(500).json({ message: 'Google authentication failed' });
//   }
// };




// import { OAuth2Client } from 'google-auth-library';
// import jwt from 'jsonwebtoken';
// import Auth from '../../models/auth.js';

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const googleAuth = async (req, res) => {
//   try {
//     const { tokenId } = req.body;
//     const { userType } = req.body; // userType from frontend (selected role during signup)

//     if (!tokenId) {
//       return res.status(400).json({ message: 'Google tokenId is required' });
//     }

//     const ticket = await client.verifyIdToken({
//       idToken: tokenId,
//       audience: process.env.GOOGLE_CLIENT_ID
//     });

//     const payload = ticket.getPayload();
//     const { email, name } = payload;

//     let user = await Auth.findOne({ email });

//     if (!user) {
//       // User does not exist, create a new one
//       user = new Auth({
//         name,
//         email,
//         authProvider: 'google',
//         userType // Set userType from frontend during initial signup
//       });
//       await user.save();
      
//       // For a new signup, return a specific status or message if needed,
//       // but the flow will handle onboarding redirection based on userType
//     } else {
//       // User exists
//       // Prevent Google-auth users from logging in with password
//       if (user.authProvider && user.authProvider !== 'google') {
//         return res.status(403).json({ message: `This email is already registered with ${user.authProvider}. Please use that method to log in.` });
//       }

//       // If user exists but userType is null/undefined (e.g., existing user from manual auth logging in with Google for first time)
//       // or if they switch roles and try to sign up with Google again.
//       // This part ensures their userType is set or updated.
//       if (!user.userType && userType) {
//         user.userType = userType;
//         await user.save();
//       }
//     }

//     // Create token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email, userType: user.userType },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(200).json({
//       message: 'Google authentication successful',
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         userType: user.userType // Ensure userType is always returned
//       }
//     });

//   } catch (error) {
//     console.error('Google Auth Error:', error);
//     res.status(500).json({ message: 'Google authentication failed' });
//   }
// };

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
//       redirect_uri: 'postmessage' // For frontend flows
//     });

//     // Verify ID token
//     const ticket = await client.verifyIdToken({
//       idToken: tokens.id_token,
//       audience: process.env.GOOGLE_CLIENT_ID
//     });

//     const payload = ticket.getPayload();
//     const { email, name } = payload;

//     let user = await Auth.findOne({ email });

//     if (!user) {
//       // User does not exist, create a new one
//       user = new Auth({
//         name,
//         email,
//         authProvider: 'google',
//         userType
//       });
//       await user.save();
//     } else {
//       // User exists - check auth provider
//       if (user.authProvider && user.authProvider !== 'google') {
//         return res.status(403).json({ 
//           message: `This email is already registered with ${user.authProvider}. Please use that method to log in.` 
//         });
//       }

//       // Update userType if not set
//       if (!user.userType && userType) {
//         user.userType = userType;
//         await user.save();
//       }
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email, userType: user.userType },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(200).json({
//       message: 'Google authentication successful',
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         userType: user.userType
//       }
//     });

//   } catch (error) {
//     console.error('Google Auth Error:', error);
//     res.status(500).json({ 
//       message: 'Google authentication failed',
//       error: error.message 
//     });
//   }
// };




import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import Auth from '../../models/auth.js';

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

export const googleAuth = async (req, res) => {
  try {
    const { code, userType } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    // Exchange auth code for tokens
    const { tokens } = await client.getToken({
      code,
      redirect_uri: 'postmessage'
    });

    // Verify ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await Auth.findOne({ email });
    const existingUser = user;

    if (!user) {
      // New user - create with provided userType
      if (!userType) {
        return res.status(400).json({ 
          message: 'User type is required for new registrations' 
        });
      }

      user = new Auth({
        name,
        email,
        profileImage: picture,
        authProvider: 'google',
        userType
      });
      await user.save();
    }
     else {
        // If user exists but userType is not set (e.g., legacy data or incomplete registration), set it
        // based on the selectedRole from frontend. This might be optional based on your data integrity.
        if (!user.userType && userType) {
            user.userType = userType;
            await user.save();
        }
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user data and indicate if it's a new user
    res.status(200).json({
      success: true,
      isNewUser: Boolean(!existingUser), // Check if userType wasn't set before
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Google authentication failed',
      error: error.message 
    });
  }
};