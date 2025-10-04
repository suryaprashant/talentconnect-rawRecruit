import { OAuth2Client } from 'google-auth-library';
import Auth from '../models/authModel.js';

const googleClient = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

export const authenticateWithGoogle = async ({ code, userType }) => {
    
    const { tokens } = await googleClient.getToken({
        code,
        redirect_uri: 'postmessage'
    });

    const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    
    let user = await Auth.findOne({
        $or: [{ email }, { googleId }]
    });

    const isNewUser = !user;

    if (isNewUser) {
        if (!userType) {
            const error = new Error('User type is required for new registrations.');
            error.statusCode = 400;
            throw error;
        }
        user = await Auth.create({
            name,
            email,
            profileImage: picture,
            authProvider: 'google',
            googleId,
            userType
        });
    } else {
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