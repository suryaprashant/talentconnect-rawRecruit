/// controllers/authentication/LinkedInAuth.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const handleLinkedInCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    // Step 6: Exchange code for access token
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Step 7: Use token to fetch user's profile
    const [profileRes, emailRes] = await Promise.all([
      axios.get('https://api.linkedin.com/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    const linkedInId = profileRes.data.id;
    const firstName = profileRes.data.localizedFirstName;
    const lastName = profileRes.data.localizedLastName;
    const email = emailRes.data.elements[0]['handle~'].emailAddress;

    // Example logic: You can create or fetch user from DB here
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   // login
    // } else {
    //   // create and then login
    // }

    return res.status(200).json({
      success: true,
      message: 'LinkedIn login successful',
      user: {
        email,
        firstName,
        lastName,
        linkedInId,
      },
    });
  } catch (error) {
    console.error('LinkedIn OAuth Error:', error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'LinkedIn authentication failed',
    });
  }
};
