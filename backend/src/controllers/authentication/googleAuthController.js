import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import Auth from '../../models/Auth.js'; // using Auth model instead of User

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({ message: 'Google tokenId is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    // Check if user exists
    let user = await Auth.findOne({ email });

    if (!user) {
      // Create new user (with no password)
      user = new Auth({
        name,
        email,
        profileImage: picture,
        authProvider: 'google'
      });

      await user.save();
    }

    // Prevent Google-auth users from logging in with password
    if (user.authProvider && user.authProvider !== 'google') {
      return res.status(403).json({ message: `This email is registered with ${user.authProvider}. Please use that method.` });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};
