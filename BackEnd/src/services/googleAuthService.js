import { OAuth2Client } from 'google-auth-library';
import Auth from '../models/authModel.js';

// const googleClient = new OAuth2Client({
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// });


const ALLOWED_USER_TYPES = [
  "student",
  "fresher",
  "professional",
  "company",
  "college",
  "employer",
  "admin"
];


export const authenticateWithGoogle = async ({ code, userType, isApp, googleToken }) => {
    let googleClient;
    let tokens;
    if(isApp)
    {
      googleClient = new OAuth2Client({
        clientId: process.env.MOBILE_GOOGLE_CLIENT_ID,
        clientSecret: process.env.MOBILE_GOOGLE_CLIENT_SECRET,
      });
    }
    else
    {
      googleClient = new OAuth2Client({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      });
      const tokenResponse = await googleClient.getToken({
          code,
          redirect_uri: 'postmessage'
      });
      tokens = tokenResponse.tokens
    }
    // console.log("Google ",googleClient);
    
    const idToken = isApp ? googleToken : tokens.id_token;
    const ticket = await googleClient.verifyIdToken({
        idToken,
        // audience: process.env.GOOGLE_CLIENT_ID
        audience: isApp ? process.env.MOBILE_GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    
    let user = await Auth.findOne({
        $or: [{ email }, { googleId }]
    });

    const isNewUser = !user;

    if (isNewUser) {
      if (!ALLOWED_USER_TYPES.includes(userType)) {
        const error = new Error("Invalid user type for registration");
        error.statusCode = 400;
        throw error;
      }

      user = await Auth.create({
        name,
        email,
        profileImage: picture,
        authProvider: "google",
        googleId,
        userType
      });
    }else {
        user.name = name;
        user.profileImage = picture;
        user.googleId = googleId; // Ensure googleId is set if they previously signed up with email
        user.authProvider = 'google';
        await user.save();
    }
    
    // We can return the user object directly. The second DB call from your original
    // code is usually not necessary unless another process modifies the user in between.
    return { user, isNewUser };
};